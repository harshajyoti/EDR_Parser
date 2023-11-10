import React from "react";
import { Link } from "react-router-dom";
import '../Styles/results.css';

const Results = () => {
  return (
    <div>
      <br></br>
      <h1 className="h1">Results</h1>
      <div className="buttonContainer">
        <Link to="/results/data">
          <button>Available supi's</button>
        </Link>
        <Link to="/results/disconnect-reason">
          <button>Disconnect Reason</button>
        </Link>
        <Link to="/results/rat-type">
          <button>Rat type</button>
        </Link>
        <Link to="/results/snssai">
          <button>SNSSAI</button>
        </Link>
        <Link to="/results/dnn">
          <button>DNN</button>
        </Link>
      </div>
    </div>
  );
};

export default Results;
