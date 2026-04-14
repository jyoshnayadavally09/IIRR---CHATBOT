# Dataset

- `agri_pest_dataset.xlsx`: source Excel dataset used for training.
- `cleaned_dataset.csv`: generated automatically by `ml/model.py`.

Cleaning rules:

1. Drop the `state` column completely.
2. Lowercase and trim every remaining value.
3. Use every remaining column except `pest` as model features.
4. Use `pest` as the classification target.
