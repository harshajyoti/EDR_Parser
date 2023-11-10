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
              <li key={index}>{value[index]}</li>
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

  const blockNames = ['UE/gNB/eNB/AMF/MME', 'PeerSMF', 'SMF+PGWc/cnSGWc', 'UDM', 'PCF', 'CHF', 'UPF'];

  return (
    <div>
      <h1 className="page-heading">{mainKey}</h1>
      {Object.entries(mainObject).map(([key, value]) =>
        renderKeyValue(key, value)
      )}

      <div className="blocks-container">
        {blockNames.map((blockName, index) => (
          <div className="block" key={index}>
            <span className="block-name">{blockName}</span>
            <br></br>
            <div className="vertical-line"></div>
            
          </div>
        ))}
        <div className='value-13'>
          <ul>
          {Object.entries(mainObject).map(([key, value], index) => {
            const procedure_name_value = value[13].split('(Procedure-Name)');
            const procedure_name = procedure_name_value.length > 1 ? procedure_name_value[1].trim() : value[13];
            
            const displayValues = value

            return (
              <li key={key}>
                <div>{key}</div>
                <br />
                <div>({procedure_name})</div>
                <br/>
                <div>

                {/* ----- 1 Starting messages ----- Loop to print the Starting messages that must be printed at the beginning of the Transaction */}

                  {displayValues.map((each_val, i) => {

                    // S5S8CreateSessReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8CreateSessReq)")) {
                      if (
                        value.includes("(Procedure-Name) PDN Connect [LTE]") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // S5S8DeleteSessReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8DeleteSessReq) 2055")) {
                      if (
                        value.includes("(Procedure-Name) PDN Disconnect") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // S5S8ModifyBearerReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8ModifyBearerReq) 2053")) {
                      if (
                        value.includes("(Procedure-Name) PDU 5G to 4G Handover") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // S5S8CreateBearerReq PeerSMF/SMF to UE
                    
                    if (each_val.includes("(EVENT-ID): (S5S8CreateBearerReq) 2059")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // S5S8DeleteBearerReq PeerSMF/SMF to UE

                    if (each_val.includes("(EVENT-ID): (S5S8DeleteBearerReq) 2057")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // S5S8UpdateBearerReq PeerSMF/SMF to UE

                    if (each_val.includes("(EVENT-ID): (S5S8UpdateBearerReq) 2062")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-PeerSMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-PeerSMF-UE">
                                <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextReleaseReq Bi_Directional UE - SMF / UE - PeerSMF

                    if (each_val.includes("(EVENT-ID): (N11SmContextReleaseReq) 1304") && value[7].includes("(Event-Name) N11SmContextReleaseReq")) {
                      if (
                        value[13].includes("(Procedure-Name) PDU Session Release - AMF initiated") && 
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471")
                        ) {
                          // For Roaming
                          if (value[i+3].includes("Failed")){
                            return (
                              <React.Fragment key={i}>
                                {/* <div>Roaming</div> */}
                                <div className='event-id-text-UE-PeerSMF-BiDir'>
                                  {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                                </div>
                                <div className="line-container-UE-PeerSMF-BiDir">
                                  <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                  <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                  <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                                </div>
                              </React.Fragment>
                            );
                          }
                          else {
                            return (
                              <React.Fragment key={i}>
                                {/* <div>Roaming</div> */}
                                <div className='event-id-text-UE-PeerSMF-BiDir'>
                                  {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                                </div>
                                <div className="line-container-UE-PeerSMF-BiDir">
                                  <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                  <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                  <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                                </div>
                              </React.Fragment>
                            );
                          }
                        }
                        else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextCreateReq UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (N11SmContextCreateReq) 1287") && value[7].includes("(Event-Name) N11SmContextCreateReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11EbiAssignmentReq when event-name is N11EbiAssignmentReq

                    if (each_val.includes("(EVENT-ID): (N11EbiAssignmentReq) 1302") && value[7].includes("(Event-Name) N11EbiAssignmentReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11N1N2MessageTransferReq if event-name is N11N1N2MessageTransferReq 

                    if (each_val.includes("(EVENT-ID): (N11N1N2MessageTransferReq) 1299") && value[7].includes("(Event-Name) N11N1N2MessageTransferReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }
                    
                    // N11SmContextUpdateReq if event-name is N11SmContextUpdateReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextUpdateReq) 1290") && value[7].includes("(Event-Name) N11SmContextUpdateReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextStatusNotifyReq if event-name is N11SmContextStatusNotifyReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextStatusNotifyReq) 1310") && value[7].includes("(Event-Name) N11SmContextStatusNotifyReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextUpdateModifyReq if event-name is N11SmContextUpdateModifyReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextUpdateModifyReq) 1293") && value[7].includes("(Event-Name) N11SmContextUpdateModifyReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11N1N2MessageTransferFailNotificationReq if event-name is N11N1N2MessageTransferFailNotificationReq

                    if (each_val.includes("(EVENT-ID): (N11N1N2MessageTransferFailNotificationReq) 1339") && value[7].includes("(Event-Name) N11N1N2MessageTransferFailNotificationReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextRetrieveReq if event-name is N11SmContextRetrieveReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextRetrieveReq) 1307") && value[7].includes("(Event-Name) N11SmContextRetrieveReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionCreateReq Only Roaming call

                    if (each_val.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") && value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444")) {
                      {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyUpdateReq SMF to PCF NOTE: No Roaming will be there this event uses n7 interface b/w SMF to PCF or vice-versa
                    // N7SmPolicyUpdateReq if procedure-name is not PDU Session Modify - PCF initiated

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyUpdateReq) 3332") && value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionVsmfUpdateReq if event-id is N11EbiAssignmentReq SMF-PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") && value.includes("(EVENT-ID): (N11EbiAssignmentReq) 1302")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    return null;
                  })}

{/* ----------------------------------------------------------------------------------------------------------------------------- */}

                {/* ----- 2 Remaining Messsages and some response ----- Loop to print the Remaining message that must come after starting messages */}

                  {displayValues.map((each_val, i) => {
                  
                    // N11SmContextReleaseReq Bi_Directional UE - SMF / UE - PeerSMF

                    if (each_val.includes("(EVENT-ID): (N11SmContextReleaseReq) 1304") && !value[7].includes("(Event-Name) N11SmContextReleaseReq")) {
                      if (
                        value[13].includes("(Procedure-Name) PDU Session Release - AMF initiated") && 
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471")
                        ) {
                          // For Roaming
                          if (value[i+3].includes("Failed")){
                            return (
                              <React.Fragment key={i}>
                                {/* <div>Roaming</div> */}
                                <div className='event-id-text-UE-PeerSMF-BiDir'>
                                  {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                                </div>
                                <div className="line-container-UE-PeerSMF-BiDir">
                                  <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                  <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                  <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                                </div>
                              </React.Fragment>
                            );
                          }
                          else {
                            return (
                              <React.Fragment key={i}>
                                {/* <div>Roaming</div> */}
                                <div className='event-id-text-UE-PeerSMF-BiDir'>
                                  {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                                </div>
                                <div className="line-container-UE-PeerSMF-BiDir">
                                  <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                  <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                  <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                                </div>
                              </React.Fragment>
                            );
                          }
                        }
                        else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextCreateReq when event-name is not N11SmContextCreateReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextCreateReq)") && !value[7].includes("(Event-Name) N11SmContextCreateReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF">
                                <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+8].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+8]} {value[i+9]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF">
                                <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11EbiAssignmentReq when event-name is not N11EbiAssignmentReq

                    if (each_val.includes("(EVENT-ID): (N11EbiAssignmentReq) 1302") && !value[7].includes("(Event-Name) N11EbiAssignmentReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11N1N2MessageTransferReq if event-name is not N11N1N2MessageTransferReq

                    if (each_val.includes("(EVENT-ID): (N11N1N2MessageTransferReq) 1299") && !value[7].includes("(Event-Name) N11N1N2MessageTransferReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextUpdateReq if event-name is not N11SmContextUpdateReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextUpdateReq) 1290") && !value[7].includes("(Event-Name) N11SmContextUpdateReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]} {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextStatusNotifyReq if event-name is not N11SmContextStatusNotifyReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextStatusNotifyReq) 1310") && !value[7].includes("(Event-Name) N11SmContextStatusNotifyReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextUpdateModifyReq if event-name is not N11SmContextUpdateModifyReq

                    if (each_val.includes("(EVENT-ID): (N11SmContextUpdateModifyReq) 1293") && !value[7].includes("(Event-Name) N11SmContextUpdateModifyReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11N1N2MessageTransferFailNotificationReq if event-name is not N11N1N2MessageTransferFailNotificationReq

                    if (each_val.includes("(EVENT-ID): (N11N1N2MessageTransferFailNotificationReq) 1339") && !value[7].includes("(Event-Name) N11N1N2MessageTransferFailNotificationReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N11SmContextRetrieveReq if event-name is N11SmContextRetrieveReq UE-PeerSMF

                    if (each_val.includes("(EVENT-ID): (N11SmContextRetrieveReq) 1307") && !value[7].includes("(Event-Name) N11SmContextRetrieveReq")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-PeerSMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-PeerSMF-BiDir">
                                <hr className="horizontal-line-UE-PeerSMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-PeerSMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-PeerSMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        // For Non-Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-UE-SMF-BiDir'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-UE-SMF-BiDir">
                                <hr className="horizontal-line-UE-SMF-BiDir" /> {/* Horizontal line */}
                                <div className="ray-line-UE-SMF-BiDir"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-UE-SMF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyUpdateReq if procedure-name is not PDU Session Modify - PCF initiated SMF-PCF

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyUpdateReq) 3332") && !value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionVsmfUpdateReq if N11EbiAssignmentReq is there SMF-PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") && !value.includes("(EVENT-ID): (N11EbiAssignmentReq) 1302")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }
                    
                    // ---- Response ---- S5S8CreateSessReq - SMF to UE/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8CreateSessReq)")) {
                      if (
                        value.includes("(Procedure-Name) PDN Connect [LTE]") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-SMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-SMF-UE">
                              <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-PeerSMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-PeerSMF-UE">
                              <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

                    // ---- Response ---- S5S8ModifyBearerReq - SMF to UE/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8ModifyBearerReq) 2053")) {
                      if (
                        value.includes("(Procedure-Name) PDU 5G to 4G Handover") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-SMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-SMF-UE">
                              <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-PeerSMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-PeerSMF-UE">
                              <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

                    // ---- Response ---- S5S8ModifyBearerReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8CreateBearerReq) 2059")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-SMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-SMF">
                              <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-PeerSMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-PeerSMF">
                              <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

                    // ---- Response ---- S5S8ModifyBearerReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8DeleteBearerReq) 2057")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-SMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-SMF">
                              <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-PeerSMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-PeerSMF">
                              <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

                    // ---- Response ---- S5S8ModifyBearerReq - UE to SMF/PeerSMF

                    if (each_val.includes("(EVENT-ID): (S5S8UpdateBearerReq) 2062")) {
                      if (
                        value.includes("(Procedure-Name) PDN Session Modify - Bearer Add/Del/Mod") &&
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        !value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        !value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        !value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        !value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        !value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Non-Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-SMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-SMF">
                              <hr className="horizontal-line-UE-SMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-SMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-UE-PeerSMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-UE-PeerSMF">
                              <hr className="horizontal-line-UE-PeerSMF" /> {/* Horizontal line */}
                              <div className="ray-line-UE-PeerSMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

      // -------- SMF to UDM --------

                    // N10SubscribeForNotificationReq SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10RegistrationRequest) 1313") && value.includes("(EVENT-ID): (N10RegistrationRequest) 1313")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N10SubscribeForNotificationReq SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10SubscriptionFetchReq) 1316") && value.includes("(EVENT-ID): (N10SubscriptionFetchReq) 1316")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N10SubscribeForNotificationReq SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10SubscribeForNotificationReq) 1319") && value.includes("(EVENT-ID): (N10SubscribeForNotificationReq) 1319")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N10DeregistrationRequest SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10DeregistrationRequest) 1325") && value.includes("(EVENT-ID): (N10DeregistrationRequest) 1325")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N10UnsubscribeForNotificationReq SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10UnsubscribeForNotificationReq) 1432") && value.includes("(EVENT-ID): (N10UnsubscribeForNotificationReq) 1432")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N10UpdateNotifyReq SMF to UDM / UDM to SMF

                    if (each_val.includes("(EVENT-ID): (N10UpdateNotifyReq) 1322") && value.includes("(EVENT-ID): (N10UpdateNotifyReq) 1322")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UDM'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UDM">
                                <hr className="horizontal-line-SMF-UDM" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UDM"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UDM-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyCreateReq

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyCreateReq) 3329") && value.includes("(EVENT-ID): (N7SmPolicyCreateReq) 3329")) {
                      {
                        if (value[i+6].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+6]} {value[i+7]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyDeleteReq

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyDeleteReq) 3335") && value.includes("(EVENT-ID): (N7SmPolicyDeleteReq) 3335")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyTerminateNotifyReq

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyTerminateNotifyReq) 3341") && value.includes("(EVENT-ID): (N7SmPolicyTerminateNotifyReq) 3341")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N7SmPolicyUpdateNotifyReq

                    if (each_val.includes("(EVENT-ID): (N7SmPolicyUpdateNotifyReq) 3338") && value.includes("(EVENT-ID): (N7SmPolicyUpdateNotifyReq) 3338")) {
                      {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PCF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PCF">
                                <hr className="horizontal-line-SMF-PCF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PCF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-PCF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

      // -------- SMF to CHF or PeerSmf to CHF--------
                    
                    // N40ChargingDataCreateReq 

                    if (each_val.includes("(EVENT-ID): (N40ChargingDataCreateReq) 1003")) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N40ChargingDataReleaseReq 

                    if (each_val.includes("(EVENT-ID): (N40ChargingDataReleaseReq) 1005")) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated") ||
                        value.includes("(Procedure-Name) PDU Session Release - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N40ChargingDataUpdateReq 

                    if (each_val.includes("(EVENT-ID): (N40ChargingDataUpdateReq) 1004")) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N40ChargingNotificationReq 

                    if (each_val.includes("(EVENT-ID): (N40ChargingNotificationReq) 3588")) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-CHF">
                                <hr className="horizontal-line-PeerSMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-CHF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-CHF">
                                <hr className="horizontal-line-SMF-CHF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-CHF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-CHF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

      // -------- SMF - UPF or PeerSmf to UPF --------

                    // N4SessionEstablishmentReq 

                    if (each_val.includes("(EVENT-ID): (N4SessionEstablishmentReq) 524") ) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N4SessionModificationReq 

                    if (each_val.includes("(EVENT-ID): (N4SessionModificationReq) 527" )) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Modify - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N4SessionReleaseReq 

                    if (each_val.includes("(EVENT-ID): (N4SessionReleaseReq) 530" )) {
                      if (
                        value.includes("(Procedure-Name) Pdu Create Procedure - HSMF") ||
                        value.includes("(Procedure-Name) PDU Session Release - PCF initiated")) {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }

                      else if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // If true the line from Peersmf to CHF
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-UPF">
                                <hr className="horizontal-line-PeerSMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-PeerSMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                      else {
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF"/> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-UPF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-UPF">
                                <hr className="horizontal-line-SMF-UPF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UPF"></div> {/* Arrow pointing right */}
                                <div className="ray-line-left-SMF-UPF-BiDir"></div>
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // ---- Response ---- N16PduSessionCreateReq - SMF to PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") && value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444")) {
                      {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            <div className='event-id-text-SMF-PeerSMF'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-SMF-PeerSMF">
                              <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                              <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                    }

                    // N16VsmfPduSessionReleaseReq Roaming call PeerSMF to SMF

                    if (each_val.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") && value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionHsmfUpdateReq Roaming call PeerSMF to SMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") && value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF"/> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionHsmfUpdateReqClient Roaming call PeerSMF to SMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") && value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-PeerSMF-SMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-PeerSMF-SMF">
                                <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                                <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16VsmfPduSessionCreateReq Roaming call SMF to PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") && value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionNotifyReqClient Roaming call SMF to PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488") && value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionVsmfUpdateReqClient Roaming call SMF to PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") && value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    // N16PduSessionNotifyReq Roaming call SMF to PeerSMF

                    if (each_val.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") && value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458")) {
                      {
                        // For Roaming
                        if (value[i+3].includes("Failed")){
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res {value[i+3]} {value[i+4]}
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                        else {
                          return (
                            <React.Fragment key={i}>
                              <div className='event-id-text-SMF-PeerSMF'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0]}/Res
                              </div>
                              <div className="line-container-SMF-PeerSMF">
                                <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                      }
                    }

                    return null;
                  })}

                {/* ----- Remaining Response messages */}

                  {displayValues.map((each_val, i) => {

                    // ---- Response ---- N11SmContextCreateReq SMF/PeerSMF to UE

                    if (each_val.includes("(EVENT-ID): (N11SmContextCreateReq) 1287")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            {/* <div>Roaming</div> */}
                            <div className='event-id-text-PeerSMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-PeerSMF-UE">
                              <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Non-Roaming
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                    }

                    // ---- Response ---- N11SmContextUpdateReq SMF/PeerSMF to UE

                    if (each_val.includes("(EVENT-ID): (N11SmContextUpdateReq) 1290")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            {/* <div>Roaming</div> */}
                            <div className='event-id-text-PeerSMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-PeerSMF-UE">
                              <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Non-Roaming
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                    }

                    // ---- Response ---- S5S8DeleteSessReq SMF/PeerSMF to UE

                    if (each_val.includes("(EVENT-ID): (S5S8DeleteSessReq) 2055")) {
                      if (
                        value.includes("(Procedure-Name) PDU Session Establishment VSMF") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReq) 1451") ||
                        value.includes("(EVENT-ID): (N16PduSessionCreateReq) 1444") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionReleaseReq) 1471") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReq) 1447") ||
                        value.includes("(EVENT-ID): (N16PduSessionHsmfUpdateReqClient) 1477") ||
                        value.includes("(EVENT-ID): (N16VsmfPduSessionCreateReq) 1468") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReq) 1458") ||
                        value.includes("(EVENT-ID): (N16PduSessionVsmfUpdateReqClient) 1478") ||
                        value.includes("(EVENT-ID): (N16PduSessionNotifyReqClient) 1488")
                      ) {
                        // For Roaming
                        return (
                          <React.Fragment key={i}>
                            {/* <div>Roaming</div> */}
                            <div className='event-id-text-PeerSMF-UE'>
                              {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                            </div>
                            <div className="line-container-PeerSMF-UE">
                              <hr className="horizontal-line-PeerSMF-UE" /> {/* Horizontal line */}
                              <div className="ray-line-PeerSMF-UE"></div> {/* Arrow pointing right */}
                            </div>
                          </React.Fragment>
                        );
                      }
                      else {
                        // For Non-Roaming
                          return (
                            <React.Fragment key={i}>
                              {/* <div>Roaming</div> */}
                              <div className='event-id-text-SMF-UE'>
                                {each_val.split("(EVENT-ID): (")[1].split(")")[0].replace('Req', 'Res')}
                              </div>
                              <div className="line-container-SMF-UE">
                                <hr className="horizontal-line-SMF-UE" /> {/* Horizontal line */}
                                <div className="ray-line-SMF-UE"></div> {/* Arrow pointing right */}
                              </div>
                            </React.Fragment>
                          );
                        }
                    }

                    // // ------ (Procedure-Name) PDU Session Release - VPLMN initiated ------

                    // if (each_val.includes("(Procedure-Name) PDU Session Release - VPLMN initiated")) {
                    //   {
                    //     return (
                    //       <React.Fragment key={i}>
                    //         {/* <div>Roaming</div> */}
                    //         <div className='event-id-text-PeerSMF-SMF'>
                    //           {"PDU Session Release - VPLMN initiated Res"}
                    //         </div>
                    //         <div className="line-container-PeerSMF-SMF">
                    //           <hr className="horizontal-line-PeerSMF-SMF" /> {/* Horizontal line */}
                    //           <div className="ray-line-PeerSMF-SMF"></div> {/* Arrow pointing right */}
                    //         </div>
                    //       </React.Fragment>
                    //     );
                    //   }
                    // }

                    // // ------ (Procedure-Name) PDU Session Release - VPLMN initiated ------

                    // if (each_val.includes("(Procedure-Name) PDU Session Release - UE initiated")) {
                    //   {
                    //     return (
                    //       <React.Fragment key={i}>
                    //         {/* <div>Roaming</div> */}
                    //         <div className='event-id-text-SMF-PeerSMF'>
                    //           {"PDU Session Release - UE initiated Res"}
                    //         </div>
                    //         <div className="line-container-SMF-PeerSMF">
                    //           <hr className="horizontal-line-SMF-PeerSMF" /> {/* Horizontal line */}
                    //           <div className="ray-line-SMF-PeerSMF"></div> {/* Arrow pointing right */}
                    //         </div>
                    //       </React.Fragment>
                    //     );
                    //   }
                    // }

                    return null
                  })}
                </div>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default DisplayData;
