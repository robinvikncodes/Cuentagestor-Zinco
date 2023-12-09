import React, { useEffect, useState } from "react";
import { Icone, Images } from "../../../Assets/AssetsLog";
// import { Icone, Images } from "../../Asset/AssetsLog";

const featureData = [
  {
    image: () => (
      <>
        <img className="absolute mx-auto " src={Images.featureImage} alt="" />
        <img className="absolute bottom-[-2rem] right-12" src={Images.SummarySlice} alt="" />
        <img className="absolute top-16 right-20" src={Images.Avtar3} alt="" />
        <img className="absolute top-44 left-[-1rem]" src={Images.Avtar2} alt="" />
        <img className="absolute bottom-36 right-20" src={Images.Avtar1} alt="" />
      </>
    ),
    title: "Track Money Exchanges",
    desc: "Effortlessly track financial transactions with Cuentagester to stay informed.",
  },
  {
    image: () => (
      <>
        <img src={Images.ExpensesSclice} alt="" />
        <img className="absolute bottom-[-40px]" src={Images.IncomSclice} alt="" />
        <img className="absolute bottom-14 right-20" src={Icone.IncomeIcone} alt="" />
        <img className="absolute top-28 left-[-30px]" src={Icone.ExpensesIcone} alt="" />
      </>
    ),
    title: "Track Income and Expenses",
    desc: "Easily manage your finances with Cuentagester for informed decisions.",
  },
  {
    image: () => (
      <>
        <img src={Images.LoanSlice} alt="" />
        <img className="absolute bottom-[-0.5rem] left-[-3.5rem]" src={Images.tookImage} alt="" />
        <img className="absolute top-52 right-24" src={Icone.LoanIcon} alt="" />
        <img className="absolute top-16 left-[-18px]" src={Icone.LoanIcon} alt="" />
      </>
    ),
    title: "Track Loan Payments",
    desc: "Cuentagester ensures you never miss a loan payment with its user-friendly tracking feature.",
  },
  {
    image: () => (
      <>
        <img src={Images.TransferSclice} alt="" />
        <img className="absolute bottom-[-1rem] left-[-3.5rem]" src={Images.transferListImage} alt="" />
        <img className="absolute top-52 right-24" src={Icone.BankIcone} alt="" />
        <img className="absolute top-16 left-[-18px]" src={Icone.BankIcone} alt="" />
      </>
    ),
    title: "Bank Transfers",
    desc: "Streamline your banking tasks effortlessly with Cuentagester.",
  },
  {
    image: () => (
      <><img src={Images.AssetSlice} alt="" />
      <img className="absolute bottom-[-1rem] left-[-3.5rem]" src={Images.transferListImage} alt="" />
      <img className="absolute top-16 right-24" src={Icone.AssetIcon1} alt="" />
      <img className="absolute top-52 left-[-18px]" src={Icone.AssetIcon2} alt="" /></>
    ),
    title: "Asset Management",
    desc: "Get a comprehensive view of your financial portfolio by tracking investments and assets in one place.",
  },
];

const Features = () => {
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    document.getElementById("features").scrollIntoView({behavior: "smooth"})
  }, [])
  
  return (
    <div id="features" className="bg-[#141D2E] rounded-[30px] py-14 px-8 mb-[-60px] relative z-30">
      <div className="mb-3">
        <h1 className="text-[#9280FF] text-[31px] md:text-[32px] lg:text-[36px] font-[500] text-center leading-8 tracking-tighter">
          Powerful Features for
        </h1>
        <h2 className="text-[#9280FF] text-[33px] md:text-[42px] lg:text-[51px] font-[700] text-center leading-8 md:leading-9 lg:leading-10 tracking-tighter">
          Total Financial Control.
        </h2>
      </div>

      <p className="text-[#DEDEDE] text-center text-sm md:text-[16px] lg:text-[18px] font-normal mb-8">
        Discover how centagester simplifies financial{" "}
        <br className="lg:hidden" /> management for you.
      </p>

      {/* Mobile Curosel */}
      <div className="cursole lg:hidden">
        <div className="carousel flex justify-center mb-12">
          <img src={Images.featureImage} alt="" />
        </div>

        <div>
          <h1 className="text-white text-[18px] font-[600] text-center">
            Track Money Exchanges
          </h1>
          <p className="text-white text-[14px] font-[400] text-center ">
            Effortlessly track financial transactions with <br /> Cuentagester
            to stay informed.
          </p>
        </div>
      </div>

      {/* Desktop Curosel */}
      <div className="hidden xl:block">
        {/* <div className="ImagesContents">
          <img src="" alt="" />
        </div> */}

        <div className="features flex justify-between">
          <div className="w-full flex justify-center">
          <div className="Images w-[379px] h-[564px] relative ">
            {/* <img src={Images.AssetSlice} alt="" />
            <img className="absolute bottom-[-1rem] left-[-3.5rem]" src={Images.transferListImage} alt="" />
            <img className="absolute top-16 right-24" src={Icone.AssetIcon1} alt="" />
            <img className="absolute top-52 left-[-18px]" src={Icone.AssetIcon2} alt="" /> */}
            {featureData[selected].image()}
          </div>
          </div>
          <div className="Features min-w-[680px] max-w-[750px] ">
            {featureData.map((data, i) => (
              <div className="mb-11 flex cursor-pointer" onMouseEnter={() => setSelected(i)} onMouseLeave={() => setSelected(0)}>
                <div className="mr-3 w-9 h-9 flex items-center justify-center">
                  <div className={i === selected ? "firstdoteActive" : "firstdote"}>
                    <div
                      className={i === selected ? "secondDoteActive" : "secondDote"}
                    >
                      <div
                        className={i === selected ? "thirdDoteActive" : "thirdDote"}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <h2 className="text-white text-[22px] font-[600]">
                    {data.title}
                  </h2>
                  <p className="text-[#A7AAAE] text-[16px] font-[400]">
                    {data.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
