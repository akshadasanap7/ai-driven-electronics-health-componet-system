"""
ML model architecture — prepared for future trained model.
Currently uses rule-based diagnosis as the primary engine.
Replace predict() with a trained sklearn/torch model when real hardware data is available.
"""
import numpy as np
from typing import Optional
import os

try:
    import joblib
    JOBLIB_AVAILABLE = True
except ImportError:
    JOBLIB_AVAILABLE = False

MODEL_PATH = "app/ai/model.pkl"

class DiagnosisModel:
    def __init__(self):
        self.model = None
        self._loaded = False

    def load_model(self) -> bool:
        if JOBLIB_AVAILABLE and os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            self._loaded = True
            return True
        return False

    def save_model(self) -> None:
        if JOBLIB_AVAILABLE and self.model:
            joblib.dump(self.model, MODEL_PATH)

    def train(self, X: np.ndarray, y: np.ndarray) -> None:
        """Train a RandomForest classifier. Requires labeled hardware data."""
        from sklearn.ensemble import RandomForestClassifier
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        self._loaded = True

    def predict(self, features: np.ndarray) -> Optional[str]:
        """Returns predicted status label or None if model not loaded."""
        if not self._loaded or self.model is None:
            return None
        pred = self.model.predict(features.reshape(1, -1))
        return pred[0]

# Singleton
diagnosis_model = DiagnosisModel()
diagnosis_model.load_model()
