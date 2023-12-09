import React from 'react'
import { Images } from '../../Assets/AssetsLog'

const About = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-center">
     <div className="mb-5 md:mr-8">
      <div className="flex items-centers justify-center">
        <img
          src={Images.AboutImage}
          alt=""
          className=" shadow-lg rounded-xl w-[13rem] md:w-[18rem] "
        />
      </div>
    </div>
    <div className="mx-4 md:w-[35rem] mb">
      <h1 className="text-[#313155] text-4xl font-bold text-center mb-1 md:text-left ">
        Detail Description
      </h1>
      <div className="border-b-2 border-[#bcc1c9] mx-12 mb-5 md:mx-0 md:mr-32"></div>
      <p className="text-[#64748b] text-center md:text-left md:text-lg">
        Take control of your finances with our powerful finance app! Our
        user-friendly interface and robust features make it easy to track
        expenses, create budgets, and achieve your financial goals. Stay
        organized with expense categorization, receive bill payment reminders,
        and gain valuable insights into your spending habits. Connect your bank
        accounts for a complete financial overview and manage investments with
        confidence. Start making smarter financial decisions today with our
        comprehensive finance app
      </p>
    </div>
  </div>
  )
}

export default About