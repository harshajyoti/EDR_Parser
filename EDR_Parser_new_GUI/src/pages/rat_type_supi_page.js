import React from 'react';
import { Link, useParams } from 'react-router-dom';
import jsonData from '../rat_type_data.json';
import '../Styles/filters_styles.css'

const SupiPage = () => {
  const { key } = useParams();
  const supiKeys = Object.keys(jsonData[key] || {});

  return (
    <div className='container'>
      <h1 className="page-heading">Supi's for {key}</h1>
      <ul className="content-list">
        {supiKeys.map((subKey) => (
          <li key={subKey}>
            <Link to={`/display/${subKey}`}>
              <button className="content-button">{subKey}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupiPage;
