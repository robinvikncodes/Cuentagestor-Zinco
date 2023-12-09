import React from "react";

const ZincoTextField = (props) => {
 
  return (
    <>
      {props.label && (
        <label className="text-[12px] font-[400] mb-3">
          {props.label}
        </label>
      )}
      <input
        name={props.name || "ZincoField"}
        id={props.id}
        style={{
          width: props.width || "100%",
          height: props.height || "35px",
        }}
        placeholder={props.placeholder}
        type={props.type || "text"}
        className="border-[#E4E4E4] border-[1px] px-[11px] py-[9px] rounded-[8px] text-[11px] mb-3"
        {...props}
      />
    </>
  );
};

export default ZincoTextField;
