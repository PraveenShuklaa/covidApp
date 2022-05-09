import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import moment from "moment";
import styles from "../../../styles/Home.module.css";
import Link from "next/link";

function index() {
  const router = useRouter();
  const { country } = router.query;
  const [countryCovidData, setCountryCovidData] = useState({});
  const [covidDataLoading, setCovidDataLoading] = useState(true);
  const [covidHistoryLoading, setCovidHistoryLoading] = useState(true);
  const [chartLabels, setChartLabels] = useState([]);
  const [casesData, setCasesData] = useState([]);
  const [deathsData, setDeathsData] = useState([]);
  const [recoveredData, setRecoveredData] = useState([]);

  useEffect(() => {
    if (router.asPath !== router.route) {
      getCountryCovidData(router.query.country);
      getCovidHistory(router.query.country);
    }
  }, [router]);

  const getCovidHistory = (countryName) => {
    axios
      .get(`https://corona.lmao.ninja/v2/historical`)
      .then((res) => {
        res.data.forEach((ele) => {
          if (ele.country === countryName) {
            let eleChartLabel = [];
            let eleCasesData = [];
            let eleDeathsData = [];
            let eleRecoveredData = [];
            for (let key in ele?.timeline?.cases) {
              if (ele.timeline.cases.hasOwnProperty(key)) {
                eleChartLabel.push(key);
                eleCasesData.push(ele?.timeline?.cases[key]);
              }
            }
            for (let key in ele?.timeline?.deaths) {
              if (ele.timeline.deaths.hasOwnProperty(key)) {
                eleDeathsData.push(ele.timeline.deaths[key]);
              }
            }
            for (let key in ele?.timeline?.recovered) {
              if (ele.timeline.recovered.hasOwnProperty(key)) {
                eleRecoveredData.push(ele.timeline.recovered[key]);
              }
            }
            setChartLabels([...eleChartLabel]);
            setCasesData([...eleCasesData]);
            setDeathsData([...eleDeathsData]);
            setRecoveredData([...eleRecoveredData]);
          }
        });
        setCovidHistoryLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCovidHistoryLoading(false);
      });
  };

  const getCountryCovidData = (countryName) => {
    axios
      .get(`https://corona.lmao.ninja/v2/countries/${countryName}`)
      .then((res) => {
        setCountryCovidData(res.data);
        setCovidDataLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCovidDataLoading(false);
      });
  };

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Cases",
        data: casesData,
        backgroundColor: "rgba(253,126,20)",
        borderColor: "rgba(253,126,20)"
      },
      {
        label: "deaths",
        data: deathsData,
        backgroundColor: "rgba(220,53,69)",
        borderColor: "rgba(220,53,69)"
      },
      {
        label: "recovered",
        data: recoveredData,
        backgroundColor: "rgba(25,135,84)",
        borderColor: "rgba(25,135,84)"
      }
    ]
  };

  if (covidDataLoading || covidHistoryLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  const options = {
    maintainAspectRatio: false
  };

  return (
    <div className="covidData">
      <Link href={"/"}>Go Back</Link>
      <div className="covidLineChart">
        <Line data={data} options={options} />
      </div>
      <div className={styles.countryTable}>
        <img
          src={countryCovidData.countryInfo?.flag ?? ""}
          alt="Country Flag"
        />
        {country}
        <p className="card p-1">
          Active <span>:</span>
          {countryCovidData.active ?? "N/A"}
        </p>
        <p className="card p-1">
          Active Per Million <span>:</span>
          {countryCovidData.activePerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Cases <span>:</span>
          {countryCovidData.cases ?? "N/A"}
        </p>
        <p className="card p-1">
          Cases Per Million <span>:</span>
          {countryCovidData.casesPerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Continent <span>:</span>
          {countryCovidData.continent ?? "N/A"}
        </p>
        <p className="card p-1">
          Critical <span>:</span>
          {countryCovidData.critical ?? "N/A"}
        </p>
        <p className="card p-1">
          Critical Per Million <span>:</span>
          {countryCovidData.criticalPerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Deaths <span>:</span>
          {countryCovidData.deaths ?? "N/A"}
        </p>
        <p className="card p-1">
          Deaths Per Million <span>:</span>
          {countryCovidData.deathsPerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Case Per People <span>:</span>
          {countryCovidData.oneCasePerPeople ?? "N/A"}
        </p>
        <p className="card p-1">
          Death Per People <span>:</span>
          {countryCovidData.oneDeathPerPeople ?? "N/A"}
        </p>
        <p className="card p-1">
          Test Per People <span>:</span>
          {countryCovidData.oneTestPerPeople ?? "N/A"}
        </p>
        <p className="card p-1">
          Population <span>:</span>
          {countryCovidData.population ?? "N/A"}
        </p>
        <p className="card p-1">
          Recovered <span>:</span>
          {countryCovidData.recovered ?? "N/A"}
        </p>
        <p className="card p-1">
          RecoveredPerOneMillion <span>:</span>
          {countryCovidData.recoveredPerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Tests <span>:</span>
          {countryCovidData.tests ?? "N/A"}
        </p>
        <p className="card p-1">
          Tests Per Million <span>:</span>
          {countryCovidData.testsPerOneMillion ?? "N/A"}
        </p>
        <p className="card p-1">
          Today Cases <span>:</span>
          {countryCovidData.todayCases ?? "N/A"}
        </p>
        <p className="card p-1">
          Today Deaths <span>:</span>
          {countryCovidData.todayDeaths ?? "N/A"}
        </p>
        <p className="card p-1">
          Today Recovered <span>:</span>
          {countryCovidData.todayRecovered ?? "N/A"}
        </p>
        <p className="card p-1">
          Updated at <span>:</span>
          {countryCovidData.updated
            ? moment(countryCovidData.updated).format("DD-MM-YYYY HH:MM:SS A")
            : "N/A"}
        </p>
      </div>
    </div>
  );
}

export default index;
