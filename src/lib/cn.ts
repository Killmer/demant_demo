import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const fontSizeTokens = [
  "text-page-title",
  "text-head-1",
  "text-head-2",
  "text-head-3",
  "text-head-4",
  "text-subhead-1",
  "text-subhead-2",
  "text-regular",
  "text-small",
  "text-extraSmall",
  "text-tiny",
  "text-table",
  "text-tile",
] as const;

const textColorTokens = [
  "text-corporate",
  "text-primary",
  "text-primary-weblink",
  "text-primary-weblink-hover",
  "text-surface-brand",
  "text-surface-brand-medium",
  "text-surface-brand-dark",
  "text-surface-brand-secondary-dark",
  "text-surface-brand-tertiary",
  "text-surface-card-primary",
  "text-header",
  "text-link-dark",
  "text-sitecore-highlight-1",
  "text-sitecore-highlight-2",
  "text-sitecore-secondary-deep-1",
  "text-sitecore-secondary-deep-2",
  "text-black-08",
  "text-white",
  "text-black",
  "text-success",
  "text-success-light",
  "text-info",
  "text-info-dark",
  "text-info-light",
  "text-warning",
  "text-warning-light",
  "text-notification",
  "text-error",
  "text-error-light",

  // greys
  "text-grey-0100",
  "text-grey-0150",
  "text-grey-0200",
  "text-grey-0250",
  "text-grey-0300",
  "text-grey-0350",
  "text-grey-0400",
  "text-grey-0450",
  "text-grey-0500",
  "text-grey-0600",
  "text-grey-0700",
  "text-grey-0750",
  "text-grey-0800",
  "text-grey-0850",
  "text-grey-0900",
  "text-grey-0925",
  "text-grey-0950",
  "text-grey-1000",

  // rights
  "text-right-0100",
  "text-right-0200",
  "text-right-0300",
  "text-right-0400",
  "text-right-0500",
  "text-right-0600",
  "text-right-0700",
  "text-right-0800",
  "text-right-0900",

  // lefts
  "text-left-0100",
  "text-left-0200",
  "text-left-0300",
  "text-left-0400",
  "text-left-0500",
  "text-left-0600",
  "text-left-0700",
  "text-left-0800",
  "text-left-0900",
] as const;

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [...fontSizeTokens],
      "text-color": [...textColorTokens],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => customTwMerge(clsx(inputs));
