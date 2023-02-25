import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, Container, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import Modal from "@mui/material/Modal";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "auto",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 2,
  p: 4,
};

export default function OrderCust() {
  const [listOrder, setlistOrder] = useState([]);
  const [dataOnModal, setdataOnModal] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [menuNames, setMenuNames] = useState([]);

  useEffect(() => {
    axios.post("http://localhost:4000/list-order").then((response) => {
      setlistOrder(response.data);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const names = await Promise.all(
        dataOnModal.map(async (data) => {
          const response = await axios.get(
            `http://localhost:4000/menu-name/${data.menu_id}`
          );
          return response.data[0].menu_name;
        })
      );
      setMenuNames(names);
    };
    fetchData();
  }, [dataOnModal]);

  const seeMenu = async (order_id) => {
    await axios
      .get(`http://localhost:4000/orderdetail/${order_id}`)
      .then((response) => {
        setdataOnModal(response.data);
        setshowModal(true);
      });
  };

  const closeModal = () => {
    setshowModal(false);
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Grid container columnGap={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>หมายเลขคำสั่งซื้อ</StyledTableCell>
                  <StyledTableCell align="left">ชื่อร้าน</StyledTableCell>
                  <StyledTableCell align="right">ราคารวม</StyledTableCell>
                  <StyledTableCell align="center">
                    สถานะคำสั่งซื้อ
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    สถานะการทำอาหาร
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    รายละเอียดคำสั่งซื้อ
                  </StyledTableCell>
                  <StyledTableCell align="center">กิจกรรม</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOrder.map((row, index) => {
                  return (
                    <StyledTableRow key={row.order_id + index}>
                      <StyledTableCell component="th" scope="row">
                        {row.order_id}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.order_id}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.order_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.order_status}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {row.order_cookingstatus}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => seeMenu(row.order_id)}
                        >
                          ดูเมนูที่สั่ง
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">คิว</StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Modal open={showModal} onClose={closeModal}>
        <Grid container sx={style}>
          {dataOnModal.map((data, index) => {
            return (
              <Grid item xs={12} key={index}>
                {menuNames[index]} {data.menu_amount} {data.menu_type === "dish" ? "จาน" : "ห่อ"}
              </Grid>
            );
          })}
        </Grid>
      </Modal>
    </Container>
  );
}
