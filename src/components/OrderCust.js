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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

export default function OrderCust() {
  const [listOrder, setlistOrder] = useState([]);
  const [dataOnModal, setdataOnModal] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [menuNames, setMenuNames] = useState([]);
  const [menuPhoto, setmenuPhoto] = useState([]);
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
      <Typography
        sx={{ width: "100%", textAlign: "center", marginBottom: 5 }}
        variant="h4"
      >
        รายการสั่งซื้อ
      </Typography>
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
                        {row.order_price.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
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
                          ดูเมนูที่สั่ง
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.order_status === "0" && (
                          <Box>
                            <p>รอเจ้าของร้านยืนยันคำสั่งซื้อ</p>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => cancelOrder(row.order_id)}
                              sx={{
                                ":hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              ยกเลิกคำสั่งซื้อ
                            </Button>
                          </Box>
                        )}
                        {(() => {
                          if (row.order_status === "1") {
                            if (row.order_cookingstatus === "2") {
                              return (
                                <Box>
                                  <Box
                                    sx={{
                                      backgroundColor:
                                        "rgba(125, 235, 71, 0.5)",
                                      color: "#1a1a1a",
                                      borderRadius: "2px",
                                      fontSize: "18px",
                                      padding: "10px",
                                    }}
                                  >
                                    กรุณาไปรับอารหารคิวที่ {row.order_id}
                                  </Box>
                                </Box>
                              );
                            } else {
                              return (
                                <Box>
                                  <Box
                                    sx={{
                                      backgroundColor:
                                        "rgba(245, 165, 71, 0.5)",
                                      color: "#1a1a1a",
                                      borderTopLeftRadius: "5px",
                                      borderTopRightRadius: "5px",
                                      fontSize: "18px",
                                      padding: "10px",
                                    }}
                                  >
                                    ลำดับคิวที่ : {row.order_id}
                                  </Box>
                                  <Box
                                    sx={{
                                      backgroundColor:
                                        "rgba(245, 255, 71, 0.5)",
                                      color: "#1a1a1a",
                                      borderBottomLeftRadius: "5px",
                                      borderBottomRightRadius: "5px",
                                      fontSize: "18px",
                                      padding: "10px",
                                    }}
                                  >
                                    จำนวนคิวที่รอ : {Qorder[index]}
                                  </Box>
                                </Box>
                              );
                            }
                          }
                        })()}
                        {row.order_status === "2" && (
                          <Box
                            sx={{
                              backgroundColor: "rgba(245, 75, 105, 0.5)",
                              color: "#1a1a1a",
                              borderRadius: "5px",
                              fontSize: "18px",
                              padding: "10px",
                            }}
                          >
                            <Box>คำสั่งซื้อนี้ถูกยกเลิก</Box>
                            <Box>โดยเจ้าของร้าน</Box>
                            <IconButton
                              variant="contained"
                              color="error"
                              onClick={() => delete_cancelOrder(row.order_id)}
                              sx={{
                                ":hover": {
                                  transform: "scale(1.5)",
                                },
                              }}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </Box>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
                {listOrder.length === 0 && (
                  <Container>
                    <p>ไม่มีรายการสั่งซื้อ</p>
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
