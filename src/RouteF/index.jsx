import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FloatButton } from "antd";
import { UpOutlined } from "@ant-design/icons";
import {
  VehicleListingPage,
  ForgotPassword,
  Home,
  LoginPage,
  ProfileDashboard,
  SellVinCreate,
  SignupPage,
  SingleViewlisting,
} from "../pages";
import { Footer, Navbar, ScrollTop, SingleVehicleView} from "../components";
import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { PrivyLoginPage } from "../pages/PrivyLogin";

const AppRoutes = () => {
  const location = useLocation();
  const [showButton, setShowButton] = useState(false);
  const [getcategory, setGetCategory] = useState(null);

  const hideNavbarFooterOn = ["/login", "/signup", "/forgotpass"];
  const shouldHideNavbarFooter = hideNavbarFooterOn.includes(location.pathname);
  const hidescrolltotop = location.pathname.startsWith("/singleviewlisting/");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <ScrollTop />
      {!shouldHideNavbarFooter && <Navbar setGetCategory={setGetCategory} />}

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/businesslisting"
            element={<VehicleListingPage getcategory={getcategory} />}
          />
          <Route
            path="/singleviewlisting/:id"
            element={<SingleViewlisting />}
          />
          <Route
            path="/singlevehicleview/:id"
            element={<SingleVehicleView />}
          />
          {/* Public routes - redirect to home if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/loginprivy"
            element={
              <PublicRoute>
                <PrivyLoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgotpass"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/profiledashboard"
            element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sellvincreate"
            element={
              <ProtectedRoute>
                <SellVinCreate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!shouldHideNavbarFooter && <Footer />}
      {showButton && !shouldHideNavbarFooter && !hidescrolltotop && (
        <FloatButton
          icon={<UpOutlined className="fs-14" />}
          type="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      )}
    </div>
  );
};

const RouteF = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export { RouteF };
