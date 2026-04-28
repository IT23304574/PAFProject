import React, { useState, useEffect } from 'react';
import { facilityService, Facility } from '../services/facility.service';
import { exportToExcel, exportToPDF } from '../services/export.service';
import './FacilityList.css';

const FacilityList: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export confirmation modal states
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = () => {
    setIsLoading(true);
    facilityService.getAll()
      .then((response) => {
        setFacilities(response.data);
        setFilteredFacilities(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Failed to load facilities');
        setIsLoading(false);
      });
  };

  const searchByType = () => {
    if (searchType) {
      facilityService.searchByType(searchType)
        .then((response) => setFilteredFacilities(response.data))
        .catch(() => setErrorMessage('Search failed'));
    } else {
      setFilteredFacilities(facilities);
    }
  };

  const searchByLocation = () => {
    if (searchLocation) {
      facilityService.searchByLocation(searchLocation)
        .then((response) => setFilteredFacilities(response.data))
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

  // Delete functions
  const openDeleteModal = (facility: Facility) => {
    setFacilityToDelete(facility);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFacilityToDelete(null);
    setIsDeleting(false);
  };

  const confirmDelete = () => {
    if (!facilityToDelete?.id) return;
    
    setIsDeleting(true);
    facilityService.delete(facilityToDelete.id)
      .then(() => {
        closeDeleteModal();
        loadFacilities();
      })
      .catch(() => {
        setErrorMessage('Delete failed');
        setIsDeleting(false);
      });
  };

  // Export confirmation functions
  const openExportModal = (type: 'excel' | 'pdf') => {
    if (filteredFacilities.length === 0) {
      alert('No data to export');
      return;
    }
    setExportType(type);
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
  };

  const confirmExport = () => {
    if (exportType === 'excel') {
      exportToExcel(filteredFacilities, 'facilities_export');
    } else {
      exportToPDF(filteredFacilities, 'Facilities Management Report');
    }
    setShowExportModal(false);
  };

  // Navigation
  const goToAddFacility = () => {
    window.location.href = '/add-facility';
  };

  const goToEditFacility = (id: string) => {
    window.location.href = `/edit-facility/${id}`;
  };

  const goToAdminDashboard = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="facility-container">
      {/* Header with Export Buttons */}
      <div className="header-section">
        <h2>🏫 Facilities Management</h2>
        <div className="header-buttons">
          <button onClick={() => openExportModal('excel')} className="btn-excel">📊 Export Excel</button>
          <button onClick={() => openExportModal('pdf')} className="btn-pdf">📄 Export PDF</button>
          <button onClick={goToAdminDashboard} className="btn-admin-dashboard">📊 Admin</button>
          <button onClick={goToAddFacility} className="btn-add">+ Add New Facility</button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Search Section */}
      <div className="search-section">
        <h3>🔍 Search Facilities</h3>
        <div className="search-row">
          <input 
            type="text" 
            placeholder="Search by Type (LAB, LECTURE_HALL...)" 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)} 
            className="search-input" 
          />
          <button onClick={searchByType} className="btn-primary">Search</button>
        </div>
        <div className="search-row">
          <input 
            type="text" 
            placeholder="Search by Location (Building 1...)" 
            value={searchLocation} 
            onChange={(e) => setSearchLocation(e.target.value)} 
            className="search-input" 
          />
          <button onClick={searchByLocation} className="btn-primary">Search</button>
        </div>
        <button onClick={clearSearch} className="btn-secondary">Clear Search</button>
      </div>

      {/* Loading */}
      {isLoading && <div className="loading">⏳ Loading facilities...</div>}

      {/* Facilities Table */}
      {!isLoading && (
        <table className="facility-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Available From</th>
              <th>Available To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacilities.map((facility) => (
              <tr key={facility.id}>
                <td>{facility.name}</td>
                <td>{facility.type}</td>
                <td>{facility.capacity}</td>
                <td>{facility.location}</td>
                <td>{facility.availableFrom}</td>
                <td>{facility.availableTo}</td>
                <td className="status-cell">
                  <span className={facility.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}>
                    {facility.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button onClick={() => goToEditFacility(facility.id!)} className="btn-warning">✏️ Edit</button>
                  <button onClick={() => openDeleteModal(facility)} className="btn-danger">🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Data */}
      {!isLoading && filteredFacilities.length === 0 && (
        <div className="no-data">📭 No facilities found.</div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header delete-header">
              <div className="modal-icon delete-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#dc2626"/>
                  <circle cx="12" cy="12" r="9" stroke="#dc2626"/>
                </svg>
              </div>
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{facilityToDelete?.name}</strong>?</p>
              <div className="warning-box">
                <span className="warning-icon">⚠️</span>
                <span>This action cannot be undone!</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDeleteModal}>Cancel</button>
              <button className="btn-confirm-delete" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={closeExportModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header export-header">
              <div className="modal-icon export-icon">
                {exportType === 'excel' ? (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16v16H4V4z" stroke="#10b981"/>
                    <path d="M8 8h8M8 12h6M8 16h4" stroke="#10b981" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v7l3-3-3-3z" stroke="#ef4444"/>
                    <path d="M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#ef4444"/>
                  </svg>
                )}
              </div>
              <h3>Export {exportType === 'excel' ? 'Excel' : 'PDF'}</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to export <strong>{filteredFacilities.length} facilities</strong> to {exportType === 'excel' ? 'Excel' : 'PDF'}?</p>
              <div className="info-box">
                <span className="info-icon">📄</span>
                <span>File will be downloaded to your device</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeExportModal}>Cancel</button>
              <button className="btn-confirm-export" onClick={confirmExport}>
                Yes, Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityList;