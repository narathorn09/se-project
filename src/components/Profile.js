import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export default function CardProfile() {
  const [member, setMember] = useState({});
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState([]);
  const [showphoto, setShowphoto] = useState(null);
  const [delayshowphoto, setDelayshowphoto] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [origin_filename, setOriginFilename] = useState("");
  const type = localStorage["mem_type"];

  const [datamem, setDatamem] = useState({
    fname: "",
    lname: "",
    tel: "",
    email: "",
    photo: "",
  });

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setShowphoto(URL.createObjectURL(e.target.files[0]));
  };

  const buttonEdit = async () => {
    setFname(datamem.fname);
    setLname(datamem.lname);
    setTel(datamem.tel);
    setEmail(datamem.email);
    setOriginFilename(datamem.photo);
    await new Promise((resolve) => setTimeout(resolve, 100));
    setEditProfile(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:4000/profile", {
          type: type,
        });
        setMember(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        if (type === "cust") {
          data = {
            fname: member.cust_name,
            lname: member.cust_Lname,
            tel: member.cust_tel,
            email: member.cust_email,
            photo: member.cust_photo,
          };
        } else {
          data = {
            fname: member.owner_name,
            lname: member.ower_Lname,
            tel: member.owner_tel,
            email: member.owner_email,
            photo: member.owner_photo,
          };
        }
        setDatamem(data);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
        setDelayshowphoto(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [member, setDatamem, type]);

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);
    formData.append("tel", tel);
    formData.append("type", type);
    formData.append("profile", file);
    formData.append("origin_filename", origin_filename);
    try {
      await axios
        .put("http://localhost:4000/update-profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          alert("แก้ไขข้อมูลส่วนตัวสำเร็จ");
          window.location.reload();
        });
    } catch (err) {
      alert("เกิดข้อผิดพลาด แก้ไขข้อมูลส่วนตัวไม่สำเร็จ");
      console.log(err);
    }
  };

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          boxShadow: 3,
          padding: 5,
          paddingBottom: 10,
        }}
      >
        {!editProfile && (
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
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
                onClick={() => buttonEdit()}
              >
                <EditIcon sx={{ fontSize: 20, marginRight: 1 }} />
                แก้ไขข้อมูลส่วนตัว
              </Box>
            </Grid>
            {delayshowphoto && (
              <Grid item xs={1}>
                <Avatar
                  alt="profile"
                  src={require(`../../uploads_profile/${datamem.photo}`)}
                  sx={{
                    width: [100, 200, 300],
                    height: [100, 200, 300],
                  }}
                />
              </Grid>
            )}
            <Grid item xs={5}>
              <Typography variant="h5" sx={{ fontSize: 30, marginBottom: 2 }}>
                ประเภทสมาชิก : {type === "cust" ? "ลูกค้า" : "เจ้าของร้าน"}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 20 }}>
                ชื่อ-นามสกุล : {datamem.fname} {datamem.lname}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 20 }}>
                Email : {datamem.email}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 20 }}>
                เบอร์มือถือ : {datamem.tel}
              </Typography>
            </Grid>
          </Grid>
        )}
        {editProfile && (
          <Grid container columnGap={2} rowGap={2}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontSize: 30, marginBottom:2, textAlign: "center" }}>
                แก้ไขข้อมูลส่วนตัว
              </Typography>
            </Grid>
            <Grid item xs={5.9}>
              <TextField
                type="text"
                name="firstName"
                fullWidth
                id="firstName"
                label="ชื่อจริง"
                autoFocus
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </Grid>
            <Grid item xs={5.9}>
              <TextField
                type="text"
                name="lastName"
                fullWidth
                id="lastName"
                label="นามสกุล"
                autoFocus
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                name="email"
                fullWidth
                id="email"
                label="Email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="tel"
                name="tel"
                fullWidth
                id="tel"
                label="เบอร์มือถือ"
                autoFocus
                value={tel}
                onChange={(e) => setTel(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="file"
                name="file"
                fullWidth
                id="file"
                autoFocus
                onChange={(e) => saveFile(e)}
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
                  setEditProfile(false);
                  setShowphoto(null);
                }}
              >
                ยกเลิก
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}
