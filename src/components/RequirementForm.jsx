import React, { useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { useAppContext } from "../context/useAppContext";

export const RequirementForm = ({ onSubmit }) => {
  const { state, dispatch } = useAppContext();

  const [formData, setFormData] = useState({
    amount: state.searchCriteria.amount || "",
    tenure: state.searchCriteria.tenure || "",
    risk: state.searchCriteria.risk || "",
    securityType: state.searchCriteria.securityType || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((previous) => ({
        ...previous,
        [id]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (
      !formData.amount ||
      Number.isNaN(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount =
        "Please enter a valid amount greater than 0.";
    }

    if (
      !formData.tenure ||
      Number.isNaN(Number(formData.tenure)) ||
      !Number.isInteger(Number(formData.tenure)) ||
      Number(formData.tenure) <= 0
    ) {
      newErrors.tenure =
        "Please enter a valid whole number of months.";
    }

    if (!formData.risk) {
      newErrors.risk =
        "Please select a risk preference.";
    }

    if (!formData.securityType.trim()) {
      newErrors.securityType =
        "Please enter the security type.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    dispatch({
      type: "SET_SEARCH_CRITERIA",
      payload: {
        amount: formData.amount,
        tenure: formData.tenure,
        risk: formData.risk,
        securityType: formData.securityType.trim(),
        search: "",
        sort: "",
        page: 1,
      },
    });

    onSubmit?.();
  };

  return (
    <Card className="mb-8 sm:mb-10 p-5 sm:p-6 lg:p-7">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Tell us what you need
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter your requirements to discover matching opportunities.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Input
          id="amount"
          label="Loan amount (₹)"
          type="number"
          placeholder="e.g. 500000"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          className="mb-0"
        />

        <Input
          id="tenure"
          label="Tenure (months)"
          type="number"
          placeholder="e.g. 24"
          value={formData.tenure}
          onChange={handleChange}
          error={errors.tenure}
        />

        <Select
          id="risk"
          label="Risk preference"
          value={formData.risk}
          onChange={handleChange}
          error={errors.risk}
          placeholder="Select risk"
          options={[
            {
              value: "Moderate",
              label: "Moderate",
            },
            {
              value: "Moderately High",
              label: "Moderately High",
            },
            {
              value: "High",
              label: "High",
            },
          ]}
          className="mb-0"
        />

        <Input
          id="securityType"
          label="Security type"
          type="text"
          placeholder="e.g. Equity shares"
          value={formData.securityType}
          onChange={handleChange}
          error={errors.securityType}
          hint="Enter the security you plan to pledge."
          className="mb-0"
        />

        <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-3 pt-2 border-t border-gray-100">
          <Button
            type="submit"
            className="min-w-[190px] shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Find opportunities
          </Button>
        </div>
      </form>
    </Card>
  );
};