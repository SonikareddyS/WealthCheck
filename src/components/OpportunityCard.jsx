import React from "react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { useAppContext } from "../context/useAppContext";

const formatINR = (amount) => {
  if (!Number.isFinite(Number(amount))) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const getRiskBadgeVariant = (risk) => {
  switch (risk) {
    case "Moderate":
      return "success";

    case "Moderately High":
      return "warning";

    case "High":
      return "danger";

    default:
      return "default";
  }
};

export const OpportunityCard = ({
  opportunity,
  onClick,
}) => {
  const { state, dispatch } = useAppContext();

  const isSelected = state.selectedForCompare.includes(opportunity.id);

  const handleCompareToggle = (event) => {
    event.stopPropagation();

    dispatch({
      type: "TOGGLE_COMPARE",
      payload: opportunity.id,
    });
  };

  return (
    <article
      aria-labelledby={`opportunity-title-${opportunity.id}`}
      className="h-full"
    >
      <Card
        onClick={onClick}
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-gray-400">
              {opportunity.id}
            </p>

            <h3
              id={`opportunity-title-${opportunity.id}`}
              className="
                break-words
                text-lg
                font-semibold
                leading-snug
                text-gray-900
                transition-colors
                duration-200
                group-hover:text-primary
              "
            >
              {opportunity.name}
            </h3>
          </div>

          <div className="shrink-0">
            <Badge
              variant={getRiskBadgeVariant(opportunity.risk)}
            >
              {opportunity.risk}
            </Badge>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
          <div className="rounded-lg p-2 -m-2 transition-colors duration-200 group-hover:bg-gray-50">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Interest rate
            </span>

            <span className="mt-1 block font-medium text-gray-900">
              {opportunity.rate}%
              <span className="text-xs text-gray-500"> p.a.</span>
            </span>
          </div>

          <div className="rounded-lg p-2 -m-2 transition-colors duration-200 group-hover:bg-gray-50">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
              LTV
            </span>

            <span className="mt-1 block font-medium text-gray-900">
              {opportunity.ltv != null
                ? `${opportunity.ltv}%`
                : "N/A"}
            </span>
          </div>

          <div className="rounded-lg p-2 -m-2 transition-colors duration-200 group-hover:bg-gray-50">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Amount range
            </span>

            <span className="mt-1 block break-words text-sm font-medium text-gray-900">
              {formatINR(opportunity.amountMin)}
              {" – "}
              {formatINR(opportunity.amountMax)}
            </span>
          </div>

          <div className="rounded-lg p-2 -m-2 transition-colors duration-200 group-hover:bg-gray-50">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Tenure
            </span>

            <span className="mt-1 block text-sm font-medium text-gray-900">
              {opportunity.tenureMin}
              {" – "}
              {opportunity.tenureMax}
              {" months"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <Button
              type="button"
              variant={isSelected ? "primary" : "outline"}
              className="text-xs py-1.5 px-3"
              onClick={handleCompareToggle}
              aria-pressed={isSelected}
              aria-label={
                isSelected
                  ? `Remove ${opportunity.name} from comparison`
                  : `Add ${opportunity.name} to comparison`
              }
            >
              {isSelected
                ? "Added to Compare"
                : "Compare"}
            </Button>
          </div>
        </div>
      </Card>
    </article>
  );
};