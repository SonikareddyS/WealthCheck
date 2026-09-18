# WealthTech Opportunity Discovery

A responsive, production-style frontend for discovering and evaluating financial opportunities such as Loan Against Securities (LAS).

The application allows users to enter their requirements, discover matching opportunities, search and sort results, inspect opportunity details, compare up to three opportunities, and check eligibility with actionable outcomes.

---

## Features

### Requirement & Discovery

- Requirement form with:
  - Loan amount
  - Tenure
  - Risk preference
  - Security type
- Dynamic opportunity listing from a local mock API
- Amount and tenure based opportunity matching
- Risk filtering
- Search across opportunity information
- Multiple sorting options
- Pagination

### Opportunity Evaluation

- Opportunity detail modal
- Display of:
  - Interest rate
  - Amount range
  - Tenure
  - LTV
  - Fee
  - Risk profile
- Compare 2–3 financial opportunities side by side
- Comparison limit of maximum 3 opportunities
- Easy access to comparison through a visible comparison CTA

### Eligibility

- Eligibility checking
- Eligible outcome
- Conditional outcome
- Not Eligible outcome
- Eligibility reasons
- Maximum supported amount
- Clear next actions

### UI & Reliability

- Loading and skeleton states
- Empty states
- API error and retry handling
- Client-side form validation
- Accessible form controls
- Semantic HTML
- Responsive desktop, tablet, and mobile layouts
- Long provider/product text handling

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| React Router DOM | Client-side routing |
| Tailwind CSS | Responsive styling |
| React Context API | Global application state |
| useReducer | Predictable state updates |
| Vitest | Unit/component testing |
| React Testing Library | UI testing |
| Testing Library User Event | User interaction testing |
| jest-dom | DOM assertions |
| jsdom | Browser-like test environment |

---

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm

Verify the installation:

```bash
node --version
npm --version
```

---

## Installation

Clone or extract the project and navigate to the project directory:

```bash
cd wealthTech
```

Install the project dependencies:

```bash
npm install
```

---

## Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Open the displayed URL in your browser.

---

## Production Build

Create an optimized production build:

```bash
npm run build
```

The production files will be generated in the `dist` directory.

---

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

---

## Linting

Run the project linter:

```bash
npm run lint
```

---

# Architecture

The application follows a layered frontend architecture that separates UI presentation, application state, service/API access, and mock data.

### Architecture Overview

```text
Presentation Layer
        |
        v
Application State
        |
        v
Service Layer
        |
        v
Mock API Layer
        |
        v
Data Layer
```

This separation keeps the UI independent from the underlying data-access implementation and makes the application easier to maintain and extend.

---

## Architecture Layers

### 1. Presentation Layer

The presentation layer contains reusable React components responsible for rendering the user interface.

Examples include:

- Requirement form
- Opportunity cards
- Opportunity listing
- Opportunity detail modal
- Comparison interface
- Eligibility result
- Loading states
- Error states
- Pagination
- Reusable UI components

The components primarily handle rendering and user interaction.

---

### 2. Application State Layer

Global application state is managed using:

- React Context API
- `useReducer`

The shared state includes:

- Search criteria
- Loan amount
- Tenure
- Risk preference
- Security type
- Search term
- Sort option
- Current page
- Selected opportunities for comparison
- Comparison limit messages

Using `useReducer` keeps related state transitions centralized and predictable.

---

### 3. Service Layer

The service layer provides a single interface between React components and the data-access implementation.

Location:

```text
src/services/opportunityApi.js
```

It exposes operations for:

- Fetching opportunities
- Fetching opportunity details
- Checking eligibility
- Comparing opportunities

Components use the service layer instead of directly depending on the mock data source.

---

### 4. Mock API Layer

The mock API implementation is located at:

```text
src/mocks/api.js
```

It simulates asynchronous API communication and includes:

- Artificial network latency
- Amount filtering
- Tenure filtering
- Risk filtering
- Search
- Sorting
- Pagination
- Eligibility checking
- Comparison handling
- API error simulation

This allows the frontend to demonstrate realistic loading and error states without requiring a production backend.

---

### 5. Data Layer

The fictional opportunity dataset is stored at:

```text
src/mocks/opportunities.json
```

Opportunity cards are rendered dynamically from API results rather than being individually hard-coded.

This allows the same UI components to work with different opportunity data.

---

# Data Flow

The application follows this data flow:

```text
User Interaction
       |
       v
React UI Components
       |
       v
AppContext + useReducer
       |
       v
Service Layer
       |
       v
Mock API Layer
       |
       v
opportunities.json
```

---

# User Journey

The application follows the required financial opportunity discovery journey:

```text
Enter Requirements
       |
       v
Discover Opportunities
       |
       v
View Opportunity Details
       |
       v
Select 2–3 Opportunities
       |
       v
Compare Opportunities
       |
       v
Check Eligibility
       |
       v
View Result & Next Action
```

---

# API / Mock Approach

The application uses the fictional opportunity dataset provided for the assessment through a local mock API layer.

The mock API follows the supplied assessment API contract.

The implementation is local because a production backend is not required for this frontend assessment.

---

## GET `/api/opportunities`

Returns a paginated list of matching opportunities.

### Supported Parameters

```text
amount
tenure
risk
search
sort
page
limit
```

The mock implementation uses these parameters to filter, search, sort, and paginate the opportunity dataset.

---

## GET `/api/opportunities/{id}`

Returns details for a specific opportunity.

Example:

```text
GET /api/opportunities/OPP-1001
```

---

## POST `/api/eligibility/check`

