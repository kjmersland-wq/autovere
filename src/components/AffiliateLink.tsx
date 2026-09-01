import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * Shared outbound affiliate link — always opens in a new tab with
 * noopener noreferrer nofollow as required for partner links.
 */
export function AffiliateLink({
  children,
  href,
  ...rest
}: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...rest}>
      {children}
    </a>
  );
}
