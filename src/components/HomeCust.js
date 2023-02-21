import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Fuse from "fuse.js";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

export default function HomeCust() {
  const [search, setSearch] = useState("");
  const [alldata, setAlldata] = useState([]);
  const [Checkbox_1, setCheckbox_1] = useState(true);
  const [Checkbox_2, setCheckbox_2] = useState(true);

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

  return (
    <>
      <Container sx={{ paddingTop: 8 }}>
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
      </Container>
    </>
  );
}
