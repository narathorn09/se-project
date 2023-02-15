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

export default function Register() {
  let navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage["token"] && localStorage["mem_type"] === "cust") {
      navigate("/cust");
    }
    if (sessionStorage["token"] && localStorage["mem_type"] === "owner") {
      navigate("/owner");
    }
  }, [navigate]);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">ประเภทของสมาชิกที่ต้องการสมัคร</Typography>
          <Box noValidate sx={{ mt: 3 }}>
            <Grid spacing={2}>
              <Grid item xs={12} sx={{ marginBottom: 3 }}>
                <Card
                  sx={{ padding: 0, minWidth: 275 }}
                  component={Button}
                  onClick={() => navigate("/register-customer")}
                >
                  <Typography
                    sx={{
                      fontSize: 30,
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      ":hover": {
                        bgcolor: "#1a1a1a",
                        color: "#EC6432",
                      },
                    }}
                    color="text.secondary"
                  >
                    <p>ลูกค้า</p>
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{
                    padding: 0,
                    minWidth: 275,
                  }}
                  component={Button}
                  onClick={() => navigate("/register-ownerstore")}
                >
                  <Typography
                    sx={{
                      // margin: 0,
                      fontSize: 30,
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      ":hover": {
                        bgcolor: "#1a1a1a",
                        color: "#EC6432",
                      },
                    }}
                    color="text.secondary"
                  >
                    <p>เจ้าของร้าน</p>
                  </Typography>
                </Card>
                <Grid item sx={{ flex: 1, marginTop: 3 }}>
                  <Link href="/login" variant="body2">
                    ย้อนกลับ
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
