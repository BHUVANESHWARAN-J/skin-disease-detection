import inspect
import tensorflow as tf
import numpy as np
import cv2
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
IMG_SIZE = 300  # Match the model's expected input size


def _find_last_conv_layer(model):
    for layer in reversed(model.layers):
        if len(layer.output.shape) == 4:
            return layer
    raise ValueError("No convolutional layer with 4D output found in the model.")


def _build_heatmap_models(model, target_layer=None):
    target_layer = target_layer or _find_last_conv_layer(model)

    if isinstance(target_layer, tf.keras.Model):
        feature_model = tf.keras.models.Model(
            inputs=target_layer.input,
            outputs=target_layer.output,
        )
    else:
        feature_model = tf.keras.models.Model(
            inputs=model.input,
            outputs=target_layer.output,
        )

    classifier_input = tf.keras.Input(shape=feature_model.output.shape[1:])
    x = classifier_input
    found_feature_layer = False

    for layer in model.layers:
        if found_feature_layer:
            # Rebuild the classifier part from the feature output forward.
            try:
                signature = inspect.signature(layer.call)
                if "training" in signature.parameters:
                    x = layer(x, training=False)
                else:
                    x = layer(x)
            except (ValueError, TypeError):
                x = layer(x)
        elif layer == target_layer:
            found_feature_layer = True

    if not found_feature_layer:
        raise ValueError("Failed to build classifier model from model layers.")

    classifier_model = tf.keras.models.Model(classifier_input, x)
    return feature_model, classifier_model


def generate_heatmap(model, img_array, save_name="heatmap.jpg"):
    feature_model, classifier_model = _build_heatmap_models(model)

    conv_outputs = feature_model(img_array)
    with tf.GradientTape() as tape:
        tape.watch(conv_outputs)
        predictions = classifier_model(conv_outputs, training=False)
        pred_index = tf.argmax(predictions[0])
        loss = predictions[:, pred_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
    heatmap = tf.maximum(heatmap, 0)
    heatmap = heatmap / (tf.reduce_max(heatmap) + tf.keras.backend.epsilon())
    heatmap = cv2.resize(heatmap.numpy(), (IMG_SIZE, IMG_SIZE))

    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    folder = BASE_DIR / "media" / "heatmaps"
    os.makedirs(folder, exist_ok=True)

    path = folder / save_name
    cv2.imwrite(str(path), heatmap)

    return f"/media/heatmaps/{save_name}"
