import React, { useState } from 'react';
import styles from './Index.module.css';

// SVG Icons
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const PaletteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5"></circle>
    <circle cx="17.5" cy="10.5" r=".5"></circle>
    <circle cx="8.5" cy="7.5" r=".5"></circle>
    <circle cx="6.5" cy="12.5" r=".5"></circle>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#147a7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#147a7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const MailSendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#147a7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const TaxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#147a7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="M9 15v-4"></path>
    <path d="M12 15v-2"></path>
    <path d="M15 15v-3"></path>
  </svg>
);

export default function BillingInvoicesSettingsPage() {
  const [autoEmail, setAutoEmail] = useState(true);
  const [taxBreakdown, setTaxBreakdown] = useState(true);
  const [brandColor, setBrandColor] = useState('#147A7E');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleSave = () => {
    window.alert('Billing & Invoice settings have been saved successfully!');
  };

  return (
    <div className={styles.page}>
      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Invoice Preview</h2>
              <button className={styles.closeButton} onClick={() => setIsPreviewModalOpen(false)}>×</button>
            </div>
            
            <div className={styles.invoicePreview}>
              <div className={styles.invoiceHeader}>
                <div className={styles.invoiceBrand} style={{ color: brandColor }}>
                  Grand Hotel Group
                </div>
                <div className={styles.invoiceDetails}>
                  <strong>INVOICE #INV-2026-001</strong><br/>
                  Date: Aug 15, 2026
                </div>
              </div>

              <div className={styles.invoiceTo}>
                <strong>Billed To:</strong><br/>
                John Doe<br/>
                john.doe@example.com
              </div>

              <table className={styles.invoiceTable}>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th className={styles.rightAlign}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Deluxe King Room (3 Nights)</td>
                    <td className={styles.rightAlign}>$850.00</td>
                  </tr>
                  <tr>
                    <td>Room Service</td>
                    <td className={styles.rightAlign}>$45.00</td>
                  </tr>
                  {taxBreakdown && (
                    <>
                      <tr>
                        <td>VAT (5%)</td>
                        <td className={styles.rightAlign}>$44.75</td>
                      </tr>
                      <tr>
                        <td>City Tourism Tax</td>
                        <td className={styles.rightAlign}>$15.00</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              <div className={styles.invoiceTotal}>
                Total: ${taxBreakdown ? '954.75' : '895.00'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb Area */}
      <div className={styles.breadcrumb}>
        <span className={styles.crumbText}>SETTINGS</span>
        <span className={styles.crumbChevron}>{'>'}</span>
        <span className={styles.crumbActive}>BILLING & INVOICES</span>
      </div>

      <div className={styles.mainCard}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.headerTitleWrap}>
            <div className={styles.headerIcon}>
              <DocumentIcon />
            </div>
            <div>
              <h2 className={styles.headerTitle}>Invoice Preferences</h2>
              <p className={styles.headerSubtitle}>Configure automated billing cycles and invoice branding.</p>
            </div>
          </div>
          <button className={styles.outlineBtn} onClick={() => setIsPreviewModalOpen(true)}>
            Preview Draft
          </button>
        </div>

        <div className={styles.divider}></div>

        {/* Company Contact */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>COMPANY CONTACT</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>CONTACT PHONE</label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}><PhoneIcon /></div>
                <input type="text" defaultValue="+1 (555) 000-0000" />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>BILLING EMAIL</label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}><MailIcon /></div>
                <input type="email" defaultValue="finance@grandhorizon.com" />
              </div>
            </div>
          </div>
        </div>

        {/* Physical Billing Address */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>PHYSICAL BILLING ADDRESS</h3>
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}><MapPinIcon /></div>
              <input type="text" defaultValue="123 Luxury Way, Azure Coast, CA 90210, USA" />
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Visual Identity */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>VISUAL IDENTITY</h3>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>INVOICE TEMPLATE</label>
              <div className={styles.inputWrapper}>
                <select defaultValue="classic">
                  <option value="classic">Classic Corporate (Default)</option>
                  <option value="modern">Modern Minimal</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>PRIMARY BRAND COLOR</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="color" 
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className={styles.colorPreview} 
                  style={{ border: 'none', padding: 0 }}
                />
                <input 
                  type="text" 
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  style={{ paddingLeft: '40px' }} 
                />
                <div className={styles.inputIconRight}><PaletteIcon /></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Toggles */}
        <div className={styles.toggleSection}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <div className={styles.toggleIcon}><MailSendIcon /></div>
              <div>
                <div className={styles.toggleTitle}>Automatic PDF Emailing</div>
                <div className={styles.toggleSubtitle}>Send finalized invoices to guest email on checkout.</div>
              </div>
            </div>
            <button 
              className={`${styles.toggleSwitch} ${autoEmail ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => setAutoEmail(!autoEmail)}
            >
              <span className={styles.toggleKnob}></span>
            </button>
          </div>

          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <div className={styles.toggleIcon}><TaxIcon /></div>
              <div>
                <div className={styles.toggleTitle}>Tax Breakdowns</div>
                <div className={styles.toggleSubtitle}>Include detailed VAT and local tourism tax rows.</div>
              </div>
            </div>
            <button 
              className={`${styles.toggleSwitch} ${taxBreakdown ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => setTaxBreakdown(!taxBreakdown)}
            >
              <span className={styles.toggleKnob}></span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      {/* Pro Tip Banner */}
      <div className={styles.proTipBanner}>
        <div className={styles.proTipIcon}><InfoIcon /></div>
        <div className={styles.proTipText}>
          <strong>Pro Tip:</strong> You can set different billing contacts for individual room blocks in the <a href="/hotel/reservations" className={styles.link}>Reservations</a> tab. All changes here will apply to new invoices generated after this moment.
        </div>
      </div>
    </div>
  );
}
