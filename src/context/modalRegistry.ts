import { ComponentType } from "react";
import NewsletterSignupModal from "containers/NewsletterSignupModal/NewsletterSignupModal";

export const MODAL_REGISTRY: Record<string, ComponentType<any>> = {
  newsletter: NewsletterSignupModal,
};
