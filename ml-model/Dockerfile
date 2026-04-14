# ML API Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY train.py .
COPY dataset_matcher.py .

# Download and setup dataset
COPY ../dataset/final_modified_dataset.xlsx ./dataset/

# Train model on startup
RUN python train.py

# Expose port
EXPOSE 6000

# Run Flask app
CMD ["python", "app.py"]
