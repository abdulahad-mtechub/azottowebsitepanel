import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Aboutus, Article, ArticleSingleView, BusinessListingPage, Faqs, ForgotPassword, Home, LoginPage, SellBusinessCreate, SignupPage, SingleViewlisting } from "../pages";
import { Footer, Navbar, ScrollTop } from "../components";
import { Termofuse } from "../pages";

const RouteF = () => {
  return (
    <BrowserRouter>
        <ScrollTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/sellbusinesscreate' element={<SellBusinessCreate/>} />
          <Route path='/businesslisting' element={<BusinessListingPage/>} />
          <Route path='/singleviewlisting/:id' element={<SingleViewlisting/>} />
          <Route path='/faq' element={<Faqs/>} />
          <Route path='/termofuse' element={<Termofuse/>} />
          <Route path='/article' element={<Article/>} />
          <Route path='/articlesingleview/:id' element={<ArticleSingleView/>} />
          <Route path='/about' element={<Aboutus/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forgotpass' element={<ForgotPassword />} />
        </Routes>
        <Footer />
    </BrowserRouter>
  )
}

export {RouteF}