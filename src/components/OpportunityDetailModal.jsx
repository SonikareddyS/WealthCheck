import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import { opportunityApi } from "../services/opportunityApi";

export const OpportunityDetailModal = ({
  opportunity,
  onClose,
  onCompare,
  isCompared,
}) => {
  const { state } = useAppContext();

  const [eligibility, setEligibility] = useState(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [eligibilityError, setEligibilityError] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);

  const [eligibilityInputs, setEligibilityInputs] = useState({
    amount: state.searchCriteria.amount || "",
    tenure: state.searchCriteria.tenure || "",
    risk: state.searchCriteria.risk || "",
    securityType: state.searchCriteria.securityType || "",
  });

  const [inputError, setInputError] = useState("");

  // oxlint-disable-next-line react(set-state-in-effect)
  useEffect(() => {
    setEligibilityInputs({
      amount: state.searchCriteria.amount || "",
      tenure: state.searchCriteria.tenure || "",
      risk: state.searchCriteria.risk || "",
      securityType: state.searchCriteria.securityType || "",
    });

    setEligibility(null);
    setEligibilityError("");
    setInputError("");
    setShowComingSoon(false);
  }, [opportunity?.id, state.searchCriteria]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
        setShowComingSoon(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!opportunity) return null;

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === "" ||
      !Number.isFinite(Number(amount))
    ) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const handleEligibilityInputChange = (event) => {
    const { name, value } = event.target;

    setEligibilityInputs((previous) => ({
      ...previous,
      [name]: value,
    }));

    setInputError("");
    setEligibilityError("");
    setEligibility(null);
    setShowComingSoon(false);
  };

  const validateEligibilityInputs = () => {
    const amount = Number(eligibilityInputs.amount);
    const tenure = Number(eligibilityInputs.tenure);

    if (
      !eligibilityInputs.amount ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return "Please enter a valid loan amount.";
    }

    if (
      !eligibilityInputs.tenure ||
      !Number.isFinite(tenure) ||
      tenure <= 0 ||
      !Number.isInteger(tenure)
    ) {
      return "Please enter a valid whole number of months for tenure.";
    }

    if (!eligibilityInputs.risk) {
      return "Please select a risk preference.";
    }

    if (!eligibilityInputs.securityType.trim()) {
      return "Please enter the security type.";
    }

    return "";
  };

  const handleCheckEligibility = async () => {
    const validationMessage = validateEligibilityInputs();

    if (validationMessage) {
      setInputError(validationMessage);
      setEligibility(null);
      return;
    }

    setEligibilityLoading(true);
    setEligibilityError("");
    setInputError("");
    setEligibility(null);
    setShowComingSoon(false);

    try {
      const result = await opportunityApi.checkEligibility({
        opportunity_id: opportunity.id,
        amount: eligibilityInputs.amount,
        tenure: eligibilityInputs.tenure,
        risk: eligibilityInputs.risk,
        security_type: eligibilityInputs.securityType,
      });

      setEligibility(result);
    } catch (error) {
      setEligibilityError(
        error.message ||
          "Unable to check eligibility. Please try again."
      );
    } finally {
      setEligibilityLoading(false);
    }
  };

  const handleRetryEligibility = () => {
    handleCheckEligibility();
  };

  const getStatusTitle = () => {
    if (!eligibility) return "";

    switch (eligibility.status) {
      case "eligible":
        return "Eligible";

      case "conditional":
        return "Conditional";

      case "not_eligible":
        return "Not Eligible";

      default:
        return "Eligibility Result";
    }
  };

  const getStatusClasses = () => {
    if (!eligibility) return "";

    switch (eligibility.status) {
      case "eligible":
        return "bg-green-50 border-green-200 text-green-800";

      case "conditional":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";

      case "not_eligible":
        return "bg-red-50 border-red-200 text-red-800";

      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getStatusIcon = () => {
    if (!eligibility) return null;

    switch (eligibility.status) {
      case "eligible":
        return (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl"
            aria-hidden="true"
          >
            ✓
          </span>
        );

      case "conditional":
        return (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 text-xl"
            aria-hidden="true"
          >
            !
          </span>
        );

      case "not_eligible":
        return (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl"
            aria-hidden="true"
          >
            ×
          </span>
        );

      default:
        return null;
    }
  };

  const getCtaLabel = () => {
    if (!eligibility) return "";

    switch (eligibility.status) {
      case "eligible":
        return "Proceed with Application";

      case "conditional":
        return "Review Requirements";

      case "not_eligible":
        return "Explore Other Opportunities";

      default:
        return "Continue";
    }
  };

  const handleCtaClick = () => {
    setShowComingSoon(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-gray-950/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6"
        onClick={onClose}
        role="presentation"
      >
        <div
          className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-2xl border border-white/20"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="opportunity-modal-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close opportunity details"
          >
            ×
          </button>

          <div className="p-5 sm:p-7 border-b border-gray-100 bg-gray-50/70">
            <div className="pr-10 min-w-0">
              <p className="text-xs sm:text-sm text-primary font-medium mb-1">
                {opportunity.id}
              </p>

              <h2
                id="opportunity-modal-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 break-words"
              >
                {opportunity.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500 break-words">
                {opportunity.provider || "Fictional Provider"}
                {" • "}
                {opportunity.product || "LAS"}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Interest Rate", `${opportunity.rate}% p.a.`],
                [
                  "Amount Range",
                  `${formatAmount(opportunity.amountMin)} - ${formatAmount(
                    opportunity.amountMax
                  )}`,
                ],
                [
                  "Tenure",
                  `${opportunity.tenureMin} - ${opportunity.tenureMax} months`,
                ],
                [
                  "Maximum LTV",
                  `${opportunity.ltv ?? "N/A"}%`,
                ],
                [
                  "Processing Fee",
                  `${opportunity.fee ?? "N/A"}%`,
                ],
                ["Risk Profile", opportunity.risk],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-gray-50 border border-gray-100 p-4 transition-all duration-200 hover:bg-gray-100/70"
                >
                  <p className="text-sm text-gray-500">{label}</p>

                  <p className="mt-1 text-lg font-semibold text-gray-900 break-words">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {opportunity.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">
                  Description
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600 break-words">
                  {opportunity.description}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs sm:text-sm text-blue-800 leading-5">
                This is fictional assessment data. Opportunity details are
                for demonstration purposes and should not be treated as real
                financial advice or provider terms.
              </p>
            </div>

            <section
              className="mt-7 border-t border-gray-100 pt-6"
              aria-labelledby="eligibility-heading"
            >
              <div>
                <h3
                  id="eligibility-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  Eligibility
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Check this opportunity against your requirements.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="eligibility-amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Loan amount (₹)
                  </label>

                  <input
                    id="eligibility-amount"
                    name="amount"
                    type="number"
                    min="1"
                    value={eligibilityInputs.amount}
                    onChange={handleEligibilityInputChange}
                    aria-invalid={inputError ? "true" : "false"}
                    aria-describedby={
                      inputError
                        ? "eligibility-input-error"
                        : undefined
                    }
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eligibility-tenure"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tenure (months)
                  </label>

                  <input
                    id="eligibility-tenure"
                    name="tenure"
                    type="number"
                    min="1"
                    step="1"
                    value={eligibilityInputs.tenure}
                    onChange={handleEligibilityInputChange}
                    aria-invalid={inputError ? "true" : "false"}
                    aria-describedby={
                      inputError
                        ? "eligibility-input-error"
                        : undefined
                    }
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 outline-none transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eligibility-risk"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Risk preference
                  </label>

                  <select
                    id="eligibility-risk"
                    name="risk"
                    value={eligibilityInputs.risk}
                    onChange={handleEligibilityInputChange}
                    aria-invalid={inputError ? "true" : "false"}
                    aria-describedby={
                      inputError
                        ? "eligibility-input-error"
                        : undefined
                    }
                    className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm"
                  >
                    <option value="">Select risk</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Moderately High">
                      Moderately High
                    </option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="eligibility-security"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Security type
                  </label>

                  <input
                    id="eligibility-security"
                    name="securityType"
                    type="text"
                    value={eligibilityInputs.securityType}
                    onChange={handleEligibilityInputChange}
                    placeholder="e.g. Equity shares"
                    aria-invalid={inputError ? "true" : "false"}
                    aria-describedby={
                      inputError
                        ? "eligibility-input-error"
                        : undefined
                    }
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-sm"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Supported amount:{" "}
                  <span className="font-medium text-gray-900">
                    {formatAmount(opportunity.amountMin)}
                    {" - "}
                    {formatAmount(opportunity.amountMax)}
                  </span>
                </p>

                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                  Supported tenure:{" "}
                  <span className="font-medium text-gray-900">
                    {opportunity.tenureMin}
                    {" - "}
                    {opportunity.tenureMax} months
                  </span>
                </p>
              </div>

              {inputError && (
                <div
                  id="eligibility-input-error"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4"
                  role="alert"
                >
                  <p className="text-sm font-medium text-red-800">
                    {inputError}
                  </p>
                </div>
              )}

              {!eligibilityLoading && (
                <button
                  type="button"
                  onClick={handleCheckEligibility}
                  className="mt-5 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                >
                  {eligibility ? "Check Again" : "Check Eligibility"}
                </button>
              )}

              {eligibilityLoading && (
                <div
                  className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
                      aria-hidden="true"
                    />

                    <p className="text-sm text-gray-700">
                      Checking eligibility...
                    </p>
                  </div>
                </div>
              )}

              {eligibilityError && !eligibilityLoading && (
                <div
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4"
                  role="alert"
                >
                  <p className="text-sm font-medium text-red-800">
                    {eligibilityError}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetryEligibility}
                    className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Retry
                  </button>
                </div>
              )}

              {eligibility && !eligibilityLoading && (
                <div
                  className={`mt-5 rounded-xl border p-5 shadow-sm ${getStatusClasses()}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon()}

                    <div className="min-w-0 w-full">
                      <h4 className="text-lg font-semibold">
                        {getStatusTitle()}
                      </h4>

                      {eligibility.reasons?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">
                            Reason
                            {eligibility.reasons.length > 1
                              ? "s"
                              : ""}
                            :
                          </p>

                          <ul className="mt-2 list-disc pl-5 space-y-1">
                            {eligibility.reasons.map(
                              (reason, index) => (
                                <li
                                  key={index}
                                  className="text-sm break-words"
                                >
                                  {reason}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {eligibility.max_supported_amount !==
                        undefined && (
                        <div className="mt-4">
                          <p className="text-sm">
                            <span className="font-medium">
                              Maximum supported amount:
                            </span>{" "}
                            {formatAmount(
                              eligibility.max_supported_amount
                            )}
                          </p>
                        </div>
                      )}

                      <div className="mt-4">
                        <p className="text-sm font-medium">
                          Next action
                        </p>

                        <p className="mt-1 text-sm">
                          {eligibility.status === "eligible"
                            ? "Review the opportunity details and compare it with other suitable options."
                            : eligibility.status === "conditional"
                            ? "Review the conditions and update the requirements if needed before proceeding."
                            : "Review the supported amount and tenure, then explore other opportunities."}
                        </p>
                      </div>

                      {/* Required CTA */}
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={handleCtaClick}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            eligibility.status === "eligible"
                              ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                              : "border-2 border-primary bg-white text-primary hover:bg-blue-50 focus:ring-blue-500"
                          }`}
                        >
                          {getCtaLabel()}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="mt-7 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => onCompare(opportunity)}
                aria-pressed={isCompared}
                aria-label={
                  isCompared
                    ? `Remove ${opportunity.name} from comparison`
                    : `Add ${opportunity.name} to comparison`
                }
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isCompared
                    ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5"
                }`}
              >
                {isCompared
                  ? "Remove from Compare"
                  : "Compare"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Coming Soon Modal */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/60 backdrop-blur-[2px] px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                className="mt-4 text-xl font-semibold text-gray-900"
              >
                Feature Coming Soon
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                This feature is coming soon and will be available in a
                future release.
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowComingSoon(false)}
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};