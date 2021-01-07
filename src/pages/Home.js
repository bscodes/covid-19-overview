import React, { useEffect, useState } from 'react';
import { getList } from '../services/api';
import { GoPrimitiveDot } from 'react-icons/go';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import './Home.scss';
import Card from '../components/card/Card';

const Home = () => {
  const [list, setList] = useState([]);
  const [sumOfCases, setSumOfCases] = useState([
    {
      "cases": "",
      "recovered": "",
      "deaths": ""
    }
  ]);
  const [sumofDailyCases, setSumofDailyCases] = useState([{
    "dailycases": "",
    "dailyrecovered": "",
    "dailydeaths": ""
  }]);

  // State variable to keep track of all the expanded rows
  // By default, nothing expanded. Hence initialized with empty array.
  const [expandedRows, setExpandedRows] = useState([]);

  // State variable to keep track which row is currently expanded.
  const [expandState, setExpandState] = useState({});

  const [showMoreClicked, setShowMoreClicked] = useState(false);

  // get the list  
  useEffect(() => {
    const getSortedList = () => {
      let mounted = true;
      getList()
      .then(items => {
        if(mounted) {
          // sort covid cases in descending order
          const sorted = items.sort((a, b) => parseFloat(b.cases) - parseFloat(a.cases));
  
          // by default, show only first 15 countries
          if (!showMoreClicked) {
            sorted.splice(15, sorted.length);
          }
          setList(sorted);
          console.log(sorted);
        }
      })
      return () => mounted = false;
    }
    getSortedList();
  }, [showMoreClicked])
  
  // sum of cases
  useEffect(() => {
    const getSumofCases = () => {
      getList()
      .then(items => {
        // with this function we can pass all cases, recovered and deaths 
        // in their own arrays and get the total numbers
        const sum = param => items.map(item => item[param]).flat().reduce((a, b) => a + b, 0);

        setSumOfCases({
          "cases": numberWithCommas(sum('cases')),
          "recovered": numberWithCommas(sum('recovered')),
          "deaths": numberWithCommas(sum('deaths'))
        });

        setSumofDailyCases({
          "dailycases": numberWithCommas(sum('todayCases')),
          "dailyrecovered": numberWithCommas(sum('todayRecovered')),
          "dailydeaths": numberWithCommas(sum('todayDeaths'))
        })
      })
    }
    getSumofCases();
  }, [])

  const handleExpandRow = (event, countryId) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(countryId);

    let obj = {};
    isRowExpanded ? (obj[countryId] = false) :  (obj[countryId] = true);
    setExpandState(obj);

    // If the row is expanded, we are here to hide it. Hence remove
    // it from the state variable. Otherwise add to it.
    const newExpandedRows = isRowExpanded ?
          currentExpandedRows.filter(id => id !== countryId) :
          currentExpandedRows.concat(countryId);

    setExpandedRows(newExpandedRows);
  }

  const handleShowMoreClicked = () => {
    setShowMoreClicked(!showMoreClicked);
  }

  // print numbers with commas
  const numberWithCommas = x => {
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  }

  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="mt-3 mb-3">
            <Card
            title="Confirmed"
            number={sumOfCases.cases} 
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="mt-3 mb-3">
            <Card
              title="Recovered"
              number={sumOfCases.recovered} 
            />
          </div>
        </div>
        <div className="col-lg-4">
          <div className="mt-3 mb-3">
            <Card
              title="Deaths"
              number={sumOfCases.deaths} 
            />
          </div>
        </div>
      </div>
      <div className="wrapper row">
        <div className="col-lg-12">
          <div className="table-wrapper mt-3 mb-5">
            <div className="title-wrapper">
              <div className="top">
                <div className="blink">
                  <h2 className="live p-0 m-0"> <GoPrimitiveDot/> Live </h2>
                </div>
                <h2 className="section-title">
                  Situation by Country
                </h2>
              </div>
              <div className="hint-wrapper">
                <p className="hint">
                   <h2> <BsFillInfoCircleFill/> Click on a country for details </h2>
                </p>
              </div>
            </div>
            <table className="table" >
              <thead>
              <tr>
                  <th > # </th>
                  <th > &nbsp; </th>
                  <th >Confirmed</th>
                  <th >Recovered</th>
                  <th >Deaths</th>
              </tr>

              </thead>

              <tbody>

              {list.map((item, index) =>
                <> 
                <tr 
                  key={ uuidv4() } 
                  onClick={event => handleExpandRow(event, item.countryInfo._id)} {  ...expandState[item.countryInfo._id] ? 'Hide' : 'Show' }       
                >
                  <td > {index + 1} </td>
                  <td className="flag"> 
                    <img src={item.countryInfo.flag} alt={item.country} className="list-image" /> 
                    <p className="m-0" > 
                      {item.country} 
                    </p> 
                  </td>
                  <td>{numberWithCommas(item.cases)}</td>
                  <td> {item.recovered === 0 ? "N/A" : numberWithCommas(item.recovered)} </td>
                  <td> {numberWithCommas(item.deaths)} </td>
                </tr>
                
                {
                  expandedRows.includes(item.countryInfo._id) ? 
                  <tr>
                    <td colSpan="6">
                      <div className="details text-left">
                        <h4 className="details-title"> Details </h4>
                        <ul className="list-group">
                          <li className="list-group-item">
                            <span><b>Today Cases:</b></span> {' '}
                            <span> { item.todayCases === 0 ? "Not updated" : item.todayCases } </span>
                          </li>
                          <li className="list-group-item">
                            <span><b>Critical:</b></span> {' '}
                            <span> { item.critical } </span>
                          </li>
                          <li className="list-group-item">
                            <span><b>Today Deaths:</b></span> {' '}
                            <span> { item.todayDeaths === 0 ? "Not updated" : item.todayDeaths } </span>
                          </li>
                          <li className="list-group-item">
                            <span><b>Today Recovered:</b></span> {' '}
                            <span> { item.todayRecovered === 0 ? "Not updated" : item.todayRecovered } </span>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr> : null
                }
                </>
              )}
              
              </tbody>       
            </table>
            <div className="button-wrapper d-flex">
              <button className="btn mx-auto" onClick={handleShowMoreClicked}>
                { showMoreClicked ? 
                  <> Show less country <BiChevronUp/> </> 
                  : 
                  <> Show all countries <BiChevronDown/> </> 
                }
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    </>
  );
}

export default Home;
