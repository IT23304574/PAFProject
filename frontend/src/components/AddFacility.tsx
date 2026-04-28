import React, { useState } from 'react';
import { facilityService, Facility } from '../services/facility.service';
import { toast } from 'react-toastify';
import './AddFacility.css';

const AddFacility: React.FC = () => {
  const [facility, setFacility] = useState<Omit<Facility, 'id'>>({
    name: '',
    type: '',
    capacity: 0,
    location: '',
    availableFrom: '08:00:00',
    availableTo: '18:00:00',
    status: 'ACTIVE'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const facilityTypes = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
  const statusOptions = ['ACTIVE', 'OUT_OF_SERVICE'];

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!facility.name.trim()) {
      newErrors.name = 'Facility name is required';
    } else if (facility.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (facility.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!facility.type) {
      newErrors.type = 'Facility type is required';
    }

    if (facility.capacity && (facility.capacity < 1 || facility.capacity > 1000)) {
      newErrors.capacity = 'Capacity must be between 1 and 1000';
    }

    if (!facility.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (facility.location.length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    if (facility.availableFrom && facility.availableTo && facility.availableFrom >= facility.availableTo) {
      newErrors.time = 'Available From must be before Available To';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    setIsLoading(true);

    try {
      await facilityService.create(facility);
      toast.success('✅ Facility created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form
      setFacility({
        name: '',
        type: '',
        capacity: 0,
        location: '',
        availableFrom: '08:00:00',
        availableTo: '18:00:00',
        status: 'ACTIVE'
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/facilities';
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || '❌ Failed to create facility', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFacility(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFacility(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="add-facility-container">
      <div className="form-card">
        <div className="form-header">
          <h2>➕ Add New Facility</h2>
          <p>Fill in the details to add a new facility</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Facility Name */}
          <div className="form-group">
            <label>Facility Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={facility.name}
              onChange={handleChange}
              placeholder="e.g., Hall A, Computer Lab 1"
              className={errors.name ? 'error-input' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Facility Type */}
          <div className="form-group">
            <label>Facility Type <span className="required">*</span></label>
            <select
              name="type"
              value={facility.type}
              onChange={handleChange}
              className={errors.type ? 'error-input' : ''}
            >
              <option value="">Select Facility Type</option>
              {facilityTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'LECTURE_HALL' ? '📚 Lecture Hall' :
                   type === 'LAB' ? '💻 Lab' :
                   type === 'MEETING_ROOM' ? '🤝 Meeting Room' :
                   '📷 Equipment'}
                </option>
              ))}
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          {/* Capacity & Time Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={facility.capacity || ''}
                onChange={handleNumberChange}
                placeholder="Number of people/items"
                className={errors.capacity ? 'error-input' : ''}
              />
              {errors.capacity && <span className="error-text">{errors.capacity}</span>}
            </div>

            <div className="form-group">
              <label>Available From</label>
              <input
                type="time"
                name="availableFrom"
                value={facility.availableFrom}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Available To</label>
              <input
                type="time"
                name="availableTo"
                value={facility.availableTo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Time Error */}
          {errors.time && <div className="error-text time-error">{errors.time}</div>}

          {/* Location */}
          <div className="form-group">
            <label>Location <span className="required">*</span></label>
            <input
              type="text"
              name="location"
              value={facility.location}
              onChange={handleChange}
              placeholder="e.g., Building 1, Floor 2"
              className={errors.location ? 'error-input' : ''}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={facility.status}
              onChange={handleChange}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'ACTIVE' ? '🟢 Active' : '🔴 Out of Service'}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : '➕ Create Facility'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => window.location.href = '/facilities'}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;