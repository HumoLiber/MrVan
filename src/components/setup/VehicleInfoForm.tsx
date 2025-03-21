import React, { useState } from 'react';
import './VehicleInfoForm.css';

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  color: string;
  seats: string;
  beds: string;
  length: string;
  height: string;
  description: string;
}

interface VehicleInfoFormProps {
  onSubmit: (vehicleInfo: VehicleInfo) => void;
  onBack: () => void;
}

const VehicleInfoForm: React.FC<VehicleInfoFormProps> = ({ onSubmit, onBack }) => {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    color: '',
    seats: '',
    beds: '',
    length: '',
    height: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VehicleInfo, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicleInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof VehicleInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VehicleInfo, string>> = {};
    let isValid = true;
    
    // Required fields
    const requiredFields: (keyof VehicleInfo)[] = ['make', 'model', 'year', 'licensePlate', 'vin'];
    
    requiredFields.forEach(field => {
      if (!vehicleInfo[field]) {
        newErrors[field] = 'Це поле обов\'язкове';
        isValid = false;
      }
    });
    
    // Year validation
    if (vehicleInfo.year && !/^\d{4}$/.test(vehicleInfo.year)) {
      newErrors.year = 'Введіть рік у форматі YYYY';
      isValid = false;
    }
    
    // VIN validation (basic)
    if (vehicleInfo.vin && vehicleInfo.vin.length !== 17) {
      newErrors.vin = 'VIN повинен містити 17 символів';
      isValid = false;
    }
    
    // Numeric validations
    if (vehicleInfo.seats && !/^\d+$/.test(vehicleInfo.seats)) {
      newErrors.seats = 'Введіть число';
      isValid = false;
    }
    
    if (vehicleInfo.beds && !/^\d+$/.test(vehicleInfo.beds)) {
      newErrors.beds = 'Введіть число';
      isValid = false;
    }
    
    if (vehicleInfo.length && !/^\d+(\.\d+)?$/.test(vehicleInfo.length)) {
      newErrors.length = 'Введіть число';
      isValid = false;
    }
    
    if (vehicleInfo.height && !/^\d+(\.\d+)?$/.test(vehicleInfo.height)) {
      newErrors.height = 'Введіть число';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(vehicleInfo);
    }
  };

  return (
    <div className="vehicle-info-form">
      <h2>Інформація про кемпер</h2>
      <p>Введіть основні дані про ваш кемпер</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="make" className="form-label">Марка *</label>
            <input
              type="text"
              id="make"
              name="make"
              className={`form-input ${errors.make ? 'error' : ''}`}
              value={vehicleInfo.make}
              onChange={handleChange}
              placeholder="Наприклад: Volkswagen"
            />
            {errors.make && <div className="error-message">{errors.make}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="model" className="form-label">Модель *</label>
            <input
              type="text"
              id="model"
              name="model"
              className={`form-input ${errors.model ? 'error' : ''}`}
              value={vehicleInfo.model}
              onChange={handleChange}
              placeholder="Наприклад: California"
            />
            {errors.model && <div className="error-message">{errors.model}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="year" className="form-label">Рік випуску *</label>
            <input
              type="text"
              id="year"
              name="year"
              className={`form-input ${errors.year ? 'error' : ''}`}
              value={vehicleInfo.year}
              onChange={handleChange}
              placeholder="Наприклад: 2020"
            />
            {errors.year && <div className="error-message">{errors.year}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="licensePlate" className="form-label">Номерний знак *</label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              className={`form-input ${errors.licensePlate ? 'error' : ''}`}
              value={vehicleInfo.licensePlate}
              onChange={handleChange}
              placeholder="Наприклад: AA1234BB"
            />
            {errors.licensePlate && <div className="error-message">{errors.licensePlate}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="vin" className="form-label">VIN код *</label>
            <input
              type="text"
              id="vin"
              name="vin"
              className={`form-input ${errors.vin ? 'error' : ''}`}
              value={vehicleInfo.vin}
              onChange={handleChange}
              placeholder="17 символів"
            />
            {errors.vin && <div className="error-message">{errors.vin}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="color" className="form-label">Колір</label>
            <input
              type="text"
              id="color"
              name="color"
              className="form-input"
              value={vehicleInfo.color}
              onChange={handleChange}
              placeholder="Наприклад: Білий"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="seats" className="form-label">Кількість місць</label>
            <input
              type="text"
              id="seats"
              name="seats"
              className={`form-input ${errors.seats ? 'error' : ''}`}
              value={vehicleInfo.seats}
              onChange={handleChange}
              placeholder="Наприклад: 4"
            />
            {errors.seats && <div className="error-message">{errors.seats}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="beds" className="form-label">Кількість спальних місць</label>
            <input
              type="text"
              id="beds"
              name="beds"
              className={`form-input ${errors.beds ? 'error' : ''}`}
              value={vehicleInfo.beds}
              onChange={handleChange}
              placeholder="Наприклад: 2"
            />
            {errors.beds && <div className="error-message">{errors.beds}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="length" className="form-label">Довжина (м)</label>
            <input
              type="text"
              id="length"
              name="length"
              className={`form-input ${errors.length ? 'error' : ''}`}
              value={vehicleInfo.length}
              onChange={handleChange}
              placeholder="Наприклад: 5.8"
            />
            {errors.length && <div className="error-message">{errors.length}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="height" className="form-label">Висота (м)</label>
            <input
              type="text"
              id="height"
              name="height"
              className={`form-input ${errors.height ? 'error' : ''}`}
              value={vehicleInfo.height}
              onChange={handleChange}
              placeholder="Наприклад: 2.1"
            />
            {errors.height && <div className="error-message">{errors.height}</div>}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="description" className="form-label">Опис кемпера</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            value={vehicleInfo.description}
            onChange={handleChange}
            rows={4}
            placeholder="Додаткова інформація про ваш кемпер"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onBack}>
            Назад
          </button>
          <button type="submit" className="button-primary">
            Продовжити
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleInfoForm;
