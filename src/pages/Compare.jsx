import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { ErrorBanner } from "../components/ErrorBanner";
import { useAppContext } from "../context/useAppContext";
import { opportunityApi } from "../services/opportunityApi";

export const Compare = () => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompareData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await opportunityApi.compareOpportunities({
        opportunity_ids: state.selectedForCompare,
      });

      setData(results);
    } catch (err) {
      setError(
        err?.message || "Failed to load comparison data."
      );
    } finally {
      setLoading(false);
    }
  }, [state.selectedForCompare]);

  // oxlint-disable react(set-state-in-effect)
  useEffect(() => {
    if (state.selectedForCompare.length < 2) {
      navigate("/");
      return;
    }

    fetchCompareData();
  }, [
    state.selectedForCompare,
    navigate,
    fetchCompareData,
  ]);
  // oxlint-enable react(set-state-in-effect)

  const handleRemove = (id) => {
    dispatch({
      type: "TOGGLE_COMPARE",
      payload: id,
    });
  };

  const formatAmount = (amount) => {
    if (!Number.isFinite(Number(amount))) {
      return "N/A";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
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

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="mb-8"
          aria-label="Loading comparison"
          aria-busy="true"
        >
          <LoadingSkeleton count={1} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton count={3} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBanner
          message={error}
          onRetry={fetchCompareData}
        />
      </main>
    );
  }

  return (
    <main
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-6
        sm:py-8
        overflow-x-hidden
      "
    >
      <header
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:justify-between
          sm:items-center
          mb-6
          sm:mb-8
        "
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Side-by-side review
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-900
              tracking-tight
              break-words
            "
          >
            Compare Opportunities
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Side-by-side comparison of your selected opportunities.
          </p>
        </div>

        <Link
          to="/"
          className="
            self-start
            sm:self-auto
            flex
            items-center
            flex-shrink-0
            px-4
            py-2
            rounded-lg
            font-medium
            border-2
            border-primary
            text-primary
            hover:bg-blue-50
            hover:-translate-y-0.5
            hover:shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:ring-offset-2
            transition-all
            duration-200
          "
          aria-label="Back to opportunity search"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          Back to Search
        </Link>
      </header>

      <section
        aria-labelledby="comparison-heading"
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          sm:gap-6
          w-full
        "
      >
        <h2 id="comparison-heading" className="sr-only">
          Selected opportunity comparison
        </h2>

        {data.map((opp) => (
          <article key={opp.id} className="h-full">
            <Card
              className="
                w-full
                max-w-full
                min-w-0
                flex
                flex-col
                h-full
                relative
                overflow-hidden
                hover:-translate-y-1
              "
            >
              <button
                type="button"
                onClick={() => handleRemove(opp.id)}
                className="
                  absolute
                  top-4
                  right-4
                  p-1.5
                  bg-gray-50
                  hover:bg-red-50
                  text-gray-400
                  hover:text-red-500
                  rounded-full
                  transition-all
                  duration-200
                  hover:scale-105
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  z-10
                "
                aria-label={`Remove ${opp.name} from comparison`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="mb-4 sm:mb-6 pr-10 min-w-0">
                <p className="text-xs text-primary font-medium mb-1">
                  {opp.id}
                </p>

                <h3
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-gray-900
                    break-words
                    overflow-wrap-anywhere
                  "
                >
                  {opp.name}
                </h3>

                <Badge
                  variant={getRiskBadgeVariant(opp.risk)}
                  className="mt-2"
                >
                  {opp.risk} Risk
                </Badge>
              </div>

              <div className="flex-grow min-w-0">
                <div className="py-3 border-b border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">
                    Interest Rate
                  </span>

                  <span className="text-lg font-semibold text-primary">
                    {opp.rate}% p.a.
                  </span>
                </div>

                <div className="py-3 border-b border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">
                    Loan Amount Range
                  </span>

                  <span className="font-medium text-gray-900 break-words">
                    {formatAmount(opp.amountMin)}
                    {" - "}
                    {formatAmount(opp.amountMax)}
                  </span>
                </div>

                <div className="py-3 border-b border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">
                    Tenure Range
                  </span>

                  <span className="font-medium text-gray-900">
                    {opp.tenureMin}
                    {" - "}
                    {opp.tenureMax}
                    {" months"}
                  </span>
                </div>

                <div className="py-3 border-b border-gray-100">
                  <span className="block text-sm text-gray-500 mb-1">
                    LTV
                  </span>

                  <span className="font-medium text-gray-900">
                    {opp.ltv !== undefined && opp.ltv !== null
                      ? `${opp.ltv}%`
                      : "N/A"}
                  </span>
                </div>

                <div className="py-3">
                  <span className="block text-sm text-gray-500 mb-1">
                    Processing Fee
                  </span>

                  <span className="font-medium text-gray-900">
                    {opp.fee !== undefined && opp.fee !== null
                      ? `${opp.fee}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </article>
        ))}

        {Array.from({
          length: Math.max(0, 3 - data.length),
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="
              w-full
              max-w-full
              min-w-0
              border-2
              border-dashed
              border-gray-200
              rounded-xl
              flex
              flex-col
              items-center
              justify-center
              p-6
              sm:p-8
              text-center
              bg-gray-50/50
              min-h-[300px]
              sm:min-h-[400px]
              overflow-hidden
              transition-all
              duration-200
              hover:border-blue-200
              hover:bg-blue-50/30
            "
          >
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 transition-transform duration-200 hover:scale-105">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <h4 className="text-gray-900 font-medium">
              Add an opportunity
            </h4>

            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Select another option from the search page to compare.
            </p>

            <Link
              to="/"
              className="
                mt-4
                px-4
                py-2
                rounded-lg
                font-medium
                border-2
                border-primary
                text-primary
                hover:bg-blue-50
                hover:-translate-y-0.5
                hover:shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-primary
                focus:ring-offset-2
                transition-all
                duration-200
                text-sm
              "
              aria-label="Find more opportunities"
            >
              Find More
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
};