import "@testing-library/jest-dom/jest-globals";
import { expect } from "@jest/globals";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { ModalProvider, useModal } from "context/ModalContext";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));

const mockSubmit = jest.fn();

jest.mock("../modalRegistry", () => {
  const MockModal = ({
    isOpen,
    onSubmit,
    onClose,
  }: {
    isOpen: boolean;
    onSubmit: (data: { value: string }) => void;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <button
          onClick={() => {
            mockSubmit();
            onSubmit({ value: "submitted" });
          }}
        >
          Submit
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
  MockModal.displayName = "MockModal";

  const MockModal2 = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal-2">
        <button onClick={onClose}>Close 2</button>
      </div>
    );
  };
  MockModal2.displayName = "MockModal2";

  return {
    MODAL_REGISTRY: {
      test: MockModal,
      test2: MockModal2,
    },
  };
});

const mockRouter = (query: Record<string, string> = {}, pathname = "/") => {
  const replace = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ query, pathname, replace });
  return { replace };
};

type TestAppProps = { id?: string; defaultData?: Record<string, string> };

const TestApp = ({ id = "test", defaultData }: TestAppProps) => {
  const { open, close, closeAll, isOpen, submittedData } = useModal<
    Record<string, string>
  >(id, defaultData);
  return (
    <div>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close (hook)</button>
      <button onClick={closeAll}>Close All</button>
      <div data-testid="is-open">{isOpen ? "open" : "closed"}</div>
      <div data-testid="submitted">{submittedData?.value ?? "none"}</div>
    </div>
  );
};

const renderApp = (props: TestAppProps = {}) =>
  render(
    <ModalProvider>
      <TestApp {...props} />
      <div data-testid="app-content">App</div>
    </ModalProvider>,
  );

describe("ModalContext", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("URL-driven modal opening (?modal=<key>)", () => {
    it("opens the registered modal when the query param matches", () => {
      mockRouter({ modal: "test" });
      renderApp();

      expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    });

    it("does not open a modal when there is no modal query param", () => {
      mockRouter({});
      renderApp();

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });

    it("does not open a modal for an unrecognised key", () => {
      mockRouter({ modal: "unknown" });
      renderApp();

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });

    it("cleans the modal query param from the URL after opening", () => {
      const { replace } = mockRouter({ modal: "test" }, "/some-page");
      renderApp();

      expect(replace).toHaveBeenCalledTimes(1);
      expect(replace).toHaveBeenCalledWith("/some-page", undefined, {
        shallow: true,
      });
    });

    it("does not call router.replace when no recognised modal param is present", () => {
      const { replace } = mockRouter({});
      renderApp();

      expect(replace).not.toHaveBeenCalled();
    });
  });

  describe("useModal — open / close / isOpen", () => {
    it("opens the modal when open() is called", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      await user.click(screen.getByRole("button", { name: "Open" }));

      expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
      expect(screen.getByTestId("is-open")).toHaveTextContent("open");
    });

    it("closes the modal when close() is called via the hook", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByRole("button", { name: "Close (hook)" }));

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });

    it("closes the modal when the modal's own onClose is called", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      await user.click(screen.getByRole("button", { name: "Open" }));
      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });
  });

  describe("useModal — submittedData", () => {
    it("returns defaultData before any submission", () => {
      mockRouter({});
      renderApp({ defaultData: { value: "default" } });

      expect(screen.getByTestId("submitted")).toHaveTextContent("default");
    });

    it("returns undefined when no defaultData is provided and nothing submitted", () => {
      mockRouter({});
      renderApp();

      expect(screen.getByTestId("submitted")).toHaveTextContent("none");
    });

    it("updates submittedData after form submission — button-driven open", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      await user.click(screen.getByRole("button", { name: "Open" }));
      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Submit" }));
      });

      expect(screen.getByTestId("submitted")).toHaveTextContent("submitted");
    });

    it("updates submittedData after form submission — URL-driven open", async () => {
      const user = userEvent.setup();
      mockRouter({ modal: "test" });
      renderApp();

      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Submit" }));
      });

      expect(screen.getByTestId("submitted")).toHaveTextContent("submitted");
    });

    it("closes the modal after submission", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      await user.click(screen.getByRole("button", { name: "Open" }));
      await act(async () => {
        await user.click(screen.getByRole("button", { name: "Submit" }));
      });

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });
  });

  describe("closeAll", () => {
    it("closes all open modals at once", async () => {
      const user = userEvent.setup();
      mockRouter({});
      render(
        <ModalProvider>
          <TestApp id="test" />
          <TestApp id="test2" />
        </ModalProvider>,
      );

      await user.click(screen.getAllByRole("button", { name: "Open" })[0]);
      await user.click(screen.getAllByRole("button", { name: "Open" })[1]);
      expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
      expect(screen.getByTestId("mock-modal-2")).toBeInTheDocument();

      await user.click(screen.getAllByRole("button", { name: "Close All" })[0]);

      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("mock-modal-2")).not.toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("always renders children regardless of modal state", async () => {
      const user = userEvent.setup();
      mockRouter({});
      renderApp();

      expect(screen.getByTestId("app-content")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByTestId("app-content")).toBeInTheDocument();
    });
  });

  describe("useModal — error boundary", () => {
    it("throws when used outside of ModalProvider", () => {
      const BrokenComponent = () => {
        useModal("test");
        return null;
      };

      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<BrokenComponent />)).toThrow(
        "useModal must be used inside ModalProvider",
      );
      spy.mockRestore();
    });
  });
});
