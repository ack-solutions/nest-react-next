"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@web/utils/cn";
import { Icon } from "./icons";
import { ChevronRightIcon, Home } from "lucide-react";

// Tailwind Variants for Breadcrumbs container
const breadcrumbsVariants = tv({
  base: "flex items-center font-medium",
  variants: {
    underline: {
      none: "no-underline",
      hover: "hover:underline",
      always: "underline",
    },
  },
  defaultVariants: {
    underline: "none",
  },
});

export interface BreadcrumbItemProps {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof breadcrumbsVariants> {
  items: BreadcrumbItemProps[];
  separator?: ReactNode;
}

export const Breadcrumbs = ({
  items,
  separator = <Icon icon={ChevronRightIcon} size='sm' strokeWidth={2} />,
  underline,
  className,
  ...props
}: BreadcrumbsProps) => {

  return (
    <nav
      aria-label="breadcrumb"
      className={cn(breadcrumbsVariants({ underline }), className, "my-4")}
      {...props}
    >
      <ol className="flex flex-wrap items-center list-none p-0 m-0">
        <li className="flex items-center">
          <Link href="/" className="flex items-center">
            <Icon icon={Home} size='sm' color='primary' strokeWidth={2} />
          </Link>
          <span className="mx-1 shrink-0 flex text-primary-light">{separator}</span>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center truncate">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "truncate max-w-[160px] transition-colors text-normal text-sm text-primary-light",
                    breadcrumbsVariants({ underline })
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "truncate max-w-[160px] text-sm text-primary-light font-normal",
                    isLast && "font-semibold max-w-auto"
                  )}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className="mx-1 shrink-0 flex text-primary-light">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
