import opportunitiesData from './opportunities.json';

/* -----------------------------
   Common helpers
----------------------------- */

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const shouldSimulateError = () => {
  return (
    localStorage.getItem('wealthtech:simulate-api-error') ===
    'true'
  );
};

/* -----------------------------
   GET /api/opportunities
----------------------------- */

export const getOpportunities = async (params = {}) => {
  await delay(500);

  if (shouldSimulateError()) {
    throw new Error(
      'Unable to load opportunities. Please try again.'
    );
  }

  let results = [...opportunitiesData];

  /* Amount filter */
  if (
    params.amount !== undefined &&
    params.amount !== ''
  ) {
    const amount = Number(params.amount);

    if (Number.isFinite(amount)) {
      results = results.filter(
        (opportunity) =>
          opportunity.amountMin <= amount &&
          opportunity.amountMax >= amount
      );
    }
  }

  /* Tenure filter */
  if (
    params.tenure !== undefined &&
    params.tenure !== ''
  ) {
    const tenure = Number(params.tenure);

    if (Number.isFinite(tenure)) {
      results = results.filter(
        (opportunity) =>
          opportunity.tenureMin <= tenure &&
          opportunity.tenureMax >= tenure
      );
    }
  }

  /* Risk filter */
  if (params.risk) {
    results = results.filter(
      (opportunity) =>
        opportunity.risk.toLowerCase() ===
        params.risk.toLowerCase()
    );
  }

  /* Search */
  if (params.search?.trim()) {
    const searchTerm =
      params.search.trim().toLowerCase();

    results = results.filter((opportunity) => {
      const searchableText = [
        opportunity.id,
        opportunity.name,
        opportunity.provider,
        opportunity.product,
        opportunity.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  /* Sorting */
  switch (params.sort) {
    case 'rate_asc':
      results.sort((a, b) => a.rate - b.rate);
      break;

    case 'rate_desc':
      results.sort((a, b) => b.rate - a.rate);
      break;

    case 'fee_asc':
      results.sort((a, b) => a.fee - b.fee);
      break;

    case 'ltv_desc':
      results.sort((a, b) => b.ltv - a.ltv);
      break;

    case 'amount_desc':
      results.sort(
        (a, b) => b.amountMax - a.amountMax
      );
      break;

    case 'tenure_desc':
      results.sort(
        (a, b) => b.tenureMax - a.tenureMax
      );
      break;

    default:
      break;
  }

  /* Pagination */
  const page = Math.max(
    1,
    Number(params.page) || 1
  );

  const limit = Math.max(
    1,
    Number(params.limit) || 6
  );

  const start = (page - 1) * limit;

  const paginatedItems = results.slice(
    start,
    start + limit
  );

  return {
    items: paginatedItems,
    total: results.length,
    page,
    limit,
  };
};

/* -----------------------------
   GET /api/opportunities/:id
----------------------------- */

export const getOpportunityById = async (id) => {
  await delay(300);

  if (shouldSimulateError()) {
    throw new Error(
      'Unable to load opportunity details. Please try again.'
    );
  }

  const opportunity = opportunitiesData.find(
    (item) => item.id === id
  );

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  return opportunity;
};

/* -----------------------------
   POST /api/eligibility/check
----------------------------- */

export const checkEligibility = async (data) => {
  await delay(600);

  if (shouldSimulateError()) {
    throw new Error(
      'Unable to check eligibility. Please try again.'
    );
  }

  const opportunity = opportunitiesData.find(
    (item) =>
      item.id === data.opportunity_id
  );

  if (!opportunity) {
    throw new Error('Opportunity not found');
  }

  const amount = Number(data.amount);
  const tenure = Number(data.tenure);

  const risk =
    data.risk?.trim() || '';

  const securityType =
    data.security_type?.trim() || '';

  const reasons = [];

  /* --------------------------------
     1. Amount
     
     Amount outside the opportunity's
     supported range = NOT ELIGIBLE
  -------------------------------- */

  const amountOutsideRange =
    !Number.isFinite(amount) ||
    amount < opportunity.amountMin ||
    amount > opportunity.amountMax;

  if (amountOutsideRange) {
    reasons.push(
      `Amount must be between ₹${opportunity.amountMin.toLocaleString(
        'en-IN'
      )} and ₹${opportunity.amountMax.toLocaleString(
        'en-IN'
      )}.`
    );
  }

  /* --------------------------------
     2. Tenure

     Tenure outside supported range
     = NOT ELIGIBLE
  -------------------------------- */

  const tenureOutsideRange =
    !Number.isFinite(tenure) ||
    tenure < opportunity.tenureMin ||
    tenure > opportunity.tenureMax;

  if (tenureOutsideRange) {
    reasons.push(
      `Tenure must be between ${opportunity.tenureMin} and ${opportunity.tenureMax} months.`
    );
  }

  /* --------------------------------
     Hard failures
  -------------------------------- */

  if (
    amountOutsideRange ||
    tenureOutsideRange
  ) {
    return {
      status: 'not_eligible',
      reasons,
      max_supported_amount:
        opportunity.amountMax,
    };
  }

  /* --------------------------------
     3. Risk mismatch

     Risk mismatch = CONDITIONAL
  -------------------------------- */

  if (
    risk &&
    opportunity.risk &&
    risk.toLowerCase() !==
      opportunity.risk.toLowerCase()
  ) {
    reasons.push(
      `Risk preference (${risk}) differs from the opportunity's stated risk profile (${opportunity.risk}).`
    );
  }

  /* --------------------------------
     4. Security type

     The supplied fictional dataset does
     not define provider-specific security
     acceptance rules.

     Therefore we only validate that a
     value was supplied.
  -------------------------------- */

  if (!securityType) {
    reasons.push(
      'Security type was not provided. Additional verification may be required.'
    );
  }

  /* --------------------------------
     Conditional result
  -------------------------------- */

  if (reasons.length > 0) {
    return {
      status: 'conditional',
      reasons,
      max_supported_amount:
        opportunity.amountMax,
    };
  }

  /* --------------------------------
     Everything matches
  -------------------------------- */

  return {
    status: 'eligible',
    reasons: [],
    max_supported_amount:
      opportunity.amountMax,
  };
};

/* -----------------------------
   POST /api/compare
----------------------------- */

export const compareOpportunities = async (
  data
) => {
  await delay(400);

  if (shouldSimulateError()) {
    throw new Error(
      'Unable to load comparison data. Please try again.'
    );
  }

  const { opportunity_ids } = data;

  if (
    !Array.isArray(opportunity_ids) ||
    opportunity_ids.length < 2 ||
    opportunity_ids.length > 3
  ) {
    throw new Error(
      'Comparison requires 2 to 3 opportunities.'
    );
  }

  return opportunitiesData.filter(
    (opportunity) =>
      opportunity_ids.includes(opportunity.id)
  );
};