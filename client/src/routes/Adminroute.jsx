import React from 'react'
import HeaderBar from "../layout/HeaderBar";
import SideBar from "../layout/SideBar";
import { CssBaseline, Box } from "@mui/material";
const Adminroute = ({children}) => {
  return (
    <div className="app">
        <SideBar />
        <main className="content">
          <HeaderBar />
          <div className="content_body">
            <Box m="20px">{children}</Box>
          </div>
        </main>
      </div>
  )
}

export default Adminroute