"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tooltipVariants = tv({
  slots: {
    wrapper: "relative inline-flex",
    content: [
      "absolute z-50 rounded-sm px-3 py-1.5",
      "text-sm font-medium",
      "pointer-events-none opacity-0",
      "transition-opacity duration-200",
      "whitespace-nowrap",
      "shadow-lg",
    ],
    arrow: [
      "absolute w-2 h-2 rotate-45",
    ],
  },
  variants: {
    placement: {
      top: {
        content: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        arrow: "top-full left-1/2 -translate-x-1/2 -mt-1",
      },
      "top-start": {
        content: "bottom-full left-0 mb-2",
        arrow: "top-full left-2 -mt-1",
      },
      "top-end": {
        content: "bottom-full right-0 mb-2",
        arrow: "top-full right-2 -mt-1",
      },
      bottom: {
        content: "top-full left-1/2 -translate-x-1/2 mt-2",
        arrow: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
      },
      "bottom-start": {
        content: "top-full left-0 mt-2",
        arrow: "bottom-full left-2 -mb-1",
      },
      "bottom-end": {
        content: "top-full right-0 mt-2",
        arrow: "bottom-full right-2 -mb-1",
      },
      left: {
        content: "right-full top-1/2 -translate-y-1/2 mr-2",
        arrow: "left-full top-1/2 -translate-y-1/2 -ml-1",
      },
      "left-start": {
        content: "right-full top-0 mr-2",
        arrow: "left-full top-2 -ml-1",
      },
      "left-end": {
        content: "right-full bottom-0 mr-2",
        arrow: "left-full bottom-2 -ml-1",
      },
      right: {
        content: "left-full top-1/2 -translate-y-1/2 ml-2",
        arrow: "right-full top-1/2 -translate-y-1/2 -mr-1",
      },
      "right-start": {
        content: "left-full top-0 ml-2",
        arrow: "right-full top-2 -mr-1",
      },
      "right-end": {
        content: "left-full bottom-0 ml-2",
        arrow: "right-full bottom-2 -mr-1",
      },
    },
    color: {
      default: {
        content: "bg-gray-900 text-white",
        arrow: "bg-gray-900",
      },
      primary: {
        content: "bg-primary text-white",
        arrow: "bg-primary",
      },
      secondary: {
        content: "bg-secondary text-white",
        arrow: "bg-secondary",
      },
      error: {
        content: "bg-error text-white",
        arrow: "bg-error",
      },
      warning: {
        content: "bg-warning text-white",
        arrow: "bg-warning",
      },
      info: {
        content: "bg-info text-white",
        arrow: "bg-info",
      },
      success: {
        content: "bg-success text-white",
        arrow: "bg-success",
      },
    },
    visible: {
      true: {
        content: "opacity-100 pointer-events-auto",
      },
      false: {
        content: "opacity-0 pointer-events-none",
      },
    },
  },
  defaultVariants: {
    placement: "top",
    color: "default",
    visible: false,
  },
});

export interface TooltipProps extends VariantProps<typeof tooltipVariants> {
  /** The content to display in the tooltip */
  title: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Whether to show the tooltip arrow */
  arrow?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when tooltip opens */
  onOpen?: () => void;
  /** Callback when tooltip closes */
  onClose?: () => void;
  /** Delay in ms before showing tooltip on hover */
  enterDelay?: number;
  /** Delay in ms before hiding tooltip on leave */
  leaveDelay?: number;
  /** Disable hover listeners */
  disableHoverListener?: boolean;
  /** Disable focus listeners */
  disableFocusListener?: boolean;
  /** Disable touch listeners */
  disableTouchListener?: boolean;
  /** Additional className for the wrapper */
  className?: string;
  /** Additional className for the tooltip content */
  contentClassName?: string;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}

export const Tooltip = ({
  title,
  children,
  placement = "bottom",
  color = "default",
  arrow = false,
  open: controlledOpen,
  onOpen,
  onClose,
  enterDelay = 100,
  leaveDelay = 0,
  disableHoverListener = false,
  disableFocusListener = false,
  disableTouchListener = false,
  className,
  contentClassName,
  disabled = false,
}: TooltipProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const { wrapper, content, arrow: arrowClass } = tooltipVariants({
    placement,
    color,
    visible: isOpen && !disabled && !!title,
  });

  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  const handleOpen = () => {
    if (disabled || !title) return;

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    enterTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(true);
      }
      onOpen?.();
    }, enterDelay);
  };

  const handleClose = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    leaveTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      onClose?.();
    }, leaveDelay);
  };

  const handleMouseEnter = () => {
    if (!disableHoverListener) {
      handleOpen();
    }
  };

  const handleMouseLeave = () => {
    if (!disableHoverListener) {
      handleClose();
    }
  };

  const handleFocus = () => {
    if (!disableFocusListener) {
      handleOpen();
    }
  };

  const handleBlur = () => {
    if (!disableFocusListener) {
      handleClose();
    }
  };

  const handleTouchStart = () => {
    if (!disableTouchListener) {
      handleOpen();
    }
  };

  const handleTouchEnd = () => {
    if (!disableTouchListener) {
      handleClose();
    }
  };

  return (
    <div
      className={wrapper({ className })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      {title && (
        <div className={content({ className: contentClassName })} role="tooltip">
          {title}
          {arrow && <div className={arrowClass()} />}
        </div>
      )}
    </div>
  );
};
