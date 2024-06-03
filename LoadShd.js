import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../StyleSheet/Assets/styles.css';
import '../DataDisplay.css'
import '../StyleSheet/Logout.css';
import * as XLSX from 'xlsx';
import BeatLoader from "react-spinners/BeatLoader";


const LoadShedding = () => {

    const [user, setUser] = useState(null);

    const [calculatedData, setCalculatedData] = useState([]);
    const [showCalculatedData, setShowCalculatedData] = useState(true);

    const [showMainRegion, setShowMainRegion] = useState(false);
    const [mainRegionColumns, setMainRegionColumns] = useState([]);
    const [selectedMainRegionColumn, setSelectedMainRegionColumn] = useState('Main Region');
    const [mainRegionData, setMainRegionData] = useState([]);

    const [showComRegion, setShowComRegion] = useState(false);
    const [comRegionColumns, setComRegionColumns] = useState([]);
    const [selectedComRegionColumn, setSelectedComRegionColumn] = useState('Comercial Region');
    const [comRegionData, setComRegionData] = useState([]);

    const [showMbu, setShowMbu] = useState(false);
    const [mbuColumns, setMbuColumns] = useState([]);
    const [selectedMbuColumn, setSelectedMbuColumn] = useState('Mbu');
    const [mbuData, setMbuData] = useState([]);

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // Retrieve user_name from local storage
        const storedUserName = localStorage.getItem("user_name");

        if (storedUserName) {
            setUser(storedUserName);
        }
    }, []);

    useEffect(() => {
        fetchCalculatedData();
        fetchMainRegionColumns();
        fetchComRegionColumns();
        fetchMbuColumns();
    }, []);

    const fetchCalculatedData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/calculatedData');
            setCalculatedData(response.data);
        } catch (error) {
            console.error('Error fetching calculated data:', error);
        }
    };

    const fetchMainRegionColumns = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/mainregions/columns');
            setMainRegionColumns(['Main Region', ...response.data]);
        } catch (error) {
            console.error('Error fetching Main Region columns:', error);
        }
    };

    const fetchComRegionColumns = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/comercialRegionData/columns');
            setComRegionColumns(['Comercial Region', ...response.data]);
        } catch (error) {
            console.error('Error fetching Comercial Region columns:', error);
        }
    };

    const fetchMbuColumns = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/mbusData/columns');
            setMbuColumns(['Mbu', ...response.data]);
        } catch (error) {
            console.error('Error fetching Mbu columns:', error);
        }
    };

    const handleShowMainRegion = async () => {
        try {
            let response;

            if (selectedMainRegionColumn === 'Main Region') {
                response = await axios.get('http://localhost:3001/api/mainRegionsTableData', {
                    params: { from: fromDate, to: toDate }
                });
            } else {
                response = await axios.get(`http://localhost:3001/api/mainRegionsTableData/column/${selectedMainRegionColumn}`, {
                    params: { from: fromDate, to: toDate }
                });
            }

            setMainRegionData(response.data);
            setShowMainRegion(true);
            // setShowOriginal(false);
            setShowComRegion(false);
            setShowMbu(false);
            // setShowCalculatedBill(false);
            setShowCalculatedData(false);
        } catch (error) {
            console.error('Error fetching main region data:', error);
        }
    };

    const handleShowComRegion = async () => {
        try {
            let response;

            if (selectedComRegionColumn === 'Comercial Region') {
                response = await axios.get('http://localhost:3001/api/comercialRegionsTableData', {
                    params: { from: fromDate, to: toDate }
                });
            } else {
                response = await axios.get(`http://localhost:3001/api/comercialRegionsTableData/column/${selectedComRegionColumn}`, {
                    params: { from: fromDate, to: toDate }
                });
            }

            setComRegionData(response.data);
            setShowComRegion(true);
            setShowMainRegion(false);
            setShowMbu(false);
            setShowCalculatedData(false);
        } catch (error) {
            console.error('Error fetching main region data:', error);
        }
    };

    const handleShowMbu = async () => {
        try {
            let response;

            if (selectedMbuColumn === 'Mbu') {
                response = await axios.get('http://localhost:3001/api/mbusTableData', {
                    params: { from: fromDate, to: toDate }
                });
            } else {
                response = await axios.get(`http://localhost:3001/api/mbusTableData/column/${selectedMbuColumn}`, {
                    params: { from: fromDate, to: toDate }
                });
            }

            setMbuData(response.data);
            setShowMbu(true);
            setShowComRegion(false);
            setShowMainRegion(false);
            setShowCalculatedData(false);
        } catch (error) {
            console.error('Error fetching main region data:', error);
        }
    };

    const handleColumnChange = (selectedColumn) => {
        setSelectedMainRegionColumn(selectedColumn);
        setSelectedComRegionColumn(selectedColumn);
        setSelectedMbuColumn(selectedColumn);
    };


    const handleExportCSV = () => {
        // Extract data from the table based on the currently visible data
        const data = [];
        const header = [];

        const table = document.querySelector('.tableData');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // Extract header data
        thead.querySelectorAll('th').forEach(th => {
            header.push(th.textContent);
        });

        // Extract table rows
        tbody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(td => {
                rowData.push(td.textContent);
            });
            data.push(rowData);
        });

        // Combine header and data
        const csvData = [header, ...data].map(row => row.join(','));

        // Get the filename from the user
        const filename = prompt("Enter the filename to save as (including '.csv')", 'export.csv');
        if (!filename) {
            // If the user cancels or doesn't provide a filename, exit
            return;
        }
        // Create a data URI
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData.join('\n'));

        // Create a download link
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', filename);

        // Trigger the download
        link.click();
    };

    const handleExportExcel = () => {
        // Extract data from the table based on the currently visible data
        const data = [];
        const header = [];

        const table = document.querySelector('.tableData');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // Extract header data
        thead.querySelectorAll('th').forEach(th => {
            header.push(th.textContent);
        });

        // Extract table rows
        tbody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(td => {
                rowData.push(td.textContent);
            });
            data.push(rowData);
        });

        // Prompt the user for the filename
        const filename = prompt("Enter the filename to save as (including '.xlsx')", 'loadSheddingData.xlsx');
        if (!filename) {
            // If the user cancels or doesn't provide a filename, exit
            return;
        }
        // Create a worksheet
        const ws = XLSX.utils.aoa_to_sheet([header, ...data]);

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

        // Save the workbook with the user-provided filename
        XLSX.writeFile(wb, filename);
    };

    const handleCopyToClipboard = () => {
        const table = document.querySelector('.tableData');
        const range = document.createRange();
        range.selectNode(table);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        alert('Table data copied to clipboard!');
    };

    const handleIconClick = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogoutClick = () => {
        // Handle logout logic here
        console.log('Logout successful');
    };

    useEffect(() => {
        // Simulate data fetching delay
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulating a delay of 2 seconds
            setLoading(false);
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    return ( 
        <div style={{ paddingTop: '4.6%' }}>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous" />

            <header>
                <div className="header-path" style={{ fontSize: '18.5px', fontFamily: 'Arial, sans-serif' }}>Dashboard &nbsp; / &nbsp; Load Shedding Calculation</div>
                {user && (
                    <div className="user-nav" style={{ fontSize: '18.5px' }}>{user}</div>
                )}
                <div className="custom-dropdown" id="dropdown" onClick={handleIconClick}>
                    <i className="fas fa-user-circle icon-nav"></i>
                    {isDropdownOpen && (
                        <div className="dropdown-content" style={{ margin: '20px 67% 20px -40px' }}>
                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/signin" onClick={handleLogoutClick}>Logout</Link>
                        </div>
                    )}
                </div>
            </header>


            <div style={{ position: 'fixed', fontFamily: 'Arial, sans-serif' }} className="sidebar">
                <nav>
                    <ul className="list-group">
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '13px' }} to="/dashboard">DASHBOARD</Link></li>
                        <li style={{ padding: '0px', borderRadius: '5px', backgroundColor: '#9A0A0F' }}><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/loadShd">LOAD SHEDDING CALCULATION</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/uploadReport">UPLOAD REPORT</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/reportGen">BILL CALCULATION & VALIDATION</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/billPre">BILL PREDICTION</Link></li>
                        {/* Add more sidebar items here */}
                    </ul>
                </nav>
            </div>

            {/* Main Form */}
            <div style={{ marginLeft: '278px' }} className="main-form">

                {/* Form Sections */}
                <div style={{ marginRight: '60px' }} className="row main-inputs">
                    <div style={{ display: 'flex', paddingLeft: '2.1%' }} className="col-4">
                        <label style={{ width: '20px' }} className="form-label">Main Region</label>
                        <div className="col-7">
                            <select className="form-select form-select-sm inputState" value={selectedMainRegionColumn} onChange={(e) => handleColumnChange(e.target.value)} style={{ marginLeft: '90%', minWidth: '170.3px' }}>
                                {mainRegionColumns.map((column, index) => (
                                    <option key={index} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '29px' }} className="col-4">
                        <label style={{ width: '50px' }} className="form-label">Commercial Region</label>
                        <div className="col-8">
                            <select className="form-select form-select-sm inputState" value={selectedComRegionColumn} onChange={(e) => handleColumnChange(e.target.value)} style={{ margin: '26px 0px 0px 60px', width: '170.3px' }}>
                                {comRegionColumns.map((column, index) => (
                                    <option key={index} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '58px' }} className="col-4">
                        <label style={{ width: '37px' }} className="form-label">MBU</label>
                        <div className="col-8">
                            <select className="form-select form-select-sm inputState" value={selectedMbuColumn} onChange={(e) => handleColumnChange(e.target.value)} style={{ width: '170.3px' }}>
                                {mbuColumns.map((column, index) => (
                                    <option key={index} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* <!-- 2 --> */}
                <div style={{ marginRight: '60px' }} className="row main-inputs">
                    <div style={{ display: 'flex' }} className="col-4">
                        <label style={{ width: '120px', textAlign: 'center' }} className="form-label">Site Code</label>
                        <div className="col-7">
                            <select className="form-select form-select-sm inputState" style={{ minWidth: '170.3px', marginLeft: '21%' }}>
                                <option selected>Choose...</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '30px' }} className="col-4">
                        <label style={{ width: '15px' }} className="form-label">From</label>
                        <div className="col-8">
                            <input style={{ marginLeft: '94px', width: '170.3px' }} type="date" className="form-control form-control-sm" value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '62px' }} className="col-4">
                        <label style={{ width: '34px' }} className="form-label">To</label>
                        <div className="col-8">
                            <input style={{ width: '170.3px' }} type="date" className="form-control form-control-sm" value={toDate}
                                onChange={(e) => setToDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Calculate LS Button */}
                <div style={{ textAlign: 'right', padding: '6px 35px 15px 0px', display: 'flex', justifyContent: 'flex-end' }} className="submit-btn data-controls">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-4">
                        <div className="col-7">
                            <select className="form-select form-select-sm inputState" style={{ backgroundColor: '#9A0A0F', color: 'white', border: 'none', height: '5vh', width: '11vw' }}>
                                <option selected>Calculate LS</option>
                                <option value="1" onClick={handleShowMainRegion}> Main Region </option>
                                <option value="2" onClick={handleShowComRegion}> Comertial Region</option>
                                <option value="3" onClick={handleShowMbu}> MBU</option>
                            </select>
                        </div>
                    </div>
                    {/* <button style={{ fontWeight: '600', marginTop: '30px' }} type="submit" 
                    onClick={ handleShowMainRegion}>Calculate LS</button> */}
                </div>

            </div>

            {/* Data Container */}
            <section style={{ marginLeft: '278px', marginRight: '20px' }} className="data-container">
                <div className="data-controls">
                    <button onClick={handleExportCSV}>CSV</button>
                    <button onClick={handleExportExcel}>EXCEL</button>
                    <button onClick={handleCopyToClipboard}>COPY</button>
                </div>
                <div className="data-table">
                    {/* Data Table */}
                    <div className="alignTable">

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '13vh 20vw 0 0' }}>
                                <BeatLoader color="white" />
                            </div>
                        ) : (
                            <div className="tableData" style={{ minWidth: '1050px', marginRight: '-4px' }}>
                                {showComRegion && (
                                    <table>
                                        <thead>
                                            <tr>
                                                {selectedComRegionColumn === 'Comercial Region' ? (
                                                    <>
                                                        <th>Date</th>
                                                        {comRegionColumns
                                                            .filter(column => column !== 'Comercial Region')
                                                            .map((column, index) => (
                                                                <th key={index}>{`${column} (HRS)`}</th>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        <th>Date</th>
                                                        <th>{`${selectedComRegionColumn} (HRS)`}</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {comRegionData.map((row, index) => (
                                                <tr key={index}>
                                                    {selectedComRegionColumn === 'Comercial Region' ? (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            {comRegionColumns
                                                                .filter(column => column !== 'Comercial Region')
                                                                .map((column, index) => (
                                                                    <td key={index}>{row[column]}</td>
                                                                ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            <td>{row[selectedComRegionColumn]}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {showMbu && (
                                    <table>
                                        <thead>
                                            <tr>
                                                {selectedMbuColumn === 'Mbu' ? (
                                                    <>
                                                        <th>Date</th>
                                                        {mbuColumns
                                                            .filter(column => column !== 'Mbu')
                                                            .map((column, index) => (
                                                                <th key={index}>{`${column} (HRS)`}</th>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        <th>Date</th>
                                                        <th>{`${selectedMbuColumn} (HRS)`}</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mbuData.map((row, index) => (
                                                <tr key={index}>
                                                    {selectedMbuColumn === 'Mbu' ? (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            {mbuColumns
                                                                .filter(column => column !== 'Mbu')
                                                                .map((column, index) => (
                                                                    <td key={index}>{row[column]}</td>
                                                                ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            <td>{row[selectedMbuColumn]}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {showCalculatedData && (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Site Code</th>
                                                <th>Major City</th>
                                                <th>OSV</th>
                                                <th>Region</th>
                                                <th>Comm Region</th>
                                                <th>Commercial with Split</th>
                                                <th>Zone</th>
                                                <th>MBU</th>
                                                <th>SOB</th>
                                                <th>LV</th>
                                                <th>GRM</th>
                                                <th>MF</th>
                                                <th>Total LS (MINS)</th>
                                                <th>Total LS (HRS)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calculatedData.map((row, index) => (
                                                <tr key={index}>
                                                    <td>{row.Date}</td>
                                                    <td>{row['Site Code']}</td>
                                                    <td>{row['Major City']}</td>
                                                    <td>{row.OSV}</td>
                                                    <td>{row.Region}</td>
                                                    <td>{row['Comm Region']}</td>
                                                    <td>{row['Commercial with Split']}</td>
                                                    <td>{row.Zone}</td>
                                                    <td>{row.MBU}</td>
                                                    <td>{row.SOB}</td>
                                                    <td>{row.LV}</td>
                                                    <td>{row.GRM}</td>
                                                    <td>{row.MF}</td>
                                                    <td>{row['Total Load shedding (MINS)']}</td>
                                                    <td>{row['Total Load Shedding (HRS)']}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {showMainRegion && (
                                    <table>
                                        <thead>
                                            <tr>
                                                {selectedMainRegionColumn === 'Main Region' ? (
                                                    <>
                                                        <th>Date</th>
                                                        {mainRegionColumns
                                                            .filter(column => column !== 'Main Region')
                                                            .map((column, index) => (
                                                                <th key={index}>{`${column} (HRS)`}</th>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        <th>Date</th>
                                                        <th>{`${selectedMainRegionColumn} (HRS)`}</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mainRegionData.map((row, index) => (
                                                <tr key={index}>
                                                    {selectedMainRegionColumn === 'Main Region' ? (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            {mainRegionColumns
                                                                .filter(column => column !== 'Main Region')
                                                                .map((column, index) => (
                                                                    <td key={index}>{row[column]}</td>
                                                                ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td>{row.Date}</td>
                                                            <td>{row[selectedMainRegionColumn]}</td>
                                                        </>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </section>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>

        </div>
    );
};

export default LoadShedding;


