/**
 * @file Hotel/Amenities/Index.jsx
 * @description Amenity Setup & Management interface for SyncStays platform.
 * Connected to live backend APIs:
 * - GET /api/amenity
 * - POST /api/amenity
 * - GET /api/amenity/:id
 * - PUT /api/amenity/:id
 * - DELETE /api/amenity/:id
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import amenityService from '@services/amenityService';
import styles from './Index.module.css';

export default function HotelAmenitiesPage() {
  // Real Backend Amenities State
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [deletingAmenity, setDeletingAmenity] = useState(null);

  // Form Field State for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'ROOM',
    icon: 'star',
    description: '',
    status: 'ACTIVE',
  });

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Fetch amenities from backend GET /api/amenity
   */
  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await amenityService.getAll();

      // Extract data array robustly based on backend response shape
      let amenitiesData = [];
      if (Array.isArray(response?.data)) {
        amenitiesData = response.data;
      } else if (response?.data && Array.isArray(response.data.amenities)) {
        amenitiesData = response.data.amenities;
      } else if (response?.data && Array.isArray(response.data.data)) {
        amenitiesData = response.data.data;
      } else if (Array.isArray(response)) {
        amenitiesData = response;
      }

      // Map backend fields to UI row structure
      const normalizedAmenities = amenitiesData.map((item, index) => {
        const id = item.id || item._id || `am-${index}`;
        const name = item.name || item.title || 'Untitled Amenity';
        const code =
          item.code ||
          item.amenityCode ||
          (name ? name.substring(0, 5).toUpperCase() : 'AMN');
        const category = item.category || 'GENERAL';
        const icon = item.icon || 'star';
        const description = item.description || item.desc || '';

        const status =
          item.status === 'INACTIVE' || item.isActive === false
            ? 'INACTIVE'
            : 'ACTIVE';

        return {
          id,
          code,
          name,
          category,
          icon,
          description,
          status,
          rawItem: item,
        };
      });

      setAmenities(normalizedAmenities);
    } catch (err) {
      console.error('API Error fetching amenities:', err);
      setError(
        err.message || 'Failed to communicate with backend server (http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  // Filtered & Searched Data
  const filteredAmenities = useMemo(() => {
    return amenities.filter((am) => {
      const matchesSearch =
        am.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        am.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === 'ALL' || am.category === categoryFilter;
      const matchesStatus =
        statusFilter === 'ALL' || am.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [amenities, searchQuery, categoryFilter, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredAmenities.length / pageSize) || 1;
  const paginatedAmenities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAmenities.slice(start, start + pageSize);
  }, [filteredAmenities, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: 'ROOM',
      icon: 'star',
      description: '',
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (am) => {
    setEditingAmenity(am);
    setFormData({
      name: am.name || '',
      category: am.category || 'ROOM',
      icon: am.icon || 'star',
      description: am.description || '',
      status: am.status || 'ACTIVE',
    });
  };

  /**
   * Save Amenity Handler (Connected to POST /api/amenity & PUT /api/amenity/:id)
   */
  const handleSaveAmenity = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Amenity name is required.', 'error');
      return;
    }

    const organizationId = localStorage.getItem('syncstays_org_id') || undefined;

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      icon: formData.icon.trim() || 'star',
      description: formData.description.trim(),
      ...(organizationId ? { organizationId } : {}),
      ...(formData.status ? { status: formData.status } : {}),
    };

    try {
      if (editingAmenity) {
        const response = await amenityService.update(editingAmenity.id, payload);
        showToast(
          response?.message || `Amenity "${formData.name}" updated successfully.`,
          'success'
        );
        setEditingAmenity(null);
        setFormData({
          name: '',
          category: 'ROOM',
          icon: 'star',
          description: '',
          status: 'ACTIVE',
        });
        await fetchAmenities();
      } else {
        const response = await amenityService.create(payload);
        showToast(
          response?.message || `Amenity "${formData.name}" created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          category: 'ROOM',
          icon: 'star',
          description: '',
          status: 'ACTIVE',
        });
        await fetchAmenities();
      }
    } catch (err) {
      console.error(
        `API Error ${editingAmenity ? 'updating' : 'creating'} amenity:`,
        err
      );
      showToast(
        err.message ||
          `Failed to ${editingAmenity ? 'update' : 'create'} amenity on the server.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete Amenity Handler (Connected to DELETE /api/amenity/:id)
   */
  const handleDeleteConfirm = async () => {
    if (!deletingAmenity) return;
    setIsSubmitting(true);
    try {
      const response = await amenityService.delete(deletingAmenity.id);
      showToast(
        response?.message || `Amenity "${deletingAmenity.name}" deleted successfully.`,
        'success'
      );
      setDeletingAmenity(null);
      await fetchAmenities();
    } catch (err) {
      console.error('API Error deleting amenity:', err);
      showToast(
        err.message || 'Failed to delete amenity on the server.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page} data-testid="hotel-amenities-page">
      {/* Toast Notification Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Hotel Amenities Setup</h1>
          <p className={styles.subtitle}>
            Manage room, bathroom, entertainment, and general guest amenities.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Add Amenity
        </Button>
      </header>

      {/* Controls Bar: Search, Category & Status Filter */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by amenity name or code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="category-filter">
            Category:
          </label>
          <select
            id="category-filter"
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Categories</option>
            <option value="ROOM">ROOM</option>
            <option value="BATHROOM">BATHROOM</option>
            <option value="ENTERTAINMENT">ENTERTAINMENT</option>
            <option value="GENERAL">GENERAL</option>
          </select>

          <label className={styles.filterLabel} htmlFor="am-status-filter">
            Status:
          </label>
          <select
            id="am-status-filter"
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Amenity Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Amenity Name</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Fetching amenities from backend (http://localhost:5000/api/amenity)...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }}>
                      ⚠️ {error}
                    </div>
                    <Button variant="secondary" size="sm" onClick={fetchAmenities}>
                      Retry Connection
                    </Button>
                  </td>
                </tr>
              ) : paginatedAmenities.length > 0 ? (
                paginatedAmenities.map((am) => (
                  <tr key={am.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.codeBadge}>{am.code}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.amenityName}>{am.name}</span>
                    </td>
                    <td className={styles.td}>
                      <Badge variant="secondary">{am.category}</Badge>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.description}>
                        {am.description || 'No description provided.'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Badge
                        variant={
                          am.status === 'ACTIVE' ? 'in-house' : 'checked-out'
                        }
                      >
                        {am.status}
                      </Badge>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(am)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: 'var(--color-error)' }}
                          onClick={() => setDeletingAmenity(am)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No amenities match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!loading && !error && (
          <div className={styles.paginationBar}>
            <div className={styles.paginationInfo}>
              Showing{' '}
              {filteredAmenities.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{' '}
              to {Math.min(currentPage * pageSize, filteredAmenities.length)} of{' '}
              {filteredAmenities.length} amenities
            </div>
            <div className={styles.paginationControls}>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span
                style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Amenity Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingAmenity}
        onClose={() => {
          if (isSubmitting) return;
          setIsAddModalOpen(false);
          setEditingAmenity(null);
        }}
        title={editingAmenity ? `Edit Amenity: ${editingAmenity.name}` : 'Add New Amenity'}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAmenity(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveAmenity}
            >
              {isSubmitting
                ? 'Saving...'
                : editingAmenity
                ? 'Save Changes'
                : 'Create Amenity'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveAmenity} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Amenity Name *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. High-Speed Wi-Fi"
              value={formData.name}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category *</label>
            <select
              className={styles.formSelect}
              value={formData.category}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="ROOM">ROOM</option>
              <option value="BATHROOM">BATHROOM</option>
              <option value="ENTERTAINMENT">ENTERTAINMENT</option>
              <option value="GENERAL">GENERAL</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Provide additional details about this amenity..."
              value={formData.description}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Status *</label>
            <select
              className={styles.formSelect}
              value={formData.status}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Amenity Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingAmenity}
        onClose={() => {
          if (isSubmitting) return;
          setDeletingAmenity(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Amenity"
        message={`Are you sure you want to delete amenity "${deletingAmenity?.name}" (${deletingAmenity?.code})?`}
        isDestructive={true}
      />
    </div>
  );
}
