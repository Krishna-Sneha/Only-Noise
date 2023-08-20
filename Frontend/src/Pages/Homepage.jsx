import React, { useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import MultiTabs from "./TabsContent";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) history.push("/chats");
  }, [history]);

  return (
    <Container maxWidth="xs" style={{ margin: "auto" }}>
      <Box
        sx={{
          border: "1px solid #D3D3D3",
          color: "white",
          fontSize: "20px",
          background: "rgba(0,0,0,0.5)",
          width: "100%",
          marginTop: "5%",
          display: "flex",
          justifyContent: "center",
          borderRadius: "15px",
          padding: "5px 0",
        }}
      >
        <Typography
          variant="h6"
          fontSize={30}
          fontFamily="Tilt Prism, cursive"
          fontWeight={1000}
        >
          Only Noise
        </Typography>
      </Box>
      <MultiTabs></MultiTabs>
    </Container>
  );
}

export default Homepage;
