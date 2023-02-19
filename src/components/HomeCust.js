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
  const [search, sestSearch] = useState("");
  const [alldata, setAlldata] = useState([]);
  const [dataSearch, setdataSearch] = useState([]);
  const [showalldata, setShowalldata] = useState(true);
  const [selectdata, setSelectdata] = useState([]);
  const [Checkbox_1, setCheckbox_1] = useState(true);
  const [Checkbox_2, setCheckbox_2] = useState(true);
  const [showselectdata, setShowselectdata] = useState(true);
  // const [showtextdata, setShowtextdata] = useState(true);
  useEffect(() => {
    axios.get("http://localhost:4000/store").then((response) => {
      setAlldata(response.data);
    });

    if (search === "" && Checkbox_1) {
      let result = alldata.filter((data) => data.store_religion === "0");
      setSelectdata(result);
      setShowselectdata(true);
      setShowalldata(false);
    }
    if (search === "" && Checkbox_2) {
      let result = alldata.filter((data) => data.store_religion === "1");
      setSelectdata(result);
      setShowselectdata(true);
      setShowalldata(false);
    }

    if (
      (search === "" && Checkbox_1 && Checkbox_2) ||
      (search === "" && !Checkbox_1 && !Checkbox_2)
    ) {
      setSelectdata(alldata);
      setShowselectdata(false);
      setShowalldata(true);
    }

    const options = {
      useExtendedSearch: true,
      includeScore: true,
      keys: ["store_name"],
    };
    const fuse = new Fuse(alldata, options);
    let result = fuse.search(search);

    setdataSearch(result);

    if (search && Checkbox_1) {
      let result = dataSearch.filter(
        (data) => data.item.store_religion === "0"
      );
      setdataSearch(result);
      setShowselectdata(false);
      setShowalldata(false);
    } else if (search && Checkbox_2) {
      let result = dataSearch.filter(
        (data) => data.item.store_religion === "1"
      );
      setdataSearch(result);
      setShowselectdata(false);
      setShowalldata(false);
    }

    if (search && Checkbox_1 && Checkbox_2) {
      setdataSearch(result);
      setShowselectdata(false);
      setShowalldata(false);
    }

    if (search === "") {
      if (Checkbox_1) {
        let result = alldata.filter((data) => data.store_religion === "0");
        setAlldata(result);
      }
      if (Checkbox_2) {
        let result = alldata.filter((data) => data.store_religion === "1");
        setAlldata(result);
      }
    }
    // if (dataSearch.length > 0) {
    //   setShowtextdata(true);

    // } else {
    //   setShowtextdata(true);
    // }

    // if (search.length > 0) {
    //   setNondataSearch(false);
    // } else {
    //   setNondataSearch(true);
    // }

    // if (showalldata) {
    //   setNondataSearch(false);
    // }
  }, [search, Checkbox_1, Checkbox_2]);

  const Search = (e) => {
    sestSearch(e.target.value);

    if (e.target.value === "") {
      setShowalldata(true);
    } else {
      setShowalldata(false);
    }
  };

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
          onChange={(e) => Search(e)}
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
          {dataSearch.map((data, index) => {
            return (
              <Box
                key={data.item.store_name + index}
                sx={{
                  display: "flex",
                  "& > :not(style)": {
                    m: 1,
                    width: "100%",
                    height: 128,
                  },
                }}
              >
                <Paper elevation={3}>{data.item.store_name}</Paper>
              </Box>
            );
          })}

          {showalldata &&
            alldata.map((data, index) => {
              return (
                <Grid item xs={1.3}>
                  <Box
                    key={data.store_name + index}
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
                        {/* <Grid item xs={1}>
                        <Box
                          sx={{
                            paddingTop: 4.6,
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component={Button}
                            sx={{
                              width: 100,
                              height: 50,
                              alignItems: "center",
                              ":hover": {
                                bgcolor: "#1a1a1a",
                                color: "#EC6432",
                              },
                            }}
                          >
                            ดูเมนู
                          </Box>
                        </Box>
                      </Grid> */}
                      </Grid>
                    </Paper>
                  </Box>
                </Grid>
              );
            })}

          {showselectdata &&
            selectdata.map((data, index) => {
              return (
                <Box
                  key={data.store_name + index}
                  sx={{
                    display: "flex",
                    "& > :not(style)": {
                      m: 1,
                      width: "100%",
                      height: 128,
                    },
                  }}
                >
                  <Paper elevation={3}>
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
                    {data.store_name}
                  </Paper>
                </Box>
              );
            })}
        </Stack>
        {false && (
          <>
            <p>ไม่มีรายการที่ต้องการค้นหา</p>
          </>
        )}
      </Container>
    </>
  );
}
