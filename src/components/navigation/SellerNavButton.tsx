import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useSellerNavigation } from "../../contexts/SellerNavigationContext";
import type { To } from "react-router-dom";

type SellerNavButtonProps = {
  to: To;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children">;

export function SellerNavButton({
  to,
  children,
  className = "",
  disabled,
  ...buttonProps
}: SellerNavButtonProps) {
  const { navigateWithFeedback, navigating } = useSellerNavigation();

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (disabled || navigating) return;
    void navigateWithFeedback(to);
  };

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || navigating}
      onClick={onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
