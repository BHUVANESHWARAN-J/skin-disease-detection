import os
import time
from pathlib import Path

import tensorflow as tf
import numpy as np
from PIL import Image, ImageEnhance

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_DIR = BASE_DIR / "media"
PROCESSING_DIR = MEDIA_DIR / "processing"

IMG_SIZE = 300  # Input size matches the loaded model's expected shape


def _save_processing_preview(image, filename):
    os.makedirs(PROCESSING_DIR, exist_ok=True)
    path = PROCESSING_DIR / filename
    image.save(path, format="JPEG")
    return f"/media/processing/{filename}"


def augment_image(image):
    augmented = image.transpose(Image.FLIP_LEFT_RIGHT)
    enhancer = ImageEnhance.Color(augmented)
    return enhancer.enhance(1.1)


def preprocess_image(file_obj):
    file_obj.seek(0)
    image = Image.open(file_obj).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))

    timestamp = int(time.time() * 1000)
    original_url = _save_processing_preview(image, f"{timestamp}_original.jpg")

    processed_image = image.copy()
    processed_url = _save_processing_preview(processed_image, f"{timestamp}_processed.jpg")

    augmented_image = augment_image(processed_image)
    augmented_url = _save_processing_preview(augmented_image, f"{timestamp}_augmented.jpg")

    arr = np.array(processed_image).astype("float32")
    arr = tf.keras.applications.efficientnet.preprocess_input(arr)
    arr = np.expand_dims(arr, axis=0)

    return arr, original_url, processed_url, augmented_url
