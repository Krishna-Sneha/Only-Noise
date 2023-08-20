import React, { useState } from "react";
import { Box, Tab, Button, SnackbarContent } from "@mui/material";
import { FormControl, FormLabel, FormGroup } from "@mui/material";
import { Input, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { LoadingButton } from "@mui/lab";
import { toast, Toaster } from "react-hot-toast";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import CustomizableSnackbar from "./chatPageComponents/CustomizableSnackbar";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dp, setDp] = useState("");

  const [showP, setShowP] = useState(false);
  const [showCP, setShowCP] = useState(false);

  const handleClick_P = () => setShowP(!showP);
  const handleClick_CP = () => setShowCP(!showCP);

  const [loading, setLoading] = useState(false);
  const [dpFlag, setDpFlag] = useState(false);
  const history = useHistory();
  const { setUser } = ChatState();
  const [open, setOpen] = useState(false);

  const postDetails = async (dp) => {
    setLoading(true);
    if (dp === undefined) {
      toast("Here is your toast.", { duration: 5000 });
      return;
    }

    if (dp.type === "image/jpeg" || dp.type === "image/png") {
      // async () => notify();
      setDpFlag(true);
      toast("Image success!", { duration: 5000 });
      const data = new FormData();
      data.append("file", dp);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "ds8gi3w5c");
      await fetch("https://api.cloudinary.com/v1_1/ds8gi3w5c/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((dataFromAPI) => {
          setDp(dataFromAPI.url.toString());
          // console.log("img:" + dataFromAPI.url.toString());
          setDpFlag(false);
          setLoading(false);
        })
        .catch((err) => console.log(err), setLoading(false));
    } else {
      console.log("wrongfile");
      toast("Please select an image!", { duration: 5000 });
      setLoading(false);
    }
  };

  const submitForm = async () => {
    setLoading(true);
    console.log(dp);
    if (!name || !email || !password || !confirmPassword) {
      alert("all details not filled! warning");
      setLoading(false);
      return;
    } else if (password != confirmPassword) {
      alert("password and confirm pwd does not match!");
      setLoading(false);
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const { data } = await axios.post(
          "http://localhost:7000/api/user",
          { name, email, password, dp },
          config
        );

        setUser(data);
        setOpen(true);
        setLoading(false);
        localStorage.setItem("userInfo", JSON.stringify(data));
        // history.push("/chats");
      } catch (error) {
        alert("error occurred!");
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <Stack spacing={2} direction="column">
      <FormControl id="name" required>
        <input
          style={{
            border: "1px solid #D3D3D3",
            borderRadius: "4px",
            padding: "9px",
            color: "white",
            fontSize: "20px",
            background: "rgba(0,0,0,0.5)",
          }}
          placeholder="Enter your name"
          value={name}
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

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
          name="email"
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
            name="password"
            type={showP ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            defaultValue={false}
          />
          <Button
            size="small"
            onClick={handleClick_P}
            style={{
              color: "white",
              fontFamily: "Indie Flower, cursive",
              fontSize: "16px",
            }}
          >
            {showP ? "hide" : "show"}
          </Button>
        </Stack>
      </FormControl>

      <FormControl id="confirmPassword" required>
        <Stack direction="row">
          <input
            style={{
              border: "1px solid #D3D3D3",
              borderRadius: "4px",
              padding: "9px",
              color: "white",
              background: "rgba(0,0,0,0.5)",
              fontFamily: "Indie Flower, cursive",
              fontSize: "20px",
            }}
            type={showCP ? "text" : "password"}
            name="password"
            placeholder="Renter password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            size="small"
            onClick={handleClick_CP}
            style={{ color: "white" }}
          >
            {showCP ? "hide" : "show"}
          </Button>
        </Stack>
      </FormControl>

      <FormControl id="dp">
        <input
          style={{
            border: "1px solid #D3D3D3",
            borderRadius: "4px",
            padding: "9px",
            color: "gray",
            fontSize: "20px",
            fontFamily: "Indie Flower, cursive",
          }}
          color="secondary"
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && postDetails(e.target.files[0])}
        />
      </FormControl>

      <LoadingButton
        size="small"
        loading={dpFlag}
        color="secondary"
        variant="contained"
        onClick={submitForm}
        fullWidth
        sx={{
          fontFamily: "Indie Flower, cursive",
          fontSize: "18px",
        }}
      >
        SignUp
      </LoadingButton>
      <CustomizableSnackbar open={open} message="Signed up Successfully!" />
    </Stack>
  );
}

export default SignUp;
