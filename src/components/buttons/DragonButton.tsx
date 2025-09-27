import React from 'react';
import './DragonButton.css';

interface DragonButtonProps {
  /** The text to display inside the button */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Button variant - controls the green glow intensity */
  variant?: 'normal' | 'intense' | 'subtle';
  /** Whether button is disabled */
  disabled?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Button type for forms */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * DragonButton - A compact, glowing green button with dragon-themed styling
 * 
 * Features:
 * - Pure CSS animations (no external deps)
 * - Respects prefers-reduced-motion
 * - Full keyboard accessibility
 * - Multiple glow intensity variants
 * - TypeScript support
 */
export const DragonButton: React.FC<DragonButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'normal',
  disabled = false,
  ariaLabel,
  type = 'button',
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Activate on Enter or Space
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type={type}
      className={`dragon-button dragon-button--${variant} ${className} ${disabled ? 'dragon-button--disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="dragon-button__glow"></span>
      <span className="dragon-button__content">
        {children}
      </span>
    </button>
  );
};

export default DragonButton;