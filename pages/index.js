import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TableContainer,
  TableSortLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import styles from "../styles/Home.module.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function descendingComparator(a, b, orderBy) {
  if (orderBy === "date") {
    return (
      new Date(b[orderBy].split("-").reverse().join("-")).getTime().valueOf() -
      new Date(a[orderBy].split("-").reverse().join("-")).getTime().valueOf()
    );
  }
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "country", label: "Country Name" },
  { id: "cases", label: "Cases" },
  { id: "todayCases", label: "Today Cases" },
  { id: "deaths", label: "Deaths" },
  { id: "todayDeaths", label: "Today Deaths" },
  { id: "recovered", label: "Recovered" },
  { id: "todayRecovered", label: "todayRecovered" },
  { id: "active", label: "Active" },
  { id: "critical", label: "Critical" },
  { id: "casesPerOneMillion", label: "Cases Per Million" },
  { id: "deathsPerOneMillion", label: "Deaths Per Million" },
  { id: "tests", label: "Tests" },
  { id: "testsPerOneMillion", label: "Tests Per Million" },
  { id: "population", label: "Population" },
  { id: "oneCasePerPeople", label: "One Case Per People" },
  { id: "oneDeathPerPeople", label: "One Death Per People" },
  { id: "oneTestPerPeople", label: "One Test Per People" },
  { id: "activePerOneMillion", label: "Active Per Million" },
  { id: "recoveredPerOneMillion", label: "Recovered Per Million" },
  { id: "criticalPerOneMillion", label: "Critical Per Million" }
];

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            className={index === 0 ? "countryColumn" : ""}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

function index() {
  const [covidData, setCovidData] = useState([]);
  const [covidDataFull, setCovidDataFull] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("country");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getCovidData = () => {
    axios
      .get(`https://corona.lmao.ninja/v2/countries`)
      .then((res) => {
        setCovidData([...res.data]);
        setCovidDataFull([...res.data]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const onInputChange = (e) => {
    setSearchInput(e.target.value);
    if (!e.target.value) {
      setCovidData([...covidDataFull]);
    } else {
      let arr = [];
      covidDataFull.forEach((ele) => {
        let country = ele.country.toUpperCase();
        let input = e.target.value.toUpperCase();
        if (country.includes(input)) {
          arr.push(ele);
        }
      });
      setCovidData([...arr]);
    }
  };

  useEffect(() => {
    getCovidData();
  }, []);

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className={styles.covidTableParent}>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="text"
              placeholder="Search Country"
              value={searchInput}
              onChange={onInputChange}
            />
          </form>
        </div>
      </nav>
      <TableContainer className={styles.covidTable}>
        <Table stickyHeader>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {covidData.length ? (
              stableSort(covidData, getComparator(order, orderBy)).map(
                (row, index) => {
                  let count = index + 1;
                  return (
                    <StyledTableRow hover key={count}>
                      <StyledTableCell className="countryColumn">
                        <Link href={`/country/${row.country ?? ""}`}>
                          {row.country}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell>{row.cases}</StyledTableCell>
                      <StyledTableCell>{row.todayCases}</StyledTableCell>
                      <StyledTableCell>{row.deaths}</StyledTableCell>
                      <StyledTableCell>{row.todayDeaths}</StyledTableCell>
                      <StyledTableCell>{row.recovered}</StyledTableCell>
                      <StyledTableCell>{row.todayRecovered}</StyledTableCell>
                      <StyledTableCell>{row.active}</StyledTableCell>
                      <StyledTableCell>{row.critical}</StyledTableCell>
                      <StyledTableCell>
                        {row.casesPerOneMillion}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.deathsPerOneMillion}
                      </StyledTableCell>
                      <StyledTableCell>{row.tests}</StyledTableCell>
                      <StyledTableCell>
                        {row.testsPerOneMillion}
                      </StyledTableCell>
                      <StyledTableCell>{row.population}</StyledTableCell>
                      <StyledTableCell>{row.oneCasePerPeople}</StyledTableCell>
                      <StyledTableCell>{row.oneDeathPerPeople}</StyledTableCell>
                      <StyledTableCell>{row.oneTestPerPeople}</StyledTableCell>
                      <StyledTableCell>
                        {row.activePerOneMillion}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.recoveredPerOneMillion}
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.criticalPerOneMillion}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                }
              )
            ) : (
              <StyledTableRow>
                <TableCell colSpan={20} align={"center"}>
                  No data found
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default index;
