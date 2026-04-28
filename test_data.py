import os
import pandas as pd
import tensorflow as tf

BASE_DIR = r"D:\varshini_project"
TRAIN_CSV = os.path.join(BASE_DIR, "train_with_submission.csv")
TRAIN_DIR = os.path.join(BASE_DIR, "dataset", "bcn_20k_train")

print("Loading CSV...")
train_df = pd.read_csv(TRAIN_CSV)
print(f"CSV loaded, shape: {train_df.shape}")

print("Sample diagnosis:", train_df['diagnosis'].unique()[:5])

print("Checking folder structure...")
if os.path.exists(TRAIN_DIR):
    print("Train dir exists")
    subdirs = [d for d in os.listdir(TRAIN_DIR) if os.path.isdir(os.path.join(TRAIN_DIR, d))]
    print("Subdirs:", subdirs[:5])
else:
    print("Train dir does not exist")

print("Testing filepath construction...")
sample_row = train_df.iloc[0]
filepath = os.path.join(TRAIN_DIR, str(sample_row["diagnosis"]), str(sample_row["bcn_filename"]))
print(f"Sample filepath: {filepath}")
print(f"Exists: {os.path.exists(filepath)}")

print("Test complete")