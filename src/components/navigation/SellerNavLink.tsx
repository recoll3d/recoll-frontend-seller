import type { MouseEvent, ReactNode } from "react";
import { Link, type To } from "react-router-dom";

import { useSellerNavigation } from "../../contexts/SellerNavigationContext";

type SellerNavLinkProps = {
  to: To;
  children: ReactNode;
  className?: string;
};

export function SellerNavLink({ to, children, className }: SellerNavLinkProps) {
  const { navigateWithFeedback, navigating } = useSellerNavigation();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    if (navigating) return;
    void navigateWithFeedback(to);
  };

  return (
    <Link to={to} className={className} onClick={onClick} aria-busy={navigating}>
      {children}
    </Link>
  );
}
