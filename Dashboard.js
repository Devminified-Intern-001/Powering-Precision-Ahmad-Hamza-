import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "../ChartCss/barChart.css";
import "../StyleSheet/Dashboard.css";
import "../StyleSheet/Logout.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [columnsName, setColumnsName] = useState("Central 1");
  const [chartOf, setChartOf] = useState("comercialRegionData");
  const [columnsNamesList, setColumnsNamesList] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [formattedData, setFormattedData] = useState([
    ["Year", "LoadShedding(HRS)", { role: "style" }],
  ]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Retrieve user_name from local storage
    const storedUserName = localStorage.getItem("user_name");

    if (storedUserName) {
      setUser(storedUserName);
    }
  }, []);
  const [formattedData1, setFormattedData1] = useState([]);
  const [formattedData2, setFormattedData2] = useState([]);
  const [formattedData3, setFormattedData3] = useState([]);
  // useEffect(() => {

  //     const fetchData = async () => {
  //         try {
  //             const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
  //             const yearColors = {
  //                 '2017': '#4285F4',
  //                 '2018': '#34A853',
  //                 '2019': '#FBBC05',
  //                 // Add more years with respective colors here
  //             };
  //             const updatedFormattedData = [['Year', 'LoadShedding(HRS)', { role: 'style' }]];
  //             response.data.forEach(entry => {
  //                 const yearMonth = `${entry.Year}-${entry.Month}`;
  //                 updatedFormattedData.push([
  //                     yearMonth,
  //                     entry.Total,
  //                     yearColors[entry.Year],
  //                 ]);
  //             });
  //             setFormattedData(updatedFormattedData); // Update formattedData with fetched data
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         }
  //     };

  //     if (columnsName) {
  //         fetchData();
  //     }
  // }, [columnsName, chartOf]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get( `http://localhost:3001/api/${chartOf}?column=${columnsName}`);
            const yearColors = {
                '2017': '#4285F4',
                '2018': '#34A853',
                '2019': '#FBBC05',
                // Add more years with respective colors here
            };
            const updatedFormattedData = [['Year', 'LoadShedding(HRS)', { role: 'style' }]];
            response.data.forEach(entry => {
                const yearMonth = `${entry.Year}-${entry.Month}`;
                updatedFormattedData.push([
                    yearMonth,
                    entry.Total / 30,  // Divide the Total by 30 to get the average
                    yearColors[entry.Year],
                ]);
            });
            setFormattedData1(updatedFormattedData); // Update formattedData1 with fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (columnsName) {
        fetchData();
    }
}, [columnsName, chartOf]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
  //       const yearColors = {
  //         '2017': '#4285F4',
  //         '2018': '#34A853',
  //         '2019': '#FBBC05',
  //         // Add more years with respective colors here
  //       };
  //       const yearlyChartData = response.data.reduce((acc, entry) => {
  //         const year = entry.Year;
  //         if (!acc[year]) {
  //           acc[year] = { year: year, total: 0 };
  //         }
  //         acc[year].total += entry.Total;
  //         return acc;
  //       }, {});

  //       const updatedFormattedData = [['Year', 'LoadShedding(HRS)', { role: 'style' }]];
  //       Object.values(yearlyChartData).forEach(yearData => {
  //         updatedFormattedData.push([
  //           yearData.year.toString(),
  //           yearData.total,
  //           yearColors[yearData.year],
  //         ]);
  //       });

  //       setFormattedData(updatedFormattedData); // Update formattedData with fetched data
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   if (columnsName) {
  //     fetchData();
  //   }
  // }, [columnsName, chartOf]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
            const yearColors = {
                '2017': '#4285F4',
                '2018': '#34A853',
                '2019': '#FBBC05',
                // Add more years with respective colors here
            };
            const yearlyChartData = response.data.reduce((acc, entry) => {
                const year = entry.Year;
                if (!acc[year]) {
                    acc[year] = { year: year, total: 0 };
                }
                acc[year].total += entry.Total;
                return acc;
            }, {});

            const updatedFormattedData = [['Year', 'LoadShedding(HRS)', { role: 'style' }]];
            Object.values(yearlyChartData).forEach(yearData => {
                updatedFormattedData.push([
                    yearData.year.toString(),
                    yearData.total / 365,  // Divide the total by 365 to get the average
                    yearColors[yearData.year],
                ]);
            });

            setFormattedData2(updatedFormattedData); // Update formattedData2 with fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    if (columnsName) {
        fetchData();
    }
}, [columnsName, chartOf]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
        const updatedFormattedData = [['Date', 'LoadShedding(HRS)', { role: 'style' }]];
        response.data.forEach(entry => {
          const dateString = `${entry.Year}-${entry.Month}-${entry.Day}`;
          updatedFormattedData.push([
            dateString,
            entry.Total,
            '#4285F4', // You can set a default color here or use dynamic colors
          ]);
        });
        setFormattedData3(updatedFormattedData); // Update formattedData with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (columnsName) {
      fetchData();
    }
  }, [columnsName, chartOf]);










  const handleSortClick = () => {
    const sortedChartData = [...formattedData]; // Create a copy of the formatted data
    sortedChartData.sort((a, b) => b[1] - a[1]); // Sort the copy
    setSortedData(sortedChartData); // Store the sorted data separately
    setIsSorted(!isSorted); // Toggle isSorted state
  };

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/${chartOf}/columns`
        );
        setColumnsNamesList(response.data);
        setColumnsName(response.data[0]); // Set the default column name
      } catch (error) {
        console.error("Error fetching column names:", error);
      }
    };

    fetchColumns();
  }, [chartOf]);

  const handleChartChange = (e) => {
    setChartOf(e.target.value);
  };

  const handleInputChange = (e) => {
    setColumnsName(e.target.value);
  };

  const options = {
    chart: {
      title: "Company Performance",
      subtitle: "Load Shedding for each month of each year",
    },
    legend: "none",
    series: {
      0: {
        bar: {
          groupWidth: "90%", // Adjust the width of bars
        },
        spacing: 0.5,
      },
    },
    chartArea: {
      left: "5%",
      right: "1%",
      top: "5%", // Increase top margin to accommodate the title and subtitle
      bottom: "16%", // Increase bottom margin to accommodate the horizontal scrollbar
      width: "90%",
      height: "80%", // Adjust the height of the chart area
      backgroundColor: '#F5F5F5',
    },
    hAxis: {
      slantedText: true, // Slant the axis labels for better readability
      slantedTextAngle: 45, // Set the angle of slanted text
      textStyle: {
        fontSize: 10, // Adjust the font size of axis labels if needed
      },
      viewWindowMode: 'explicit',
      viewWindow: {
        min: 0, // Set the minimum value for the horizontal axis
      },
      gridlines: {
        count: -1, // Show gridlines for all labels
      },
    },
    vAxis: {
      viewWindowMode: 'explicit',
      viewWindow: {
        min: 0, // Set the minimum value for the vertical axis
      },
    },
    scrollbar: {
      // Add horizontal scrollbar
      enable: true,
      orientation: "horizontal",
    },
    margin: "auto",
  };



  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    // Handle logout logic here
    console.log("Logout successful");
  };

  return (
    <div>
      <div id="topbar" style={{ marginTop: "-80px" }}>
        <h3 className="dash-nav">Dashboard</h3>
        {user && (
          <h3 className="user-nav" style={{ marginTop: "0.4vh" }}>
            {user}
          </h3>
        )}
        <div
          className="custom-dropdown"
          id="dropdown"
          onClick={handleIconClick}
        >
          <i className="fas fa-user-circle icon-nav"></i>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/signin" onClick={handleLogoutClick}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="sec-1">
        <div
          style={{
            position: "fixed",
            fontFamily: "Arial, sans-serif",
            marginTop: "-16px",
          }}
          className="sidebar"
        >
          <nav>
            <ul className="list-group">
              <li
                style={{
                  padding: "0px",
                  borderRadius: "5px",
                  backgroundColor: "#9A0A0F",
                }}
              >
                <Link
                  style={{ paddingLeft: "12px", paddingRight: "13px" }}
                  to="/dashboard"
                >
                  DASHBOARD
                </Link>
              </li>
              <li>
                <Link
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                  to="/loadShd"
                >
                  LOAD SHEDDING CALCULATION
                </Link>
              </li>
              <li>
                <Link
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                  to="/uploadReport"
                >
                  UPLOAD REPORT
                </Link>
              </li>
              <li>
                <Link
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                  to="/reportGen"
                >
                  BILL CALCULATION & VALIDATION
                </Link>
              </li>
              <li>
                <Link
                  style={{ paddingLeft: "12px", paddingRight: "12px" }}
                  to="/billPre"
                >
                  BILL PREDICTION
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content">
          <div style={{ display: "flex", padding: "0px 20px" }}>
            <div className="index-sec">
              <div className="col-7">
                <select
                  className="form-select form-select-sm inputState"
                  value={chartOf}
                  onChange={handleChartChange}
                >
                  <option value="comercialRegionData">
                    Commercial Region Data
                  </option>
                  <option value="mbusData">Mbus Data</option>
                  <option value="mainregions">Main Regions Data</option>
                </select>
              </div>
            </div>

            <div className="index-sec">
              <div className="col-7">
                <select
                  className="form-select form-select-sm inputState"
                  value={columnsName}
                  onChange={handleInputChange}
                >
                  {columnsNamesList.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="index-sec">
              <div className="col-7">
                {/* <select className="form-select form-select-sm inputState">
                                    <option selected>MBU</option>
                                    <option value="1">C1-LHR-01</option>
                                    <option value="1">C1-LHR-02</option>
                                    <option value="1">C1-LHR-03</option>
                                    <option value="1">C1-LHR-04</option>
                                    <option value="1">C1-LHR-05</option>
                                    <option value="1">C1-LHR-06</option>
                                    <option value="1">C1-LHR-07</option>
                                    <option value="2">C2-KSR-03</option>
                                    <option value="3">C2-MKR-02</option>
                                    <option value="3">...</option>
                                </select> */}
                <button
                  className="form-select form-select-sm inputState"
                  onClick={handleSortClick}
                >
                  {isSorted ? "Original Data" : "Sort Descending"}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", padding: "10px 20px" }}>
            <div className="sec2">
              <div className="heading">
                <h2>Load-Shedding (HRS) - Column Chart</h2>
              </div>
              <div className="chart">
                <Chart
                  chartType="ColumnChart" // Change this to ColumnChart for bar chart
                  width="200%"
                  height="100%"
                  data={isSorted ? formattedData1.slice().sort((a, b) => b[1] - a[1]) : formattedData1}
                  options={options}
                />
              </div>
              <div className="heading">
                <h2>Load-Shedding (YR) - Column Chart</h2>
              </div>
              <div className="chart">
                <Chart
                  chartType="ColumnChart" // Change this to ColumnChart for bar chart
                  width="100%"
                  height="100%"
                  data={isSorted ? formattedData2.slice().sort((a, b) => b[1] - a[1]) : formattedData2}
                  options={options}
                />
              </div>
            </div>
            <div className="sec2">
              <div className="heading">
                <h2>Load-Shedding (HRS) - Line Chart</h2>
              </div>
              <div className="chart">
                <Chart
                  chartType="LineChart" // Change this to ColumnChart for bar chart
                  width="150%"
                  height="100%"
                  data={isSorted ? formattedData1.slice().sort((a, b) => b[1] - a[1]) : formattedData1}
                  options={options}
                />
              </div>
              <div className="heading">
                <h2>Load-Shedding (DY) - Pie Chart</h2>
              </div>
              <div className="chart">
                <Chart
                  chartType="PieChart" // Change this to ColumnChart for bar chart
                  width="100%"
                  height="100%"
                  data={isSorted ? formattedData2.slice().sort((a, b) => b[1] - a[1]) : formattedData2}
                  options={options}
                />
              </div>
            </div>
          </div>



          {/* <div style={{ display: "flex", padding: "20px" }}>
            <div className="sec2">
              <div className="heading">
                <h2>Load-Shedding (HRS)</h2>
              </div>
              <div className="chart">
                <Chart
                  chartType="ColumnChart" // Change this to ColumnChart for bar chart
                  width="150%"
                  height="100%"
                  data={isSorted ? sortedData : formattedData}
                  options={options}
                />
              </div>
              <div className="chart">
                <Chart
                  chartType="ColumnChart" // Change this to ColumnChart for bar chart
                  width="150%"
                  height="100%"
                  data={isSorted ? sortedData : formattedData}
                  options={options}
                />
              </div>
              
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;















// import { Link } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { Chart } from "react-google-charts";
// import axios from "axios";
// import "../ChartCss/barChart.css";
// import "../StyleSheet/Dashboard.css";
// import "../StyleSheet/Logout.css";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [columnsName, setColumnsName] = useState("Central 1");
//   const [chartOf, setChartOf] = useState("comercialRegionData");
//   const [columnsNamesList, setColumnsNamesList] = useState([]);
//   const [sortedData, setSortedData] = useState([]);
//   const [isSorted, setIsSorted] = useState(false);
//   const [formattedData, setFormattedData] = useState([
//     ["Year", "LoadShedding(HRS)", { role: "style" }],
//   ]);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     // Retrieve user_name from local storage
//     const storedUserName = localStorage.getItem("user_name");

//     if (storedUserName) {
//       setUser(storedUserName);
//     }
//   }, []);

//   useEffect(() => {

//       const fetchData = async () => {
//           try {
//               const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
//               const yearColors = {
//                   '2017': '#4285F4',
//                   '2018': '#34A853',
//                   '2019': '#FBBC05',
//                   // Add more years with respective colors here
//               };
//               const updatedFormattedData = [['Year', 'LoadShedding(HRS)', { role: 'style' }]];
//               response.data.forEach(entry => {
//                   const yearMonth = `${entry.Year}-${entry.Month}`;
//                   updatedFormattedData.push([
//                       yearMonth,
//                       entry.Total,
//                       yearColors[entry.Year],
//                   ]);
//               });
//               setFormattedData(updatedFormattedData); // Update formattedData with fetched data
//           } catch (error) {
//               console.error('Error fetching data:', error);
//           }
//       };

//       if (columnsName) {
//           fetchData();
//       }
//   }, [columnsName, chartOf]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `http://localhost:3001/api/${chartOf}?column=${columnsName}`
// //         );
// //         const yearColors = {
// //           2017: "#4285F4",
// //           2018: "#34A853",
// //           2019: "#FBBC05",
// //           // Add more years with respective colors here
// //         };
// //         const aggregatedData = {};
// //         response.data.forEach((entry) => {
// //           const year = entry.Year;
// //           if (!aggregatedData[year]) {
// //             aggregatedData[year] = 0;
// //           }
// //           aggregatedData[year] += entry.Total;
// //         });
// //         const updatedFormattedData = [
// //           ["Year", "LoadShedding(HRS)", { role: "style" }],
// //         ];
// //         const maxDataValue = Math.max(...Object.values(aggregatedData));
// //         const scaleFactor = maxDataValue > 0 ? 20 / maxDataValue : 1; // Calculate scale factor
// //         for (const year in aggregatedData) {
// //           const height = aggregatedData[year] * scaleFactor; // Calculate bar height based on scale factor
// //           updatedFormattedData.push([
// //             year,
// //             aggregatedData[year],
// //             height, // Set the height of the bars
// //           ]);
// //         }

