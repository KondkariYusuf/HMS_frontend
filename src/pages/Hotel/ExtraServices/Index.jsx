/**
 * @file Hotel/ExtraServices/Index.jsx
 * @description Extra Services Management interface for SyncStays platform.
 * Connected to live backend APIs:
 * - GET /api/extra-service-for-hotel
 * - GET /api/extra-service-for-hotel/:id
 * - POST /api/extra-service-for-hotel
 * - PUT /api/extra-service-for-hotel/:id
 * - DELETE /api/extra-service-for-hotel/:id
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Modal from '@components/Modal/Modal';
import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal';
import Toast from '@components/Toast/Toast';
import extraServiceService from '@services/extraServiceService';
import styles from './Index.module.css';

export default function HotelExtraServicesPage() {
  // Real Backend Extra Services State
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingService, setDeletingService] = useState(null);

  // Form Field State for Add/Edit
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: 'GENERAL',
    price: '',
    chargeType: 'PER_BOOKING',
    description: '',
    status: 'ACTIVE',
  });

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /**
   * Fetch extra services from backend GET /api/extra-service-for-hotel
   */
  const fetchExtraServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await extraServiceService.getAll();

      // Extract data array robustly based on backend response shape
      let servicesData = [];
      if (Array.isArray(response?.data)) {
        servicesData = response.data;
      } else if (response?.data && Array.isArray(response.data.extraServices)) {
        servicesData = response.data.extraServices;
      } else if (response?.data && Array.isArray(response.data.data)) {
        servicesData = response.data.data;
      } else if (Array.isArray(response)) {
        servicesData = response;
      }

      // Map backend fields to UI row structure
      const normalizedServices = servicesData.map((item, index) => {
        const id = item.id || item._id || `exs-${index}`;
        const serviceName =
          item.serviceName || item.name || item.title || 'Untitled Extra Service';
        const serviceType = item.serviceType || item.type || 'GENERAL';
        const price = item.price || item.rate || 0;
        const chargeType = item.chargeType || 'PER_BOOKING';
        const description = item.description || item.desc || '';

        const status =
          item.status === 'INACTIVE' || item.isActive === false
            ? 'INACTIVE'
            : 'ACTIVE';

        return {
          id,
          serviceName,
          serviceType,
          price,
          chargeType,
          description,
          status,
          rawItem: item,
        };
      });

      setExtraServices(normalizedServices);
    } catch (err) {
      console.error('API Error fetching extra services:', err);
      setError(
        err.message || 'Failed to communicate with backend server (http://localhost:5000).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExtraServices();
  }, [fetchExtraServices]);

  // Filtered & Searched Data
  const filteredServices = useMemo(() => {
    return extraServices.filter((s) => {
      const matchesSearch = s.serviceName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === 'ALL' || s.serviceType === typeFilter;
      const matchesStatus =
        statusFilter === 'ALL' || s.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [extraServices, searchQuery, typeFilter, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredServices.length / pageSize) || 1;
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    setFormData({
      serviceName: '',
      serviceType: 'GENERAL',
      price: '',
      chargeType: 'PER_BOOKING',
      description: '',
      status: 'ACTIVE',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = async (service) => {
    try {
      // Optional GET by ID if fresh details are returned from backend
      const res = await extraServiceService.getById(service.id);
      const data = res?.data || service;
      setEditingService(service);
      setFormData({
        serviceName: data.serviceName || data.name || service.serviceName,
        serviceType: data.serviceType || service.serviceType || 'GENERAL',
        price: data.price ? String(data.price) : String(service.price || ''),
        chargeType: data.chargeType || service.chargeType || 'PER_BOOKING',
        description: data.description || service.description || '',
        status: data.status || service.status || 'ACTIVE',
      });
    } catch {
      // Fallback to table item details
      setEditingService(service);
      setFormData({
        serviceName: service.serviceName,
        serviceType: service.serviceType || 'GENERAL',
        price: service.price ? String(service.price) : '',
        chargeType: service.chargeType || 'PER_BOOKING',
        description: service.description || '',
        status: service.status || 'ACTIVE',
      });
    }
  };

  /**
   * Save Extra Service Handler (Connected to POST & PUT /api/extra-service-for-hotel)
   */
  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.serviceName.trim()) {
      showToast('Service name is required.', 'error');
      return;
    }

    const organizationId = localStorage.getItem('syncstays_org_id') || undefined;
    const organizationBranchId = localStorage.getItem('syncstays_branch_id') || undefined;

    setIsSubmitting(true);
    const payload = {
      serviceName: formData.serviceName.trim(),
      serviceType: formData.serviceType,
      price: formData.price ? Number(formData.price) : 0,
      chargeType: formData.chargeType,
      description: formData.description.trim(),
      ...(organizationId ? { organizationId } : {}),
      ...(organizationBranchId ? { organizationBranchId } : {}),
      ...(formData.status ? { status: formData.status } : {}),
    };

    try {
      if (editingService) {
        const response = await extraServiceService.update(editingService.id, payload);
        showToast(
          response?.message || `Extra service "${formData.serviceName}" updated successfully.`,
          'success'
        );
        setEditingService(null);
        setFormData({
          serviceName: '',
          serviceType: 'GENERAL',
          price: '',
          chargeType: 'PER_BOOKING',
          description: '',
          status: 'ACTIVE',
        });
        await fetchExtraServices();
      } else {
        const response = await extraServiceService.create(payload);
        showToast(
          response?.message || `Extra service "${formData.serviceName}" created successfully.`,
          'success'
        );
        setIsAddModalOpen(false);
        setFormData({
          serviceName: '',
          serviceType: 'GENERAL',
          price: '',
          chargeType: 'PER_BOOKING',
          description: '',
          status: 'ACTIVE',
        });
        await fetchExtraServices();
      }
    } catch (err) {
      console.error(
        `API Error ${editingService ? 'updating' : 'creating'} extra service:`,
        err
      );
      showToast(
        err.message ||
          `Failed to ${editingService ? 'update' : 'create'} extra service on the server.`,
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Delete Extra Service Handler (Connected to DELETE /api/extra-service-for-hotel/:id)
   */
  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    setIsSubmitting(true);
    try {
      const response = await extraServiceService.delete(deletingService.id);
      showToast(
        response?.message || `Extra service "${deletingService.serviceName}" deleted successfully.`,
        'success'
      );
      setDeletingService(null);
      await fetchExtraServices();
    } catch (err) {
      console.error('API Error deleting extra service:', err);
      showToast(
        err.message || 'Failed to delete extra service on the server.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page} data-testid="hotel-extra-services-page">
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
          <h1 className={styles.title}>Extra Services Setup</h1>
          <p className={styles.subtitle}>
            Manage hotel add-on services, pricing structures, and guest charges.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAddModal}>
          + Add Extra Service
        </Button>
      </header>

      {/* Controls Bar: Search, Type & Status Filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by service name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel} htmlFor="type-filter">
            Type:
          </label>
          <select
            id="type-filter"
            className={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Types</option>
            <option value="TRANSPORT">TRANSPORT</option>
            <option value="DINING">DINING</option>
            <option value="WELLNESS">WELLNESS</option>
            <option value="LAUNDRY">LAUNDRY</option>
            <option value="GENERAL">GENERAL</option>
          </select>

          <label className={styles.filterLabel} htmlFor="exs-status-filter">
            Status:
          </label>
          <select
            id="exs-status-filter"
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

      {/* Extra Service Table Card */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Service Name</th>
                <th className={styles.th}>Service Type</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Charge Structure</th>
                <th className={styles.th}>Description</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Fetching extra services from backend (http://localhost:5000/api/extra-service-for-hotel)...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-sm)' }}>
                      ⚠️ {error}
                    </div>
                    <Button variant="secondary" size="sm" onClick={fetchExtraServices}>
                      Retry Connection
                    </Button>
                  </td>
                </tr>
              ) : paginatedServices.length > 0 ? (
                paginatedServices.map((s) => (
                  <tr key={s.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.serviceName}>{s.serviceName}</span>
                    </td>
                    <td className={styles.td}>
                      <Badge variant="secondary">{s.serviceType}</Badge>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.price}>
                        ₹{Number(s.price).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                        {s.chargeType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.description}>
                        {s.description || 'No description provided.'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <Badge
                        variant={
                          s.status === 'ACTIVE' ? 'in-house' : 'checked-out'
                        }
                      >
                        {s.status}
                      </Badge>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(s)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: 'var(--color-error)' }}
                          onClick={() => setDeletingService(s)}
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
                    No extra services match the selected filter criteria.
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
              {filteredServices.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}{' '}
              to {Math.min(currentPage * pageSize, filteredServices.length)} of{' '}
              {filteredServices.length} extra services
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

      {/* Add / Edit Extra Service Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingService}
        onClose={() => {
          if (isSubmitting) return;
          setIsAddModalOpen(false);
          setEditingService(null);
        }}
        title={
          editingService
            ? `Edit Service: ${editingService.serviceName}`
            : 'Add New Extra Service'
        }
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingService(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSaveService}
            >
              {isSubmitting
                ? 'Saving...'
                : editingService
                ? 'Save Changes'
                : 'Create Service'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveService} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Service Name *</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Airport Pickup"
              value={formData.serviceName}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, serviceName: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Service Type</label>
              <select
                className={styles.formSelect}
                value={formData.serviceType}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
              >
                <option value="TRANSPORT">TRANSPORT</option>
                <option value="DINING">DINING</option>
                <option value="WELLNESS">WELLNESS</option>
                <option value="LAUNDRY">LAUNDRY</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={styles.formInput}
                placeholder="e.g. 1500"
                value={formData.price}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Charge Structure</label>
              <select
                className={styles.formSelect}
                value={formData.chargeType}
                disabled={isSubmitting}
                onChange={(e) =>
                  setFormData({ ...formData, chargeType: e.target.value })
                }
              >
                <option value="PER_BOOKING">PER BOOKING</option>
                <option value="PER_NIGHT">PER NIGHT</option>
                <option value="PER_GUEST">PER GUEST</option>
                <option value="PER_GUEST_PER_NIGHT">PER GUEST PER NIGHT</option>
              </select>
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

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Describe what is included in this add-on service..."
              value={formData.description}
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>

      {/* Delete Extra Service Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingService}
        onClose={() => {
          if (isSubmitting) return;
          setDeletingService(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Extra Service"
        message={`Are you sure you want to delete extra service "${deletingService?.serviceName}"?`}
        isDestructive={true}
      />
    </div>
  );
}
