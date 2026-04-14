import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Load dataset
dataset_path = "../dataset/final_modified_dataset.xlsx"

if not os.path.exists(dataset_path):
    print(f"Dataset not found at {dataset_path}")
    print("Please ensure the Excel file is in the dataset folder")
    exit(1)

df = pd.read_excel(dataset_path)
print(f"Dataset loaded: {len(df)} rows, {len(df.columns)} columns")
print(f"Columns: {list(df.columns)}")

# Determine target column (flexible naming)
target_col = None
for col in df.columns:
    if col.lower() in ['pest', 'disease', 'prediction', 'recommendation', 'output']:
        target_col = col
        break

if target_col is None:
    # Use last column as target
    target_col = df.columns[-1]

print(f"Target column: {target_col}")

X = df.drop(columns=[target_col])
y = df[target_col]

print(f"Features: {list(X.columns)}")
print(f"Target classes: {y.unique()}")

# Encode categorical data
encoders = {}
for col in X.columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    encoders[col] = le
    print(f"Encoded {col}: {len(le.classes_)} classes")

# Encode target
target_encoder = LabelEncoder()
y_encoded = target_encoder.fit_transform(y)
print(f"Encoded target: {len(target_encoder.classes_)} classes")
print(f"Classes: {target_encoder.classes_}")

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
print(f"Train: {len(X_train)}, Test: {len(X_test)}")

# Model - Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

print("Training Random Forest model...")
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Model Accuracy: {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=target_encoder.classes_))

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Important Features:")
print(feature_importance.head(10))

# Save everything
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(encoders, open("encoders.pkl", "wb"))
pickle.dump(target_encoder, open("target_encoder.pkl", "wb"))

print("\n✅ Model, encoders, and target_encoder saved successfully!")
print("Files: model.pkl, encoders.pkl, target_encoder.pkl")
