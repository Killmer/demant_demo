import clsx from 'clsx';
import Button from 'components/Button';
import PortalRootLoader from 'components/modal/PortalRootLoader';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  width?: number | string;
  overlayClassNames?: string;
};

const Modal: FC<Props> = ({
  children,
  isOpen,
  onClose: handleClose,
  width = undefined,
  overlayClassNames = undefined
}) => {
  const nodeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && isOpen ? handleClose() : null;

    document.body.addEventListener('keydown', closeOnEscapeKey);

    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setLoaded(true);
    }
  }, [isOpen]);

  const contentStyles = {
    width,
    maxWidth: width
  };

  if (!isOpen) return null;

  return (
    <PortalRootLoader loaded={loaded} wrapperId="react-portal-modal-container">
      <div className={clsx(overlayClassNames, 'absolute inset-0 grid justify-center items-center')} ref={nodeRef}>
        <div className={clsx('bg-white p-6 min-w-[800px] relative shadow-2xl rounded-4')} style={contentStyles}>
          <Button className={clsx('absolute -top-5 right-0')} label="Close" onClick={handleClose}>
            X
          </Button>

          {children}
        </div>
      </div>
    </PortalRootLoader>
  );
};

export default Modal;
