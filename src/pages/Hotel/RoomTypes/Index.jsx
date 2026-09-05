/**
 * @file Hotel/RoomTypes/Index.jsx
 * @description Room Type Management interface for SyncStays platform.
 * Aligned strictly with backend Sequelize model (type, description, iconFileId, status).
 * Fully connected to live backend APIs:
 * - GET /api/room-type
 * - POST /api/room-type
 * - GET /api/room-type/:id
 * - PUT /api/room-type/:id
 * - DELETE /api/room-type/:id
 */
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import roomTypeService from '@services/roomTypeService';
import fileService from '@services/fileService';
import styles from './Index.module.css';

const isValidUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);

/* ========================================================= */
/* PREMIUM SVG ICON COMPONENTS                               */
/* ========================================================= */
const EyeIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PencilIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const BuildingIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const AlertCircleIcon = ({ size = 18, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const XIcon = ({ size = 14, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const initialFormData = {
  name: '',
  description: '',
  iconFileId: null,
  iconUrl: '',
  status: 'active',
};

export default function HotelRoomTypesPage() {
  // Real Backend Room Types State
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
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
  const [selectedRoomTypeDetail, setSelectedRoomTypeDetail] = useState(null);

  // Form Field State for Add/Edit (strictly aligned with model)
  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);

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
      const resData = response?.data;
      const typesData = Array.isArray(resData)
        ? resData
        : Array.isArray(resData?.responses)
        ? resData.responses
        : Array.isArray(resData?.rows)
        ? resData.rows
        : Array.isArray(resData?.roomTypes)
        ? resData.roomTypes
        : Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(response)
        ? response
        : [];

      // Map backend fields strictly to UI row structure
      const normalizedTypes = typesData.map((item, index) => {
        const id = item.id || item._id || `rt-${index}`;
        const name = item.type || item.name || item.title || 'Untitled Room Type';
        const description = item.description || item.desc || '';
        const iconFileId = item.iconFileId || item.icon?.id || null;
        const iconUrl = item.icon?.url || null;

        const status =
          String(item.status).toLowerCase() === 'inactive' || item.isActive === false
            ? 'inactive'
            : 'active';

        return {
          id,
          name,
          type: name,
          description,
          iconFileId,
          iconUrl,
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
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        rt.name.toLowerCase().includes(q) ||
        rt.description.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'ALL' || rt.status === statusFilter.toLowerCase();
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
    setEditingRoomType(null);
    setFormData(initialFormData);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (rt) => {
    setEditingRoomType(rt);
    setFormData({
      name: rt.name || rt.type || '',
      description: rt.description || '',
      iconFileId: rt.iconFileId || null,
      iconUrl: rt.iconUrl || '',
      status: (rt.status || 'active').toLowerCase(),
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIconFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, iconUrl: tempPreview }));
    setIsUploadingIcon(true);

    try {
      const res = await fileService.uploadSingle(file);
      if (res.success && res.fileId) {
        setFormData((prev) => ({
          ...prev,
          iconFileId: res.fileId,
          iconUrl: res.data?.url || res.data?.files?.url || tempPreview,
        }));
        showToast('Icon uploaded successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to upload icon', 'error');
      }
    } catch (err) {
      console.error('Error uploading icon:', err);
      showToast(err.message || 'Error uploading icon', 'error');
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleRemoveIcon = () => {
    setFormData((prev) => ({
      ...prev,
      iconFileId: null,
      iconUrl: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Save Room Type Handler (Connected to POST /api/room-type & PUT /api/room-type/:id)
   */
  const handleSaveRoomType = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Room Type name is required.', 'error');
      return;
    }

    setIsSubmitting(true);

    let userOrgId = localStorage.getItem('syncstays_org_id');
    let userBranchId = localStorage.getItem('syncstays_branch_id');
    try {
      const rawUser = localStorage.getItem('syncstays_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        userOrgId = userOrgId || u.organizationId;
        userBranchId = userBranchId || u.organizationBranchId;
      }
    } catch (e) {}

    let orgId = isValidUUID(userOrgId) ? userOrgId : null;
    let branchId = isValidUUID(userBranchId) ? userBranchId : null;

    if (!orgId) {
      orgId = roomTypes.find((rt) => isValidUUID(rt.rawItem?.organizationId))?.rawItem?.organizationId;
    }
    if (!branchId) {
      branchId = roomTypes.find((rt) => isValidUUID(rt.rawItem?.organizationBranchId))?.rawItem?.organizationBranchId;
    }

    const payload = {
      type: formData.name.trim(),
      description: formData.description.trim() || null,
      iconFileId: formData.iconFileId || null,
      status: (formData.status || 'active').toLowerCase(),
      ...(orgId ? { organizationId: orgId } : {}),
      ...(branchId ? { organizationBranchId: branchId } : {}),
    };

    try {
      if (editingRoomType) {
        const response = await roomTypeService.update(editingRoomType.id, payload);
        showToast(
          response?.message || `Room Type "${formData.name}" updated successfully.`,
          'success'
        );
        setEditingRoomType(null);
        setFormData(initialFormData);
        await fetchRoomTypes();
      } else {
        const response = await roomTypeService.create(payload);
        showToast(
          response?.message || `Room Type "${formData.name}" created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData(initialFormData);
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
            Manage room categories, visual icons, descriptions, and operational availability.
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
            placeholder="Search room types or descriptions..."
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
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Room Type Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '60px' }}>Icon</th>
                <th className={styles.th}>Room Type Name</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th} style={{ width: '130px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Fetching room types from backend (http://localhost:5000/api/room-type)...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircleIcon size={18} />
                      <span>{error}</span>
                    </div>
                    <Button variant="secondary" size="sm" onClick={fetchRoomTypes}>
                      Retry Connection
                    </Button>
                  </td>
                </tr>
              ) : paginatedRoomTypes.length > 0 ? (
                paginatedRoomTypes.map((rt) => (
                  <tr
                    key={rt.id}
                    className={`${styles.tr} ${styles.clickableRow}`}
                    onClick={() => setSelectedRoomTypeDetail(rt)}
                    title="Click to view details"
                  >
                    <td className={styles.td} style={{ width: '60px' }}>
                      {rt.iconUrl ? (
                        <img src={rt.iconUrl} alt={rt.name} className={styles.typeIcon} />
                      ) : (
                        <div className={styles.typeIconPlaceholder} title="Default Icon">
                          <BuildingIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.typeName}>{rt.name}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.description}>
                        {rt.description || '—'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Badge
                        variant={
                          rt.status === 'active' ? 'in-house' : 'checked-out'
                        }
                      >
                        {rt.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.actionsCell} style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className={styles.actionBtnView}
                          title="View Details"
                          aria-label="View Details"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoomTypeDetail(rt);
                          }}
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtnEdit}
                          title="Edit Room Type"
                          aria-label="Edit Room Type"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(rt);
                          }}
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtnDelete}
                          title="Delete Room Type"
                          aria-label="Delete Room Type"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingRoomType(rt);
                          }}
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
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
        maxWidth="580px"
        onClose={() => {
          if (isSubmitting || isUploadingIcon) return;
          setIsAddModalOpen(false);
          setEditingRoomType(null);
        }}
        title={editingRoomType ? `Edit Room Type "${editingRoomType.name}"` : 'Add New Room Type'}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting || isUploadingIcon}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingRoomType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting || isUploadingIcon}
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
          {/* Room Type Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Room Type Name *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Deluxe Suite, Standard Double"
              value={formData.name}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Icon Image Uploader */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Icon Image</label>
            <div className={styles.iconUploadContainer}>
              <div className={styles.iconPreviewBox}>
                {formData.iconUrl ? (
                  <img src={formData.iconUrl} alt="Icon Preview" className={styles.iconPreviewImg} />
                ) : (
                  <span className={styles.iconPreviewEmpty}>
                    <BuildingIcon size={24} />
                  </span>
                )}
              </div>
              <div className={styles.uploadActions}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={handleIconFileSelect}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={isUploadingIcon || isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingIcon ? 'Uploading...' : formData.iconUrl ? 'Change Icon' : 'Upload Icon'}
                </Button>
                {formData.iconUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveIcon}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-error)',
                      cursor: 'pointer',
                      fontSize: '12px',
                      textAlign: 'left',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <XIcon size={12} />
                    <span>Remove Icon</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formTextarea}
              rows={3}
              placeholder="Describe features and ambiance of this room type category..."
              value={formData.description}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Status */}
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
        message={`Are you sure you want to delete room type "${deletingRoomType?.name}"?`}
        isDestructive={true}
      />

      {/* Room Type Details View Modal (No IDs exposed) */}
      <Modal
        isOpen={!!selectedRoomTypeDetail}
        maxWidth="580px"
        onClose={() => setSelectedRoomTypeDetail(null)}
        title={selectedRoomTypeDetail ? `${selectedRoomTypeDetail.name}` : 'Room Type Details'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                const target = selectedRoomTypeDetail;
                setSelectedRoomTypeDetail(null);
                handleOpenEditModal(target);
              }}
            >
              Edit Category
            </Button>
            <Button variant="primary" onClick={() => setSelectedRoomTypeDetail(null)}>
              Done
            </Button>
          </>
        }
      >
        {selectedRoomTypeDetail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
              {selectedRoomTypeDetail.iconUrl ? (
                <img
                  src={selectedRoomTypeDetail.iconUrl}
                  alt={selectedRoomTypeDetail.name}
                  style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                />
              ) : (
                <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'var(--color-highlight-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BuildingIcon size={28} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {selectedRoomTypeDetail.name}
                </h3>
                <Badge
                  variant={selectedRoomTypeDetail.status === 'active' ? 'in-house' : 'checked-out'}
                  style={{ marginTop: '4px' }}
                >
                  {selectedRoomTypeDetail.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className={styles.detailSection}>
              <h4 className={styles.sectionTitle}>Category Description</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.5, fontSize: '14px' }}>
                {selectedRoomTypeDetail.description || 'No description provided for this room type.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
