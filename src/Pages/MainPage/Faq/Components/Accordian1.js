import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

let accordinaData = [
  {
    tital:
      "Find the answers you're looking for to make the most of cuentagester?.",
    summary:
      "Find the answers you're looking for to make the most of cuentagester Find the answers you're looking for to make the most of cuentagester..",
  },

  {
    tital:
      "Find the answers you're looking for to make the most of cuentagester?.",
    summary: "Find the answers you're looking for to make the most of cuentagester Find the answers you're looking for to make the most of cuentagester.."
  },
  {
    tital:
      "Find the answers you're looking for to make the most of cuentagester?.",
    summary: "Find the answers you're looking for to make the most of cuentagester Find the answers you're looking for to make the most of cuentagester.."
  },

];

const Accordian1 = () => {
  return (
    <div>
        {accordinaData.map((i, key) => (
      <Accordion
        key={key + 1}
        sx={{
          backgroundColor: "#F0F9FF", // Background color
          borderRadius: "12px !important", // Border radius
          boxShadow: "none", // Box shadow
          margin: "20px 0px",
          padding: "10px 0px",
          border: "none",
          "&::before": {
            content: "none", // Remove the ::before content
          },
          "& .MuiAccordionSummary-content": {
            "&::before": {
              borderBottom: "none", // Remove the border bottom
            },
          },
        }}
      >
        <AccordionSummary
          
          sx={{
            backgroundColor: "#F0F9FF",
            borderRadius: "12px !important", // Background color for the summary header
            "&::before": {
              content: "none", // Remove the ::before content
            },
            "& .MuiSvgIcon-root": {
              // Styles for the expand icon
              color: "#0C8DFF", // Icon color
              margin: "auto 1px",
            },
          }}
          expandIcon={<ArrowDownwardIcon />}
          aria-controls={`panel${key + 1}a-content`}
          id={`panel${key + 1}a-header`}
        >
          <CircleIcon
            style={{
              color: "#5755F3",
              fontSize: "14px",
              marginRight: "15px",
            }}
          />
          <h2 className="font-azeret font-14 text-semibold">{i.tital}</h2>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "16px", // Padding for the details content
            "& .MuiAccordion-root::before": {
              height: "0px !important",
            },
          }}
        >
          <p className="font-azeret font-14 font-steelBlue">{i.summary}</p>
        </AccordionDetails>
      </Accordion>
      ))}
    </div>
  );
};

export default Accordian1;
