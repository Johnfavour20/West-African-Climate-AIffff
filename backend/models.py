from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # stores hashed password
    role = db.Column(db.String(20), default='Researcher')
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    datasets = db.relationship('ClimateDataset', backref='uploader', lazy=True)
    predictions = db.relationship('Prediction', backref='user', lazy=True)
    activity_logs = db.relationship('ActivityLog', backref='user', lazy=True)

class ClimateDataset(db.Model):
    __tablename__ = 'climate_datasets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dataset_name = db.Column(db.String(150), nullable=False)
    source = db.Column(db.String(100), default='Kaggle')
    description = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=False)
    records_count = db.Column(db.Integer, default=0)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    predictions = db.relationship('Prediction', backref='dataset', lazy=True)

class PredictionModel(db.Model):
    __tablename__ = 'prediction_models'
    
    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(100), nullable=False)
    algorithm = db.Column(db.String(100), nullable=False)
    model_file = db.Column(db.String(255), nullable=True)
    training_date = db.Column(db.DateTime, default=datetime.utcnow)
    accuracy_score = db.Column(db.Float, default=0.0)  # acts as R2 score or similar
    remarks = db.Column(db.Text, nullable=True)
    
    predictions = db.relationship('Prediction', backref='trained_model', lazy=True)

class Prediction(db.Model):
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dataset_id = db.Column(db.Integer, db.ForeignKey('climate_datasets.id'), nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey('prediction_models.id'), nullable=False)
    prediction_type = db.Column(db.String(50), nullable=False)  # 'Temperature' or 'Rainfall'
    predicted_value = db.Column(db.Float, nullable=False)
    mae = db.Column(db.Float, default=0.0)
    rmse = db.Column(db.Float, default=0.0)
    r_squared = db.Column(db.Float, default=0.0)
    prediction_date = db.Column(db.DateTime, default=datetime.utcnow)

class ActivityLog(db.Model):
    __tablename__ = 'activity_log'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    activity = db.Column(db.String(200), nullable=False)
    activity_date = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(50), nullable=True)
