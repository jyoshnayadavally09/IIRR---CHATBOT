import pandas as pd
import json
from pathlib import Path

class DatasetMatcher:
    def __init__(self, excel_path=None):
        self.df = None
        if excel_path and Path(excel_path).exists():
            self.load_dataset(excel_path)
    
    def load_dataset(self, excel_path):
        """Load the Excel dataset"""
        try:
            self.df = pd.read_excel(excel_path)
            print(f"Dataset loaded: {len(self.df)} rows, {len(self.df.columns)} columns")
            print(f"Columns: {list(self.df.columns)}")
        except Exception as e:
            print(f"Error loading dataset: {e}")
            self.df = None
    
    def normalize_value(self, value):
        """Normalize input values for comparison"""
        if isinstance(value, str):
            return value.lower().strip()
        return str(value).lower().strip()
    
    def find_match(self, user_inputs):
        """Find matching row in dataset based on user inputs"""
        if self.df is None or self.df.empty:
            return None
        
        # Create a copy for filtering
        filtered_df = self.df.copy()
        
        # Normalize column names
        filtered_df.columns = [self.normalize_value(col) for col in filtered_df.columns]
        
        # Try to match on key fields
        match_fields = {
            'farmer_name': user_inputs.get('farmer_name'),
            'variety_name': user_inputs.get('variety_name'),
            'crop_status': user_inputs.get('crop_status'),
            'stage': user_inputs.get('stage'),
            'weather_type': user_inputs.get('weather_type'),
        }
        
        # Filter based on available matching fields
        for field, value in match_fields.items():
            if value and field in filtered_df.columns:
                normalized_value = self.normalize_value(value)
                # Find exact match
                mask = filtered_df[field].astype(str).apply(
                    lambda x: self.normalize_value(x) == normalized_value
                )
                if mask.any():
                    filtered_df = filtered_df[mask]
        
        # Return the first match
        if not filtered_df.empty:
            return filtered_df.iloc[0].to_dict()
        
        # Fallback: try to match by crop_status only
        if 'crop_status' in user_inputs:
            crop_status = self.normalize_value(user_inputs['crop_status'])
            if 'crop_status' in filtered_df.columns:
                mask = filtered_df['crop_status'].astype(str).apply(
                    lambda x: self.normalize_value(x) == crop_status
                )
                if mask.any():
                    return filtered_df[mask].iloc[0].to_dict()
        
        return None

# Initialize matcher
dataset_path = Path(__file__).parent.parent / 'dataset' / 'final_modified_dataset.xlsx'
matcher = DatasetMatcher(str(dataset_path))
