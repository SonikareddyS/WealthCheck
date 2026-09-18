import React, { useState } from "react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export const EligibilityResult = ({ result, onAcknowledge }) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (!result) return null;

  const getStatusColor = (status) => {
    if (status === "eligible") return "success";
    if (status === "conditional") return "warning";
    return "danger";
  };

  const getStatusTitle = (status) => {
    if (status === "eligible") return "You are Eligible!";
    if (status === "conditional") return "Conditional Eligibility";
    return "Not Eligible";
  };

  const handleCtaClick = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <div className="mt-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
        <div className="flex items-center mb-3">
          <h4 className="text-lg font-semibold text-gray-900 mr-3">
            {getStatusTitle(result.status)}
          </h4>

          <Badge
            variant={getStatusColor(result.status)}
            className="capitalize"
          >
            {result.status.replace("_", " ")}
          </Badge>
        </div>

        {result.reasons && result.reasons.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Please note the following:
            </p>

            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {result.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {result.max_supported_amount &&
          result.status !== "not_eligible" && (
            <p className="text-sm font-medium text-gray-800 mb-4">
              Maximum supported amount: ₹
              {Number(
                result.max_supported_amount / 100000
              ).toFixed(2)}
              L
            </p>
          )}

        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={handleCtaClick}
            variant={result.status === "eligible" ? "primary" : "outline"}
          >
            {result.status === "eligible"
              ? "Proceed with Application"
              : "Acknowledge"}
          </Button>
        </div>
      </div>

      {showComingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>

              <h3
                id="coming-soon-title"
                className="text-xl font-semibold text-gray-900"
              >
                Feature Coming Soon
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                This feature will be available in a future release.
              </p>

              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    setShowComingSoon(false);

                    if (onAcknowledge) {
                      onAcknowledge();
                    }
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};