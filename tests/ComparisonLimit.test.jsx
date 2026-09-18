import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppProvider } from "../src/context/AppProvider";
import { OpportunityList } from "../src/components/OpportunityList";

vi.mock("../src/services/opportunityApi", () => ({
  opportunityApi: {
    getOpportunities: vi.fn(),
  },
}));

import { opportunityApi } from "../src/services/opportunityApi";

const opportunities = [
  {
    id: "TEST-1",
    name: "Test Opportunity One",
    rate: 10,
    amountMin: 100000,
    amountMax: 1000000,
    tenureMin: 12,
    tenureMax: 60,
    ltv: 50,
    fee: 1,
    risk: "Moderate",
    description: "Test opportunity",
  },
  {
    id: "TEST-2",
    name: "Test Opportunity Two",
    rate: 10,
    amountMin: 100000,
    amountMax: 1000000,
    tenureMin: 12,
    tenureMax: 60,
    ltv: 50,
    fee: 1,
    risk: "Moderate",
    description: "Test opportunity",
  },
  {
    id: "TEST-3",
    name: "Test Opportunity Three",
    rate: 10,
    amountMin: 100000,
    amountMax: 1000000,
    tenureMin: 12,
    tenureMax: 60,
    ltv: 50,
    fee: 1,
    risk: "Moderate",
    description: "Test opportunity",
  },
  {
    id: "TEST-4",
    name: "Test Opportunity Four",
    rate: 10,
    amountMin: 100000,
    amountMax: 1000000,
    tenureMin: 12,
    tenureMax: 60,
    ltv: 50,
    fee: 1,
    risk: "Moderate",
    description: "Test opportunity",
  },
];

describe("Opportunity comparison limit", () => {
  beforeEach(() => {
    opportunityApi.getOpportunities.mockResolvedValue({
      items: opportunities,
      total: opportunities.length,
      page: 1,
      limit: 6,
    });
  });

  it("prevents selecting more than three opportunities", async () => {
    const user = userEvent.setup();

    render(
      <AppProvider>
        <OpportunityList />
      </AppProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /add test opportunity one to comparison/i,
        })
      ).toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", {
        name: /add test opportunity one to comparison/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /add test opportunity two to comparison/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /add test opportunity three to comparison/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /add test opportunity four to comparison/i,
      })
    );

    expect(
      screen.getByText(
        "You can compare up to 3 opportunities. Remove one to add another."
      )
    ).toBeInTheDocument();
  });
});