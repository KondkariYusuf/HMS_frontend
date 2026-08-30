import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Index.module.css';

const IconDocument = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9H8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPhone = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMail = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 6l-10 7L2 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPin = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="10"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPalette = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.16-.6-1.57-.36-.39-.58-.93-.58-1.5 0-1.18.96-2.14 2.14-2.14h2.09c2.73 0 4.95-2.22 4.95-4.95C22 6.58 17.52 2 12 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconInfo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16v-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8h.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMailSend = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const IconTax = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15v-4" />
    <path d="M12 15v-2" />
    <path d="M15 15v-3" />
  </svg>
);

const defaultFormData = {
  phone: '+1 (555) 000-0000',
  email: 'finance@grandhorizon.com',
  address: '123 Luxury Way, Azure Coast, CA 90210, USA',
  template: 'Classic Corporate (Default)',
  color: '#147A7E',
  pdfEmailing: true,
  taxBreakdowns: true,
};

export default function BillingInvoicesPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaved, setIsSaved] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] =
    useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('billingSettings');

    if (saved) {
      try {
        setFormData({
          ...defaultFormData,
          ...JSON.parse(saved),
        });
      } catch {
        localStorage.removeItem('billingSettings');
      }
    }
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      'billingSettings',
      JSON.stringify(formData)
    );

    setIsSaved(true);

    window.setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const toggleSetting = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));

    setIsSaved(false);
  };

  const previewTotal = formData.taxBreakdowns
    ? '954.75'
    : '895.00';

  return (
    <div className={styles.pageWrapper}>
      {/* Invoice Preview Modal */}
      {isPreviewModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Invoice Preview"
        >
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Invoice Preview
              </h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() =>
                  setIsPreviewModalOpen(false)
                }
                aria-label="Close invoice preview"
              >
                ×
              </button>
            </div>

            <div className={styles.invoicePreview}>
              <div className={styles.invoiceHeader}>
                <div
                  className={styles.invoiceBrand}
                  style={{
                    color: formData.color,
                  }}
                >
                  Grand Hotel Group
                </div>

                <div className={styles.invoiceDetails}>
                  <strong>
                    INVOICE #INV-2026-001
                  </strong>
                  <br />
                  Date: Aug 15, 2026
                </div>
              </div>

              <div className={styles.invoiceTo}>
                <strong>Billed To:</strong>
                <br />
                John Doe
                <br />
                john.doe@example.com
              </div>

              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th
                      className={
                        styles.rightAlign
                      }
                    >
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      Deluxe King Room (3 Nights)
                    </td>
                    <td
                      className={
                        styles.rightAlign
                      }
                    >
                      $850.00
                    </td>
                  </tr>

                  <tr>
                    <td>Room Service</td>
                    <td
                      className={
                        styles.rightAlign
                      }
                    >
                      $45.00
                    </td>
                  </tr>

                  {formData.taxBreakdowns && (
                    <>
                      <tr>
                        <td>VAT (5%)</td>
                        <td
                          className={
                            styles.rightAlign
                          }
                        >
                          $44.75
                        </td>
                      </tr>

                      <tr>
                        <td>
                          City Tourism Tax
                        </td>
                        <td
                          className={
                            styles.rightAlign
                          }
                        >
                          $15.00
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              <div className={styles.invoiceTotal}>
                Total: ${previewTotal}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        SETTINGS &gt;{' '}
        <span>BILLING &amp; INVOICES</span>
      </div>

      <div className={styles.settingsCard}>
        {/* Header */}
        <div className={styles.headerSection}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <IconDocument />
            </div>

            <div>
              <h2 className={styles.headerTitle}>
                Invoice Preferences
              </h2>

              <p className={styles.headerSubtitle}>
                Configure automated billing cycles and
                invoice branding.
              </p>
            </div>
          </div>

          <button
            type="button"
            className={
              styles.previewButton ||
              styles.outlineBtn
            }
            onClick={() =>
              setIsPreviewModalOpen(true)
            }
          >
            Preview Draft
          </button>
        </div>

        <div className={styles.divider} />

        {/* Company Contact */}
        <div className={styles.section}>
          <h3 className={styles.sectionLabel}>
            COMPANY CONTACT
          </h3>

          <div className={styles.formRow2}>
            <div className={styles.inputGroup}>
              <label htmlFor="billing-phone">
                CONTACT PHONE
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <IconPhone />
                </span>

                <input
                  id="billing-phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="billing-email">
                BILLING EMAIL
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <IconMail />
                </span>

                <input
                  id="billing-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="billing-address">
              PHYSICAL BILLING ADDRESS
            </label>

            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <IconPin />
              </span>

              <input
                id="billing-address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Visual Identity */}
        <div className={styles.section}>
          <h3 className={styles.sectionLabel}>
            VISUAL IDENTITY
          </h3>

          <div className={styles.formRow2}>
            <div className={styles.inputGroup}>
              <label htmlFor="invoice-template">
                INVOICE TEMPLATE
              </label>

              <div className={styles.selectWrapper}>
                <select
                  id="invoice-template"
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                >
                  <option>
                    Classic Corporate (Default)
                  </option>
                  <option>
                    Modern Minimal
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="brand-color">
                PRIMARY BRAND COLOR
              </label>

              <div className={styles.inputWrapper}>
                <div
                  className={styles.colorSwatch}
                  style={{
                    backgroundColor:
                      formData.color,
                  }}
                />

                <input
                  id="brand-color"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={styles.colorInput}
                />

                <span
                  className={
                    styles.inputIconRight
                  }
                >
                  <IconPalette />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Billing Toggles */}
        <div className={styles.togglesSection}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleLeft}>
              <div className={styles.toggleIcon}>
                <IconMailSend />
              </div>

              <div>
                <div className={styles.toggleTitle}>
                  Automatic PDF Emailing
                </div>

                <div
                  className={
                    styles.toggleSubtitle
                  }
                >
                  Send finalized invoices to guest
                  email on checkout.
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                formData.pdfEmailing
              }
              aria-label="Toggle automatic PDF emailing"
              className={`${styles.toggleSwitch || styles.switch} ${formData.pdfEmailing
                  ? styles.toggleOn
                  : styles.toggleOff
                }`}
              onClick={() =>
                toggleSetting('pdfEmailing')
              }
            >
              <span
                className={
                  styles.toggleKnob ||
                  styles.slider
                }
              />
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLeft}>
              <div className={styles.toggleIcon}>
                <IconTax />
              </div>

              <div>
                <div className={styles.toggleTitle}>
                  Tax Breakdowns
                </div>

                <div
                  className={
                    styles.toggleSubtitle
                  }
                >
                  Include detailed VAT and local
                  tourism tax rows.
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={
                formData.taxBreakdowns
              }
              aria-label="Toggle tax breakdowns"
              className={`${styles.toggleSwitch || styles.switch} ${formData.taxBreakdowns
                  ? styles.toggleOn
                  : styles.toggleOff
                }`}
              onClick={() =>
                toggleSetting('taxBreakdowns')
              }
            >
              <span
                className={
                  styles.toggleKnob ||
                  styles.slider
                }
              />
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          type="button"
          className={`${styles.saveButton || styles.saveBtn} ${isSaved ? styles.saved : ''
            }`}
          onClick={handleSave}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '8px' }}
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>

          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Pro Tip */}
      <div
        className={
          styles.proTip || styles.proTipBanner
        }
      >
        <span className={styles.proTipIcon}>
          <IconInfo />
        </span>

        <div className={styles.proTipText}>
          <strong>Pro Tip:</strong>{' '}
          You can set different billing contacts
          for individual room blocks in the{' '}
          <Link to="/hotel/reservations">
            Reservations
          </Link>{' '}
          tab. All changes here will apply to new
          invoices generated after this moment.
        </div>
      </div>

      <div className={styles.footerCopyright}>
        © 2024 GRAND HORIZON LUXURY RESORT •
        HOSPITALITYOS
      </div>
    </div>
  );
}