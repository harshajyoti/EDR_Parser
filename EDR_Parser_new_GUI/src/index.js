import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import Home from "./routes/Home";
import Results from "./routes/Results";
import Navbar from "./components/Navbar";
import Process from "./routes/Process";

// Results pages

import DataPage from "./pages/data"
import DisplayPage from "./pages/DisplayPage"
import Diss_reason_Data from "./pages/diss_reason"
import Rat_type from "./pages/rat_type"
import Snssai from "./pages/snssai";
import Dnn from "./pages/dnn";
import Diss_reason_SupiPage from "./pages/diss_reason_supi_page";
import Rat_type_SupiPage from "./pages/rat_type_supi_page"
import Snssai_SupiPage from "./pages/snssai_supi_page"
import Dnn_SupiPage from './pages/dnn_supi_page'

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "process",
        element: <Process />,
      },
      {
        path: "results",
        element: <Results />,
      },
      {
        path: "results/data",
        element: <DataPage />,
      },
      {
        path: "/display/:key",
        element: <DisplayPage />
      },
      {
        path: "results/disconnect-reason",
        element: <Diss_reason_Data />
      },
      {
        path: "results/rat-type",
        element: <Rat_type />
      },
      {
        path: "results/snssai",
        element: <Snssai />
      },
      {
        path: "results/dnn",
        element: <Dnn />
      },
      {
        path: "results/disconnect-reason/:key",
        element: <Diss_reason_SupiPage />
      },
      {
        path: "results/rat-type/:key",
        element: <Rat_type_SupiPage />
      },
      {
        path: "results/snssai/:key",
        element: <Snssai_SupiPage />
      },
      {
        path: "/results/dnn/:key",
        element: <Dnn_SupiPage  />
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
