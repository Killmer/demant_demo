import { RootPortalProps } from 'components/modal/PortalRoot';
import dynamic from 'next/dynamic';
import { FunctionComponent, ReactNode } from 'react';


export type RootPortalLoaderProps = {
  wrapperId: string;
  loaded: boolean;
  children: ReactNode;
};

const RootPortal = dynamic<RootPortalProps>(
  () => import('components/modal/PortalRoot').then(({ PortalRoot: rp }) => rp),
  { ssr: false }
);

export const PortalRootLoader: FunctionComponent<RootPortalLoaderProps> = ({
  children,
  loaded,
  wrapperId = 'root-portal-wrapper'
}) => {
  return loaded ? <RootPortal wrapperId={wrapperId}>{children}</RootPortal> : null;
};
export default PortalRootLoader;
