import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppProvider } from "../src/context/AppProvider";
import { RequirementForm } from "../src/components/RequirementForm";

describe("RequirementForm validation", () => {
  it("shows validation errors when the form is submitted empty", async () => {
    const user = userEvent.setup();

    render(
      <AppProvider>
        <RequirementForm />
      </AppProvider>
    );

    const submitButton = screen.getByRole("button", {
      name: /find opportunities/i,
    });

    await user.click(submitButton);

    expect(
      screen.getByText("Please enter a valid amount greater than 0.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter a valid whole number of months.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please select a risk preference.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter the security type.")
    ).toBeInTheDocument();
  });
});