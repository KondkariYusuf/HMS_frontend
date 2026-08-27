/**
 * @file Hotel/Guests/Index.jsx
 * @description Hotel guest directory with search, filters,
 * guest actions, guest registration modal, and guest edit modal.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Avatar from '@components/Avatar/Avatar';
import Modal from '@components/Modal/Modal';
import useHotelGuests from '@hooks/useHotelGuests';
import hotelGuestService from '@services/hotelGuestService';

import styles from './Index.module.css';

export default function HotelGuestsPage() {
  const navigate = useNavigate();
  const { guests, refetch, registerGuest } = useHotelGuests();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [idTypeFilter, setIdTypeFilter] = useState('ALL');

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
        guest.status === statusFilter;

      const currentIdType = String(guest.idType || guest.idProofType || 'OTHER').toUpperCase();
      const targetIdType = String(idTypeFilter).toUpperCase();

      const matchesIdType =
        idTypeFilter === 'ALL' ||
        currentIdType === targetIdType ||
        (targetIdType === 'AADHAR' && currentIdType.includes('AADHAR'));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesIdType
      );
    });
  }, [guests, search, statusFilter, idTypeFilter]);

  const getBadgeVariant = (status) => {
    if (status === 'ACTIVE') {
      return 'in-house';
    }

    if (status === 'BLACKLISTED') {
      return 'error';
    }

    return 'regular';
  };

  const handleViewGuest = (guestId) => {
    navigate(`/hotel/guests/${guestId}`);
  };

  const handleOpenEdit = (guest) => {
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
      };
      await hotelGuestService.update(editingGuest.id, payload);
      setEditingGuest(null);
      if (refetch) refetch();
    } catch (err) {
      console.error('Failed to update guest details:', err);
      alert('Updating guest failed. Please verify API connection.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleRegisterGuest = async () => {
    await registerGuest(registerForm);
    setIsRegisterOpen(false);
    setRegisterForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      idProofType: 'passport',
      idNumber: '',
    });
  };

  return (
    <div
      className={styles.page}
      data-testid="hotel-guests-page"
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

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
        >
          + Register Guest
        </Button>
      </header>

      {/* =========================
          SEARCH & FILTERS
      ========================= */}

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
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            Status
          </label>

          <select
            className={styles.select}
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="ALL">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

            <option value="BLACKLISTED">
              Blacklisted
            </option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            ID Type
          </label>

          <select
            className={styles.select}
            value={idTypeFilter}
            onChange={(event) =>
              setIdTypeFilter(event.target.value)
            }
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

      {/* =========================
          GUEST DIRECTORY
      ========================= */}

      <section className={styles.overviewCard}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              All Guests
            </h2>

            <span className={styles.resultCount}>
              {filteredGuests.length} guests
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
              {filteredGuests.map((guest) => {
                const fullName = guest.name || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Guest';

                return (
                  <tr key={guest.id}>
                    {/* Guest */}
                    <td>
                      <div className={styles.guestCell}>
                        <Avatar
                          name={fullName}
                          size="sm"
                        />

                        <div>
                          <div className={styles.guestName}>
                            {fullName}
                          </div>

                          <div className={styles.guestId}>
                            {guest.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className={styles.contactCell}>
                        <span>
                          {guest.phone || 'N/A'}
                        </span>

                        <span>
                          {guest.email || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Identity Document */}
                    <td>
                      <div className={styles.idCell}>
                        <strong>
                          {String(guest.idType || guest.idProofType || 'OTHER').replaceAll('_', ' ')}
                        </strong>

                        <span>
                          {guest.idNumber || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Total Stays */}
                    <td>
                      <span className={styles.stayCount}>
                        {guest.totalStays || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <Badge
                        variant={getBadgeVariant(
                          guest.status
                        )}
                      >
                        {guest.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className={styles.viewButton}
                          onClick={() => handleViewGuest(guest.id)}
                        >
                          View
                        </button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEdit(guest)}
                        >
                          Edit
                        </Button>
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
        </div>
      </section>

      {/* =========================
          REGISTER GUEST MODAL
      ========================= */}

      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Guest"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsRegisterOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={handleRegisterGuest}
            >
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
              className={styles.formInput}
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
              className={styles.formInput}
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className={styles.formInput}
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              className={styles.formInput}
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ID Proof Type</label>
            <select
              className={styles.formInput}
              value={registerForm.idProofType}
              onChange={(e) => setRegisterForm({ ...registerForm, idProofType: e.target.value })}
            >
              <option value="aadhar">Aadhar Card</option>
              <option value="passport">Passport</option>
              <option value="pan">PAN Card</option>
              <option value="license">Driving License</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>ID Number</label>
            <input
              type="text"
              placeholder="Enter ID number"
              className={styles.formInput}
              value={registerForm.idNumber}
              onChange={(e) => setRegisterForm({ ...registerForm, idNumber: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* =========================
          EDIT GUEST MODAL
      ========================= */}

      {editingGuest && (
        <Modal
          isOpen={Boolean(editingGuest)}
          onClose={() => setEditingGuest(null)}
          title={`Edit Guest - ${editingGuest.name || editingGuest.id}`}
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setEditingGuest(null)}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleSaveEdit}
                disabled={isSavingEdit}
              >
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
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
                className={styles.formInput}
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className={styles.formInput}
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className={styles.formInput}
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                className={styles.formInput}
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>ID Proof Type</label>
              <select
                className={styles.formInput}
                value={editForm.idProofType}
                onChange={(e) => setEditForm({ ...editForm, idProofType: e.target.value })}
              >
                <option value="aadhar">Aadhar Card</option>
                <option value="passport">Passport</option>
                <option value="pan">PAN Card</option>
                <option value="license">Driving License</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>ID Number</label>
              <input
                type="text"
                placeholder="Enter ID number"
                className={styles.formInput}
                value={editForm.idNumber}
                onChange={(e) => setEditForm({ ...editForm, idNumber: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}