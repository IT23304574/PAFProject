import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facilityService, Facility } from '../services/facility.service';
import './FacilityList.css';

const FacilityList: React.FC = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = () => {
    setIsLoading(true);
    facilityService.getAll()
      .then((response) => {
        console.log('Loaded facilities:', response.data);
        setFacilities(response.data);
        setFilteredFacilities(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading facilities:', error);
        setErrorMessage('Failed to load facilities');
        setIsLoading(false);
      });
  };

  const searchByType = () => {
    if (searchType) {
      facilityService.searchByType(searchType)
        .then((response) => {
          setFilteredFacilities(response.data);
        })
        .catch(() => setErrorMessage('Search failed'));
    } else {
      setFilteredFacilities(facilities);
    }
  };

  const searchByLocation = () => {
    if (searchLocation) {
      facilityService.searchByLocation(searchLocation)
        .then((response) => {
          setFilteredFacilities(response.data);
        })
        .catch(() => setErrorMessage('Search failed'));
    } else {
      setFilteredFacilities(facilities);
    }
  };

  const clearSearch = () => {
    setSearchType('');
    setSearchLocation('');
    setFilteredFacilities(facilities);
  };

  const handleDeleteClick = (facility: Facility) => {
    setFacilityToDelete(facility);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (facilityToDelete?.id) {
      facilityService.delete(facilityToDelete.id)
        .then(() => {
          setShowConfirmModal(false);
          loadFacilities();
        })
        .catch(() => setErrorMessage('Delete failed'));
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setFacilityToDelete(null);
  };

  const goToAddFacility = () => {
    navigate('/facilities/add');
  };

  const goToAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="facility-container">
      <div className="header-section">
        <h2>🏫 Facilities Management</h2>
        <div className="header-buttons">
          <button onClick={goToAdminDashboard} className="btn-dashboard">📊 Admin Dashboard</button>
          <button onClick={goToAddFacility} className="btn-add">+ Add New Facility</button>
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="search-section">
        <h3>🔍 Search Facilities</h3>
        <div className="search-row">
          <input 
            type="text" 
            placeholder="Search by Type (e.g., LAB, LECTURE_HALL)" 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)} 
            className="search-input" 
          />
          <button onClick={searchByType} className="btn-primary">Search</button>
        </div>
        <div className="search-row">
          <input 
            type="text" 
            placeholder="Search by Location (e.g., Building 1)" 
            value={searchLocation} 
            onChange={(e) => setSearchLocation(e.target.value)} 
            className="search-input" 
          />
          <button onClick={searchByLocation} className="btn-primary">Search</button>
        </div>
        <button onClick={clearSearch} className="btn-secondary">Clear Search</button>
      </div>

      {isLoading && <div className="loading">⏳ Loading facilities...</div>}

      {!isLoading && (
        <table className="facility-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Available To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.id?.slice(0, 12)}...</td>
                <td>{facility.name}</td>
                <td>{facility.type}</td>
                <td>{facility.capacity}</td>
                <td>{facility.location}</td>
                <td>{facility.availableTo || '-'}</td>
                <td>
                  <span className={facility.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}>
                    {facility.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => navigate(`/facilities/edit/${facility.id}`)} className="btn-warning">✏️ Edit</button>
                  <button onClick={() => handleDeleteClick(facility)} className="btn-danger">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && filteredFacilities.length === 0 && (
        <div className="no-data">📭 No facilities found.</div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">⚠️</div>
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{facilityToDelete?.name}</strong>?</p>
              <p className="modal-warning">This action cannot be undone!</p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={cancelDelete}>Cancel</button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityList;