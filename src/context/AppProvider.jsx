import React, { useReducer } from "react";
import { AppContext } from "./AppContext";

const initialState = {
  searchCriteria: {
    amount: "",
    tenure: "",
    risk: "",
    securityType: "",
    search: "",
    sort: "",
    page: 1,
    limit: 6,
  },
  selectedForCompare: [],
  compareLimitMessage: "",
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH_CRITERIA":
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          ...action.payload,
        },
      };

    case "SET_SEARCH":
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          search: action.payload,
          page: 1,
        },
      };

    case "SET_SORT":
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          sort: action.payload,
          page: 1,
        },
      };

    case "CLEAR_SEARCH":
      return {
        ...state,
        searchCriteria: {
          ...state.searchCriteria,
          search: "",
          page: 1,
        },
      };

    case "TOGGLE_COMPARE": {
      const exists = state.selectedForCompare.includes(action.payload);

      // Remove from comparison
      if (exists) {
        return {
          ...state,
          selectedForCompare: state.selectedForCompare.filter(
            (id) => id !== action.payload
          ),
          compareLimitMessage: "",
        };
      }

      // Maximum of 3
      if (state.selectedForCompare.length >= 3) {
        return {
          ...state,
          compareLimitMessage:
            "You can compare up to 3 opportunities. Remove one to add another.",
        };
      }

      // Add to comparison
      return {
        ...state,
        selectedForCompare: [
          ...state.selectedForCompare,
          action.payload,
        ],
        compareLimitMessage: "",
      };
    }

    case "CLEAR_COMPARE":
      return {
        ...state,
        selectedForCompare: [],
        compareLimitMessage: "",
      };

    case "CLEAR_COMPARE_LIMIT_MESSAGE":
      return {
        ...state,
        compareLimitMessage: "",
      };

    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};