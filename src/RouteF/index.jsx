import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";
import { FloatButton } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import { Aboutus, Article, ArticleSingleView, BusinessListingPage, EndaPage, Faqs, ForgotPassword, Home, LoginPage, PrivacyPolicy, ProfileDashboard, SellBusinessCreate, SignupPage, SingleViewlisting } from "../pages";
import { Footer, Navbar, ScrollTop,Singlebusinessview } from "../components";
import { Termofuse } from "../pages";
import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const location = useLocation();
  const [showButton, setShowButton] = useState(false);
  const [ getcategory, setGetCategory ] = useState(null)

  const hideNavbarFooterOn = ['/login', '/signup']; // Add more paths here if needed
  const shouldHideNavbarFooter = hideNavbarFooterOn.includes(location.pathname);


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
    <>
      <ScrollTop />
      {!shouldHideNavbarFooter && <Navbar setGetCategory={setGetCategory} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/businesslisting' element={<BusinessListingPage getcategory={getcategory} />} />
        <Route path='/singleviewlisting/:id' element={<SingleViewlisting />} />
        <Route path='/singlebusinessview/:id' element={<Singlebusinessview />} />
        <Route path='/faq' element={<Faqs />} />
        <Route path='/termofuse' element={<Termofuse />} />
        <Route path='/article' element={<Article />} />
        <Route path='/articlesingleview/:id' element={<ArticleSingleView />} />
        <Route path='/about' element={<Aboutus />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgotpass' element={<ForgotPassword />} />
        <Route path='/privacypolicy' element={<PrivacyPolicy />} />
        <Route path='/endapage' element={<EndaPage />} />

        <Route
          path='/profiledashboard'
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/sellbusinesscreate'
          element={
            <ProtectedRoute>
              <SellBusinessCreate />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!shouldHideNavbarFooter && <Footer />}
      {showButton && !shouldHideNavbarFooter && (
        <FloatButton 
          icon={<UpOutlined className="fs-14" />}
          type="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ right: 24 }}
          
        />
      )}
    </>
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