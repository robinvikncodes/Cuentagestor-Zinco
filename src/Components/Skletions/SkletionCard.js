import { Skeleton } from '@mui/material'
import React from 'react'

const SkletionCard = () => {
  return (
    <div
      className="bg-white flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] "
    >
      <div className="w-[44px] h-[3px] bg-[#D9D9D9] rounded-[20px] mb-3"></div>
      <p className="text-[10px] font-[400] w-3/4 ">
        <Skeleton variant="text" />
      </p>
      <div className=" rounded-[13px] my-[10px] inline-block ">
        {/* <img src={Icone.BankIcon} alt="" className="" /> */}
        <Skeleton variant="rounded" width={"34px"} height={"34px"} />
      </div>
      <p className=" text-[#15960A] text-[10px] font-[400] w-full">
        <Skeleton variant="text" width={"100%"} />
      </p>
    </div>
  )
}

export default SkletionCard