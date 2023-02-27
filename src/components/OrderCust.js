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
import { Box } from "@mui/system";

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
  const [storeNames, setStoreNames] = useState([]);
  const [listupdates, setListupdates] = useState(true);

  useEffect(() => {
    axios.post("http://localhost:4000/list-order").then((response) => {
      setlistOrder(response.data);
      if (response.data.length === 0) {
        localStorage.removeItem("order");
      }
      setListupdates(!listupdates);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const names = await Promise.all(
        listOrder.map(async (data) => {
          const response = await axios.get(
            `http://localhost:4000/store-name/${data.store_id}`
          );
          return response.data[0].store_name;
        })
      );
      setStoreNames(names);
    };
    fetchData();
  }, [listupdates]);

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

  const cancelOrder = async (order_id) => {
    const text = `คุณต้องการยกเลิกคำสั่งซื้อ หมายเลข${order_id}?`;
    const confirmed = window.confirm(text);
    if (confirmed) {
      await axios
        .delete(`http://localhost:4000/cancel-order/${order_id}`)
        .then((response) => {
          window.location.reload();
        });
    }
  };

  const delete_cancelOrder = async (order_id) => {
    await axios
      .delete(`http://localhost:4000/cancel-order/${order_id}`)
      .then((response) => {
        window.location.reload();
      });
  };

  const [Qorder, setQorder] = useState([]);

  useEffect(() => {
    const Queue = async () => {
      const q = await Promise.all(
        listOrder.map(async (data) => {
          const response = await axios.post(`http://localhost:4000/queue`, {
            order_id: data.order_id,
            store_id: data.store_id,
          });
          return response.data.q;
        })
      );
      setQorder(q);
    };
    Queue();
  }, [listOrder]);

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
                        {storeNames[index]}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.order_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {(() => {
                          if (row.order_status === "0") {
                            return (
                              <Typography sx={{ color: "orange" }}>
                                ยังไม่ยืนยัน
                              </Typography>
                            );
                          } else if (row.order_status === "1") {
                            return (
                              <Typography sx={{ color: "green" }}>
                                ยืนยันแล้ว
                              </Typography>
                            );
                          } else if (row.order_status === "2") {
                            return (
                              <Typography sx={{ color: "red" }}>
                                ถูกยกเลิก
                              </Typography>
                            );
                          }
                        })()}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {(() => {
                          if (row.order_cookingstatus === "0") {
                            return "ยังไม่เริ่มทำ";
                          } else if (row.order_cookingstatus === "1") {
                            return "กำลังทำ";
                          } else if (row.order_cookingstatus === "2") {
                            return "เสร็จสิ้น";
                          }
                        })()}
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
                      <StyledTableCell align="center">
                        {row.order_status === "0" && (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => cancelOrder(row.order_id)}
                          >
                            ยกเลิกคำสั่งซื้อ
                          </Button>
                        )}
                        {(() => {
                          if (row.order_status === "1") {
                            if (row.order_cookingstatus === "2") {
                              return (
                                <Box>
                                  <Box>กรุณาไปรับอารหาร</Box>
                                </Box>
                              );
                            } else {
                              return (
                                <Box>
                                  <Box>ลำดับคิวที่ {row.order_id}</Box>
                                  <Box>จำนวนคิวที่รอ {Qorder[index]}</Box>
                                </Box>
                              );
                            }
                          }
                        })()}
                        {row.order_status === "2" && (
                          <Box>
                            <Box>คำสั่งซื้อนี้ถูกยกเลิก</Box>
                            <Box>โดยเจ้าของร้าน</Box>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => delete_cancelOrder(row.order_id)}
                            >
                              กดเพื่อลบรายการ
                            </Button>
                          </Box>
                        )}
                      </StyledTableCell>
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
                {index === 0 ? (
                  <Typography>หมายเลขคำสั่งซื้อ : {data.order_id}</Typography>
                ) : null}
                {index + 1 + ")"} {menuNames[index]} {data.menu_amount}{" "}
                {data.menu_type === "dish" ? "จาน" : "ห่อ"}
              </Grid>
            );
          })}
        </Grid>
      </Modal>
    </Container>
  );
}
