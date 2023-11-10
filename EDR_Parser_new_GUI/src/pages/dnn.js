import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsonData from '../dnn_type_data.json';
import '../Styles/data.css'

const Dnn = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const totalkeys = Object.keys(jsonData).length;

  const handleKeyClick = (key) => {
    setSelectedKey(key);
  };

  return (
    <div className='container'>
      <h1 className="page-heading">Total DNN types : {totalkeys}</h1>
      <div>
        <br></br>
        <ul className="content-list">
          {Object.keys(jsonData).map((key) => {
            const urlFriendlyKey = encodeURIComponent(key.replace(/\s+/g, '-'));
            return (
              <li key={key}>
                <div className="content-item">
                  <Link to={`/results/dnn/${urlFriendlyKey}`}>
                    <button className="content-button" onClick={() => handleKeyClick(key)}>
                      {key}
                    </button>
                  </Link>
                  <div className="content-count">{`Total supi: ${Object.keys(jsonData[key]).length}`}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dnn;
