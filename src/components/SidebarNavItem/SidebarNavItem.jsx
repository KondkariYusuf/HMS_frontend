/**
 * @file SidebarNavItem.jsx
 * @description Navigation link used by the SyncStays HMS sidebar.
 * @param {Object} props
 * @param {string} props.path - Destination route.
 * @param {string} props.label - Navigation label.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SidebarNavItem.module.css';

export default function SidebarNavItem({ path, label }) {
    return (
        <NavLink
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
                isActive
                    ? `${styles.link} ${styles.active}`
                    : styles.link
            }
        >
            {label}
        </NavLink>
    );
}