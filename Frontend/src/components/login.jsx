import React, { useState } from "react";
import { Box, Tab, Button } from "@mui/material";
import { FormControl, FormLabel, FormGroup } from "@mui/material";
import { Input, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { config } from "dotenv";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import CustomizableSnackbar from "./chatPageComponents/CustomizableSnackbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showP, setShowP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick_P = () => setShowP(!showP);

  const history = useHistory();
  const { setUser } = ChatState();

  const [open, setOpen] = useState(false);

  const submitForm = async () => {
    if (!email || !password) {
      alert("email or password missing!");
      setLoading(false);
      return;
    } else {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:7000/api/user/login",
          { email, password },
          config
        );
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));

        setOpen(true);
        setLoading(false);
      } catch (error) {
        alert("error while logging");
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <Stack spacing={2} direction="column">
      <FormControl id="email" required>
        <input
          style={{
            border: "1px solid #D3D3D3",
            borderRadius: "4px",
            padding: "9px",
            color: "white",
            fontSize: "20px",
            background: "rgba(0,0,0,0.5)",
          }}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" required>
        <Stack direction="row">
          <input
            style={{
              border: "1px solid #D3D3D3",
              borderRadius: "4px",
              padding: "9px",
              color: "white",
              fontSize: "20px",
              background: "rgba(0,0,0,0.5)",
            }}
            type={showP ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            defaultValue={false}
          />
          <Button
            size="small"
            onClick={handleClick_P}
            style={{ color: "white" }}
          >
            {showP ? "hide" : "show"}
          </Button>
        </Stack>
      </FormControl>
      <Button
        color="secondary"
        variant="contained"
        onClick={submitForm}
        fullWidth
        sx={{
          fontFamily: "Indie Flower, cursive",
          fontSize: "18px",
        }}
      >
        Login
      </Button>
      <Button
        color="error"
        variant="contained"
        onClick={() => {
          setEmail("guest_user@example.com"), setPassword("123456");
        }}
        fullWidth
        sx={{
          fontFamily: "Indie Flower, cursive",
          fontSize: "18px",
        }}
      >
        Get Guest user credentials
      </Button>
      <CustomizableSnackbar open={open} message="Login Successful!" />
    </Stack>
  );
}

export default Login;
