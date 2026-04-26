import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { facilityService, Facility } from '../services/facility.service';
import './FacilityForm.css';

const FacilityForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [facility, setFacility] = useState<Facility>({
    name: '',
    type: '',
    capacity: 0,
    location: '',
    availableTo: '',
    status: 'ACTIVE'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const facilityTypes = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
  const statusOptions = ['ACTIVE', 'OUT_OF_SERVICE'];

  useEffect(() => {
    if (isEditMode && id) {
      loadFacility();
    }
  }, [id, isEditMode]);

  const loadFacility = () => {
    setIsLoading(true);
    facilityService.getById(id!).then((response) => {
      setFacility(response.data);
      setIsLoading(false);
    }).catch(() => {
      setErrorMessage('Failed to load facility');
      setIsLoading(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!facility.name.trim()) {
      setErrorMessage('Facility name is required');
      setIsLoading(false);
      return;
    }
    if (!facility.type) {
      setErrorMessage('Facility type is required');
      setIsLoading(false);
      return;
    }
    if (!facility.location.trim()) {
      setErrorMessage('Location is required');
      setIsLoading(false);
      return;
    }

    if (isEditMode && id) {
      facilityService.update(id, facility).then(() => {
        setSuccessMessage('Facility updated successfully!');
        setTimeout(() => navigate('/facilities'), 1500);
      }).catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Update failed');
        setIsLoading(false);
      });
    } else {
      facilityService.create(facility).then(() => {
        setSuccessMessage('Facility created successfully!');
        setTimeout(() => navigate('/facilities'), 1500);
      }).catch((err) => {
        setErrorMessage(err.response?.data?.message || 'Create failed');
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>{isEditMode ? '✏️ Edit Facility' : '➕ Add New Facility'}</h2>
        <p>{isEditMode ? 'Update facility information' : 'Fill in the details to add a new facility'}</p>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Facility Name <span className="required">*</span></label>
            <input 
              type="text" 
              value={facility.name} 
              onChange={(e) => setFacility({...facility, name: e.target.value})} 
              placeholder="e.g., Hall A, Computer Lab 1"
              required 
            />
          </div>

          <div className="form-group">
            <label>Facility Type <span className="required">*</span></label>
            <select value={facility.type} onChange={(e) => setFacility({...facility, type: e.target.value})} required>
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input 
                type="number" 
                value={facility.capacity || ''} 
                onChange={(e) => setFacility({...facility, capacity: parseInt(e.target.value) || 0})} 
                placeholder="Number of people/items"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Available To (Time)</label>
              <input 
                type="time" 
                value={facility.availableTo} 
                onChange={(e) => setFacility({...facility, availableTo: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location <span className="required">*</span></label>
            <input 
              type="text" 
              value={facility.location} 
              onChange={(e) => setFacility({...facility, location: e.target.value})} 
              placeholder="e.g., Building 1, Floor 2"
              required 
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={facility.status} onChange={(e) => setFacility({...facility, status: e.target.value})}>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'ACTIVE' ? '🟢 Active' : '🔴 Out of Service'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditMode ? '✏️ Update Facility' : '➕ Create Facility')}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/facilities')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityForm;