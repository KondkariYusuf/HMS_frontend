/**
 * @file Hotel/CheckIn/Index.jsx
 * @description Express guest check-in / check-out desk.
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/Button/Button';
import Badge from '@components/Badge/Badge';

import guestData from '../../../data/guestData.json';

import styles from './Index.module.css';

export default function HotelCheckInPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  const arrivingGuests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return guestData;
    }

    return guestData.filter((guest) => {
      const fullName =
        `${guest.firstName} ${guest.lastName}`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        guest.phone.includes(searchValue) ||
        guest.email.toLowerCase().includes(searchValue) ||
        guest.idNumber.toLowerCase().includes(searchValue)
      );
    });
  }, [search]);

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
  };

  const handleBackToGuest = () => {
    if (selectedGuest) {
      navigate(`/hotel/guests/${selectedGuest.id}`);
    }
  };

  return (
    <div
      className={styles.page}
      data-testid="hotel-check-in-page"
    >
      {/* =========================
          HEADER
      ========================= */}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Express Check-In / Check-Out
          </h1>

          <p className={styles.subtitle}>
            Quickly verify guests, complete check-in, and manage
            room access.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/hotel/guests')}
        >
          Guest Directory
        </Button>
      </header>

      {/* =========================
          SEARCH
      ========================= */}

      <section className={styles.searchCard}>
        <div className={styles.searchHeader}>
          <div>
            <h2>Find Guest</h2>

            <p>
              Search using guest name, phone, email, or ID.
            </p>
          </div>

          <span className={styles.stepBadge}>
            STEP 1
          </span>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search guest by name, phone, email or ID..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSelectedGuest(null);
          }}
        />
      </section>

      {/* =========================
          GUEST RESULTS
      ========================= */}

      <section className={styles.contentGrid}>
        <div className={styles.guestCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Available Guests</h2>

              <p>
                Select a guest to continue the check-in process.
              </p>
            </div>

            <span className={styles.count}>
              {arrivingGuests.length}
            </span>
          </div>

          <div className={styles.guestList}>
            {arrivingGuests.map((guest) => {
              const fullName =
                `${guest.firstName} ${guest.lastName}`;

              const isSelected =
                selectedGuest?.id === guest.id;

              return (
                <button
                  type="button"
                  key={guest.id}
                  className={`${styles.guestRow} ${isSelected ? styles.selected : ''
                    }`}
                  onClick={() =>
                    handleSelectGuest(guest)
                  }
                >
                  <div className={styles.guestInfo}>
                    <div className={styles.avatar}>
                      {guest.firstName?.charAt(0)}
                      {guest.lastName?.charAt(0)}
                    </div>

                    <div>
                      <strong>{fullName}</strong>

                      <span>
                        {guest.phone}
                      </span>

                      <small>
                        {guest.id}
                      </small>
                    </div>
                  </div>

                  <Badge
                    variant={
                      guest.status === 'ACTIVE'
                        ? 'in-house'
                        : 'regular'
                    }
                  >
                    {guest.status}
                  </Badge>
                </button>
              );
            })}

            {arrivingGuests.length === 0 && (
              <div className={styles.emptyState}>
                No guest found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* =========================
            CHECK-IN PANEL
        ========================= */}

        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div>
              <h2>Check-In Details</h2>

              <p>
                Review guest information before proceeding.
              </p>
            </div>

            <span className={styles.count}>
              STEP 2
            </span>
          </div>

          {!selectedGuest ? (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>
                ✓
              </div>

              <strong>Select a guest</strong>

              <p>
                Choose a guest from the list to view their
                check-in details.
              </p>
            </div>
          ) : (
            <div className={styles.selectedPanel}>
              <div className={styles.selectedHeader}>
                <div>
                  <span className={styles.label}>
                    SELECTED GUEST
                  </span>

                  <h3>
                    {selectedGuest.firstName}{' '}
                    {selectedGuest.lastName}
                  </h3>
                </div>

                <Badge variant="in-house">
                  {selectedGuest.status}
                </Badge>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedGuest.phone}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedGuest.email}
                  </strong>
                </div>

                <div>
                  <span>ID Type</span>
                  <strong>
                    {selectedGuest.idType.replaceAll(
                      '_',
                      ' '
                    )}
                  </strong>
                </div>

                <div>
                  <span>ID Number</span>
                  <strong>
                    {selectedGuest.idNumber}
                  </strong>
                </div>
              </div>

              <div className={styles.notice}>
                <strong>Front Desk Verification</strong>

                <p>
                  ID verification and booking validation will
                  be connected to the backend API later.
                </p>
              </div>

              <div className={styles.actionButtons}>
                <Button
                  variant="secondary"
                  onClick={handleBackToGuest}
                >
                  View Guest Profile
                </Button>

                <Button
                  variant="primary"
                  onClick={() =>
                    window.alert(
                      'Check-in completed successfully.'
                    )
                  }
                >
                  Complete Check-In
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          WORKFLOW
      ========================= */}

      <section className={styles.workflowCard}>
        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>1</span>

          <div>
            <strong>Find Guest</strong>
            <p>Search and select the guest.</p>
          </div>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>2</span>

          <div>
            <strong>Verify Details</strong>
            <p>Confirm identity and booking.</p>
          </div>
        </div>

        <div className={styles.workflowLine} />

        <div className={styles.workflowStep}>
          <span className={styles.workflowNumber}>3</span>

          <div>
            <strong>Complete Check-In</strong>
            <p>Issue room access and finish.</p>
          </div>
        </div>
      </section>
    </div>
  );
}