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
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
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
  width: "auto",
  height: "auto",
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 2,
  p: 4,
};

export default function OrderConfirm() {
  const [listOrder, setlistOrder] = useState([]);
  const [dataOnModal, setdataOnModal] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [menuNames, setMenuNames] = useState([]);
  const [menuPhoto, setmenuPhoto] = useState([]);

  useEffect(() => {
    try {
      axios.get("http://localhost:4000/list-order-confirm").then((response) => {
        setlistOrder(response.data);
        if (response.data.length > 0) {
          localStorage.setItem("order_con", "have");
        } else {
          localStorage.setItem("order_con", "no");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  //   console.table(listOrder);

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

  useEffect(() => {
    const fetchData = async () => {
      const filename = await Promise.all(
        dataOnModal.map(async (data) => {
          const response = await axios.get(
            `http://localhost:4000/menu-filename/${data.menu_id}`
          );
          return response.data[0].menu_photo;
        })
      );
      setmenuPhoto(filename);
    };
    fetchData();
  }, [dataOnModal]);

  const seeMenu = async (order_id) => {
    await axios
      .get(`http://localhost:4000/orderdetail/${order_id}`)
      .then((response) => {
        setdataOnModal(response.data);
        setTimeout(() => {
          setshowModal(true);
        }, 500);
      });
  };

  const startCook = async (order_id) => {
    await axios
      .put(`http://localhost:4000/start-cook/${order_id}`)
      .then((response) => {
        window.location.reload();
      });
  };

  const endCook = async (order_id) => {
    await axios
      .put(`http://localhost:4000/end-cook/${order_id}`)
      .then((response) => {
        window.location.reload();
      });
  };

  const successOrder = async (order_id) => {
    const text = `คุณต้องการยืนยันการมารับอาหารของลูกค้า หมายเลขคำสั่งซื้อ ${order_id}?`;
    const confirmed = window.confirm(text);
    if (confirmed) {
      await axios
        .delete(`http://localhost:4000/success-order/${order_id}`)
        .then((response) => {
          window.location.reload();
        });
    }
  };

  const closeModal = () => {
    setshowModal(false);
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Typography
        sx={{ width: "100%", textAlign: "center", marginBottom: 5 }}
        variant="h4"
      >
        คำสั่งซื้อที่ยืนยันแล้ว
      </Typography>
      <Typography
        sx={{ width: "100%", textAlign: "center", marginBottom: 5 }}
        variant="h5"
      >
        จำนวนคำสั่งซื้อทั้งหมด : {listOrder.length}
      </Typography>
      <Grid container columnGap={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>หมายเลขคำสั่งซื้อ</StyledTableCell>
                  <StyledTableCell align="right">ราคารวม</StyledTableCell>
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
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {row.order_id}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.order_price.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
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
                          sx={{
                            bgcolor: "#48E8AB",
                            color: "#1a1a1a",
                            ":hover": {
                              bgcolor: "#48E8AB",
                              color: "#1a1a1a",
                              transform: "scale(1.05)",
                            },
                          }}
                          onClick={() => seeMenu(row.order_id)}
                        >
                          รายละเอียดคำสั่งซื้อ
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ width: "15%" }}>
                        <Grid container rowGap={0.5}>
                          {row.order_cookingstatus === "0" && (
                            <Grid item xs={12}>
                              <Button
                                variant="contained"
                                sx={{ color: "#FF8E0D" }}
                                onClick={() => startCook(row.order_id)}
                              >
                                กดเพื่อเริ่มทำ
                              </Button>
                            </Grid>
                          )}
                          {row.order_cookingstatus === "1" && (
                            <Grid item xs={12}>
                              <Button
                                variant="contained"
                                sx={{ color: "#4AFF54" }}
                                onClick={() => endCook(row.order_id)}
                              >
                                กดเพื่อเสร็จสิ้น
                              </Button>
                            </Grid>
                          )}
                          {row.order_cookingstatus === "2" && (
                            <>
                              <Grid item xs={12}>
                                รอลูกค้ามารับอาหาร
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  sx={{ color: "#38EEF0" }}
                                  onClick={() => successOrder(row.order_id)}
                                >
                                  ยืนยันการมารับอาหาร
                                </Button>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}

                {listOrder.length === 0 && (
                  <Container>
                    <p>ไม่มีคำสั่งซื้อที่ยืนยันแล้ว</p>
                  </Container>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {dataOnModal && showModal && (
        <Modal
          open={showModal}
          onClose={closeModal}
          sx={{ justifyContent: "center", alignContent: "center", flex: 1 }}
        >
          <TableContainer component={Paper}>
            <Table>
              <TableBody sx={style}>
                {dataOnModal.map((data, index) => {
                  return (
                    <>
                      {index === 0 && (
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: "center",
                            alignContent: "center",
                            marginBottom: 2,
                          }}
                        >
                          หมายเลขคำสั่งซื้อ : {data.order_id}
                        </Typography>
                      )}
                      <StyledTableRow key={index}>
                        <StyledTableCell></StyledTableCell>

                        <StyledTableCell>{index + 1 + ")"}</StyledTableCell>

                        <StyledTableCell>
                          <img
                            sx={{ padding: 1 }}
                            component="img"
                            width="50"
                            height="50"
                            src={require(`../../uploads/${menuPhoto[index]}`)}
                            alt="food menu"
                          />
                        </StyledTableCell>
                        <StyledTableCell>{menuNames[index]}</StyledTableCell>
                        <StyledTableCell>{data.menu_amount}</StyledTableCell>
                        <StyledTableCell>
                          {data.menu_type === "dish" ? "จาน" : "ห่อ"}
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal>
      )}
    </Container>
  );
}
