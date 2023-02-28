import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";

export default function Register() {
  let navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage["token"] && localStorage["mem_type"] === "cust") {
      navigate("/cust/home");
    }
    if (sessionStorage["token"] && localStorage["mem_type"] === "owner") {
      navigate("/owner/home");
    }
  }, [navigate]);

  return (
    <Container sx={{ paddingTop: 10 }}>
      <CssBaseline />
      <Box
        sx={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">ประเภทของสมาชิกที่ต้องการสมัคร</Typography>
        <Box noValidate sx={{ mt: 3 }}>
          <Grid container columnGap={1}>
            <Grid item xs={5.9} sx={{ marginBottom: 3 }}>
              <Card
                sx={{
                  width: "90%",
                  padding: 10,
                  ":hover": {
                    bgcolor: "#1a1a1a",
                    color: "#EC6432",
                  },
                }}
                component={Button}
                onClick={() => navigate("/register-customer")}
              >
                <PersonIcon sx={{ fontSize: 100 }} />
                <Typography variant="h5">ลูกค้า</Typography>
              </Card>
            </Grid>
            <Grid item xs={5.9}>
              <Card
                sx={{
                  width: "90%",
                  padding: 10,
                  ":hover": {
                    bgcolor: "#1a1a1a",
                    color: "#EC6432",
                  },
                }}
                component={Button}
                onClick={() => navigate("/register-ownerstore")}
              >
                <StoreIcon sx={{ fontSize: 100 }} />
                <Typography variant="h5">เจ้าของร้าน</Typography>
              </Card>
            </Grid>

            <Link href="/login" variant="body2" component={Button}>
              ย้อนกลับ
            </Link>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
