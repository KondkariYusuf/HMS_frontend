/**
 * @file Hotel/RoomTypes/Index.jsx
 * @description Room Type Management interface for SyncStays platform.
 * Fully connected to live backend APIs:
 * - GET /api/room-type
 * - POST /api/room-type
 * - GET /api/room-type/:id
 * - PUT /api/room-type/:id
 * - DELETE /api/room-type/:id
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import roomTypeService from '@services/roomTypeService';
import styles from './Index.module.css';

export default function HotelRoomTypesPage() {
  // Real Backend Room Types State
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [deletingRoomType, setDeletingRoomType] = useState(null);

  // Form Field State for Add/Edit
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    baseRate: '',
    maxOccupancy: '2',
    maxAdults: '2',
    maxChildren: '0',
    bedType: 'KING',
    sizeSqft: '',
    status: 'ACTIVE',
  });

  // Global Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Fetch room types from backend GET /api/room-type
   */
  const fetchRoomTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomTypeService.getAll();

      // Extract data array robustly based on backend response shape
      let typesData = [];
      if (Array.isArray(response?.data)) {
        typesData = response.data;
      } else if (response?.data && Array.isArray(response.data.roomTypes)) {
        typesData = response.data.roomTypes;
      } else if (response?.data && Array.isArray(response.data.data)) {
        typesData = response.data.data;
      } else if (Array.isArray(response)) {
        typesData = response;
      }

      // Map backend fields to UI row structure
      const normalizedTypes = typesData.map((item, index) => {
        const id = item.id || item._id || `rt-${index}`;
        const name = item.name || item.title || 'Untitled Room Type';
        const code =
          item.code ||
          item.typeCode ||
          (name ? name.substring(0, 5).toUpperCase() : 'RT');
        const description = item.description || item.desc || '';
        const baseRate = item.baseRate || item.price || item.rate || 0;
        const maxOccupancy = item.maxOccupancy || item.capacity || 2;
        const maxAdults = item.maxAdults || 2;
        const maxChildren = item.maxChildren || 0;
        const bedType = item.bedType || 'KING';
        const sizeSqft = item.sizeSqft || item.size || 0;

        const status =
          item.status === 'INACTIVE' || item.isActive === false
            ? 'INACTIVE'
            : 'ACTIVE';

        return {
          id,
          code,
          name,
          description,
          baseRate,
          maxOccupancy,
          maxAdults,
          maxChildren,
          bedType,
          sizeSqft,
          status,
          rawItem: item,
        };
      });

      setRoomTypes(normalizedTypes);
    } catch (err) {
      console.error('API Error fetching room types:', err);
      setError(
        err.message || 'Failed to communicate with backend server (http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Filtered & Searched Data
  const filteredRoomTypes = useMemo(() => {
    return roomTypes.filter((rt) => {
      const matchesSearch =
        rt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rt.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'ALL' || rt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [roomTypes, searchQuery, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredRoomTypes.length / pageSize) || 1;
  const paginatedRoomTypes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRoomTypes.slice(start, start + pageSize);
  }, [filteredRoomTypes, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      baseRate: '',
      maxOccupancy: '2',
      maxAdults: '2',
      maxChildren: '0',
      bedType: 'KING',
      sizeSqft: '',
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (rt) => {
    setEditingRoomType(rt);
    setFormData({
      code: rt.code || '',
      name: rt.name || '',
      description: rt.description || '',
      baseRate: rt.baseRate ? String(rt.baseRate) : '',
      maxOccupancy: rt.maxOccupancy ? String(rt.maxOccupancy) : '2',
      maxAdults: rt.maxAdults ? String(rt.maxAdults) : '2',
      maxChildren: rt.maxChildren ? String(rt.maxChildren) : '0',
      bedType: rt.bedType || 'KING',
      sizeSqft: rt.sizeSqft ? String(rt.sizeSqft) : '',
      status: rt.status || 'ACTIVE',
    });
  };

  /**
   * Save Room Type Handler (Connected to POST /api/room-type & PUT /api/room-type/:id)
   */
  const handleSaveRoomType = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Room Type name is required.', 'error');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      ...(formData.code.trim() ? { code: formData.code.toUpperCase().trim() } : {}),
      ...(formData.baseRate ? { baseRate: Number(formData.baseRate) } : {}),
      ...(formData.maxOccupancy ? { maxOccupancy: Number(formData.maxOccupancy) } : {}),
      ...(formData.maxAdults ? { maxAdults: Number(formData.maxAdults) } : {}),
      ...(formData.maxChildren ? { maxChildren: Number(formData.maxChildren) } : {}),
      ...(formData.bedType ? { bedType: formData.bedType } : {}),
      ...(formData.sizeSqft ? { sizeSqft: Number(formData.sizeSqft) } : {}),
      ...(formData.status ? { status: formData.status } : {}),
    };

    try {
      if (editingRoomType) {
        const response = await roomTypeService.update(editingRoomType.id, payload);
        showToast(
          response?.message || `Room Type "${formData.name}" updated successfully.`,
          'success'
        );
        setEditingRoomType(null);
        setFormData({
          code: '',
          name: '',
          description: '',
          baseRate: '',
          maxOccupancy: '2',
          maxAdults: '2',
          maxChildren: '0',
          bedType: 'KING',
          sizeSqft: '',
          status: 'ACTIVE',
        });
        await fetchRoomTypes();
      } else {
        const response = await roomTypeService.create(payload);
        showToast(
          response?.message || `Room Type "${formData.name}" created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData({
          code: '',
          name: '',
          description: '',
          baseRate: '',
          maxOccupancy: '2',
          maxAdults: '2',
          maxChildren: '0',
          bedType: 'KING',
          sizeSqft: '',
          status: 'ACTIVE',
        });
        await fetchRoomTypes();
      }
    } catch (err) {
      console.error(
        `API Error ${editingRoomType ? 'updating' : 'creating'} room type:`,
        err
      );
      showToast(
        err.message ||
          `Failed to ${editingRoomType ? 'update' : 'create'} room type on the server.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete Room Type Handler (Connected to DELETE /api/room-type/:id)
   */
  const handleDeleteConfirm = async () => {
    if (!deletingRoomType) return;
    setIsSubmitting(true);
    try {
      const response = await roomTypeService.delete(deletingRoomType.id);
      showToast(
        response?.message || `Room Type "${deletingRoomType.name}" deleted successfully.`,
        'success'
      );
      setDeletingRoomType(null);
      await fetchRoomTypes();
    } catch (err) {
      console.error('API Error deleting room type:', err);
      showToast(
        err.message || 'Failed to delete room type on the server.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page} data-testid="hotel-room-types-page">
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
          <h1 className={styles.title}>Room Types Setup</h1>
          <p className={styles.subtitle}>
            Configure room categories, base pricing, occupancy limits, and bed configurations.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Add Room Type
        </Button>
      </header>

      {/* Controls Bar: Search & Status Filter */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by room type name or code..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="rt-status-filter">
            Status:
          </label>
          <select
            id="rt-status-filter"
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

      {/* Room Type Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Code</th>
                <th className={styles.th}>Room Type Name</th>
                <th className={styles.th}>Base Rate</th>
                <th className={styles.th}>Occupancy</th>
                <th className={styles.th}>Bed Type</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Fetching room types from backend (http://localhost:5000/api/room-type)...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }}>
                      ⚠️ {error}
                    </div>
                    <Button variant="secondary" size="sm" onClick={fetchRoomTypes}>
                      Retry Connection
                    </Button>
                  </td>
                </tr>
              ) : paginatedRoomTypes.length > 0 ? (
                paginatedRoomTypes.map((rt) => (
                  <tr key={rt.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.codeBadge}>{rt.code}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.typeName}>{rt.name}</span>
                      {rt.description && (
                        <div className={styles.description}>{rt.description}</div>
                      )}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.rate}>
                        ₹{Number(rt.baseRate).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span>
                        Max {rt.maxOccupancy} ({rt.maxAdults} Adults, {rt.maxChildren} Children)
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Badge variant="secondary">{rt.bedType}</Badge>
                    </td>
                    <td className={styles.td}>
                      <Badge
                        variant={
                          rt.status === 'ACTIVE' ? 'in-house' : 'checked-out'
                        }
                      >
                        {rt.status}
                      </Badge>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(rt)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: 'var(--color-error)' }}
                          onClick={() => setDeletingRoomType(rt)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    No room types match the selected filter criteria.
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
              {filteredRoomTypes.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{' '}
              to {Math.min(currentPage * pageSize, filteredRoomTypes.length)} of{' '}
              {filteredRoomTypes.length} room types
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

      {/* Add / Edit Room Type Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingRoomType}
        onClose={() => {
          if (isSubmitting) return;
          setIsAddModalOpen(false);
          setEditingRoomType(null);
        }}
        title={editingRoomType ? `Edit Room Type: ${editingRoomType.name}` : 'Add New Room Type'}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoomType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveRoomType}
            >
              {isSubmitting
                ? 'Saving...'
                : editingRoomType
                ? 'Save Changes'
                : 'Create Room Type'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveRoomType} className={styles.formGrid}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Type Code</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. DLX-K, STE-01"
                value={formData.code}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Room Type Name *</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Deluxe King"
                value={formData.name}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Describe amenities, view, and features of this category..."
              value={formData.description}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Base Rate (₹) *</label>
              <input
                type="number"
                min="0"
                className={styles.formInput}
                placeholder="e.g. 4500"
                value={formData.baseRate}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, baseRate: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bed Type</label>
              <select
                className={styles.formSelect}
                value={formData.bedType}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, bedType: e.target.value })
                }
              >
                <option value="SINGLE">SINGLE</option>
                <option value="TWIN">TWIN</option>
                <option value="QUEEN">QUEEN</option>
                <option value="KING">KING</option>
                <option value="SUITE">SUITE</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Max Occupancy</label>
              <input
                type="number"
                min="1"
                className={styles.formInput}
                value={formData.maxOccupancy}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, maxOccupancy: e.target.value })
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
          </div>
        </form>
      </Modal>

      {/* Delete Room Type Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingRoomType}
        onClose={() => {
          if (isSubmitting) return;
          setDeletingRoomType(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Room Type"
        message={`Are you sure you want to delete room type "${deletingRoomType?.name}" (${deletingRoomType?.code})?`}
        isDestructive={true}
      />
    </div>
  );
}
