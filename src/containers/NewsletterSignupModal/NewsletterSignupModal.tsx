import { FormDataDTO } from "models/FormDataDTO";
import { FC } from "react";
import NewsletterSignupForm from "./NewsletterSignupForm";
import Modal from "src/components/modal/Modal";
import Image from "next/image";

type Props = {
  onSubmit: (data: FormDataDTO) => void;
  isOpen: boolean;
  heroImageUrl?: string;
  onClose: () => void;
};

const POPUP_ACCENT_DECORATION_STYLES =
  "xs:before:content-[''] xs:before:absolute xs:before:w-1 xs:before:h-[83px] xs:before:bg-primary-weblink xs:before:top-0 xs:before:left-9";

const NewsletterSignupModal: FC<Props> = ({
  onSubmit,
  isOpen,
  heroImageUrl = "/modal/hero.jpg",
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={`flex min-h-[460px] max-w-[850px]  ${POPUP_ACCENT_DECORATION_STYLES}`}
      >
        <div className="p-6 xs:p-14">
          <h3 className="font-sans text-head-3 font-medium text-grey-0100 mb-4">
            Want to see the unseen?
          </h3>
          <p className="font-sans text-subhead-1  text-grey-0300 max-w-[260px] mb-6">
            A gamechanger is coming.
            <br />
            Get ready for the impossible made possible.
          </p>
          <NewsletterSignupForm onSubmit={onSubmit} />
        </div>

        <div className="relative min-w-[50%] hidden md:block">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </Modal>
  );
};

export default NewsletterSignupModal;
