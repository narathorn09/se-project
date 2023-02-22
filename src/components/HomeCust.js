import { useState, useEffect } from "react";
import * as React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, ButtonGroup, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function HomeCust() {
  let navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [alldata, setAlldata] = useState([]);
  const [Checkbox_1, setCheckbox_1] = useState(true);
  const [Checkbox_2, setCheckbox_2] = useState(true);
  const [idStore, setidStore] = useState(0);

  const [nameStore, setnameStore] = useState("");
  const [detailStore, setdetailStore] = useState("");
  const [listMenu, setlistMenu] = useState([]);

  const [openModal, setopenModal] = useState(false);
  const [dataOnModal, setdataOnModal] = useState({
    menu_name: "",
    menu_price: "",
    menu_photo: "",
  });

  let [numMenu, setnumMenu] = useState(1);
  const numUP = () => {
    setnumMenu((numMenu += 1));
  };
  const numDOWN = () => {
    if (numMenu > 1) setnumMenu((numMenu -= 1));
  };

  const [typeMenu, setTypeMenu] = useState("dish");

  const handleChange = (type) => {
    setTypeMenu(type);
  };

  useEffect(() => {
    //เลือก Checkbox ทั้งสองช่องหรือ ไม่ได้เลือกทั้งสอง
    if (
      (Checkbox_1 && Checkbox_2) === true ||
      (Checkbox_1 && Checkbox_2) === false
    ) {
      try {
        const data = {
          store_name: search,
        };
        console.log(data);
        axios.post("http://localhost:4000/store-all", data).then((response) => {
          setAlldata(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    }

    //เลือก Checkbox แรกที่เป็นศาสนาพุทธ จะให้ store_religion: "0"
    if (Checkbox_1 === true && Checkbox_2 === false) {
      try {
        const data = {
          store_name: search,
          store_religion: "0",
        };
        console.log(data);
        axios
          .post("http://localhost:4000/store-search", data)
          .then((response) => {
            setAlldata(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    }

    //เลือก Checkbox ที่สองที่เป็นศาสนาอิสลาม จะให้ store_religion: "1"
    if (Checkbox_1 === false && Checkbox_2 === true) {
      try {
        const data = {
          store_name: search,
          store_religion: "1",
        };
        console.log(data);
        axios
          .post("http://localhost:4000/store-search", data)
          .then((response) => {
            setAlldata(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [search, Checkbox_1, Checkbox_2]);

  const selectStore = async (id) => {
    const data = {
      store_id: id,
    };

    await axios
      .post("http://localhost:4000/store-select", data)
      .then((res) => {
        console.log(res.data);
        setnameStore(res.data[0].store_name);
        setdetailStore(res.data[0].store_details);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post("http://localhost:4000/list-menu-store-select", data)
      .then((res) => {
        setlistMenu(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setidStore(1);
  };

  const selectMenu = (name, price, photo, e) => {
    e.preventDefault();
    setopenModal(true);
    setdataOnModal({
      menu_name: name,
      menu_price: price,
      menu_photo: photo,
    });
  };
  // console.log(dataOnModal);

  const closeModal = () => {
    setopenModal(false);
  };

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

  return (
    <>
      <Container sx={{ paddingTop: 8 }}>
        {idStore === 0 && (
          <Box>
            <TextField
              autoComplete="search"
              type="search"
              name="search"
              fullWidth
              id="search"
              label="ค้นหาร้านอาหาร"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FormGroup aria-label="position" row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Checkbox_1}
                    onChange={(e) => setCheckbox_1(e.target.checked)}
                  />
                }
                label="ร้านศาสนาพุทธ"
                labelPlacement="end"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Checkbox_2}
                    onChange={(e) => setCheckbox_2(e.target.checked)}
                  />
                }
                label="ร้านศาสอิสลาม"
                labelPlacement="end"
              />
            </FormGroup>
            <Stack spacing={2} sx={{ marginTop: 2 }}>
              {alldata.map((data, index) => {
                return (
                  <Grid item xs={1.3} key={data.store_name + index}>
                    <Box
                      sx={{
                        display: "flex",
                        "& > :not(style)": {
                          m: 1,
                          width: "100%",
                          height: 128,
                        },
                      }}
                    >
                      <Paper
                        component={Button}
                        onClick={() => selectStore(data.store_id)}
                        elevation={3}
                        sx={{
                          ":hover": {
                            bgcolor: "#1a1a1a",
                            color: "#EC6432",
                            transform: "scale(1.07)",
                          },
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={1.3}>
                            <Box
                              component="img"
                              sx={{
                                height: 100,
                                width: 100,
                                borderRadius: 1,
                                margin: 1.7,
                                // maxHeight: { xs: 233, md: 167 },
                                // maxWidth: { xs: 350, md: 250 },
                              }}
                              alt="The house from the offer."
                              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            md={9}
                            sx={{
                              textAlign: "left",
                              margin: 1.7,
                            }}
                          >
                            <Typography variant="h6" gutterBottom>
                              {data.store_name}
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: 16 }}>
                              {data.store_details}
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: 16 }}>
                              {data.store_religion === "0"
                                ? "ศาสนาพุทธ"
                                : "ศาสนาอิสลาม"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  </Grid>
                );
              })}
            </Stack>
          </Box>
        )}
        {idStore !== 0 && (
          <Box>
            {/* window.location.reload() */}
            <Box component={Button} onClick={() => setidStore(0)}>
              ย้อนกลับ
            </Box>
            <Typography
              sx={{ width: "100%", textAlign: "center" }}
              variant="h4"
            >
              ร้าน{nameStore}
            </Typography>
            <Typography
              sx={{ width: "100%", textAlign: "center", marginTop: 2 }}
              variant="h6"
            >
              รายละเอียด : {detailStore}
            </Typography>
            <Divider sx={{ marginTop: 2 }} />
            <Grid
              container
              sx={{
                marginTop: 5,
                rowGap: 3,
                columnGap: 1.5,
              }}
            >
              {listMenu.map((data, index) => (
                <Grid key={data + index} item xs={2.9} maxWidth={100}>
                  <Card
                    sx={{
                      "&:hover > .cardContent > .buttons": {
                        visibility: "visible",
                      },
                      ":hover": {
                        bgcolor: "#1a1a1a",
                        color: "#EC6432",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <CardMedia
                      sx={{ padding: 1 }}
                      component="img"
                      height="140"
                      src={require(`../../uploads/${data.menu_photo}`)}
                      alt="food menu"
                    />
                    <CardContent className="cardContent">
                      <Typography gutterBottom variant="h5" component="div">
                        {data.menu_name}
                      </Typography>
                      <Typography variant="body2">
                        {data.menu_price} บาท
                      </Typography>
                      <Box
                        className="buttons"
                        sx={{
                          marginTop: 2,
                          display: "grid",
                          columnGap: 1,
                          visibility: "hidden",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={(e) =>
                            selectMenu(
                              data.menu_name,
                              data.menu_price,
                              data.menu_photo,
                              e
                            )
                          }
                        >
                          สั่งซื้อ
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {openModal && (
          <Modal open={openModal} onClose={closeModal}>
            <Grid container sx={style}>
              <Grid xs={4}>
                <CardMedia
                  sx={{ padding: 1 }}
                  component="img"
                  height="140"
                  src={require(`../../uploads/${dataOnModal.menu_photo}`)}
                  alt="food menu"
                />
              </Grid>
              <Grid xs={6} sx={{ marginLeft: "5%" }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {dataOnModal.menu_name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {dataOnModal.menu_price} บาท
                </Typography>
                <Typography variant="body" sx={{ mr: 2 }}>
                  จำนวน
                </Typography>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Button onClick={numDOWN}>
                    <RemoveIcon />
                  </Button>
                  <Button>{numMenu}</Button>
                  <Button onClick={numUP}>
                    <AddIcon />
                  </Button>
                </ButtonGroup>
                <ToggleButtonGroup
                  sx={{
                    backgroundColor: "primary",
                    color: "primary",
                    height: 40,
                    marginLeft: 1,
                  }}
                  value={typeMenu}
                  exclusive
                  onChange={(e) => handleChange(e.target.value)}
                  aria-label="Platform"
                >
                  <ToggleButton
                    value="dish"
                    style={{
                      backgroundColor: typeMenu === "dish" ? "#1a1a1a" : null,
                      color: typeMenu === "dish" ? "white" : null,
                    }}
                  >
                    จาน
                  </ToggleButton>
                  <ToggleButton
                    value="pack"
                    style={{
                      backgroundColor: typeMenu === "pack" ? "#1a1a1a" : null,
                      color: typeMenu === "pack" ? "white" : null,
                    }}
                  >
                    ห่อ
                  </ToggleButton>
                </ToggleButtonGroup>
                <Box
                  sx={{
                    width: "100%",
                    // marginLeft: 10,
                    marginTop: 2,
                    display: "grid",
                    columnGap: 1,
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}
                >
                  <Button variant="contained" color="success">
                    เพิ่มไปยังตะกร้า
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={closeModal}
                  >
                    ยกเลิก
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Modal>
        )}
      </Container>
    </>
  );
}
