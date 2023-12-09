import React from 'react'
import ZincoModal from '../../Component/ZincoModal'
import AddButton from '../../Component/AddButton'

const CompanyModal = (props) => {
  return (
    <ZincoModal
    // key={"Soman"}
    open={props.open}
    handleClose={props.handleClose}
  >
    <div className="">
      <div className="flex justify-between items-center px-[26px] py-[21px]">
        <p className="text-[16px] font-[400]">Companies</p>
        <AddButton addbgcolor={"white"} />
      </div>
      <div className="">
        <input
          type="text"
          placeholder="Search"
          className="px-6 py-4 w-full bg-[#EEEEEE]"
        />
        {[
          "Fossa solution",
          "Jessy Foods",
          "Vikn codes",
          "Blueberry",
          "Sukhoi",
          "Boing",
          "Northrop Grumman",
        ].map((countryName, key) => (
          <p
            key={key + 1}
            className="px-6 py-4 bg-white border-b-[1px] text-[14px] text-[#737373] font-[400]"
          >
            {countryName}
          </p>
        ))}
      </div>
      <div className="h-7"></div>
    </div>
  </ZincoModal>
  )
}

export default CompanyModal