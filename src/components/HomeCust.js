import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Fuse from "fuse.js";
import { IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function HomeCust() {
  const [search, sestSearch] = useState("");
  const [dataSearch, setdataSearch] = useState([]);
  const [showalldata, setNonshowalldata] = useState(true);
  const [alldata, setAlldata] = useState([]);
  const [nondataSearch, setNondataSearch] = useState(false);

  const [Selectfilter, setSelectfilter] = useState("");

  const whenSelectfilter = (e) => {
    setSelectfilter(e.target.value);
  };
  // console.log(Selectfilter);

  const optionFillter = {
    useExtendedSearch: true,
    includeScore: true,
    keys: ["store_name", "store_religion"],
  };

  const fuseFillter = new Fuse(alldata, optionFillter);

  useEffect(() => {
    const resultFillter = fuseFillter.search({
      $and: [{ store_name: search }, { store_religion: Selectfilter }],
    });
    console.log(resultFillter);
  }, [search, Selectfilter]);

  const options = {
    keys: ["store_name"],
  };
  const fuse = new Fuse(alldata, options);

  useEffect(() => {
    const result = fuse.search(search);
    setdataSearch(result);
    // console.log(result);

    if (dataSearch.length > 0) {
      setNondataSearch(false);
      // console.log("test");
    } else {
      setNondataSearch(true);
      // console.log("test");
    }

    if (search.length > 0) {
      setNondataSearch(false);
    } else {
      setNondataSearch(true);
    }

    if (showalldata) {
      setNondataSearch(false);
    }
  }, [search, Selectfilter]);

  useEffect(() => {
    axios.get("http://localhost:4000/store").then((response) => {
      setAlldata(response.data);
    });
    if (Selectfilter != "all" && Selectfilter != "") {
      axios
        .post("http://localhost:4000/store-filter1", {
          Selectfilter,
        })
        .then((response) => {
          setAlldata(response.data);
        });
    }
  }, [search]);

  const Search = (e) => {
    sestSearch(e.target.value);
    setNonshowalldata(false);
    if (e.target.value === "") {
      setNonshowalldata(true);
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={Search}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ minWidth: 120, marginTop: 3 }}>
          <FormControl>
            <InputLabel id="Select" size="23px">
              ตัวกรอง
            </InputLabel>
            <Select
              labelId="Select"
              id="Select"
              value={Selectfilter}
              label="Select"
              onChange={whenSelectfilter}
            >
              <MenuItem value={"all"}>ทั้งหมด</MenuItem>
              <MenuItem value={"0"}>ศาสนาพุทธ</MenuItem>
              <MenuItem value={"1"}>ศาสนาอิสลาม</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
        {nondataSearch && (
          <>
            <p>ไม่มีรายการที่ต้องการค้นหา</p>
          </>
        )}
      </Container>
    </>
  );
}
