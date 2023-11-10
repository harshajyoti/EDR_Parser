import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Process.css';

function InputForm() {
  const [selectedInputType, setSelectedInputType] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputTypeChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedInputType(selectedValue);
    setSelectedOptions([]);
    setInputValue('');
  };

  const handleCheckboxChange = (option, isChecked) => {
    if (isChecked) {
      const updatedOptions = [...selectedOptions, { option, additionalInput: '' }];
      setSelectedOptions(updatedOptions);
    } else {
      const updatedOptions = selectedOptions.filter((item) => item.option !== option);
      setSelectedOptions(updatedOptions);
    }
  };

  const handleAdditionalInputChange = (index, value) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index].additionalInput = value;
    setSelectedOptions(updatedOptions);
  };

  const handleInputChange = (e, index) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = `${updatedOptions[index].split('$')[0]}$${e.target.value}`;
    setSelectedOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('selected_filter', selectedInputType);
      if (selectedInputType === 'DisconnectCause') {
        const formattedOptions = selectedOptions.map((option) => `${option.option}$${option.additionalInput}`);
        formData.append('input_value', formattedOptions.join(','));
      } else {
        formData.append('input_value', inputValue);
      }
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/process-input', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data.output);
    } catch (error) {
      // Check if the error is a response from the server
      if (error.response && error.response.data && error.response.data.error) {
        // Display an alert for the server error
        alert(error.response.data.error);
      } else {
        // Display a generic error alert
        alert('An error occurred. Please try again later.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="input-form-container">
        <h1>Please provide inputs</h1>
        <br />
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="Supi"
              checked={selectedInputType === 'Supi'}
              onChange={handleInputTypeChange}
            />
            Supi
          </label>
          <label>
            <input
              type="radio"
              value="Date"
              checked={selectedInputType === 'Date'}
              onChange={handleInputTypeChange}
            />
            Date
          </label>
          <label>
            <input
              type="radio"
              value="DisconnectCause"
              checked={selectedInputType === 'DisconnectCause'}
              onChange={handleInputTypeChange}
            />
            Disconnect cause
          </label>
          <label>
            <input
              type="radio"
              value="None"
              checked={selectedInputType === 'None'}
              onChange={handleInputTypeChange}
            />
            None
          </label>
        </div>

        {selectedInputType === 'DisconnectCause' && (
          <div>
            <p>Select Interface:</p>
            <br></br>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="N1"
                checked={selectedOptions.some((item) => item.option === 'N1')}
                onChange={(e) => handleCheckboxChange('N1', e.target.checked)}
              />
              <span>N1</span>
              {selectedOptions.some((item) => item.option === 'N1') && (
                <input
                  type="text"
                  placeholder="Enter error code"
                  value={selectedOptions.find((item) => item.option === 'N1')?.additionalInput || ''}
                  onChange={(e) => handleAdditionalInputChange(selectedOptions.findIndex((item) => item.option === 'N1'), e.target.value)}
                />
              )}
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="N2"
                checked={selectedOptions.some((item) => item.option === 'N2')}
                onChange={(e) => handleCheckboxChange('N2', e.target.checked)}
              />
              <span>N2</span>
              {selectedOptions.some((item) => item.option === 'N2') && (
                <input
                  type="text"
                  placeholder="Enter error code"
                  value={selectedOptions.find((item) => item.option === 'N2')?.additionalInput || ''}
                  onChange={(e) => handleAdditionalInputChange(selectedOptions.findIndex((item) => item.option === 'N2'), e.target.value)}
                />
              )}
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                value="N4"
                checked={selectedOptions.some((item) => item.option === 'N4')}
                onChange={(e) => handleCheckboxChange('N4', e.target.checked)}
              />
              <span>N4</span>
              {selectedOptions.some((item) => item.option === 'N4') && (
                <input
                  type="text"
                  placeholder="Enter error code"
                  value={selectedOptions.find((item) => item.option === 'N4')?.additionalInput || ''}
                  onChange={(e) => handleAdditionalInputChange(selectedOptions.findIndex((item) => item.option === 'N4'), e.target.value)}
                />
              )}
            </label>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>File path:</label>
                <input
                  type="text"
                  placeholder="Please enter the file path"
                  value={file}
                  onChange={(e) => setFile(e.target.value)}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        
        {selectedInputType && selectedInputType !== 'None' && selectedInputType !== 'DisconnectCause' && selectedInputType !== 'Date' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{selectedInputType}:</label>
              <input
                type="text"
                placeholder={`Please enter ${selectedInputType}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>File path:</label>
              <input
                type="text"
                placeholder="Please enter the file path"
                value={file}
                onChange={(e) => setFile(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        {selectedInputType === 'Date' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{selectedInputType}:</label>
              <input
                type="text"
                placeholder={`Please enter Date (YYYY/MM/DD)`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>File path:</label>
              <input
                type="text"
                placeholder="Please enter the file path"
                value={file}
                onChange={(e) => setFile(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
        {selectedInputType === 'None' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>File path:</label>
              <input
                type="text"
                placeholder="Please enter the file path"
                value={file}
                onChange={(e) => setFile(e.target.value)}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      <div className="main-result-container">
        <p>{"Selected filter: "}{selectedInputType}</p>
        {selectedInputType === 'DisconnectCause' && (
          <p>{"Filter value: "}{selectedOptions.map(option => `${option.option}$${option.additionalInput}`).join(',')}</p>
        )}
        {selectedInputType !== 'DisconnectCause' && (
          <p>{"Filter value: "}{inputValue}</p>
        )}
        <p>{"File path: "}{file}</p>
        <br />
        {isLoading && <div className="result-container">Processing, please wait...</div>}

        {result && !isLoading && (
          <div className="result-container">
            <h2>Result:</h2>
            {result.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputForm;
