import React from 'react';
import { Link } from 'react-router-dom';
import jsonData from '../disconnet_reason_data.json';
import '../Styles/filters_styles.css';

const Diss_reason_Data = () => {
  const totalkeys = Object.keys(jsonData).length;

  return (
    <div className="container">
      <h1 className="style-page-heading">Total Disconnect reasons: {totalkeys}</h1>
      <div>
        <br />
        <ul className="content-list">
          {Object.keys(jsonData).map((key) => (
            <li key={key}>
              <div className="content-item">
                <Link to={`/results/disconnect-reason/${key}`}>
                  <button className="content-button">{key}</button>
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

export default Diss_reason_Data;
