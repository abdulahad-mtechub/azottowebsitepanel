import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Aboutus, Article, ArticleSingleView, BusinessListingPage, Faqs, Home, SellBusinessCreate, SingleViewlisting } from "../pages";
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
        </Routes>
        <Footer />
    </BrowserRouter>
  )
}

export {RouteF}