import React from 'react'
import Navbar from '../components/Navbar'
import Preloader from '../components/Preloader'
import CartOffcanvas from '../components/CartOffCanvas'
import SearchOffcanvas from '../components/SearchOffCanvas'
import Banner from '../components/Banner'
import ArrivedProduct from '../components/ArrivedProduct'
import Products from '../components/Products'
import Offers from '../components/Offers'

import ContactBanner from '../components/ContactBanner'
import Footer from '../components/Footer'
import Services from '../components/Services.jsx'
import AppBanner from '../components/AppBanner'



function Home() {
  return (
    <>
    <Preloader />
    <CartOffcanvas />
    <SearchOffcanvas />
    
    <Banner />
    <ArrivedProduct/>
    <Offers />
    <Products />

    <ContactBanner/>
    <Services/>
    <AppBanner/>
    
  

    </>
  )
}

export default Home