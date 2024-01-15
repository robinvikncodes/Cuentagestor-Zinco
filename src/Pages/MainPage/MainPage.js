import React, { useEffect } from 'react'
import Header from '../../Components/Header/Header'
import LandingPage from './LandingPage/LandingPage'
import Features from './Feature/Features'
import Pricing from './Pricing/Pricing'
import Testmonies from './Testimonial/Testmonies'
import Contact from './Contact/Contact'
import Faq from './Faq/Faq'
import Footer from '../../Components/Footer/Footer'

const MainPage = () => {
  useEffect(() => {
    document.getElementById("main").scrollIntoView();
  }, [])
  return (
    <>
    <Header/>
    <div id='main' className='h-4'></div>
    <LandingPage />
    <Features />
    {/* <Pricing /> */}
    <Testmonies />
    <Contact/>
    <Faq />
    <Footer/>
    </>
  )
}

export default MainPage