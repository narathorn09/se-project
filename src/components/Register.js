import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";

export default function Register() {
  let navigate = useNavigate();

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
          <Typography component="h1" variant="h5">
            ประเภทของสมาชิกที่ต้องการสมัคร
          </Typography>
          <Box noValidate sx={{ mt: 3 }} >
            <Grid  spacing={2}>
              <Grid item xs={12} sx={{marginBottom: 5}}>
                <Card
                  sx={{ minWidth: 275 }}
                  component={Button}
                  onClick={() => navigate("/register-customer")}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 30 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      ลูกค้า
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card
                  sx={{ minWidth: 275 }}
                  component={Button}
                  onClick={() => navigate("/register-ownerstore")}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 30 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      เจ้าของร้าน
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
