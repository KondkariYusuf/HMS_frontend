/**
 * @file SidebarGroup.jsx
 * @description Accessible collapsible navigation group for the application sidebar.
 * @param {Object} props
 * @param {string} props.label - Visible group label.
 * @param {Array} props.items - Navigation items belonging to the group.
 * @param {boolean} props.isOpen - Whether the submenu is expanded.
 * @param {Function} props.onToggle - Callback used to toggle the submenu.
 * @param {React.ComponentType} props.NavItem - Navigation item component.
 */

import React from 'react';
import styles from './SidebarGroup.module.css';

export default function SidebarGroup({
    label,
    items,
    isOpen,
    onToggle,
    NavItem,
}) {
    return (
        <section className={styles.group}>
            <button
                type="button"
                className={styles.groupButton}
                aria-expanded={isOpen}
                onClick={onToggle}
            >
                <span>{label}</span>

                <span
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''
                        }`}
                    aria-hidden="true"
                >
                    ›
                </span>
            </button>

            {isOpen && (
                <ul className={styles.itemList}>
                    {items.map((item) => (
                        <li key={item.path}>
                            <NavItem {...item} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}