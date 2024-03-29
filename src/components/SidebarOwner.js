import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import Badge from "@mui/material/Badge";
import StoreIcon from "@mui/icons-material/Store";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CardProfile from "./Profile";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import Store from "./Store";
import { Link } from "react-router-dom";
import OrderOwner from "./OrderOwner";
import OrderConfirm from "./OrderConfirm";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FF0000",
    color: "#FF0000",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function SidebarOwner(prop) {
  let navigate = useNavigate();
  let { index } = prop;
  console.log(index);
  const tokensend = sessionStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${tokensend}`;

  useEffect(() => {
    if (!("token" in sessionStorage)) {
      navigate("/login");
    }
    // if (sessionStorage["token"] && localStorage["mem_type"] === "cust") {
    //   navigate("/cust/home");
    // }
    // if (sessionStorage["token"] && localStorage["mem_type"] === "owner") {
    //   navigate("/owner/home");
    // }
  }, [navigate]);

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [Focus, setFocus] = useState(index);

  const changeFocus = (index) => {
    setFocus(index);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  let order_fcust = localStorage.getItem("order_fcust");
  let order_con = localStorage.getItem("order_con");
  
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img
            style={{ clipPath: `circle(50%)` }}
            component="img"
            height="40"
            src={require(`../logofo.png`)}
            alt="logo"
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flex: 1,
              alignItems: "center",
              justifyContent: "end",
              marginLeft: "20px",
            }}
          >
            ระบบจองคิวสั่งอาหาร : เจ้าของร้าน
          </Typography>

          <Box
            component={Button}
            color="inherit"
            aria-label="logout"
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              navigate("/login");
            }}
          >
            <Typography variant="button" sx={{ flex: 1, marginRight: 1 }}>
              ออกจากระบบ
            </Typography>
            <LogoutIcon />
          </Box>
        </Toolbar>
      </AppBar>
      {/* <Router> */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            "ข้อมูลส่วนตัว",
            "หน้าแรก",
            "คำสั่งซื้อจากลูกค้า",
            "คำสั่งซื้อที่ยืนยันแล้ว",
          ].map((text, index) => (
            <Link
              key={text}
              to={(() => {
                if (text === "ข้อมูลส่วนตัว") {
                  return "/owner/profile";
                } else if (text === "หน้าแรก") {
                  return "/owner/home";
                } else if (text === "คำสั่งซื้อจากลูกค้า") {
                  return "/owner/order";
                } else if (text === "คำสั่งซื้อที่ยืนยันแล้ว") {
                  return "/owner/cooking";
                }
              })()}
              style={{ textDecoration: "none" }}
            >
              <ListItem
                onClick={() => changeFocus(index)}
                disablePadding
                sx={{
                  color: Focus === index ? "#EC6432" : "black",
                  // backgroundColor: Focus === index ? "black" : "white",
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: Focus === index ? "#EC6432" : "black",
                    }}
                  >
                    {(() => {
                      if (text === "ข้อมูลส่วนตัว") {
                        return <AccountCircleIcon />;
                      } else if (text === "หน้าแรก") {
                        return <StoreIcon />;
                      } else if (text === "คำสั่งซื้อจากลูกค้า") {
                        return <LibraryBooksIcon />;
                      } else if (text === "คำสั่งซื้อที่ยืนยันแล้ว") {
                        return <HourglassTopIcon />;
                      }
                    })()}
                    {order_fcust === "have" &&
                      text === "คำสั่งซื้อจากลูกค้า" && (
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        />
                      )}
                    {order_con === "have" &&
                      text === "คำสั่งซื้อที่ยืนยันแล้ว" && (
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        />
                      )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        {(() => {
          if (Focus === 0) {
            return <CardProfile />;
          } else if (Focus === 1) {
            return <Store />;
          } else if (Focus === 2) {
            return <OrderOwner />;
          } else if (Focus === 3) {
            return <OrderConfirm />;
          }
        })()}
      </Box>
      {/* </Router> */}
    </Box>
  );
}
