import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from xgboost import XGBClassifier

# Paths to the 4 ecommerce datasets
file_paths = {
    "buykart": "buykart_with_fingerprint.csv",
    "ecomplus": "ecomplus_with_fingerprint.csv",
    "shopmax": "shopmax_with_fingerprint.csv",
    "megastore": "megastore_with_fingerprint.csv"
}

# 8 Fraud-detection features based on behavior
features = [
    "IP_Address_Changed", 
    "New_Device", 
    "VPN_Use",
    "Multiple_Failed_OTPs", 
    "Unusual_Cart_Value", 
    "Email_Pattern",
    "First_Time_High_Value_Purchase", 
    "Shipping_Address_Changed"
]

target = "Is_Fraud"

# Common encoding map for string values
yes_no_map = {"Yes": 1, "No": 0, "Y": 1, "N": 0, True: 1, False: 0}

for name, path in file_paths.items():
    print(f"\n📦 Training model for: {name}")
    
    # Load dataset
    df = pd.read_csv(path)

    # Encode string features if needed
    for col in features + [target]:
        if df[col].dtype == "object":
            df[col] = df[col].map(yes_no_map).fillna(0)

    # Prepare input/output
    X = df[features]
    y = df[target]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, stratify=y, test_size=0.3, random_state=42
    )

    # Train XGBoost classifier
    model = XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=4,
        use_label_encoder=False,
        eval_metric='logloss',
        scale_pos_weight=(len(y_train) - y_train.sum()) / y_train.sum(),
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluate and show results
    y_pred = model.predict(X_test)
    print("✅ Evaluation Results:")
    print(classification_report(y_test, y_pred, digits=3))

    # Save model
    model_path = f"{name}_fraud_model.pkl"
    joblib.dump(model, model_path)
    print(f"✅ Model saved: {model_path}")
