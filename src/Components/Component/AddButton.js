import { IconButton } from '@mui/material'
import React from 'react'
import { Icone } from '../../Assets/AssetsLog'

const AddButton = (props) => {
  return (
    <IconButton {...props} sx={{
        backgroundColor: props.addbgcolor || "#F8F5FF"
    }}>
        <img src={Icone.PurplePlus} alt="" />
    </IconButton>
  )
}

export default AddButton