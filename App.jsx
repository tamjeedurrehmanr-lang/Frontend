import { createBrowserRouter } from "react-router-dom";
import About from "./About.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminLogin from "./AdminLogin.jsx";
import BuyCar from "./BuyCar.jsx";
import CarDetails from "./CarDetails.jsx";
import CarHubBuyerLogin from "./CarHubBuyerLogin.jsx";
import CarHubSellerLogin from "./CarHubSellerLogin.jsx";
import EditCarListing from "./EditCarListing.jsx";
import Home from "./Home.jsx";
import MakeOffer from "./MakeOffer.jsx";
import Profile from "./Profile.jsx";
import Register from "./Register.jsx";
import ReportAd from "./ReportAd.jsx";
import SellYourCar from "./SellYourCar.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/buycar", element: <BuyCar /> },
  { path: "/sellyourcar", element: <SellYourCar /> },
  { path: "/adminlogin", element: <AdminLogin /> },
  { path: "/buyerlogin", element: <CarHubBuyerLogin /> },
  { path: "/admindashboard", element: <AdminDashboard /> },
  { path: "/sellerlogin", element: <CarHubSellerLogin /> },
  { path: "/about", element: <About /> },
  { path: "/makeoffer", element: <MakeOffer /> },
  { path: "/reportad", element: <ReportAd /> },
  { path: "/editcarlisting", element: <EditCarListing /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/cardetails", element: <CarDetails /> },
  { path: "/cardetails/:carId", element: <CarDetails /> },
]);
