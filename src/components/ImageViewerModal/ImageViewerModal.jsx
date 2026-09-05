/**
 * @file ImageViewerModal.jsx
 * @description Premium lightbox image viewer with zoom-in, zoom-out, pan/drag,
 * thumbnail gallery navigation, and keyboard shortcuts.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ImageViewerModal.module.css';

// Sleek inline SVG icons for toolbar & navigation
const ZoomInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ImageViewerModal({
  isOpen,
  images = [],
  initialIndex = 0,
  title = 'Room Photos',
  onClose,
}) {
  const normalizedImages = Array.isArray(images)
    ? images.map((item, idx) => {
        if (typeof item === 'string') return { url: item, name: `Photo ${idx + 1}` };
        return {
          url: item.url || item.secure_url || item.file?.url || '',
          name: item.name || item.originalName || `Photo ${idx + 1}`,
        };
      }).filter((img) => Boolean(img.url))
    : [];

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Sync index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, normalizedImages.length - 1)));
      setZoom(1);
      setPan({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex, normalizedImages.length]);

  // Reset zoom & pan when navigating images
  const resetTransform = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
    resetTransform();
  }, [normalizedImages.length, resetTransform]);

  const handlePrev = useCallback(() => {
    if (normalizedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
    resetTransform();
  }, [normalizedImages.length, resetTransform]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const nextZoom = Math.max(prev - 0.35, 0.5);
      if (nextZoom <= 1) {
        setPan({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  };

  const handleResetZoom = () => {
    resetTransform();
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetTransform();
    } else {
      setZoom(2);
    }
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.2, 3.5));
    } else {
      setZoom((prev) => {
        const nextZoom = Math.max(prev - 0.2, 0.5);
        if (nextZoom <= 1) setPan({ x: 0, y: 0 });
        return nextZoom;
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Pan / Dragging
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || normalizedImages.length === 0) return null;

  const currentImg = normalizedImages[currentIndex] || normalizedImages[0];

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" data-testid="image-viewer-modal">
      {/* Top Controls Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.titleArea}>
          <span className={styles.titleText}>{title}</span>
          <span className={styles.counterBadge}>
            {currentIndex + 1} / {normalizedImages.length}
          </span>
        </div>

        {/* Center Zoom Controls */}
        <div className={styles.controlsGroup}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            title="Zoom Out (-)"
            aria-label="Zoom Out"
          >
            <ZoomOutIcon />
          </button>

          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={handleZoomIn}
            disabled={zoom >= 3.5}
            title="Zoom In (+)"
            aria-label="Zoom In"
          >
            <ZoomInIcon />
          </button>

          <button
            type="button"
            className={styles.toolBtn}
            onClick={handleResetZoom}
            disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
            title="Reset Zoom (0)"
            aria-label="Reset Zoom"
          >
            <ResetIcon />
          </button>
        </div>

        {/* Close Modal Button */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          title="Close Viewer (Esc)"
          aria-label="Close Viewer"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Main Stage / Image Viewport */}
      <div
        className={styles.stage}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {/* Navigation Arrows */}
        {normalizedImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navPrev}`}
              onClick={handlePrev}
              title="Previous Photo (←)"
              aria-label="Previous Photo"
            >
              <ChevronLeftIcon />
            </button>

            <button
              type="button"
              className={`${styles.navArrow} ${styles.navNext}`}
              onClick={handleNext}
              title="Next Photo (→)"
              aria-label="Next Photo"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}

        {/* Image Container with Dynamic Transform */}
        <div
          className={styles.imageWrapper}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
          onDoubleClick={handleDoubleClick}
        >
          <img
            src={currentImg.url}
            alt={currentImg.name}
            className={styles.mainImage}
            draggable={false}
          />
        </div>

        {/* Zoom Tooltip Hint */}
        <div className={styles.zoomHint}>
          {zoom > 1 ? 'Drag to pan • Double-click to reset' : 'Double-click to zoom in • Scroll to scale'}
        </div>
      </div>

      {/* Bottom Thumbnails Strip */}
      {normalizedImages.length > 1 && (
        <div className={styles.thumbnailStrip}>
          {normalizedImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.thumbBtn} ${idx === currentIndex ? styles.activeThumb : ''}`}
              onClick={() => {
                setCurrentIndex(idx);
                resetTransform();
              }}
              title={img.name || `Photo ${idx + 1}`}
            >
              <img src={img.url} alt="" className={styles.thumbImg} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
