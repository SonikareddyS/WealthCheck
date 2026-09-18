import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { Home } from "./pages/Home";
import { Compare } from "./pages/Compare";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-bg font-sans flex flex-col">
          <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 transition-shadow duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav
                aria-label="Main navigation"
                className="flex justify-between h-16 items-center"
              >
                <Link
                  to="/"
                  className="flex items-center gap-2 group"
                  aria-label="WealthTech home"
                >
                  <div
                    aria-hidden="true"
                    className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md group-hover:bg-blue-600"
                  >
                    W
                  </div>

                  <span className="font-bold text-xl tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-primary">
                    WealthTech
                  </span>
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-200 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              <p>
                © {new Date().getFullYear()} WealthTech Assessment. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;