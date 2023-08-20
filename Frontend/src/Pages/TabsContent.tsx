import React, { useState } from "react";
import { Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Stack from "@mui/material/Stack";
import SignUp from "../components/signup";
import Login from "../components/login";

function MultiTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        color: "#fff",
        opacity: ".5",
        backgroundColor: "#000",
        width: "100%",
        marginTop: "5%",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "5px 0",
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <TabList
            aria-label="Tabs content"
            onChange={handleChange}
            centered
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab
              sx={{
                width: "50%",
                borderRadius: "6px",
                padding: "9px",
                color: "white",
                fontFamily: "Indie Flower, cursive",
                fontSize: "22px",
              }}
              label="Login"
              value="1"
              icon={<LoginIcon />}
              iconPosition="start"
            ></Tab>

            <Tab
              sx={{
                width: "50%",
                borderRadius: "6px",
                padding: "9px",
                color: "white",
                fontFamily: "Indie Flower, cursive",
                fontSize: "22px",
              }}
              label="SignUp"
              value="2"
              icon={<CreateIcon />}
              iconPosition="start"
            ></Tab>
          </TabList>
        </Box>
        <TabPanel value="1">
          <Login></Login>
        </TabPanel>
        <TabPanel value="2">
          <SignUp></SignUp>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default MultiTabs;
