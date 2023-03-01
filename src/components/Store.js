import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const Store = () => {
  const [idStore, setIdStore] = useState(0);
  const [nameStore, setnameStore] = useState("");
  const [detailStore, setdetailStore] = useState("");
  const [storeReligion, setStoreReligion] = useState("");
  const [photoStore, setPhotoStore] = useState("");
  const [showEditStore, setShowEditStore] = useState(false);

  const [upnameStore, setUpnameStore] = useState("");
  const [updetailStore, setUpdetailStore] = useState("");
  const [upstoreReligion, setUpStoreReligion] = useState("");
  const [upphotoStore, setUpphotoStore] = useState("");
  const [upfileStore, setUpfileStore] = useState([]);
  const [showupfileStore, setShowUpfileStore] = useState(null);

  const [addMenu, setaddMenu] = useState(false);
  const [nameMenu, setnameMenu] = useState("");
  const [priceMenu, setpriceMenu] = useState(0);
  const [listMenu, setlistMenu] = useState([]);
  const [file, setFile] = useState([]);
  const [showphoto, setShowphoto] = useState(null);
  const [editMenu, setEditMenu] = useState(false);

  const [editfile, setEditFile] = useState([]);
  const [showeditfile, setShowEditFile] = useState(null);

  const [upnameMenu, setupnameMenu] = useState("");
  const [upID, setupID] = useState(0);
  const [upPriced, setupPrice] = useState(0);
  const [origin_fileName, setorigin_FileName] = useState("");

  useEffect(() => {
    setnameMenu("");
    setpriceMenu("");
  }, [addMenu]);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("http://localhost:4000/list-menu")
        .then((res) => {
          // setsaveMenu(true);
          setlistMenu(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      await axios
        .get("http://localhost:4000/store-detail")
        .then((res) => {
          setIdStore(res.data[0].store_id);
          setnameStore(res.data[0].store_name);
          setdetailStore(res.data[0].store_details);
          setPhotoStore(res.data[0].store_photo);
          setStoreReligion(res.data[0].store_religion);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, []);

  const editFile = (e) => {
    setEditFile(e.target.files[0]);
    setShowEditFile(URL.createObjectURL(e.target.files[0]));
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setShowphoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("menu_name", nameMenu);
    formData.append("menu_price", priceMenu);
    formData.append("file", file);

    try {
      await axios
        .post("http://localhost:4000/add-menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          alert("เพิ่มเมนูสำเร็จ");
          window.location.reload();
        });
    } catch (err) {
      alert("เกิดข้อผิดพลาด เพิ่มไม่เมนูสำเร็จ");
      console.log(err);
    }
  };

  const updateClick = async () => {
    const formDataUpdate = new FormData();
    formDataUpdate.append("menu_id", upID);
    formDataUpdate.append("menu_name", upnameMenu);
    formDataUpdate.append("menu_price", upPriced);
    formDataUpdate.append("origin_filename", origin_fileName);
    if (editFile) {
      formDataUpdate.append("file", editfile);
    }

    try {
      await axios
        .put("http://localhost:4000/update-menu", formDataUpdate, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          alert("แก้ไขเมนูสำเร็จ");
          window.location.reload();
        });
    } catch (err) {
      alert("เกิดข้อผิดพลาด แก้ไขไม่เมนูสำเร็จ");
      console.log(err);
    }
  };

  const buttonEdit = (id, name, price, filename) => {
    setupnameMenu(name);
    setupID(id);
    setupPrice(price);
    setorigin_FileName(filename);
    setEditMenu(true);
  };

  const buttonDelete = (id, name) => {
    const text = `คุณต้องการลบเมนู ${name}?`;
    const confirmed = window.confirm(text);
    if (confirmed) {
      axios
        .delete(`http://localhost:4000/delete-menu/${id}`)
        .then((response) => {
          console.log(response);
          window.location.reload();
        });
    }
  };

  const saveFileStore = (e) => {
    setUpfileStore(e.target.files[0]);
    setShowUpfileStore(URL.createObjectURL(e.target.files[0]));
  };

  const updateStore = async () => {
    setUpnameStore(nameStore);
    setUpdetailStore(detailStore);
    setUpphotoStore(photoStore);
    setUpStoreReligion(storeReligion);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setShowEditStore(true);
  };

  const upStore_handleClick = async () => {
    const formData = new FormData();
    formData.append("store_id", idStore);
    formData.append("store_name", upnameStore);
    formData.append("store_details", updetailStore);
    formData.append("store_religion", upstoreReligion);
    formData.append("store", upfileStore);
    formData.append("origin_filename", upphotoStore);
    try {
      await axios
        .put("http://localhost:4000/update-store", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          alert("แก้ไขข้อมูลร้านค้าสำเร็จ");
          window.location.reload();
        });
    } catch (err) {
      alert("เกิดข้อผิดพลาด แก้ไขข้อมูลร้านค้าสำเร็จ");
      console.log(err);
    }
  };

  return (
    <>
      <Container sx={{ paddingTop: 5 }}>
        {showEditStore && (
          <Box>
            <Grid container rowGap={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                    bgcolor: "#1a1a1a",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(52, 52, 52, 0.05)",
                  }}
                >
                  <Typography
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      // color: "#EC6432",
                      padding: "10px",
                    }}
                    variant="h4"
                  >
                    แก้ไขข้อมูลร้านค้า
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  name="StoretName"
                  fullWidth
                  id="StoretName"
                  label="ชื่อร้าน"
                  autoFocus
                  value={upnameStore}
                  onChange={(e) => setUpnameStore(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={4}
                  type="text"
                  name="StoreDetail"
                  fullWidth
                  id="StoreDetail"
                  label="รายละเอียดร้าน"
                  autoFocus
                  value={updetailStore}
                  onChange={(e) => setUpdetailStore(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="religion">ศาสนา</InputLabel>
                  <Select
                    labelId="religion"
                    id="religion"
                    value={upstoreReligion}
                    label="ศาสนา"
                    onChange={(e) => setUpStoreReligion(e.target.value)}
                  >
                    <MenuItem value={"0"}>พุทธ</MenuItem>
                    <MenuItem value={"1"}>อิสลาม</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="file"
                  name="file"
                  fullWidth
                  id="file"
                  autoFocus
                  onChange={(e) => saveFileStore(e)}
                />
              </Grid>
              {showupfileStore && (
                <Grid item xs={12}>
                  <Box
                    component="img"
                    src={showupfileStore}
                    sx={{ width: 100, height: 100 }}
                  />
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => upStore_handleClick()}
                >
                  บันทึก
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ marginLeft: 1 }}
                  onClick={() => {
                    setShowEditStore(false);
                    setShowUpfileStore(null);
                  }}
                >
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        {/* main ###################################################################################### */}
        {!showEditStore && (
          <>
            <Box
              // style={{ position: "fixed", top: 50, right: 0 }}
              sx={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                textAlign: "center",
                color: "#EC6432",
                bgcolor: "#1a1a1a",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "rgba(52, 52, 52, 0.05)",
              }}
            >
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  color: "#EC6432",
                  padding: "10px",
                }}
                variant="h4"
              >
                ร้าน{nameStore}
              </Typography>
              {photoStore !== "" && (
                <Box
                  component="img"
                  sx={{
                    height: 100,
                    width: 100,
                    borderRadius: 1,
                    margin: 1,
                  }}
                  style={{ clipPath: `circle(50%)` }}
                  alt="The house from the offer."
                  src={require(`../../uploads_store/${photoStore}`)}
                />
              )}
              <Typography
                sx={{ width: "100%", textAlign: "center" }}
                variant="body1"
              >
                รายละเอียด : {detailStore}
              </Typography>
              <Typography
                sx={{ width: "100%", textAlign: "center" }}
                variant="body1"
              >
                ศาสนา : {storeReligion === "0" ? "พุทธ" : "อิสลาม"}
              </Typography>
              <Box
                sx={{
                  ":hover": {
                    bgcolor: "#1a1a1a",
                    color: "#EC6432",
                    transform: "scale(1.05)",
                  },
                  marginTop: 1,
                }}
                component={Button}
                onClick={() => updateStore()}
              >
                <EditIcon sx={{ fontSize: 20, marginRight: 1 }} />
                แก้ไขข้อมูลร้านค้า
              </Box>
            </Box>

            {!editMenu && (
              <>
                <Divider sx={{ marginTop: 2 }} />
                <Box
                  onClick={() => setaddMenu(!addMenu)}
                  component={Button}
                  sx={{
                    ":hover": {
                      bgcolor: "#1a1a1a",
                      color: "#EC6432",
                    },
                    width: "100%",
                    height: 50,
                    textAlign: "center",
                    marginTop: 2,
                    border: 1,
                    fontSize: 20,
                  }}
                >
                  เพิ่มเมนู
                </Box>
              </>
            )}
            {addMenu && !editMenu && (
              <Box mt={3}>
                <Grid container rowSpacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="menu"
                      label="ชื่อเมนูอาหาร"
                      name="menu"
                      autoComplete="menu"
                      value={nameMenu}
                      onChange={(e) => setnameMenu(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      id="number"
                      label="ราคา"
                      name="number"
                      autoComplete="number"
                      value={priceMenu}
                      onChange={(e) => setpriceMenu(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      id="file"
                      onChange={saveFile}
                    />
                  </Grid>
                  {showphoto && (
                    <Grid item xs={12}>
                      <Box
                        component="img"
                        src={showphoto}
                        sx={{ width: 100, height: 100 }}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleClick()}
                    >
                      บันทึก
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ marginLeft: 1 }}
                      onClick={() => {
                        setaddMenu(false);
                        setShowphoto(null);
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ marginTop: 2 }} />
              </Box>
            )}
            <Divider sx={{ marginTop: 3, marginBottom: 2 }} />
            {editMenu && (
              <Box>
                {" "}
                <Grid container rowSpacing={2}>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ width: "100%", textAlign: "center" }}
                      variant="h5"
                    >
                      แก้ไขข้อมูลเมนู
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="up_menu"
                      label="ชื่อเมนูอาหาร"
                      name="up_menu"
                      autoComplete="up_menu"
                      value={upnameMenu}
                      onChange={(e) => setupnameMenu(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      id="up_number"
                      label="ราคา"
                      name="up_number"
                      autoComplete="up_number"
                      value={upPriced}
                      onChange={(e) => setupPrice(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      id="file"
                      onChange={editFile}
                    />
                  </Grid>
                  {showeditfile && (
                    <Grid item xs={12}>
                      <Box
                        component="img"
                        src={showeditfile}
                        sx={{ width: 100, height: 100 }}
                      />
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => updateClick()}
                    >
                      บันทึก
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ marginLeft: 1 }}
                      onClick={() => {
                        setEditMenu(false);
                        setShowEditFile(null);
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
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
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "19px", fontWeight: "light" }}
                      >
                        {data.menu_price.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                      <Box
                        className="buttons"
                        sx={{
                          marginTop: 2,
                          display: "grid",
                          columnGap: 1,
                          gridTemplateColumns: "repeat(2, 1fr)",
                          visibility: "hidden",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() =>
                            buttonEdit(
                              data.menu_id,
                              data.menu_name,
                              data.menu_price,
                              data.menu_photo
                            )
                          }
                        >
                          แก้ไขเมนู
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            buttonDelete(data.menu_id, data.menu_name)
                          }
                        >
                          ลบ
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Store;
