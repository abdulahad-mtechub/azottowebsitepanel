import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BusinessListingPage, Home, SellBusinessCreate } from "../pages";
import { Footer, Navbar } from "../components";
const RouteF = () => {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/sellbusinesscreate' element={<SellBusinessCreate/>} />
          <Route path='/businesslisting' element={<BusinessListingPage/>} />
        </Routes>
        <Footer />
    </BrowserRouter>
  )
}

export {RouteF}