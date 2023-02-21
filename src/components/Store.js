import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Box } from "@mui/system";
import { Button, Grid, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Store = () => {
  let navigate = useNavigate();

  const [addMenu, setaddMenu] = useState(false);
  const [nameMenu, setnameMenu] = useState("");
  const [priceMenu, setpriceMenu] = useState("");
  const [saveMenu, setsaveMenu] = useState(false);
  const [listMenu, setlistMenu] = useState([]);
  const [file, setFile] = useState([]);
  const [showphoto, setShowphoto] = useState(null);
  const [editMenu, setEditMenu] = useState(false);

  const [editfile, setEditFile] = useState([]);
  const [showeditfile, setShowEditFile] = useState(null);

  const editFile = (e) => {
    setEditFile(e.target.files[0]);
    setShowEditFile(URL.createObjectURL(e.target.files[0]));
  };

  const [upnameMenu, setupnameMenu] = useState("");
  const [upID, setupID] = useState(0);
  const [upPriced, setupPrice] = useState(0);
  const [origin_fileName, setorigin_FileName] = useState("");

  useEffect(() => {
    setnameMenu("");
    setpriceMenu("");
  }, [addMenu]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/list-menu")
      .then((res) => {
        setsaveMenu(true);
        setlistMenu(res.data);
        // const path = res.data.menu_photo;
        // // setShowphoto();
        console.log(res.data[0].menu_photo);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          setsaveMenu(true);
          alert("เพิ่มเมนูสำเร็จ");
        });
    } catch (err) {
      alert(err.message);
      alert("เกิดข้อผิดพลาด เพิ่มไม่เมนูสำเร็จ");
      console.log(err);
    }
    window.location.reload();
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

  return (
    <>
      <Container sx={{ paddingTop: 5 }}>
        <Typography sx={{ width: "100%", textAlign: "center" }} variant="h4">
          หน้าร้าน
        </Typography>
        <Typography
          sx={{ width: "100%", textAlign: "center", marginTop: 2 }}
          variant="h6"
        >
          รายละเอียด
        </Typography>
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
          }}
        >
          เพิ่มเมนู
        </Box>
        {addMenu && (
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
          // spacing={2}
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
                    transform: "translateY(-10px)",
                  },
                }}
              >
                <CardMedia
                  sx={{ padding: 1 }}
                  component="img"
                  height="140"
                  // src="test.jpg"
                  // src={`../../uploads/${data.menu_photo}`}
                  src={require(`../../uploads/${data.menu_photo}`)}
                  alt="food menu"
                />
                <CardContent className="cardContent">
                  <Typography gutterBottom variant="h5" component="div">
                    {data.menu_name}
                  </Typography>
                  <Typography variant="body2">{data.menu_price} บาท</Typography>
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
                      แก้ไขข้อมูล
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => buttonDelete(data.menu_id, data.menu_name)}
                    >
                      ลบข้อมูล
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Store;
