/**
 * @file Avatar.jsx
 * @description Circular profile image component with customizable size and ring border.
 * @figmaFrame Figma frame: Components - Avatar
 *
 * @param {Object} props
 * @param {string} [props.src] - Avatar image URL
 * @param {string} [props.name] - User name for alt attribute or initials fallback
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Avatar sizing variant
 * @param {boolean} [props.hasRing=true] - Applies primary ring border around avatar
 */
import React from 'react';
import styles from './Avatar.module.css';

export default function Avatar({
  src,
  name = 'User',
  size = 'md',
  hasRing = true,
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const avatarClasses = [
    styles.avatar,
    styles[size],
    hasRing ? styles.ring : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={avatarClasses} data-testid="avatar">
      {src ? (
        <img src={src} alt={name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
}
