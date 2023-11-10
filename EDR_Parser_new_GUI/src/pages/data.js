import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsonData from '../file_data.json';
import '../Styles/data.css'

const DataPage = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const totalkeys = Object.keys(jsonData).length;

  const handleKeyClick = (key) => {
    setSelectedKey(key);
  };

  return (
    <div>
      <h1 className="page-heading">Total Supi's : {totalkeys}</h1>
      <div>
        <br></br>
        <ul className="supi-list">
          {Object.keys(jsonData).map((key) => (
            <li key={key}>
              <Link to={`/display/${key}`}>
                <button className="supi-button" onClick={() => handleKeyClick(key)}>
                  {key}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataPage;
