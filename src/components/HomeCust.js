import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

export default function HomeCust() {
  const [search, sestSearch] = useState("");
  const [dataSearch, setdataSearch] = useState([]);
  const [nondata, setNondata] = useState(true);
  const [alldata, setAlldata] = useState([]);
  const [findData, setFindData] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/store").then((response) => {
      setAlldata(response.data);
    //   setFindData(true);
    });
  }, []);

  const handleSearch = (e) => {
    sestSearch(e.target.value);
    if (search !== "") {
      e.preventDefault();
      const data = {
        store_name: search,
      };
      axios
        .post("http://localhost:4000/search-store", data)
        .then((response) => {
          setdataSearch(response.data);
          setNondata(false);

          if (response.data.length == 0) {
            setNondata(true);
            setFindData(false);
          }
          console.log(response.data.length);
        });
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
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack spacing={2} sx={{ marginTop: 2 }}>
          {dataSearch.map((data, index) => {
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
                <Paper elevation={3}>{data.store_name}</Paper>
              </Box>
            );
          })}

          {findData &&
            alldata.map((data, index) => {
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
                  <Paper elevation={3}>{data.store_name}</Paper>
                </Box>
              );
            })}
        </Stack>
        {nondata && (
          <>
            <p>ไม่มีรายการที่ต้องการค้นหา</p>
          </>
        )}
      </Container>
    </>
  );
}
