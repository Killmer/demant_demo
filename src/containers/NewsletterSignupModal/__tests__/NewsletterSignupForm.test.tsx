import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewsletterSignupForm from "../NewsletterSignupForm";

describe("NewsletterSignupForm", () => {
  const setup = (onSubmit = jest.fn()) => {
    const user = userEvent.setup();
    render(<NewsletterSignupForm onSubmit={onSubmit} />);
    return { user, onSubmit };
  };

  describe("rendering", () => {
    it("renders the email input with its label", () => {
      setup();
      expect(screen.getByLabelText("E-mail*")).toBeInTheDocument();
    });

    it("renders the first clinic address line with its label", () => {
      setup();
      expect(
        screen.getByLabelText("Clinic - Address line 1"),
      ).toBeInTheDocument();
    });

    it("renders the 'Add another line' button", () => {
      setup();
      expect(
        screen.getByRole("button", { name: "Add another line" }),
      ).toBeInTheDocument();
    });

    it("renders the terms and conditions checkbox", () => {
      setup();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      setup();
      expect(
        screen.getByRole("button", { name: "Submit" }),
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows an error when submitting with an empty email", async () => {
      const { user } = setup();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("E-mail is required."),
      ).toBeInTheDocument();
    });

    it("shows an error for an invalid email address", async () => {
      const { user } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "not-an-email");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("Please enter a valid e-mail address."),
      ).toBeInTheDocument();
    });

    it("shows an error when terms are not accepted", async () => {
      const { user } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "test@example.com");
      await user.click(screen.getByRole("button", { name: "Submit" }));

      expect(
        await screen.findByText("You must accept the terms and conditions."),
      ).toBeInTheDocument();
    });

    it("does not show validation errors when all fields are valid", async () => {
      const { user } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "test@example.com");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(
          screen.queryByText("E-mail is required."),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Please enter a valid e-mail address."),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("You must accept the terms and conditions."),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with trimmed email when the form is valid", async () => {
      const { user, onSubmit } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "  user@example.com  ");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ email: "user@example.com" }),
        );
      });
    });

    it("calls onSubmit with the accepted terms flag set to true", async () => {
      const { user, onSubmit } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "user@example.com");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ acceptedTerms: true }),
        );
      });
    });

    it("calls onSubmit with trimmed clinic values", async () => {
      const { user, onSubmit } = setup();
      await user.type(screen.getByLabelText("E-mail*"), "user@example.com");
      await user.type(
        screen.getByLabelText("Clinic - Address line 1"),
        "  My Clinic  ",
      );
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ clinic: ["My Clinic"] }),
        );
      });
    });

    it("does not call onSubmit when the form is invalid", async () => {
      const { user, onSubmit } = setup();
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await screen.findByText("E-mail is required.");
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("dynamic clinic address lines", () => {
    it("adds a second address line when 'Add another line' is clicked", async () => {
      const { user } = setup();
      await user.click(
        screen.getByRole("button", { name: "Add another line" }),
      );

      expect(screen.getByLabelText("Address line 2")).toBeInTheDocument();
    });

    it("removes an address line when its remove button is clicked", async () => {
      const { user } = setup();
      await user.click(
        screen.getByRole("button", { name: "Add another line" }),
      );

      expect(screen.getByLabelText("Address line 2")).toBeInTheDocument();

      await user.click(
        screen.getByRole("button", { name: "Remove address line 2" }),
      );

      expect(screen.queryByLabelText("Address line 2")).not.toBeInTheDocument();
    });

    it("allows adding up to three address lines", async () => {
      const { user } = setup();
      const addButton = screen.getByRole("button", {
        name: "Add another line",
      });

      await user.click(addButton);
      await user.click(addButton);

      expect(screen.getByLabelText("Address line 2")).toBeInTheDocument();
      expect(screen.getByLabelText("Address line 3")).toBeInTheDocument();
    });

    it("disables 'Add another line' when the maximum of 3 lines is reached", async () => {
      const { user } = setup();
      const addButton = screen.getByRole("button", {
        name: "Add another line",
      });

      await user.click(addButton);
      await user.click(addButton);

      expect(addButton).toBeDisabled();
    });

    it("includes all clinic line values in the submission payload", async () => {
      const { user, onSubmit } = setup();

      const addButton = screen.getByRole("button", {
        name: "Add another line",
      });
      await user.click(addButton);

      await user.type(
        screen.getByLabelText("Clinic - Address line 1"),
        "Clinic A",
      );
      await user.type(screen.getByLabelText("Address line 2"), "Clinic B");
      await user.type(screen.getByLabelText("E-mail*"), "user@example.com");
      await user.click(screen.getByRole("checkbox"));
      await user.click(screen.getByRole("button", { name: "Submit" }));

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ clinic: ["Clinic A", "Clinic B"] }),
        );
      });
    });
  });
});
