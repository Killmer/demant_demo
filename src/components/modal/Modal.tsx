import clsx from "clsx";
import PortalRootLoader from "components/modal/PortalRootLoader";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import Button, { ButtonVariant } from "../Button";
import CloseIcon from "images/close.svg";

type Props = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  width?: number | string;
  overlayClassNames?: string;
  closeOnOverlayClick?: boolean;
};

const Modal: FC<Props> = ({
  children,
  isOpen,
  onClose: handleClose,
  width = undefined,
  overlayClassNames = undefined,
  closeOnOverlayClick = false,
}) => {
  const nodeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" && isOpen ? handleClose() : null;

    document.body.addEventListener("keydown", closeOnEscapeKey);

    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setLoaded(true);
    }
  }, [isOpen]);

  const contentStyles = {
    width,
    maxWidth: width,
  };

  if (!isOpen) return null;

  return (
    <PortalRootLoader loaded={loaded} wrapperId="react-portal-modal-container">
      <div
        className={clsx(
          overlayClassNames,
          "absolute inset-0 flex justify-center items-end xs:items-center",
          closeOnOverlayClick ? "bg-black-08" : "",
        )}
        onClick={closeOnOverlayClick ? handleClose : undefined}
        ref={nodeRef}
      >
        <div
          className="relative m-0 xs:m-6"
          style={contentStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            className={clsx(
              "absolute bg-white z-40 rounded-[1000px] px-[14px] py-[14px]  top-0 right-0 xs:-top-5 xs:-right-5  xs:shadow-e0",
            )}
            variant={ButtonVariant.Tertiary}
            label="Close"
            onClick={handleClose}
          >
            <CloseIcon className="w-4 h-4 text-primary-weblink" />
          </Button>
          <div className="bg-white shadow-2xl rounded-t-6 xs:rounded-6 overflow-hidden flex flex-col max-h-[calc(100vh-3rem)]">
            <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PortalRootLoader>
  );
};

export default Modal;
