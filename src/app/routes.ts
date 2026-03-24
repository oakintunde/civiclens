import { createBrowserRouter } from "react-router";
import Layout from "./layout";
import AboutUs from "./pages/About";
import Blog from "./pages/Blog";
import {
  FederalBudget,
  MunicipalBudgets,
  ProvincialBudgets,
  YearComparison,
} from "./pages/budgetPlaceholders";
import ContactUs from "./pages/Contact";
import { Home } from "./pages/Home";
import Infographics from "./pages/Infographics";
import Maps from "./pages/Maps";
import NotFound from "./pages/NotFound";
import Spendings from "./pages/Spendings";
import Visualizations from "./pages/Visualization";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "federal", Component: FederalBudget },
      { path: "provincial", Component: ProvincialBudgets },
      { path: "municipal", Component: MunicipalBudgets },
      { path: "comparison", Component: YearComparison },
      { path: "maps", Component: Maps },
      { path: "infographics", Component: Infographics },
      { path: "visualizations", Component: Visualizations },
      { path: "spendings", Component: Spendings },
      { path: "about-us", Component: AboutUs },
      { path: "blog", Component: Blog },
      { path: "contact-us", Component: ContactUs },
      { path: "*", Component: NotFound },
    ],
  },
]);