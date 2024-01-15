import React, { useEffect, useState } from "react";
import ZincoModal from "../../Component/ZincoModal";
import AddButton from "../../Component/AddButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMutation, useQuery } from "react-query";
import { countryLists } from "../../../Api/UserCredentials/UserCredentialsApi";
import { Button, IconButton } from "@mui/material";
import {
  createCountry,
  defaultCountry,
  userCountryList,
} from "../../../Api/Countrys/countryesApi";
import { BaseUrl } from "../../../globalVariable";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));

const CountryModal = (props) => {
  // let allcountry =[]
  const [allcountry, setAllcountry] = useState({
    listCountry: [],
    defaultCountry: []
  })
  const dispatch = useDispatch()
  const [boolean, setBoolean] = useState(true);
  const [countryText, setCountryText] = useState({
    defaultCountry: "",
    listCountry: ""
  })
  const [countryObj, setcountryObj] = useState({});
  const [countryList, setcountryLists] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [defaultCountryList, setDefaultCountryList] = useState([]);

  const callCountryList = function () {
    userCountryList().then((res) => {
      setAllcountry({...allcountry, listCountry: res.data})
      console.log(res.data);
      setcountryLists(res.data);
    });
  };

  // const { isLoading, data } = useQuery(
  //   "country-list",
  //   () => {
  //     return countryLists();
  //   },
  //   {
  //     onSuccess: (res) => {
  //       console.log(res);
  //     },
  //   }
  // );

  // const { isLoading, error, data } = useQuery("country-list", () => {
  //   return countryLists();
  // });

  const {
    isLoading: defCouisLoding,
    error: defCouError,
    data: defCouData,
  } = useQuery("defaultCountry-list", () => userCountryList(), {
    onSuccess: (data) => {
      if (data.StatusCode === 6000) {
        setcountryLists(data.data);
        setAllcountry({...allcountry, listCountry: data.data})
      }
    },
    // staleTime: Infinity, // data will never go stale
    // cacheTime: Infinity,
  });

  const setcountryDefault = function (country) {
    setcountryObj(country.country);
    // localStorage.setItem("UserCredentials", JSON.stringify({...userData, country_details: country.country}))
    localStorage.setItem(
      "UserCredentials",
      JSON.stringify({
        ...userData,
        country_details: { ...country.country, id: country.id },
      })
    );
    defaultMutate.mutate({ id: country.id, is_default: true });
  };

  const defaultMutate = useMutation({
    mutationFn: (newData) => {
      return defaultCountry({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
      } else {
        // localStorage.setItem("UserCredentials", JSON.stringify({...userData, country_details: countryObj}))
        window.location.reload();
        // callCountryList()
      }
    },
  });
  
  const countryMutate = useMutation({
    mutationFn: (newData) => {
      return createCountry({ ...newData });
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.errors,
            severity: "success",
          })
        );
      } else {
        callCountryList();
        dispatch(
          openSnackbar({
            open: true,
            message: "Country added Successfully",
            severity: "success",
          })
        );
      }
    },
  });

  // useEffect(() => {
  //   callCountryList()
  // }, []);

  const setCountry = function (country) {
    countryMutate.mutate({ country });
  };

  const handlechangea = (e)=> {
    const {value}=e.target;
    // console.log(value,"0000000000000000-----====");
    if(value){
    let countryList = allcountry.listCountry.filter(j => e.target.value === "" || j.country.country_name.toLowerCase().includes(e.target.value.toLowerCase()))

    console.log(countryList, allcountry.listCountry);
    setcountryLists( countryList )
    }else{
      setcountryLists(allcountry.listCountry)  
    }
  };

  const handlechangeb = (e)=> {
    const {value}=e.target;
    console.log(value,"0000000000000000-----====");
    if(value){
    let countryList = allcountry.defaultCountry.filter(j => e.target.value === "" || j.country_name.toLowerCase().includes(e.target.value.toLowerCase()))

    // console.log(countryList, allcountry.defaultCountry);
    setDefaultCountryList( countryList )
    }else{
      setDefaultCountryList(allcountry.defaultCountry)
    }
  };
  // console.log(countryList);

  useEffect(() => {
    fetch(BaseUrl + "/api/v1/country/list-default-country/", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoading(false);
        console.log(res);
        if (res.StatusCode === 6000) {
          setDefaultCountryList(res.data);
          // console.log(res.data);
          // allcountry = res.data
          setAllcountry({...allcountry, defaultCountry: res.data})
        }
      });
  }, []);

  // useEffect(() => {
    
  //   let countryList = defaultCountryList.filter(j => countryText.listCountry === "" || j.country_name.toLowerCase().includes(countryText.listCountry.toLowerCase()))
  //   console.log(countryList, allcountry.defaultCountry);
  //   setDefaultCountryList(countryList.length ? countryList : allcountry.defaultCountry)
  // }, [countryText.listCountry])

  return (
    <ZincoModal
      // key={"Gopy"}
      open={props.open}
      handleClose={props.handleClose}
    >
      <div className="py-[21px] ">
        <div className="flex justify-between items-center px-[26px] pb-2">
          {!boolean ? (
            <div className="flex items-center">
              <IconButton
                aria-label="delete"
                color="error"
                sx={{ color: "#3634A8" }}
                onClick={() => setBoolean(true)}
              >
                <ArrowBackIcon />
              </IconButton>

              <p className="text-[16px] font-[400]">Add Country</p>
            </div>
          ) : (
            <>
              <p className="text-[16px] font-[400]">Country</p>
              <AddButton
                addbgcolor={"white"}
                onClick={() => setBoolean(false)}
              />
            </>
          )}
        </div>

        <div className="min-h-[450px] max-h-[570px] overflow-y-scroll">
          {boolean ? (
            <>
              <input
                type="text"
                placeholder="Search"
                className="px-6 py-4 w-full bg-[#EEEEEE]"
                onChange={e => handlechangea(e)}
              />
              {countryList.map((country, key) => (
                <Button
                  key={key + 1}
                  // variant="outlined"
                  sx={{
                    display: "block",
                    width: "100%",
                    textTransform: "none",
                    color: "#737373",
                    paddingY: "16px",
                    paddingX: "26px",
                    borderBottom: "1px solid #EEEEEE",
                    borderRadius: "0px",
                    fontSize: "14px",
                    textAlign: "left",
                  }}
                  onClick={() => setcountryDefault(country)}
                >
                  {country.country.country_name}
                </Button>
              ))}
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search"
                className="px-6 py-4 w-full bg-[#EEEEEE]"
                onChange={(e) => handlechangeb(e)}
              />
              {!isLoading &&
                defaultCountryList.map((country, key) => (
                  <Button
                    key={key + 1}
                    // variant="outlined"
                    sx={{
                      display: "block",
                      width: "100%",
                      textTransform: "none",
                      color: "#737373",
                      paddingY: "16px",
                      paddingX: "26px",
                      borderBottom: "1px solid #EEEEEE",
                      borderRadius: "0px",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                    onClick={() => setCountry(country.id)}
                  >
                    {country.country_name}
                  </Button>
                ))}
            </>
          )}
        </div>
        <div className="h-7"></div>
      </div>
    </ZincoModal>
  );
};

export default CountryModal;
