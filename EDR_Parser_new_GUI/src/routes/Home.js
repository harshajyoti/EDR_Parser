import React, { useEffect, useState } from "react";
import homeImg from "../Images/edr_home3.jpg";
import "../Styles/home-comp.css";

function Home() {
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    // Start showing the second text after a delay
    const timer = setTimeout(() => {
      setShowSecondText(true);
    }, 2000); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, []);

  return (
    <div className="home">
      <img
        src={homeImg}
        alt="Description of the image"
      />
      <div className="text-overlay">
        <div className="center-text top-text">
          <h1 className="font-size">EDR Parser</h1>
        </div>
      </div>
      {/* <div className="text-overlay-2">
        <div className="animated_text">
        {showSecondText && (
          <div className="half left-half">
            <h1>A unified dashboard to</h1>
          </div>
        )}
        {showSecondText && (
          <div className="half right-half">
            <h1>streamline your deployment and testing needs.</h1>
          </div>
        )}
        </div>
    </div> */}
  </div>
  );
}

export default Home;
