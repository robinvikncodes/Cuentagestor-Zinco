import React from 'react'
import Header from '../../Components/Header/Header'
import LandingPage from './LandingPage/LandingPage'
import Features from './Feature/Features'
import Pricing from './Pricing/Pricing'
import Testmonies from './Testimonial/Testmonies'
import Contact from './Contact/Contact'
import Faq from './Faq/Faq'
import Footer from '../../Components/Footer/Footer'

const MainPage = () => {
  return (
    <>
    <Header/>
    <LandingPage />
    <Features />
    <Pricing />
    <Testmonies />
    <Contact/>
    <Faq />
    <Footer/>
    </>
  )
}

export default MainPage