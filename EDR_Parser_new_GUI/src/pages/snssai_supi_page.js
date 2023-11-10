import React from 'react';
import { Link, useParams } from 'react-router-dom';
import jsonData from '../snssai_type_data.json';
import '../Styles/filters_styles.css'

const SupiPage = () => {
  const { key } = useParams();
  const originalKey = decodeURIComponent(key.replace(/-/g, ' ')
  .replace(/\s*>\s*/g, ' ->')
  .replace(/\(S\sNSSAI\)/g, '(S-NSSAI)')
  .replace(/\sN\s/g, '-N ')
);
  const supiKeys = Object.keys(jsonData[originalKey] || {});
  console.log("SUPI keys", supiKeys);

  console.log(originalKey);

  return (
    <div className='container'>
      <h1 className="page-heading">Supi's for {originalKey}</h1>
      <ul className="content-list">
        {supiKeys.map((subKey) => (
          <li originalKey={subKey}>
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
