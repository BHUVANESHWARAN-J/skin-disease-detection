import os
import shutil
import pandas as pd

# Paths
csv_path = 'train_with_submission.csv'
source_folder = 'dataset/bcn_20k_train'

# Read CSV
df = pd.read_csv(csv_path)

# Create dict filename -> diagnosis
diagnosis_dict = dict(zip(df['bcn_filename'], df['diagnosis']))

# Get unique diagnoses
unique_diagnoses = df['diagnosis'].unique()

# Create subfolders
for diag in unique_diagnoses:
    folder_path = os.path.join(source_folder, diag)
    os.makedirs(folder_path, exist_ok=True)
    print(f"Created folder: {folder_path}")

# Move files
moved_count = 0
for filename in os.listdir(source_folder):
    if filename.endswith('.jpg'):
        if filename in diagnosis_dict:
            diag = diagnosis_dict[filename]
            src = os.path.join(source_folder, filename)
            dst = os.path.join(source_folder, diag, filename)
            shutil.move(src, dst)
            moved_count += 1
            if moved_count % 1000 == 0:
                print(f"Moved {moved_count} files...")
        else:
            print(f"No diagnosis found for {filename}")

print(f"Total files moved: {moved_count}")
print("Organization complete!")