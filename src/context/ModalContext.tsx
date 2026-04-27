import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/router";
import { MODAL_REGISTRY } from "context/modalRegistry";

interface ModalContextValue {
  openIds: readonly string[];
  submittedData: Readonly<Record<string, unknown>>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
  recordSubmission: (id: string, data: unknown) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown>>(
    {},
  );

  const openModal = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const closeModal = (id: string) => {
    setOpenIds((prev) => prev.filter((x) => x !== id));
  };

  const closeAll = () => setOpenIds([]);

  const recordSubmission = (id: string, data: unknown) => {
    setSubmittedData((prev) => ({ ...prev, [id]: data }));
  };

  // Open a modal after redirect via ?modal=<registry-key>
  useEffect(() => {
    const modalKey = router.query.modal as string | undefined;
    if (modalKey && MODAL_REGISTRY[modalKey]) {
      openModal(modalKey);
      router.replace(router.pathname, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.modal]);

  return (
    <ModalContext.Provider
      value={{ openIds, submittedData, openModal, closeModal, closeAll, recordSubmission }}
    >
      {children}
      {openIds.map((id) => {
        const Component = MODAL_REGISTRY[id];
        if (!Component) return null;
        return (
          <Component
            key={id}
            isOpen
            onClose={() => closeModal(id)}
            onSubmit={(data: unknown) => {
              recordSubmission(id, data);
              closeModal(id);
            }}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

const useModalContext = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return ctx;
};

export const useModal = <TData = unknown>(
  id: string,
  defaultData?: TData,
): {
  open: () => void;
  close: () => void;
  closeAll: () => void;
  isOpen: boolean;
  submittedData: TData | undefined;
} => {
  const ctx = useModalContext();
  return {
    open: () => ctx.openModal(id),
    close: () => ctx.closeModal(id),
    closeAll: ctx.closeAll,
    isOpen: ctx.openIds.includes(id),
    submittedData: (
      id in ctx.submittedData ? ctx.submittedData[id] : defaultData
    ) as TData | undefined,
  };
};
