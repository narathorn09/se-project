import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";

export default function CardProfile() {
  const [member, setMember] = useState({});

  useEffect(() => {
    axios.get("http://localhost:4000/profile").then((response) => {
      setMember(response.data);
      console.log(response.data);
    });
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", boxShadow: 3 }}>
      <Container sx={{ paddingTop: 8 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item xs={1}>
            <Avatar
              alt="profile"
              src="/static/images/avatar/1.jpg"
              sx={{
                width: [100, 200, 300],
                height: [100, 200, 300],
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h4">
              ประเภทสมาชิก :{" "}
              {localStorage["mem_type"] === "cust" ? "ลูกค้า" : "เจ้าของร้าน"}
            </Typography>
            <Typography variant="h11">
              ชื่อ-นามสกุล : {member.cust_name} {member.cust_Lname}
            </Typography>
            <Typography>Email : {member.cust_email}</Typography>
            <Typography>เบอร์มือถือ : {member.cust_tel}</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