Checks eligibility for a selected opportunity using the user's requirements.

### Request Fields

```text
opportunity_id
amount
tenure
risk
security_type
```

### Response Fields

```text
status
reasons
max_supported_amount
```

### Supported Statuses

```text
eligible
conditional
not_eligible
```

---

## POST `/api/compare`

Accepts 2–3 opportunity IDs and returns comparison-ready opportunity data.

Example:

```text
{
  "opportunity_ids": [
    "OPP-1001",
    "OPP-1004"
  ]
}
```

The application prevents users from selecting more than three opportunities for comparison.

---

# Search, Filtering & Sorting

## Search

The search functionality checks relevant opportunity information including:

- Opportunity ID
- Opportunity name
- Provider
- Product
- Description

---

## Filtering

Opportunities can be filtered using:

- Requested amount
- Requested tenure
- Risk preference

---

## Sorting

The mock API supports multiple sorting options:

- Interest rate ascending
- Interest rate descending
- Fee ascending
- LTV descending
- Maximum amount descending
- Maximum tenure descending

---

# Eligibility Logic

The mock eligibility logic checks the user's requirements against the selected opportunity.

## Eligible

Returned when:

- Requested amount is within the supported amount range
- Requested tenure is within the supported tenure range
- No additional conditional information is required

---

## Conditional

Returned when:

- Amount and tenure are supported
- But additional conditions may apply

Examples include:

- Risk preference differs from the opportunity risk profile
- Security type information is missing

The UI displays the relevant reasons.

---

## Not Eligible

Returned when:

- Requested amount is outside the supported range
- Or requested tenure is outside the supported range

The result provides an explanation and the maximum supported amount where applicable.

---

# Error & Loading States

The application handles asynchronous states explicitly.

## Loading State

While opportunity data is being fetched, skeleton placeholders are displayed.

---

## Empty State

If no opportunities match the current requirements, the user receives a clear empty-state message with guidance to modify their search criteria.

---

## API Error

If the mock API fails, an error message is displayed with a retry action.

---

## Retry

The user can retry the failed operation without refreshing the entire page.

---

# Edge Cases

The application handles the following assessment edge cases:

- No matching opportunities
- API/network failure with retry
- Invalid or incomplete input
- Requested amount above the supported maximum
- Requested tenure outside the supported range
- Conditional eligibility
- Comparison limit reached
- Long provider/product text
- Loading/skeleton state

---

# Responsive Design

The application is designed for:

- Desktop
- Tablet
- Mobile

Responsive behavior includes:

- Responsive opportunity grid
- Mobile-friendly requirement form
- Responsive comparison layout
- Flexible text wrapping
- Mobile-friendly opportunity detail modal
- No unusable horizontal overflow

The comparison experience adapts to smaller screens rather than relying on a desktop-only wide table.

---

# Accessibility

The application follows basic accessibility practices, including:

- Semantic HTML
- Associated form labels
- Accessible button names
- Keyboard-friendly controls
- Visible focus states
- `aria-invalid` for validation errors
- `aria-describedby` for supporting and error text
- Accessible modal interactions
- Live regions for important dynamic messages
- Appropriate `aria-label` usage
- `aria-pressed` for comparison selection controls

---

# Testing

The project uses:

- Vitest
- React Testing Library
- Testing Library User Event
- jest-dom
- jsdom

Run the automated tests with:

```bash
npm test
```

---

## Automated Tests

### 1. Requirement Form Validation

Verifies that submitting the requirement form without required values displays the appropriate validation messages.

The test covers:

- Amount validation
- Tenure validation
- Risk validation
- Security type validation

---

### 2. Comparison Limit

Verifies that:

- Users can select opportunities for comparison
- Up to three opportunities can be selected
- Selecting a fourth opportunity is prevented
- The comparison limit message is displayed

Expected result:

```text
Test Files  2 passed
Tests       2 passed
```

---

# Project Structure

```text
wealthTech/
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Select.jsx
│   │   │
│   │   ├── EligibilityResult.jsx
│   │   ├── ErrorBanner.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── OpportunityCard.jsx
│   │   ├── OpportunityDetailModal.jsx
│   │   ├── OpportunityList.jsx
│   │   ├── PaginationControls.jsx
│   │   ├── RequirementForm.jsx
│   │   └── SortFilterBar.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx
│   │
│   ├── mocks/
│   │   ├── api.js
│   │   └── opportunities.json
│   │
│   ├── pages/
│   │   ├── Compare.jsx
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   └── opportunityApi.js
│   │
│   └── App.jsx
│
├── tests/
│   ├── setup.js
│   ├── RequirementForm.test.jsx
│   └── ComparisonLimit.test.jsx
│
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

# Assumptions

- All financial opportunity data is fictional and used only for assessment purposes.
- The supplied fictional dataset is treated as the source of opportunity data.
- The API is mocked locally because a production backend is not required for the assessment.
- Eligibility results are deterministic and based on the implemented assessment logic.
- Eligibility results are not real financial underwriting decisions.
- Risk preference and security type are treated as user-provided inputs during the mock eligibility flow.
- The comparison feature supports a maximum of three opportunities as required by the assessment.

---

# Development Workflow

A typical local development workflow is:

```bash
npm install
npm run dev
```

After making changes:

```bash
npm test
npm run lint
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# Available Commands

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm test` | Run automated tests |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run linting |

---

# Notes

This project is implemented as a frontend assessment using fictional financial opportunity data and a local mock API.

The architecture is intentionally separated into reusable components, application state, services, mock API logic, and data so that the mock API can later be replaced by a real backend with minimal changes to the presentation layer.