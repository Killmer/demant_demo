import React, { useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

export type RootPortalProps = {
  wrapperId: string;
  children: React.ReactNode;
};


const createWrapperAndAppendToBody = (wrapperId: string) => {
  const wrapperElement = document.createElement('div');

  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);

  return wrapperElement;
};

export const PortalRoot: React.FC<RootPortalProps> = ({ children, wrapperId }) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    let systemCreated = false;

    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }

    setWrapperElement(element);

    return () => {
      if (systemCreated && element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (wrapperElement === null) return null;

  return createPortal(children, wrapperElement);
};
