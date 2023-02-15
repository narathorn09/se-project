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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const RegisterOnwer = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage["token"]) {
      navigate("/");
    }
  }, [navigate]);

  const [memUsername, setMemUsername] = useState("");
  const [memPassword, setMemPassword] = useState("");
  const [con_password, setCon_password] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerLname, setOwnerLname] = useState("");
  const [ownerTel, setOwnerTel] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDetails, setStoreDetails] = useState("");
  const [storeReligion, setStoreReligion] = useState("");
  // const [errorEmail, setErrorEmail] = useState("");

  const [valid_form, setValid_form] = useState(true);
  const [checkalldata, setcheckalldata] = useState(true);
  const [showpass, setShowpass] = useState(false);
  const [showpasscon, setShowpasscon] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [nextSections, setNextSections] = useState(false);

  const ShowAlert = () => {
    setShowAlert(true);
  };

  const [usernameTaken, setUsernameTaken] = useState(false);
  const checkUsername = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/members-check-username?mem_username=${username.trim()}`
      );
      if (response.data.length > 0) {
        // console.log(response.data);
        setUsernameTaken(true);
      } else if (response.data.length === 0) {
        setUsernameTaken(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUsernameChange = (e) => {
    setMemUsername(e.target.value);
    checkUsername(e.target.value);
  };

  useEffect(() => {
    // setMemUsername("");
    // setMemPassword("");
    // setOwnerName("");
    // setOwnerLname("");
    // setOwnerTel("");
    // setOwnerEmail("");

    // if (ownerEmail.trim() === ''.trim()) {
    //   setErrorEmail(true);
    // } else {
    //   setErrorEmail(false);
    // }

    setValid_form(() => {
      if (
        (memUsername &&
          memPassword &&
          con_password &&
          ownerName &&
          ownerLname &&
          ownerTel &&
          ownerEmail) !== "" &&
        memPassword === con_password &&
        !usernameTaken
      ) {
        return false;
      } else {
        return true;
      }
    });
  }, [
    memUsername,
    memPassword,
    con_password,
    ownerName,
    ownerLname,
    ownerTel,
    ownerEmail,
    usernameTaken,
  ]);

  useEffect(() => {
    setcheckalldata(() => {
      if ((storeName && storeDetails && storeReligion) !== "") {
        return false;
      } else {
        return true;
      }
    });
  }, [
    storeName,
    storeDetails,
    storeReligion,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const Data = {
        mem_type: 1,
        mem_username: memUsername,
        mem_password: memPassword,
        owner_name: ownerName,
        ower_Lname: ownerLname,
        owner_tel: ownerTel,
        owner_email: ownerEmail,
        store_name: storeName,
        store_details: storeDetails,
        store_religion: storeReligion,
      };

      await axios.post("http://localhost:4000/register-ownerstore", Data);
      // alert("สมัครสมาชิกสำเร็จ"),
      ShowAlert();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      alert("พบข้อผิดพลาด");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Snackbar open={showAlert} autoHideDuration={1000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          สมัครสมาชิก สำเร็จ !
        </Alert>
      </Snackbar>

      {!nextSections && (
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
          <Typography component="h1" variant="h5">
            สมัครสมาชิก : เจ้าของร้าน
          </Typography>
          <Box
            // component="form"
            noValidate
            // onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="ชื่อจริง"
                  autoFocus
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="นามสกุล"
                  name="lastName"
                  autoComplete="family-name"
                  value={ownerLname}
                  onChange={(e) => setOwnerLname(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  // error={errorEmail !== ''}
                  // helperText={errorEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="เบอร์มือถือ"
                  name="phone"
                  autoComplete="phone"
                  value={ownerTel}
                  onChange={(e) => setOwnerTel(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="ชื่อผู้ใช้"
                  name="username"
                  autoComplete="username"
                  value={memUsername}
                  onChange={handleUsernameChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {memUsername && (
                          <div>
                            {usernameTaken ? (
                              <Typography sx={{ fontSize: 10, color: "red" }}>
                                <ClearIcon
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    marginRight: 0.3,
                                  }}
                                />
                                ชื่อผู้ใช้นี้ถูกใช้งานไปแล้ว
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: 10, color: "green" }}>
                                <CheckIcon
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    marginRight: 0.3,
                                  }}
                                />
                                ชื่อผู้ใช้สามารถใช้งานได้
                              </Typography>
                            )}
                          </div>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="รหัสผ่าน"
                  type={showpass ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={memPassword}
                  onChange={(e) => setMemPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setShowpass(!showpass);
                        }}
                      >
                        <IconButton>
                          {showpass ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="con_password"
                  label="ยืนยันรหัสผ่าน"
                  type={showpasscon ? "text" : "password"}
                  id="con_password"
                  autoComplete="new-con_password"
                  value={con_password}
                  onChange={(e) => setCon_password(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {memPassword && con_password && (
                          <div>
                            {memPassword === con_password ? (
                              <Typography sx={{ fontSize: 10, color: "green" }}>
                                <CheckIcon
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    marginRight: 0.3,
                                  }}
                                />
                                รหัสผ่านตรงกัน
                              </Typography>
                            ) : (
                              <Typography sx={{ fontSize: 10, color: "red" }}>
                                <ClearIcon
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    marginRight: 0.3,
                                  }}
                                />
                                รหัสไม่ผ่านตรงกัน
                              </Typography>
                            )}
                          </div>
                        )}
                        <IconButton
                          onClick={() => {
                            setShowpasscon(!showpasscon);
                          }}
                        >
                          {showpasscon ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              // type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={valid_form}
              onClick={() => setNextSections(true)}
            >
              ถัดไป
            </Button>

            <Grid container>
              <Grid item sx={{ flex: 1.97 }}>
                <Link href="/register" variant="body2">
                  ย้อนกลับ
                </Link>
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <Link href="/login" variant="body2">
                  คุณมีบัญชีผู้ใช้อยู่แล้ว?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
      {nextSections && (
        <>
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
            <Typography component="h1" variant="h5">
              กรอกข้อมูลร้านค้า
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name_store"
                    label="ชื่อร้าน"
                    name="name_store"
                    autoComplete="name_store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    // error={errorEmail !== ''}
                    // helperText={errorEmail}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="store_detail"
                    label="รายละเอียดร้าน"
                    name="store_detail"
                    autoComplete="store_detail"
                    value={storeDetails}
                    onChange={(e) => setStoreDetails(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* <TextField
                    required
                    fullWidth
                    id="username"
                    label="ชื่อผู้ใช้"
                    name="username"
                    autoComplete="username"
                    value={storeReligion}
                    onChange={(e) => setStoreReligion(e.target.value)}
                  > */}
                  <FormControl fullWidth>
                    <InputLabel id="religion">ศาสนา</InputLabel>
                    <Select
                      labelId="religion"
                      id="religion"
                      value={storeReligion}
                      label="ศาสนา"
                      onChange={(e) => setStoreReligion(e.target.value)}
                    >
                      <MenuItem value={"0"}>พุทธ</MenuItem>
                      <MenuItem value={"1"}>อิสลาม</MenuItem>
                    </Select>
                  </FormControl>
                  {/* </TextField> */}
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={checkalldata}
                onClick={() => setNextSections(true)}
              >
                สมัครสมาชิก
              </Button>

              <Grid container>
                <Grid item sx={{ flex: 1.97 }}>
                  <Link variant="body2" onClick={() => setNextSections(false)}>
                    ย้อนกลับ
                  </Link>
                </Grid>
                <Grid item sx={{ flex: 1 }}>
                  <Link href="/login" variant="body2">
                    คุณมีบัญชีผู้ใช้อยู่แล้ว?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default RegisterOnwer;
