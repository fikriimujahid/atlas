"use client";

import NextLink, { type LinkProps } from "next/link";
import { useParams as useNextParams, usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes } from "react";

type CompatLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Omit<LinkProps, "href"> & {
    href?: LinkProps["href"];
    to?: LinkProps["href"];
  };

export const Link = forwardRef<HTMLAnchorElement, CompatLinkProps>(function Link(
  { href, to, ...props },
  ref,
) {
  return <NextLink ref={ref} href={href ?? to ?? "/"} {...props} />;
});

export function useLocation() {
  const pathname = usePathname() ?? "/";

  return {
    pathname,
  };
}

export function useParams<T extends Record<string, string | string[] | undefined>>() {
  return useNextParams<T>();
}