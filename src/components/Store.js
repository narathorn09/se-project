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

// const tokensend = sessionStorage.getItem("token");
// axios.defaults.headers.common["Authorization"] = `Bearer ${tokensend}`;

const Store = () => {
  const [addMenu, setaddMenu] = useState(false);
  const [nameMenu, setnameMenu] = useState("");
  const [priceMenu, setpriceMenu] = useState("");

  useEffect(() => {
    // setpriceMenu("");
  }, [addMenu]);

  const handleClick = async () => {
    const data = {
      menu_name: nameMenu,
      menu_price: priceMenu,
    };

    await axios
      .post("http://localhost:4000/add-menu", data)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // axios.post(`http://localhost:4000/add-menu=${username.trim()}`);
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
                  onClick={handleClick}
                >
                  บันทึก
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ marginLeft: 1 }}
                >
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ marginTop: 2 }} />
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((data, index) => (
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
                  image="https://plus.unsplash.com/premium_photo-1674654419438-3720f0b71087?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="green iguana"
                />
                <CardContent className="cardContent">
                  <Typography gutterBottom variant="h5" component="div">
                    ข้าวกระเพราหมูสับ
                  </Typography>
                  <Typography variant="body2">40.00 บาท</Typography>
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
                    <Button variant="contained" color="success">
                      แก้ไขข้อมูล
                    </Button>
                    <Button variant="contained" color="error">
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
