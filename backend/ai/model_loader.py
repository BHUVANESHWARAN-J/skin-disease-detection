import pickle
import tensorflow as tf
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

MODEL_CANDIDATES = [
    PROJECT_ROOT / "final_skin_model_efficientnetb3.keras",
    PROJECT_ROOT / "final_skin_model.keras",
    PROJECT_ROOT / "best_skin_model_efficientnetb3.keras",
    PROJECT_ROOT / "best_skin_model.keras",
    BASE_DIR / "model" / "final_skin_model_efficientnetb3.keras",
    BASE_DIR / "model" / "final_skin_model.keras",
    BASE_DIR / "model" / "best_skin_model_efficientnetb3.keras",
    BASE_DIR / "model" / "best_skin_model.keras",
]

MODEL_PATH = next((path for path in MODEL_CANDIDATES if path.exists()), None)
if MODEL_PATH is None:
    raise FileNotFoundError(
        "No Keras model file found. Please place one of these model files in the project root or backend/model:\n"
        + "\n".join(str(path) for path in MODEL_CANDIDATES)
    )

ENCODER_PATH = BASE_DIR / "model" / "label_encoder.pkl"
if not ENCODER_PATH.exists():
    candidate_encoder = PROJECT_ROOT / "label_encoder.pkl"
    if candidate_encoder.exists():
        ENCODER_PATH = candidate_encoder

# Custom loss used when training the saved model.
def sparse_focal_loss(gamma=2.0, alpha=0.25):
    def loss_fn(y_true, y_pred):
        y_true = tf.cast(y_true, tf.int32)
        y_true_onehot = tf.one_hot(y_true, depth=tf.shape(y_pred)[-1])

        epsilon = tf.keras.backend.epsilon()
        y_pred = tf.clip_by_value(y_pred, epsilon, 1.0 - epsilon)

        ce = -y_true_onehot * tf.math.log(y_pred)
        weight = alpha * tf.pow(1 - y_pred, gamma)
        fl = weight * ce

        return tf.reduce_mean(tf.reduce_sum(fl, axis=1))
    return loss_fn

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={"loss_fn": sparse_focal_loss()}
)

with open(ENCODER_PATH, "rb") as f:
    label_encoder = pickle.load(f)
