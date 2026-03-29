import { createBrowserRouter } from "react-router";
import Layout from "./layout";
import AboutUs from "./pages/About";
import Blog from "./pages/Blog";
import { YearComparison } from "./pages/budgetPlaceholders";
import ContactUs from "./pages/Contact";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";
import Spendings from "./pages/Spendings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "comparison", Component: YearComparison },
      { path: "spendings", Component: Spendings },
      { path: "about-us", Component: AboutUs },
      { path: "blog", Component: Blog },
      { path: "contact-us", Component: ContactUs },
      { path: "*", Component: NotFound },
    ],
  },
]);