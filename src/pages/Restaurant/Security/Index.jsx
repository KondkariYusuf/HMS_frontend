/**
 * @file Restaurant/Security/Index.jsx
 * @description Dining security and menu access settings.
 */

import React, { useState } from 'react';
import styles from './Index.module.css';

export default function RestaurantSecurityPage() {
    const [settings, setSettings] = useState({
        requireManagerApproval: true,
        restrictMenuEditing: true,
        protectGuestData: true,
        auditMenuChanges: true,
    });

    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));
        setSaved(false);
    };

    const handleSave = () => {
        try {
            localStorage.setItem(
                'syncstays_dining_security_settings',
                JSON.stringify(settings)
            );
            setSaved(true);
        } catch (error) {
            console.warn('Dining security settings could not be saved:', error);
        }
    };

    return (
        <div className={styles.page} data-testid="dining-security-page">
            <header className={styles.header}>
                <div>
                    <div className={styles.breadcrumb}>Restaurant / Dining Security</div>

                    <h1 className={styles.title}>Dining Security</h1>

                    <p className={styles.subtitle}>
                        Manage security, access control, guest privacy, and menu
                        protection for restaurant operations.
                    </p>
                </div>
            </header>

            <section className={styles.securityPanel}>
                <div className={styles.panelHeader}>
                    <div className={styles.shieldIcon} aria-hidden="true">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 12 11 14 15 10" />
                        </svg>
                    </div>

                    <div>
                        <h2>Security & Access Controls</h2>
                        <p>
                            Configure the security rules used across the restaurant and
                            dining modules.
                        </p>
                    </div>
                </div>

                <div className={styles.settingsList}>
                    <SecuritySetting
                        title="Manager Approval Required"
                        description="Require manager approval before sensitive dining operations are completed."
                        checked={settings.requireManagerApproval}
                        onChange={() => handleToggle('requireManagerApproval')}
                    />

                    <SecuritySetting
                        title="Restrict Menu Editing"
                        description="Limit menu changes to authorized restaurant management users."
                        checked={settings.restrictMenuEditing}
                        onChange={() => handleToggle('restrictMenuEditing')}
                    />

                    <SecuritySetting
                        title="Protect Guest Information"
                        description="Keep guest and dining information accessible only to authorized staff."
                        checked={settings.protectGuestData}
                        onChange={() => handleToggle('protectGuestData')}
                    />

                    <SecuritySetting
                        title="Audit Menu Changes"
                        description="Record menu and pricing changes for operational review."
                        checked={settings.auditMenuChanges}
                        onChange={() => handleToggle('auditMenuChanges')}
                    />
                </div>

                <div className={styles.panelFooter}>
                    {saved && (
                        <span className={styles.savedMessage}>
                            Security settings saved successfully.
                        </span>
                    )}

                    <button
                        type="button"
                        className={styles.saveButton}
                        onClick={handleSave}
                    >
                        Save Security Settings
                    </button>
                </div>
            </section>

            <section className={styles.infoGrid}>
                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Access</span>
                    <strong>Role-based</strong>
                    <p>
                        Security permissions are controlled through the application&apos;s
                        access management system.
                    </p>
                </div>

                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Guest Privacy</span>
                    <strong>Protected</strong>
                    <p>
                        Guest-related dining information should only be visible to
                        authorized restaurant staff.
                    </p>
                </div>

                <div className={styles.infoCard}>
                    <span className={styles.infoLabel}>Audit Trail</span>
                    <strong>Enabled</strong>
                    <p>
                        Security-related configuration changes can be reviewed by
                        authorized administrators.
                    </p>
                </div>
            </section>
        </div>
    );
}

function SecuritySetting({ title, description, checked, onChange }) {
    return (
        <div className={styles.settingRow}>
            <div className={styles.settingContent}>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

            <button
                type="button"
                role="switch"
                aria-checked={checked}
                className={`${styles.toggle} ${checked ? styles.toggleActive : ''}`}
                onClick={onChange}
            >
                <span className={styles.toggleThumb} />
            </button>
        </div>
    );
}