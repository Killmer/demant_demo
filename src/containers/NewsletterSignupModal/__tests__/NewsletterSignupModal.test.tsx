import { expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormDataDTO } from "models/FormDataDTO";
import NewsletterSignupModal from "../NewsletterSignupModal";

jest.mock("src/components/modal/Modal", () => {
  const { useEffect } = require("react");

  const MockModal = ({
    isOpen,
    children,
    onClose,
    closeOnOverlayClick = false,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
    closeOnOverlayClick?: boolean;
  }) => {
    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) onClose();
      };
      document.body.addEventListener("keydown", handler);
      return () => document.body.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <div
          data-testid="modal-overlay"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <button onClick={onClose} aria-label="Close">
          x
        </button>
        {children}
      </div>
    );
  };
  MockModal.displayName = "Modal";
  return { __esModule: true, default: MockModal };
});

const baseProps = {
  isOpen: true,
  onSubmit: jest.fn(),
  onClose: jest.fn(),
};

describe("NewsletterSignupModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("visibility", () => {
    it("renders the modal content when isOpen is true", () => {
      render(<NewsletterSignupModal {...baseProps} />);
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("renders nothing when isOpen is false", () => {
      render(<NewsletterSignupModal {...baseProps} isOpen={false} />);
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  describe("content", () => {
    it("renders the headline text", () => {
      render(<NewsletterSignupModal {...baseProps} />);
      expect(
        screen.getByRole("heading", { name: /want to see the unseen/i }),
      ).toBeInTheDocument();
    });

    it("renders the subheading copy", () => {
      render(<NewsletterSignupModal {...baseProps} />);
      expect(screen.getByText(/a gamechanger is coming/i)).toBeInTheDocument();
    });

    it("renders the hero image with the default URL", () => {
      const { container } = render(<NewsletterSignupModal {...baseProps} />);
      // img has alt="" so it has ARIA role "presentation" – query the DOM directly
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img?.getAttribute("src")).toContain("hero.jpg");
    });

    it("renders the hero image with a custom heroImageUrl", () => {
      const { container } = render(
        <NewsletterSignupModal
          {...baseProps}
          heroImageUrl="/custom/image.jpg"
        />,
      );
      const img = container.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img?.getAttribute("src")).toContain("image.jpg");
    });

    it("renders the embedded newsletter signup form", () => {
      render(<NewsletterSignupModal {...baseProps} />);
      expect(screen.getByLabelText("E-mail*")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onClose when the close button is clicked", async () => {
      const user = userEvent.setup();
      render(<NewsletterSignupModal {...baseProps} />);

      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the overlay is clicked", async () => {
      const user = userEvent.setup();
      render(<NewsletterSignupModal {...baseProps} />);

      // NewsletterSignupModal always passes closeOnOverlayClick to Modal
      await user.click(screen.getByTestId("modal-overlay"));
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the Escape key is pressed", () => {
      render(<NewsletterSignupModal {...baseProps} />);

      // The real Modal listens on document.body; the mock replicates the same behaviour
      fireEvent.keyDown(document.body, { key: "Escape" });
      expect(baseProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when a key other than Escape is pressed", () => {
      render(<NewsletterSignupModal {...baseProps} />);

      fireEvent.keyDown(document.body, { key: "Enter" });
      expect(baseProps.onClose).not.toHaveBeenCalled();
    });

    it("does not call onClose via Escape when the modal is closed", () => {
      render(<NewsletterSignupModal {...baseProps} isOpen={false} />);

      fireEvent.keyDown(document.body, { key: "Escape" });
      expect(baseProps.onClose).not.toHaveBeenCalled();
    });

    it("calls onSubmit with the form data when the form is submitted successfully", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<NewsletterSignupModal {...baseProps} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText("E-mail*"), "test@example.com");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      const expected: FormDataDTO = {
        email: "test@example.com",
        clinic: [""],
        acceptedTerms: true,
      };

      await screen.findByRole("button", { name: "Submit" });
      expect(onSubmit).toHaveBeenCalledWith(expected);
    });
  });
});