// //         setFormattedData(updatedFormattedData); // Update formattedData with fetched data
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     if (columnsName) {
// //       fetchData();
// //     }
// //   }, [columnsName, chartOf]);

//   // useEffect(() => {
//   //     const fetchData = async () => {
//   //         try {
//   //             const response = await axios.get(`http://localhost:3001/api/${chartOf}?column=${columnsName}`);
//   //             const updatedFormattedData = [['Day', 'LoadShedding(HRS)', { role: 'style' }]];
//   //             const dayColors = {}; // To assign colors to each day
//   //             response.data.forEach(entry => {
//   //                 const day = `${entry.Year}-${entry.Month}-${entry.Day}`;
//   //                 if (!dayColors[day]) {
//   //                     dayColors[day] = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`; // Random color for each day
//   //                 }
//   //                 updatedFormattedData.push([
//   //                     day,
//   //                     entry.Total,
//   //                     dayColors[day],
//   //                 ]);
//   //             });
//   //             setFormattedData(updatedFormattedData); // Update formattedData with fetched data
//   //         } catch (error) {
//   //             console.error('Error fetching data:', error);
//   //         }
//   //     };

//   //     if (columnsName) {
//   //         fetchData();
//   //     }
//   // }, [columnsName, chartOf]);

//   //
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           `http://localhost:3001/api/${chartOf}?column=${columnsName}`
// //         );
// //         const weekColors = {
// //           // Add week-color mapping here if needed
// //         };
// //         const updatedFormattedData = [
// //           ["Week", "LoadShedding(HRS)", { role: "style" }],
// //         ];
// //         response.data.forEach((entry) => {
// //           const week = `Week ${entry.Week} ${entry.Year}`;
// //           updatedFormattedData.push([
// //             week,
// //             entry.Total,
// //             weekColors[week], // You can set colors based on weeks if needed
// //           ]);
// //         });
// //         setFormattedData(updatedFormattedData); // Update formattedData with fetched data
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     if (columnsName) {
// //       fetchData();
// //     }
// //   }, [columnsName, chartOf]);

//   const handleSortClick = () => {
//     const sortedChartData = [...formattedData]; // Create a copy of the formatted data
//     sortedChartData.sort((a, b) => b[1] - a[1]); // Sort the copy
//     setSortedData(sortedChartData); // Store the sorted data separately
//     setIsSorted(!isSorted); // Toggle isSorted state
//   };

//   useEffect(() => {
//     const fetchColumns = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3001/api/${chartOf}/columns`
//         );
//         setColumnsNamesList(response.data);
//         setColumnsName(response.data[0]); // Set the default column name
//       } catch (error) {
//         console.error("Error fetching column names:", error);
//       }
//     };

//     fetchColumns();
//   }, [chartOf]);

//   const handleChartChange = (e) => {
//     setChartOf(e.target.value);
//   };

//   const handleInputChange = (e) => {
//     setColumnsName(e.target.value);
//   };

//   const options = {
//     chart: {
//       title: "Company Performance",
//       subtitle: "Load Shedding for each month of each year",
//     },
//     legend: "none", // Hide legend to prevent duplicate legend items
//     series: {
//       0: {
//         // This represents the first series (bar)
//         bar: {
//           groupWidth: "90%", // Adjusts width of bars
//         },
//         // Adjust the space between bars
//         // You can use values between 0 to 1 for spacing
//         // For example, setting it to 0.5 will provide 50% space between bars
//         spacing: 0.5,
//       },
//     },
//     chartArea: {
//       // Adjust chart area to remove extra space
//       left: "11%",
//       right: "1%",
//       top: "1%",
//       bottom: "1%",
//       width: "70%",
//       height: "70%",
//     },
//     margin: "auto", // Center the chart horizontally
//   };

//   const handleIconClick = () => {
//     setDropdownOpen(!isDropdownOpen);
//   };

//   const handleLogoutClick = () => {
//     // Handle logout logic here
//     console.log("Logout successful");
//   };

//   return (
//     <div>
//       <div id="topbar" style={{ marginTop: "-80px" }}>
//         <h3 className="dash-nav">Dashboard</h3>
//         {user && (
//           <h3 className="user-nav" style={{ marginTop: "0.4vh" }}>
//             {user}
//           </h3>
//         )}
//         <div
//           className="custom-dropdown"
//           id="dropdown"
//           onClick={handleIconClick}
//         >
//           <i className="fas fa-user-circle icon-nav"></i>
//           {isDropdownOpen && (
//             <div className="dropdown-content">
//               <Link to="/signin" onClick={handleLogoutClick}>
//                 Logout
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="sec-1">
//         <div
//           style={{
//             position: "fixed",
//             fontFamily: "Arial, sans-serif",
//             marginTop: "-16px",
//           }}
//           className="sidebar"
//         >
//           <nav>
//             <ul className="list-group">
//               <li
//                 style={{
//                   padding: "0px",
//                   borderRadius: "5px",
//                   backgroundColor: "#9A0A0F",
//                 }}
//               >
//                 <Link
//                   style={{ paddingLeft: "12px", paddingRight: "13px" }}
//                   to="/dashboard"
//                 >
//                   DASHBOARD
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   style={{ paddingLeft: "12px", paddingRight: "12px" }}
//                   to="/loadShd"
//                 >
//                   LOAD SHEDDING CALCULATION
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   style={{ paddingLeft: "12px", paddingRight: "12px" }}
//                   to="/uploadReport"
//                 >
//                   UPLOAD REPORT
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   style={{ paddingLeft: "12px", paddingRight: "12px" }}
//                   to="/reportGen"
//                 >
//                   BILL REPORT GENERATOR
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   style={{ paddingLeft: "12px", paddingRight: "12px" }}
//                   to="/billPre"
//                 >
//                   BILL PREDICTION
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>
//         <div className="content">
//           <div style={{ display: "flex", padding: "20px" }}>
//             <div className="index-sec">
//               <div className="col-7">
//                 <select
//                   className="form-select form-select-sm inputState"
//                   value={chartOf}
//                   onChange={handleChartChange}
//                 >
//                   <option value="comercialRegionData">
//                     Commercial Region Data
//                   </option>
//                   <option value="mbusData">Mbus Data</option>
//                   <option value="mainregions">Main Regions Data</option>
//                 </select>
//               </div>
//             </div>

//             <div className="index-sec">
//               <div className="col-7">
//                 <select
//                   className="form-select form-select-sm inputState"
//                   value={columnsName}
//                   onChange={handleInputChange}
//                 >
//                   {columnsNamesList.map((name, index) => (
//                     <option key={index} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="index-sec">
//               <div className="col-7">
//                 {/* <select className="form-select form-select-sm inputState">
//                                     <option selected>MBU</option>
//                                     <option value="1">C1-LHR-01</option>
//                                     <option value="1">C1-LHR-02</option>
//                                     <option value="1">C1-LHR-03</option>
//                                     <option value="1">C1-LHR-04</option>
//                                     <option value="1">C1-LHR-05</option>
//                                     <option value="1">C1-LHR-06</option>
//                                     <option value="1">C1-LHR-07</option>
//                                     <option value="2">C2-KSR-03</option>
//                                     <option value="3">C2-MKR-02</option>
//                                     <option value="3">...</option>
//                                 </select> */}
//                 <button
//                   className="form-select form-select-sm inputState"
//                   onClick={handleSortClick}
//                 >
//                   {isSorted ? "Original Data" : "Sort Descending"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div style={{ display: "flex", padding: "20px" }}>
//             <div className="sec2">
//               <div className="heading">
//                 <h2>Load-Shedding (HRS)</h2>
//               </div>
//               <div className="chart">
//                 <Chart
//                   chartType="BarChart"
//                   width="100%"
//                   height="250%"
//                   data={isSorted ? sortedData : formattedData}
//                   options={options}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
