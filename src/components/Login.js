import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

const tokensend = sessionStorage.getItem("token");
axios.defaults.headers.common["Authorization"] = `Bearer ${tokensend}`;

export default function Login() {
  let navigate = useNavigate();

  // const [memType, setMemType] = useState("");
  const [memUsername, setMemUsername] = useState("");
  const [memPassword, setMemPassword] = useState("");
  // const [usernameTaken, setUsernameTaken] = useState(false);
  // const [validtoken, setValidToken] = useState(false);

  useEffect(() => {
    if (sessionStorage["token"] && localStorage["mem_type"] === "cust") {
      navigate("/cust");
    }
    if (sessionStorage["token"] && localStorage["mem_type"] === "owner") {
      navigate("/owner");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (memUsername.trim() === "" || memPassword.trim() === "") {
      alert("โปรดกรอกข้อมูลเพื่อเข้าสู่ระบบ");
      return;
    }
    const response = await axios.get(
      `http://localhost:4000/members-check-username?mem_username=${memUsername.trim()}`
    );
    if (response.data.length === 0) {
      alert("ชื่อผู้ใช้ไม่ถูกต้อง");
      return;
    }

    try {
      const Data = {
        mem_username: memUsername,
        mem_password: memPassword,
      };
      // dotenv.config();
      // let api_root = process.env.REACT_APP_API_ROOT;
      // let login_path = api_root + "/login";
      // console.log(login_path);

      await axios.post("http://localhost:4000/login", Data).then((res) => {
        if (res.data.token) {
          // alert("เข้าสู่ระบบสำเร็จ");
          sessionStorage.setItem("token", res.data.token);
          axios
            .post("http://localhost:4000/members-check-memtype", {
              mem_username: memUsername,
            })
            .then((res) => {
              const type = res.data[0].mem_type;
              if (type === "0") {
                localStorage.setItem("mem_type", "cust");
                navigate("/cust");
              }
              if (type === "1") {
                localStorage.setItem("mem_type", "owner");
                navigate("/owner");
              }
            });
        } else {
          console.log(res.data.token);
          alert("รหัสผ่านไม่ถูกต้อง");
        }
      });
    } catch (error) {
      console.log(error);
      alert("เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">หน้าเข้าสู่ระบบ</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="ชื่อผู้ใช้"
              name="username"
              autoComplete="username"
              autoFocus
              value={memUsername}
              onChange={(e) => setMemUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type="password"
              id="password"
              autoComplete="current-password"
              value={memPassword}
              onChange={(e) => setMemPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  คุณยังไม่มีบัญชีสมาชิก? กดเพื่อสมัคร
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
