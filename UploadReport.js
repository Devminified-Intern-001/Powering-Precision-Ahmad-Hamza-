import React, { useEffect, useState, useRef } from "react";
import '../StyleSheet/Dashboard.css';
import '../StyleSheet/Logout.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UploadReport = () => {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [columnsName, setColumnsName] = useState("Central 1");
  const [tableOf, setTableOf] = useState("comercialRegionData");
  const [columnsNamesList, setColumnsNamesList] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('tableName', tableOf);
    formData.append('columnName', columnsName);
    formData.append('from', fromDate);
    formData.append('to', toDate);

    try {
      const response = await axios.post('http://localhost:3001/api/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('File uploaded successfully: ' + response.data.message);
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    }
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("user_name");
    if (storedUserName) {
      setUser(storedUserName);
    }
  }, []);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/${tableOf}/columns`
        );
        setColumnsNamesList(response.data);
        setColumnsName(response.data[0]); // Set the default column name
      } catch (error) {
        console.error("Error fetching column names:", error);
      }
    };

    fetchColumns();
  }, [tableOf]);

  const handleTableChange = (e) => {
    setTableOf(e.target.value);
  };

  const handleIconClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    console.log("Logout successful");
  };

  return (
    <div>
      <div id="topbar" style={{ marginTop: '-60px' }}>
        <h3 className="dash-nav">Dashboard &nbsp; / &nbsp; Upload Report</h3>
        {user && (
          <h3 className="user-nav" style={{ marginTop: "0.4vh" }}>
            {user}
          </h3>
        )}
        <div className="custom-dropdown" id="dropdown" onClick={handleIconClick}>
          <i className="fas fa-user-circle icon-nav"></i>
          {isDropdownOpen && (
            <div className="dropdown-content" style={{ marginLeft: '85.6vw' }}>
              <Link to="/signin" onClick={handleLogoutClick}>Logout</Link>
            </div>
          )}
        </div>
      </div>

      <div className="sec-1">
        <div style={{ position: 'fixed', fontFamily: 'Arial, sans-serif', marginTop: '4px' }} className="sidebar">
          <nav>
            <ul className="list-group">
              <li><Link style={{ paddingLeft: '12px', paddingRight: '13px' }} to="/dashboard">DASHBOARD</Link></li>
              <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/LoadShd">LOAD SHEDDING CALCULATION</Link></li>
              <li style={{ padding: '0px', borderRadius: '5px', backgroundColor: '#9A0A0F' }}><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/uploadReport">UPLOAD REPORT</Link></li>
              <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/reportGen">BILL CALCULATION & VALIDATION</Link></li>
              <li><Link style={{ paddingLeft: '12px', paddingRight: '12px' }} to="/billPre">BILL PREDICTION</Link></li>
            </ul>
          </nav>
        </div>

        <div className="main-div">
          <div className="main">
            <div className="upload-section">
              <h1>UPLOAD A REPORT</h1>

              <div style={{ display: "flex", padding: "0px 20px", justifyContent: "center" }}>
                <div className="index-sec" style={{ width: "29%", marginRight: "2%" }}>
                  <div className="col-7">
                    <select
                      className="form-select form-select-sm inputState"
                      value={tableOf}
                      onChange={handleTableChange}
                    >
                      <option value="comercialRegionData">Commercial Region Data</option>
                      <option value="mbusData">Mbus Data</option>
                      <option value="mainregions">Main Regions Data</option>
                    </select>
                  </div>
                </div>

                <div className="index-sec" style={{ width: "29%" }}>
                  <div className="col-7">
                    <select
                      className="form-select form-select-sm inputState"
                      value={columnsName}
                      onChange={(e) => setColumnsName(e.target.value)}
                    >
                      {columnsNamesList.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="from" style={{ margin: "4.1% 0% 0% 2.1%" }}>From</label>
                <input type="date" id="from" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="to" style={{ margin: "1.8% 0% 0% 2.1%" }}>To</label>
                <input type="date" id="to" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <img
                className="up-img"
                src="./Images/upload.png"
                alt="Button"
                onClick={handleImageClick}
                style={{ cursor: 'pointer', maxHeight: '130px', marginTop: "-2px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;
