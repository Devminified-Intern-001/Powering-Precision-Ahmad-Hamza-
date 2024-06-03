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

    const [selectedMainRegion, setSelectedMainRegion] = useState('');
    const [selectedComRegion, setSelectedComRegion] = useState('');
    const [selectedMbu, setSelectedMbu] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState([]);
    const [billResults, setBillResults] = useState({});
    const [unitPrice, setUnitPrice] = useState('');


    useEffect(() => {
        // Retrieve user_name from local storage
        const storedUserName = localStorage.getItem("user_name");

        if (storedUserName) {
            setUser(storedUserName);
        }
    }, []);


    const handleMainRegionChange = (event) => {
        setSelectedMainRegion(event.target.value);
    };

    const handleComRegionChange = (event) => {
        setSelectedComRegion(event.target.value);
    };

    const handleMbuChange = (event) => {
        setSelectedMbu(event.target.value);
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;

        if (name === 'fromDate') {
            setFromDate(value);
        } else if (name === 'toDate') {
            setToDate(value);
        }
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/predict', {
                selectedMainRegion,
                selectedComRegion,
                selectedMbu,
                fromDate,
                toDate,
                unitPrice
            });
            setPredictions(response.data.predictions);
            setBillResults(response.data.bill_results); // Update bill_results state
            setLoading(false);
        } catch (error) {
            console.error('Error fetching predictions:', error);
            setLoading(false);
        }
    };

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
                <div className="header-path" style={{ fontSize: '18.5px', fontFamily: 'Arial, sans-serif' }}>Dashboard &nbsp; / &nbsp; Bill Prediction</div>
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


            <div style={{ position: 'fixed', fontFamily: 'Arial, sans-serif', paddingTop: '20px' }} className="sidebar">
                <nav>
                    <ul className="list-group">
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/dashboard">DASHBOARD</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/loadShd">LOAD SHEDDING CALCULATION</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/uploadReport">UPLOAD REPORT</Link></li>
                        <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/reportGen">BILL CALCULATION & VALIDATION</Link></li>
                        <li style={{ padding: '0px', borderRadius: '5px', backgroundColor: '#9A0A0F' }}><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/billPre">BILL PREDICTION</Link></li>
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
                            <select className="form-select form-select-sm inputState" value={selectedMainRegion} onChange={handleMainRegionChange} style={{ marginLeft: '90%', minWidth: '170.3px' }}>
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
                            <select className="form-select form-select-sm inputState" value={selectedComRegion} onChange={handleComRegionChange} style={{ margin: '26px 0px 0px 60px', width: '170.3px' }}>
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
                            <select className="form-select form-select-sm inputState" value={selectedMbu} onChange={handleMbuChange} style={{ width: '170.3px' }}>
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
                        <label style={{ width: '120px', textAlign: 'center' }} className="form-label">Unit Price   *</label>
                        <div className="col-7">
                            <input
                                type="number"
                                className="form-control form-control-sm inputState"
                                placeholder="Enter unit price..."
                                style={{ minWidth: '170.3px', marginLeft: '21%' }}
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '30px' }} className="col-4">
                        <label style={{ width: '15px' }} className="form-label">From</label>
                        <div className="col-8">
                            <input style={{ marginLeft: '94px', width: '170.3px' }} type="date" className="form-control form-control-sm" name="fromDate" value={fromDate} onChange={handleDateChange} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '62px' }} className="col-4">
                        <label style={{ width: '34px' }} className="form-label">To</label>
                        <div className="col-8">
                            <input style={{ width: '170.3px' }} type="date" className="form-control form-control-sm" name="toDate" value={toDate} onChange={handleDateChange} />
                        </div>
                    </div>
                </div>

                {/* Calculate LS Button */}
                <div style={{ textAlign: 'right', padding: '6px 35px 15px 0px', display: 'flex', justifyContent: 'flex-end' }} className="submit-btn data-controls">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="col-4">
                        <div className="col-7">
                            <button className="btn btn-primary" onClick={handlePredict} disabled={loading} style={{ backgroundColor: '#9A0A0F', color: 'white', border: 'none', height: '5vh', width: '11vw' }}>
                                {loading ? <BeatLoader color="#fff" size={10} /> : 'Predict LS'}
                            </button>
                        </div>
                    </div>
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
                        <div className="tableData" style={{ minWidth: '1050px', marginRight: '-4px' }}>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>LS Prediction (HRS)</th>
                                        <th>Electricity Bill</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(predictions).map((key, index) => (
                                        <tr key={index}>
                                            <td>{key}</td>
                                            <td>{predictions[key]}</td>
                                            <td>{billResults[key]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>

        </div>
    );
};

export default LoadShedding;


