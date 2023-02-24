import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";

export default function CardProfile() {
  const [member, setMember] = useState({});
  const type = localStorage["mem_type"];
  console.log(type);

  useEffect(() => {
    axios
      .post("http://localhost:4000/profile", { type: type })
      .then((response) => {
        setMember(response.data);
        console.log(response.data);
      });
  }, [type]);

  return (
    <Container sx={{ paddingTop: 5 }}>
      <Box sx={{ width: "100%", height: "100%", boxShadow: 3 ,padding: 5}}>

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
                ประเภทสมาชิก : {type === "cust" ? "ลูกค้า" : "เจ้าของร้าน"}
              </Typography>
              <Typography variant="h11">
                ชื่อ-นามสกุล :{" "}
                {type === "cust" ? member.cust_name : member.owner_name}{" "}
                {type === "cust" ? member.cust_Lname : member.ower_Lname}
              </Typography>
              <Typography>
                Email :{" "}
                {type === "cust" ? member.cust_email : member.owner_email}
              </Typography>
              <Typography>
                เบอร์มือถือ :{" "}
                {type === "cust" ? member.cust_tel : member.owner_tel}
              </Typography>
            </Grid>
          </Grid>
       
      </Box>
    </Container>
  );
}
