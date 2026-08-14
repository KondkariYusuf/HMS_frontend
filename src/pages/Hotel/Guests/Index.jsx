/**
 * @file Hotel/Guests/Index.jsx
 * @description Hotel guest directory with search, filters,
 * guest actions, and guest registration modal.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';
import Avatar from '@components/Avatar/Avatar';
import Modal from '@components/Modal/Modal';

import guestData from '../../../data/guestData.json';

import styles from './Index.module.css';

export default function HotelGuestsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [idTypeFilter, setIdTypeFilter] = useState('ALL');

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const filteredGuests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return guestData.filter((guest) => {
      const fullName =
        `${guest.firstName} ${guest.lastName}`.toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        guest.email.toLowerCase().includes(searchValue) ||
        guest.phone.includes(searchValue) ||
        guest.idNumber.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === 'ALL' ||
        guest.status === statusFilter;

      const matchesIdType =
        idTypeFilter === 'ALL' ||
        guest.idType === idTypeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesIdType
      );
    });
  }, [search, statusFilter, idTypeFilter]);

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

  const handleRegisterGuest = () => {
    setIsRegisterOpen(false);

    alert(
      'Guest registration will be connected to the backend API later.'
    );
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
            Manage guest profiles, identification, and
            stay history.
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
            <option value="ALL">
              All ID Types
            </option>

            <option value="PASSPORT">
              Passport
            </option>

            <option value="NATIONAL_ID">
              National ID
            </option>

            <option value="DRIVING_LICENSE">
              Driving License
            </option>

            <option value="VOTER_ID">
              Voter ID
            </option>

            <option value="OTHER">
              Other
            </option>
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGuests.map((guest) => {
                const fullName =
                  `${guest.firstName} ${guest.lastName}`;

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
                          {guest.phone}
                        </span>

                        <span>
                          {guest.email}
                        </span>
                      </div>
                    </td>

                    {/* Identity Document */}
                    <td>
                      <div className={styles.idCell}>
                        <strong>
                          {guest.idType.replaceAll(
                            '_',
                            ' '
                          )}
                        </strong>

                        <span>
                          {guest.idNumber}
                        </span>
                      </div>
                    </td>

                    {/* Total Stays */}
                    <td>
                      <span className={styles.stayCount}>
                        {guest.totalStays}
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

                    {/* View */}
                    <td>
                      <button
                        type="button"
                        className={styles.viewButton}
                        onClick={() =>
                          handleViewGuest(guest.id)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredGuests.length === 0 && (
            <div className={styles.emptyState}>
              No guests found matching your search or
              filters.
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
            <label>First Name</label>

            <input
              type="text"
              placeholder="Enter first name"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>

            <input
              type="text"
              placeholder="Enter last name"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone</label>

            <input
              type="tel"
              placeholder="Enter phone number"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email address"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>ID Type</label>

            <select className={styles.formInput}>
              <option value="">
                Select ID type
              </option>

              <option value="PASSPORT">
                Passport
              </option>

              <option value="NATIONAL_ID">
                National ID
              </option>

              <option value="DRIVING_LICENSE">
                Driving License
              </option>

              <option value="VOTER_ID">
                Voter ID
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>ID Number</label>

            <input
              type="text"
              placeholder="Enter ID number"
              className={styles.formInput}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}