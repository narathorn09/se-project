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
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import KeyIcon from "@mui/icons-material/Key";

const RegisterOnwer = () => {
  let navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage["token"] && localStorage["mem_type"] === "cust") {
      navigate("/cust/home");
    }
    if (sessionStorage["token"] && localStorage["mem_type"] === "owner") {
      navigate("/owner/home");
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
  const [emailError, setEmailError] = useState("");

  const [valid_form, setValid_form] = useState(true);
  const [checkalldata, setcheckalldata] = useState(true);
  const [showpass, setShowpass] = useState(false);
  const [showpasscon, setShowpasscon] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

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

  const nextSec = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(ownerEmail)) {
      setEmailError("?????????????????????????????????????????????????????????????????????????????????????????????");
      return;
    } else {
      setNextSections(true);
    }
  };

  useEffect(() => {
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
        !usernameTaken &&
        !passwordError
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
    passwordError,
  ]);

  useEffect(() => {
    setcheckalldata(() => {
      if ((storeName && storeDetails && storeReligion) !== "") {
        return false;
      } else {
        return true;
      }
    });
  }, [storeName, storeDetails, storeReligion]);

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
      // alert("???????????????????????????????????????????????????"),
      ShowAlert();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      alert("????????????????????????????????????");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Snackbar open={showAlert} autoHideDuration={1000}>
        <Alert severity="success" sx={{ width: "100%" }}>
          ????????????????????????????????? ?????????????????? !
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
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ????????????????????????????????? : ?????????????????????????????????
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
                  label="????????????????????????"
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
                  label="?????????????????????"
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
                  onChange={(e) => {
                    setOwnerEmail(e.target.value);
                    setEmailError("");
                  }}
                  error={!!emailError}
                  helperText={emailError}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="tel"
                  required
                  fullWidth
                  id="phone"
                  label="?????????????????????????????????"
                  name="phone"
                  autoComplete="phone"
                  value={ownerTel}
                  onChange={(e) => {
                    const input = e.target.value;
                    const onlyNums = input.replace(/[^0-9]/g, "");
                    if (onlyNums.length <= 10) {
                      setOwnerTel(onlyNums);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIphoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="??????????????????????????????"
                  name="username"
                  autoComplete="username"
                  value={memUsername}
                  onChange={handleUsernameChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
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
                                ????????????????????????????????????????????????????????????????????????????????????
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
                                ???????????????????????????????????????????????????????????????????????????
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
                  label="????????????????????????"
                  type={showpass ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={memPassword}
                  onChange={(e) => {
                    const password = e.target.value;
                    if (password.length < 6) {
                      setPasswordError(true);
                    } else {
                      setPasswordError(false);
                    }
                    setMemPassword(password);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
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
                  inputProps={{
                    maxLength: 10,
                  }}
                  error={passwordError}
                  FormHelperTextProps={{
                    sx: { color: "red" },
                  }}
                  helperText={
                    passwordError && "????????????????????????????????????????????????????????????????????? 6 ????????????????????????"
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="con_password"
                  label="??????????????????????????????????????????"
                  type={showpasscon ? "text" : "password"}
                  id="con_password"
                  autoComplete="new-con_password"
                  value={con_password}
                  onChange={(e) => setCon_password(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
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
                                ??????????????????????????????????????????
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
                                ???????????????????????????????????????????????????
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
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={valid_form}
              onClick={() => nextSec()}
            >
              ???????????????
            </Button>

            <Grid container>
              <Grid item sx={{ flex: 1.97 }}>
                <Link href="/register" variant="body2">
                  ????????????????????????
                </Link>
              </Grid>
              <Grid item sx={{ flex: 1 }}>
                <Link href="/login" variant="body2">
                  ?????????????????????????????????????????????????????????????????????????
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
              ???????????????????????????????????????
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
                    label="????????????????????????"
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
                    multiline
                    rows={4}
                    required
                    fullWidth
                    id="store_detail"
                    label="??????????????????????????????????????????"
                    name="store_detail"
                    autoComplete="store_detail"
                    value={storeDetails}
                    onChange={(e) => setStoreDetails(e.target.value)}
                    inputProps={{
                      component: Typography,
                      variant: "body1",
                      wrap: "hard",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="religion">???????????????</InputLabel>
                    <Select
                      labelId="religion"
                      id="religion"
                      value={storeReligion}
                      label="???????????????"
                      onChange={(e) => setStoreReligion(e.target.value)}
                    >
                      <MenuItem value={"0"}>????????????</MenuItem>
                      <MenuItem value={"1"}>??????????????????</MenuItem>
                    </Select>
                  </FormControl>
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
                ?????????????????????????????????
              </Button>

              <Grid container>
                <Grid item sx={{ flex: 1.97 }}>
                  <Link variant="body2" onClick={() => setNextSections(false)}>
                    ????????????????????????
                  </Link>
                </Grid>
                <Grid item sx={{ flex: 1 }}>
                  <Link href="/login" variant="body2">
                    ?????????????????????????????????????????????????????????????????????????
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
