import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import jsonData from '../rat_type_data.json';
import '../Styles/filters_styles.css'

const Rat_type = () => {
  const [selectedKey, setSelectedKey] = useState(null);
  const totalkeys = Object.keys(jsonData).length;

  const handleKeyClick = (key) => {
    setSelectedKey(key);
  };

  return (
    <div className='container'>
      <h1 className="style-page-heading">Total Rat types : {totalkeys}</h1>
      <div>
        <br></br>
        <ul className="content-list">
          {Object.keys(jsonData).map((key) => (
            <li key={key}>
              <div className="content-item">
                <Link to={`/results/rat-type/${key}`}>
                  <button className="content-button" onClick={() => handleKeyClick(key)}>
                    {key}
                  </button>
                </Link>
                <div className="content-count">{`Total supi: ${Object.keys(jsonData[key]).length}`}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Rat_type;
