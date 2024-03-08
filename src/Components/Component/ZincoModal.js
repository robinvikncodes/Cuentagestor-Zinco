import { Box, Modal } from '@mui/material'
import React from 'react'

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // minWidth: 400,
    backgroundColor: "background.paper",
    borderRadius: "22px",
    boxShadow: 24,
    padding:  "0px",
    // border: "2px solid #000",
    // px: "26px",
    // py: "21px",
  };

const ZincoModal = (props) => {
    // const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
  
  return (
    <Modal
    open={props.open}
    onClose={() => props.handleClose()}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    sx={{
      "& .MuiBackdrop-root": {
        backdropFilter: props.is_blur ? "blur(4px)" : "none", // Adjust the blur value as needed
      },
    }}
  >
    <Box sx={style}>
        {props.children}
    </Box>
    </Modal>
  )
}

export default ZincoModal

// -------======== Values you always needs ========-------
// {/* <div className="px-[26px] py-[21px]"> */}
// open={open} handleClose={handleClose}