import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CardMedia, Container } from "@mui/material";

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
  const [dataInCart, setdataInCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (Array.isArray(parsedCart)) {
        setdataInCart(parsedCart);
      }
    }
  }, []);

  //   console.log(dataInCart)
  return (
    <Container sx={{ paddingTop: 5 }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ชื่อร้าน</StyledTableCell>
              <StyledTableCell align="center">เมนู</StyledTableCell>
              <StyledTableCell align="center">ราคา</StyledTableCell>
              <StyledTableCell align="center">จำนวน</StyledTableCell>
              <StyledTableCell align="center">ภาชนะ</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataInCart.map((row, index) => {
              return (
                <StyledTableRow key={row.store_id + index}>
                  <StyledTableCell component="th" scope="row">
                    {row.store_id}
                  </StyledTableCell>
                  <StyledTableCell align="center" >
                    <img
                      sx={{ padding: 1 }}
                      component="img"
                      width="100"
                      height="100"
                      src={require(`../../uploads/${row.menu_photo}`)}
                      alt="food menu"
                    />{" "}
                     {row.menu_name}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    {row.menu_price}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.menu_num}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.menu_type === "dish"? "จาน":"ห่อ"}
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
