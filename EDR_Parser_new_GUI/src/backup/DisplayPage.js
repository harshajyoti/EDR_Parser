import React, { useState } from 'react';
import jsonData from '../file_data.json';
import { useParams } from 'react-router-dom';
import '../Styles/DisplayPage.css';

const DisplayData = () => {
  const { key: mainKey } = useParams();
  const mainObject = jsonData[mainKey];

  const [expandedLists, setExpandedLists] = useState({});

  const toggleListExpansion = (listKey) => {
    setExpandedLists((prevExpandedLists) => ({
      ...prevExpandedLists,
      [listKey]: !prevExpandedLists[listKey],
    }));
  };

  const renderKeyValue = (key, value) => {
    if (Array.isArray(value)) {
      const isExpanded = expandedLists[key] || false;
      const displayItems = isExpanded ? value : value.slice(0, 8);

      return (
        <div key={key}>
          <strong>{key}:</strong>
          <ul>
            {displayItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {value.length > 8 && (
              <button className='button-decor' onClick={() => toggleListExpansion(key)}>
                {isExpanded ? 'See Less' : 'See More'}
              </button>
          )}
          <br />
        </div>
      );
    }
  };

  const blockNames = ['UE/gNB/eNB/AMF/MME', 'SMF+PGWc/cnSGWc', 'UDM', 'PCF', 'CHF', 'UPF'];

  return (
    <div>
      <h1 className="page-heading">{mainKey}</h1>
      {Object.entries(mainObject).map(([key, value]) =>
        renderKeyValue(key, value)
      )}
  
      <div className="blocks-container">
        {blockNames.map((blockName, index) => (
          <div key={index} className="block">
            <span className="block-name">{blockName}</span>
            <br></br>
            {index < blockNames.length && <div className="vertical-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default DisplayData;
