/**
 * @file Hotel/Guests/Index.jsx
 * @description Hotel guest directory with search, filters,
 * pagination, direct guest activate/deactivate status toggle,
 * calculated total stays from bookings, row-click navigation, Eye/Pencil icons,
 * modern form inputs, guest registration modal, guest edit modal, and Toast notifications.
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit3,
  Power,
  UserPlus,
  Search,
  SlidersHorizontal,
  X,
  User,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Avatar from '@components/Avatar/Avatar';
import Modal from '@components/Modal/Modal';
import Toast from '@components/Toast/Toast';
import useHotelGuests from '@hooks/useHotelGuests';
import useBookings from '@hooks/useBookings';
import hotelGuestService from '@services/hotelGuestService';

import styles from './Index.module.css';

const ITEMS_PER_PAGE = 10;

export default function HotelGuestsPage() {
  const navigate = useNavigate();
  const { guests, refetch, registerGuest, updateGuestStatus } = useHotelGuests();
  const { bookings } = useBookings();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [idTypeFilter, setIdTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idProofType: 'passport',
    idNumber: '',
  });

  const [editingGuest, setEditingGuest] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idProofType: 'passport',
    idNumber: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // ESC key listener for modal closure
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsRegisterOpen(false);
        setEditingGuest(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute real stay count by cross-referencing bookings
  const getGuestStayCount = (guest) => {
    if (!guest) return 0;
    const gId = String(guest.id);
    const gEmail = guest.email?.toLowerCase();
    const gPhone = guest.phone || guest.phoneNumber;

    if (!bookings || !Array.isArray(bookings)) return guest.totalStays || 0;

    const matchedBookings = bookings.filter((b) => {
      const rawG = b.rawRecord?.primaryGuest || b.guest || {};
      const bGuestId = String(b.primaryGuestId || rawG.id || b.guest?.id || '');
      const bEmail = (rawG.email || b.guest?.email || '').toLowerCase();
      const bPhone = rawG.phoneNumber || rawG.phone || b.guest?.phone;

      return (
        (bGuestId && bGuestId === gId) ||
        (gEmail && bEmail && bEmail === gEmail) ||
        (gPhone && bPhone && bPhone === gPhone)
      );
    });

    return Math.max(matchedBookings.length, Number(guest.totalStays || 0));
  };

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return guests.filter((guest) => {
      const fullName = (guest.name || `${guest.firstName || ''} ${guest.lastName || ''}`).toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        (guest.email && guest.email.toLowerCase().includes(searchValue)) ||
        (guest.phone && guest.phone.includes(searchValue)) ||
        (guest.idNumber && guest.idNumber.toLowerCase().includes(searchValue));

      const matchesStatus =
        statusFilter === 'ALL' ||
        (guest.status || 'ACTIVE').toUpperCase() === statusFilter.toUpperCase();

      const currentIdType = String(guest.idType || guest.idProofType || 'OTHER').toUpperCase();
      const targetIdType = String(idTypeFilter).toUpperCase();

      const matchesIdType =
        idTypeFilter === 'ALL' ||
        currentIdType === targetIdType ||
        (targetIdType === 'AADHAR' && currentIdType.includes('AADHAR'));

      return matchesSearch && matchesStatus && matchesIdType;
    });
  }, [guests, search, statusFilter, idTypeFilter]);

  // Paginated Guests
  const totalItems = filteredGuests.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGuests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGuests, currentPage]);

  const rangeText = useMemo(() => {
    if (totalItems === 0) return 'Showing 0 of 0 entries';
    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);
    return `Showing ${start} - ${end} of ${totalItems} entries`;
  }, [currentPage, totalItems]);

  const getBadgeVariant = (status) => {
    const st = (status || 'ACTIVE').toUpperCase();
    if (st === 'ACTIVE') return 'in-house';
    if (st === 'BLACKLISTED') return 'error';
    return 'regular';
  };

  const handleViewGuest = (guestId) => {
    navigate(`/hotel/guests/${guestId}`);
  };

  // Direct Activate / Deactivate Toggle (Passes full required fields to satisfy backend PUT validation)
  const handleToggleStatus = async (guest, e) => {
    if (e) e.stopPropagation();
    const currentStatus = (guest.status || 'ACTIVE').toUpperCase();
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const payload = {
      firstName: guest.firstName || guest.name?.split(' ')[0] || 'Guest',
      lastName: guest.lastName || guest.name?.split(' ').slice(1).join(' ') || '',
      email: guest.email || '',
      phoneNumber: guest.phone || guest.phoneNumber || '',
      idProofType: (guest.idType || guest.idProofType || 'passport').toLowerCase(),
      idNumber: guest.idNumber || guest.idProofNumber || '',
      status: newStatus,
    };

    try {
      await updateGuestStatus(guest.id, newStatus, payload);
      showToast(`Guest ${guest.name || guest.firstName || 'profile'} set to ${newStatus}!`, 'success');
    } catch (err) {
      console.warn('Failed to toggle guest status:', err);
      showToast(`Failed to set guest status to ${newStatus}.`, 'error');
    }
  };

  const handleOpenEdit = (guest, e) => {
    if (e) e.stopPropagation();
    setEditingGuest(guest);
    setEditForm({
      firstName: guest.firstName || guest.name?.split(' ')[0] || '',
      lastName: guest.lastName || guest.name?.split(' ').slice(1).join(' ') || '',
      phone: guest.phone || guest.phoneNumber || '',
      email: guest.email || '',
      idProofType: (guest.idType || guest.idProofType || 'passport').toLowerCase(),
      idNumber: guest.idNumber || guest.idProofNumber || '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editingGuest) return;
    setIsSavingEdit(true);
    try {
      const payload = {
        firstName: editForm.firstName?.trim(),
        lastName: editForm.lastName?.trim(),
        email: editForm.email?.trim(),
        phoneNumber: editForm.phone?.trim(),
        idProofType: editForm.idProofType,
        idNumber: editForm.idNumber?.trim(),
        status: editingGuest.status || 'ACTIVE',
      };
      await hotelGuestService.update(editingGuest.id, payload);
      showToast(`Guest profile for ${editForm.firstName} updated successfully!`, 'success');
      setEditingGuest(null);
      if (refetch) refetch();
    } catch (err) {
      console.error('Failed to update guest details:', err);
      showToast('Failed to update guest profile.', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleRegisterGuest = async () => {
    if (!registerForm.firstName.trim()) {
      showToast('First Name is required.', 'error');
      return;
    }
    try {
      await registerGuest(registerForm);
      showToast(`New guest ${registerForm.firstName} registered successfully!`, 'success');
      setIsRegisterOpen(false);
      setRegisterForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        idProofType: 'passport',
        idNumber: '',
      });
      if (refetch) refetch();
    } catch (err) {
      showToast('Failed to register new guest.', 'error');
    }
  };

  return (
    <div
      className={styles.page}
      data-testid="hotel-guests-page"
    >
      {/* Toast Feedback Banner */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* PAGE HEADER */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Guest Directory
          </h1>
          <p className={styles.subtitle}>
            Manage guest profiles, identification, and stay history.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsRegisterOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <UserPlus size={16} /> Register Guest
        </Button>
      </header>

      {/* SEARCH & FILTERS */}
      <section className={styles.filterCard}>
        <div className={styles.searchWrapper}>
          <label className={styles.filterLabel}>
            Search Guests
          </label>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, phone, email or ID..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Status
          </label>
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="BLACKLISTED">Blacklisted</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            ID Type
          </label>
          <select
            className={styles.select}
            value={idTypeFilter}
            onChange={(event) => {
              setIdTypeFilter(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All ID Types</option>
            <option value="AADHAR">Aadhar Card</option>
            <option value="PASSPORT">Passport</option>
            <option value="PAN">PAN Card</option>
            <option value="NATIONAL_ID">National ID</option>
            <option value="DRIVING_LICENSE">Driving License</option>
            <option value="VOTER_ID">Voter ID</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </section>

      {/* GUEST DIRECTORY TABLE */}
      <section className={styles.overviewCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              All Guests
            </h2>
            <span className={styles.resultCount}>
              {totalItems} guests total
            </span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Guest</th>
                <th>Contact</th>
                <th>Identity Document</th>
                <th>Total Stays</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedGuests.map((guest) => {
                const fullName = guest.name || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Guest';
                const staysCount = getGuestStayCount(guest);
                const isActive = (guest.status || 'ACTIVE').toUpperCase() === 'ACTIVE';

                return (
                  <tr
                    key={guest.id}
                    onClick={() => handleViewGuest(guest.id)}
                    style={{ cursor: 'pointer' }}
                    className={styles.tr}
                  >
                    {/* Guest Cell */}
                    <td>
                      <div className={styles.guestCell}>
                        <Avatar name={fullName} size="sm" />
                        <div>
                          <div className={styles.guestName}>{fullName}</div>
                          <div className={styles.guestId}>{guest.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className={styles.contactCell}>
                        <span>{guest.phone || 'N/A'}</span>
                        <span>{guest.email || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Identity Document */}
                    <td>
                      <div className={styles.idCell}>
                        <strong>
                          {String(guest.idType || guest.idProofType || 'OTHER').replaceAll('_', ' ')}
                        </strong>
                        <span>{guest.idNumber || 'N/A'}</span>
                      </div>
                    </td>

                    {/* Total Stays (Calculated from bookings) */}
                    <td>
                      <span className={styles.stayCount} style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {staysCount} Stays
                      </span>
                    </td>

                    {/* Status Badge & Icon Toggle */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Badge variant={getBadgeVariant(guest.status || 'ACTIVE')}>
                          {guest.status || 'ACTIVE'}
                        </Badge>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(guest, e)}
                          title={isActive ? 'Deactivate Guest' : 'Activate Guest'}
                          style={{
                            border: 'none',
                            background: isActive ? '#fee2e2' : '#dcfce7',
                            color: isActive ? '#dc2626' : '#15803d',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>

                    {/* Actions: Eye Icon (View) & Pencil Icon (Edit) */}
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewGuest(guest.id);
                          }}
                          title="View Details"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border)',
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-main)',
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={(e) => handleOpenEdit(guest, e)}
                          title="Edit Guest Profile"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border)',
                            background: '#fff',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-main)',
                          }}
                        >
                          <Edit3 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredGuests.length === 0 && (
            <div className={styles.emptyState}>
              No guests found matching your search or filters.
            </div>
          )}

          {/* Table Pagination Footer */}
          {totalItems > 0 && (
            <div className={styles.tableFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
              <span className={styles.paginationInfo} style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {rangeText}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    background: currentPage === 1 ? '#f1f5f9' : '#fff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  &lt; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      background: currentPage === num ? 'var(--color-primary)' : '#fff',
                      color: currentPage === num ? '#fff' : 'var(--color-text-main)',
                      fontWeight: currentPage === num ? 700 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {num}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    background: currentPage >= totalPages ? '#f1f5f9' : '#fff',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REGISTER GUEST MODAL */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Guest"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRegisterGuest}>
              Register Guest
            </Button>
          </>
        }
      >
        <div className={styles.registerForm}>
          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="guest@example.com"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ID Proof Type</label>
            <select
              value={registerForm.idProofType}
              onChange={(e) => setRegisterForm({ ...registerForm, idProofType: e.target.value })}
            >
              <option value="passport">Passport</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="license">Driving License</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>ID Proof Number</label>
            <input
              type="text"
              placeholder="e.g. 1234-5678-9012"
              value={registerForm.idNumber}
              onChange={(e) => setRegisterForm({ ...registerForm, idNumber: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* EDIT GUEST MODAL */}
      <Modal
        isOpen={Boolean(editingGuest)}
        onClose={() => setEditingGuest(null)}
        title={`Edit Guest Profile - ${editingGuest?.name || ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingGuest(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} disabled={isSavingEdit}>
              {isSavingEdit ? 'Saving...' : 'Save Profile'}
            </Button>
          </>
        }
      >
        <div className={styles.registerForm}>
          <div className={styles.formGroup}>
            <label>First Name *</label>
            <input
              type="text"
              value={editForm.firstName}
              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={editForm.lastName}
              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ID Proof Type</label>
            <select
              value={editForm.idProofType}
              onChange={(e) => setEditForm({ ...editForm, idProofType: e.target.value })}
            >
              <option value="passport">Passport</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
              <option value="license">Driving License</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>ID Proof Number</label>
            <input
              type="text"
              value={editForm.idNumber}
              onChange={(e) => setEditForm({ ...editForm, idNumber: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}