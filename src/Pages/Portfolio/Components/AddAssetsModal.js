import React, { useEffect, useState } from "react";
import ZincoModal from "../../../Components/Component/ZincoModal";
import InputField from "../../UserCredentials/Components/InputField";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  Select,
  TextField,
} from "@mui/material";
import SearchField from "../../../Components/Component/SearchField";
import { Icone } from "../../../Assets/AssetsLog";
import styled from "@emotion/styled";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { listAccount } from "../../../Api/Accounts/AccountsApi";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { css } from "@emotion/react";
import { createAssets, updateAssets } from "../../../Api/Assets/AssetsApi";
import { openSnackbar } from "../../../features/snackbar";
import { useDispatch } from "react-redux";
import { BaseUrl } from "../../../globalVariable";

const userData = JSON.parse(localStorage.getItem("UserCredentials"));
let imgFile;

const selectStyles = css`
  &:focus {
    outline: none;
  }
  padding: 0;
`;

const AddAssetsModal = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [selectedValue, setSelectedValue] = useState("a");
  const [selectedImage, setSelectedImage] = useState([]);
  // const [imagePayLoad, setimagePayLoad] = useState({})


  const [assetDetails, setAssetDetails] = useState({
    pre_owned: false,
    from_account: "",
    as_on_date: new Date().toJSON().slice(0, 10),
    value: "",
    share: "",
  });

  const [submitData, setSubmitData] = useState({
    asset_name: "",
    date: new Date().toJSON().slice(0, 10),
    asset_type: 0,
    total_share: 0,
    total_value: 0,
    // asset_details: {},
    // address: {},
    // images: [],
  });
  const [address, setaddress] = useState({
    address_name: "",
    building_name: "",
    land_mark: "",
    state: "",
    pin_code: "",
  });

  const [assetImage, setAssetImage] = useState([]);
  const [editAssetImages, setEditAssetImages] = useState([])

  // const [age, setAge] = React.useState("");

  const clearState = function () {
    setSubmitData({
      asset_name: "",
      date: new Date().toJSON().slice(0, 10),
      asset_type: 0,
      total_share: 0,
      total_value: 0,
    });
    setAssetDetails({
      pre_owned: false,
      from_account: "",
      as_on_date: new Date().toJSON().slice(0, 10),
      value: "",
      share: "",
    });
    setaddress({
      address_name: "",
      building_name: "",
      land_mark: "",
      state: "",
      pin_code: "",
    });
    setAssetImage([])
  };

  const handleChangeSelect = (event) => {
    console.log(event.target.value);
    setSubmitData({ ...submitData, asset_type: event.target.value });
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleImageChange = (event) => {
    let newImages = [];
    let payloadImage = [];
    for (const file of event.target.files) {
      newImages = [URL.createObjectURL(file), ...newImages];
      payloadImage = [file, ...payloadImage];
    }
    setSelectedImage([...selectedImage, ...newImages]);
    setAssetImage([assetImage, ...payloadImage]);
  };

  const addImage = () => {
    const input = document.getElementById("imgInput");
    input.click();
  };

  const { isLoading, error, data } = useQuery(
    "account-list",
    () => {
      return listAccount({
        account_type: [1, 2],
      }).then((res) => {
        if (res.StatusCode === 6000) {
          return res;
        } else {
          // throw new Error('Unexpected status code');
          return [];
        }
      });
    },
    {
      onSuccess: (data) => {
        setAssetDetails({
          ...assetDetails,
          from_account: data.data[0]?.id,
        });
      },
    }
  );

  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return props.edit
        ? updateAssets({ ...newTodo })
        : createAssets({ ...newTodo });
    },
    onSuccess: (data) => {
      if (data.StatusCode !== 6000) {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: data.message,
            severity: "success",
          })
        );
        queryClient.invalidateQueries("assets-list");
        clearState();
        props.handleClose();
      }
    },
  });

  const submitAssets = () => {
    const payload = {
      ...submitData,
      asset_details: {
        ...assetDetails,
        value: submitData.value || assetDetails.value,
        share: submitData.share || assetDetails.share,
        // pre_owned: assetDetails.pre_owned ? "True" : "False",
        pre_owned: assetDetails.pre_owned,
      },
      address: address,
      images: assetImage,
    };

    if (props.edit) {
      payload.id = props.assetData?.data?.id;
      payload.asset_details = [
        ...props.assetData?.data?.asset_details,
      ];
      payload.address = {
        ...address,
        id: props.assetData?.data?.address[0].id,
      };
      // payload.assetPrevImg = props?.assetData?.data?.images
    }

    mutation.mutate(payload);
  };

  useEffect(() => {
    if (props.edit === true) {
      console.log(props.assetData.data);
      setSubmitData({
        asset_name: props.assetData?.data?.asset_name,
        date: props.assetData?.data?.date,
        asset_type: parseInt(props.assetData?.data?.asset_type),
        total_share: parseInt(props.assetData?.data?.total_share),
        total_value: parseInt(props.assetData?.data?.total_value),
      });
      setAssetDetails({
        pre_owned: props.assetData?.data?.asset_details[0]?.pre_owned,
        from_account: props.assetData?.data?.asset_details[0]?.from_account,
        as_on_date: props.assetData?.data?.asset_details[0]?.as_on_date,
        value: parseInt(props.assetData?.data?.asset_details[0]?.value),
        share: parseInt(props.assetData?.data?.asset_details[0]?.share),
      });
      setaddress({
        address_name: props.assetData?.data?.address[0]?.address_name,
        building_name: props.assetData?.data?.address[0]?.building_name,
        land_mark: props.assetData?.data?.address[0]?.land_mark,
        state: props.assetData?.data?.address[0]?.state,
        pin_code: props.assetData?.data?.address[0]?.pin_code,
      });
      
      setEditAssetImages(props.assetData?.data?.images)
      let fileList = []
      Promise.all(
        props.assetData?.data?.images.map((url, index) =>
          fetch(BaseUrl + url.image)
            .then((response) => response.blob())
            .then((blob) => {
              fileList.push(blob)
            })
        )
      ).then(async () => {
        console.log(assetImage);
        setAssetImage([...assetImage, ...fileList])
      });
    } else {
      clearState();
    }
  }, [props.edit, props.assetData]);

  return (
    <ZincoModal open={props.open} handleClose={props.handleClose}>
      <div className="border-b-[1px]">
        <p className="px-[26px] py-[21px] text-[16px] font-[400]">
          Add an Asset
        </p>
      </div>
      <div className="px-[26px] py-[21px] w-[450px] h-[75vh] overflow-y-scroll ">
        <div
          className={`w-full flex ${
            !selectedImage.length && "justify-center"
          } pb-5 overflow-x-auto`}
        >
          {selectedImage &&
            selectedImage.map((img, key) => (
              <img
                className="w-[142px] h-[142px] rounded-lg mr-2 "
                key={key + 1}
                src={img}
                alt="img"
              />
            ))}
          {props.edit && editAssetImages?.map((obj) => (
            <img
                className="w-[142px] h-[142px] rounded-lg mr-2 "
                key={obj.id}
                src={BaseUrl + obj?.image}
                alt="img"
              />
          ))}
          <div style={{ width: "142px" }}>
            <AddButton onClick={() => addImage()}>
              <img src={Icone.PurplePlus} alt="" className="" />
            </AddButton>
          </div>
          <input
            style={{ display: "none" }}
            name="photo"
            id="imgInput"
            type="file"
            accept="image/*"
            multiple={true}
            onChange={handleImageChange}
          />
        </div>
        <InputField
          placeholder={"Asset Name"}
          error={""}
          value={submitData.asset_name}
          onChange={(e) =>
            setSubmitData({ ...submitData, asset_name: e.target.value })
          }
        />
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            value={submitData.asset_type}
            input={<OutlinedInput />}
            onChange={handleChangeSelect}
            sx={selectStyles}
          >
            <MenuItem value={0}>Organization</MenuItem>
            <MenuItem value={1}>Building</MenuItem>
            <MenuItem value={2}>Land</MenuItem>
            <MenuItem value={3}>Share Market</MenuItem>
            <MenuItem value={4}>Rental building</MenuItem>
          </Select>
        </FormControl>
        <div className="flex justify-between">
          {/* <FormGroup>
            <FormControlLabel
              onClick={() =>
                setAssetDetails({
                  ...assetDetails,
                  pre_owned: !assetDetails.pre_owned,
                })
              }
              value={assetDetails.pre_owned}
              control={ */}
          <div className="flex items-center">
            <Checkbox
              checked={assetDetails.pre_owned}
              onClick={() =>
                setAssetDetails({
                  ...assetDetails,
                  pre_owned: !assetDetails.pre_owned,
                })
              }
              // value
              {...{ inputProps: { "aria-label": "Checkbox demo" } }}
              icon={<RadioButtonUncheckedIcon sx={{ color: "#7F52E8" }} />}
              checkedIcon={<RadioButtonCheckedIcon sx={{ color: "#7F52E8" }} />}
            />

            <p className="text-[14px] font-[400]">Pre owned</p>
          </div>

          <input
            type="date"
            value={assetDetails.as_on_date}
            onChange={(e) =>
              setAssetDetails({ ...assetDetails, as_on_date: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2 mb-2">
          <input
            type="number"
            className="border bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="Share %"
            value={assetDetails.share}
            onChange={(e) =>{
              e.target.value <= 100 && setSubmitData({...submitData, total_share: e.target.value})
              e.target.value <= 100 && setAssetDetails({ ...assetDetails, share: e.target.value })
            }}
          />
          <input
            type="number"
            className="border bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="Value"
            value={assetDetails.value}
            onChange={(e) =>{
              setSubmitData({...submitData, total_value: e.target.value})
              setAssetDetails({ ...assetDetails, value: e.target.value })
            }}
          />
        </div>
        <SearchField />

        {!assetDetails.pre_owned && (
          <>
            <p className="text-[17px] font-[500] my-3">Account</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {data?.data.slice(0, 7).map((data, key) => (
                <>
                  <div
                    key={key + 1}
                    style={{
                      backgroundColor:
                        data.id === assetDetails.from_account && "#F6F6F6",
                    }}
                    onClick={() => {
                      setAssetDetails({
                        ...assetDetails,
                        from_account: data.id,
                      });
                    }}
                    className="bg-white cursor-pointer flex flex-col justify-center items-center rounded-[15px] border-[1px] border-[#E7E7E7] p-[10px] py-4 "
                  >
                    {data.account_type === "2" ? (
                      <>
                        <p className="text-[#0150B1] text-[10px] font-[400]">
                          {data.account_name}
                        </p>
                        <div className="bg-[#E2EFFF] p-[10px] rounded-[13px] my-[5px] inline-block">
                          <img src={Icone.BankIcon} alt="" className="" />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-[#15960A] text-[10px] font-[400]">
                          {data.account_name}
                        </p>
                        <div className="bg-[#F1FFF0] p-[10px] rounded-[13px] my-[5px] inline-block">
                          <img
                            src={Icone.WalletGreenIcon}
                            alt=""
                            className=""
                          />
                        </div>{" "}
                      </>
                    )}
                    <p className="text-[10px] font-[400]">
                      {userData.country_details.currency_simbol} {data.balance}
                    </p>
                  </div>
                </>
              ))}
            </div>
          </>
        )}

        <div className="mt-5">
          <p className="text-[17px] font-[500] mb-2">Address</p>
          <input
            type="text"
            className="border w-full mb-2 bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="Building No/Name"
            value={address.building_name}
            onChange={(e) =>
              setaddress({
                ...address,
                building_name: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="border w-full mb-2 bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="Landmark"
            value={address.land_mark}
            onChange={(e) =>
              setaddress({
                ...address,
                land_mark: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="border w-full mb-2 bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="City"
            value={address.address_name}
            onChange={(e) =>
              setaddress({
                ...address,
                address_name: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="border w-full mb-2 bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="State/Province"
            value={address.state}
            onChange={(e) =>
              setaddress({
                ...address,
                state: e.target.value,
              })
            }
          />
          <input
            type="number"
            className="border w-full mb-2 bg-[#F3F7FC] p-[8px] text-[12px] rounded-md"
            placeholder="Postal code"
            value={address.pin_code}
            onChange={(e) =>
              setaddress({
                ...address,
                pin_code: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="flex justify-between items-center p-1 border-t">
        <IconButton onClick={() => props.handleClose()}>
          <img src={Icone.ClipIcon} alt="" />
        </IconButton>
        <IconButton
          onClick={() => {
            submitAssets();
          }}
        >
          <img src={Icone.CheckIcon} alt="" />
        </IconButton>
      </div>
    </ZincoModal>
  );
};

export default AddAssetsModal;

const AddButton = styled(Button)(() => ({
  width: "130px !important",
  height: "142px",
  fontSize: "15px",
  fontWeight: "500",
  color: "#7F52E8",
  backgroundColor: "#EFE8FF",
  borderRadius: "15px",
  border: "1px solid #E4E4E4",
  textTransform: "none",
}));
