import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Button,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Cart() {
  if (!localStorage["cart"]) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  const [dataInCart, setdataInCart] = useState([]);
  const [dataConfirm, setdataConfirm] = useState([]);

  let cart = JSON.parse(localStorage.getItem("cart"));

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (Array.isArray(parsedCart)) {
        setdataInCart(parsedCart);
      }
    }
  }, []);

  const deleteItems = (id, type) => {
    const cartItems = JSON.parse(localStorage.getItem("cart"));
    const updatedCart = cartItems.filter(
      (item) => !(item.menu_id === id && item.menu_type === type)
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setdataInCart(updatedCart);
    if (JSON.parse(localStorage.getItem("cart")).length === 0) {
      window.location.reload();
    }
  };

  let totalPrice = 0;
  dataInCart.forEach((item) => {
    totalPrice += item.menu_price * item.menu_num;
  });

  const OrderConfirm = async () => {
   await axios
      .post("http://localhost:4000/cust-order", dataInCart, {
        params: {
          total_price: totalPrice,
        },
      })
      .then((response) => {
        localStorage.removeItem("cart")
        window.location.reload()
        alert("ยืนยันคำสั่งซื้อสำเร็จ")
        console.log(response.data);
      });
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Grid container columnGap={2}>
        <Grid item xs={8}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ชื่อร้าน</StyledTableCell>
                  <StyledTableCell align="center">รูปเมนู</StyledTableCell>
                  <StyledTableCell align="left">ชื่อเมนู</StyledTableCell>
                  <StyledTableCell align="center">ราคา</StyledTableCell>
                  <StyledTableCell align="center">จำนวน</StyledTableCell>
                  <StyledTableCell align="center">ภาชนะ</StyledTableCell>
                  <StyledTableCell align="center">ลบ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataInCart.map((row, index) => {
                  return (
                    <StyledTableRow key={row.store_id + index}>
                      <StyledTableCell component="th" scope="row">
                        {row.store_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <img
                          sx={{ padding: 1 }}
                          component="img"
                          width="100"
                          height="100"
                          src={require(`../../uploads/${row.menu_photo}`)}
                          alt="food menu"
                        />{" "}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.menu_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.menu_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.menu_num}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.menu_type === "dish" ? "จาน" : "ห่อ"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton
                          onClick={() =>
                            deleteItems(row.menu_id, row.menu_type)
                          }
                        >
                          <DeleteIcon sx={{ fontSize: 29 }} color="error" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
                {cart.length === 0 && (
                  <Container>
                    <p>ไม่มีสินค้าในรถเข็น</p>
                  </Container>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={3.7}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">
                    ราคารวมทั้งหมด
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    <Grid container rowGap={2}>
                      <Grid item xs={12}>
                        <Typography variant="h4" sx={{ textAlign: "center" }}>
                          {totalPrice.toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          sx={{ width: "100%" }}
                          variant="contained"
                          color="success"
                          onClick={() => OrderConfirm()}
                        >
                          ยินยันคำสั่งซื้อ
                        </Button>
                      </Grid>
                    </Grid>
                  </StyledTableCell>
                </StyledTableRow>
                {/* {cart.length === 0 && (
                  <Container>
                    <p>ไม่มีสินค้าในรถเข็น</p>
                  </Container>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
