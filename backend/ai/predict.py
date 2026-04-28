import time
from pathlib import Path
from django.core.files import File
from .model_loader import model, label_encoder
from .preprocess import preprocess_image
from .severity import get_severity
from .treatment import get_treatment
from .gradcam import generate_heatmap

BASE_DIR = Path(__file__).resolve().parent.parent


def run_prediction(file, user):
    from api.models import PredictionHistory

    x, original_url, processed_url, augmented_url = preprocess_image(file)

    pred = model.predict(x, verbose=0)[0]
    
    index = pred.argmax()
    confidence = float(pred[index]) * 100

    disease = label_encoder.inverse_transform([index])[0]

    severity, priority = get_severity(disease)
    treatment = get_treatment(disease)

    # Generate heatmap
    timestamp = int(time.time())
    heatmap_filename = f"heatmap_{user.id}_{timestamp}.jpg"
    try:
        heatmap_url = generate_heatmap(model, x, heatmap_filename)
    except Exception:
        heatmap_url = None

    # Normalize the input image file for Django model saving if needed
    input_file = file
    if not hasattr(input_file, '_committed'):
        input_file = File(input_file)
        input_file.name = Path(getattr(file, 'name', 'uploaded_image.jpg')).name

    # Save prediction and heatmap files through Django fields
    history = PredictionHistory(
        user=user,
        predicted_disease=disease,
        confidence=round(confidence, 2),
        severity=severity,
        doctor_priority=priority,
    )
    history.image.save(input_file.name, input_file, save=False)

    if heatmap_url:
        heatmap_path = BASE_DIR / "media" / "heatmaps" / heatmap_filename
        with open(heatmap_path, 'rb') as heatmap_file_obj:
            heatmap_file = File(heatmap_file_obj)
            heatmap_file.name = heatmap_filename  # Just the filename, upload_to adds the path
            history.heatmap.save(heatmap_filename, heatmap_file, save=False)

    history.save()

    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "severity": severity,
        "doctor_priority": priority,
        "treatment": treatment,
        "heatmap_url": heatmap_url,
        "original_url": original_url,
        "processed_url": processed_url,
        "augmented_url": augmented_url,
    }
