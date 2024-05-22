import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import "./Dashboard.css";
import Sidebar from "../components/Sidebar";
import Maincontainer from "../components/Maincontainer";
import Maincontainer2 from "../components/Maincontainer2";
import Maincontainer3 from "../components/Maincontainer3";
import Maincontainer4 from "../components/Maincontainer4";
import Maincontainer5 from "../components/Maincontainer5";
import Topbar from "../components/Topbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingcomp from "../components/Landingcomp";
import { Workspaces } from "@mui/icons-material";
import mainIP from "../constant";
// import React, { useState } from "react";

const Dashboard = (props) => {
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [resourceGroupCount, setResourceGroupCount] = useState(0);
  const [ADFCount, setADFCount] = useState(0);
  const [pipelineCount, setPipelineCount] = useState(0);
  const [ChangeMainComponent, setChangeMainComponent] = useState(false);
  const [selectedOptions, setADFSelectedOptions] = useState([]);
  const [workspaceselect, setworkspaceselect] = useState(0);
  const [currentdata, setCurrentdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalPipeline, setGlobalPipeline] = useState("All");
  const Multipleadfclick = (index) => {
    setworkspaceselect(index);
  };
  useEffect(() => {
    fetch(`${mainIP}/Pipelines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedOptions),
    })
      .then((response) => response.json())
      .then((data) => {
        // setDummydata(data[2]);
        setCurrentdata(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [ChangeMainComponent]);
  return (
    <div className="dashboard">
      <div className="row top-section">
        <div className="col-12 remove-padding">
          <Topbar />
        </div>
      </div>

      <div className="row bottom-section ">
        <div className="col-3">
          <div className="sidebar">
            <Sidebar
              setSubC={setSubscriptionCount}
              setResGC={setResourceGroupCount}
              setADFC={setADFCount}
              setpipelineC={setPipelineCount}
              setmaincomponent={setChangeMainComponent}
              setADFSelectedOptions={setADFSelectedOptions}
              subscriptionOptions={props.subscriptionOptions}
              setGlobalPipeline = {setGlobalPipeline}
            />
          </div>
        </div>

        <div className="col-9">
          <div className="mainwindow">
            {ChangeMainComponent ? (
              <div className="workspace-section">
                {selectedOptions.map((value, index) => (
                  <button
                    key={value}
                    type="button"
                    className="btn btn-outline-primary workspace-btn-costum"
                    onClick={() => Multipleadfclick(index)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ) : null}

            {ChangeMainComponent ? (
              (() => {
                if (workspaceselect === 0) {
                  return (
                    <Maincontainer2
                      availabledata={currentdata[0]}
                      subC={subscriptionCount}
                      resGC={resourceGroupCount}
                      adfCount={ADFCount}
                      pipelineC={pipelineCount}
                      flag={true}
                      workspaces={selectedOptions}
                      workspaceselect={workspaceselect}
                      currentdata={currentdata[0]}
                      IsLoading={isLoading}
                      globalPipeline={globalPipeline}
                    />
                  );
                } else if (workspaceselect === 1) {
                  return (
                    <Maincontainer3
                      availabledata={currentdata[1]}
                      subC={subscriptionCount}
                      resGC={resourceGroupCount}
                      adfCount={ADFCount}
                      pipelineC={pipelineCount}
                      flag={true}
                      workspaces={selectedOptions}
                      workspaceselect={workspaceselect}
                      currentdata={currentdata[1]}
                      IsLoading={isLoading}
                    />
                  );
                } else if (workspaceselect === 3) {
                  return (
                    <Maincontainer4
                      availabledata={currentdata[3]}
                      subC={subscriptionCount}
                      resGC={resourceGroupCount}
                      adfCount={ADFCount}
                      pipelineC={pipelineCount}
                      flag={true}
                      workspaces={selectedOptions}
                      workspaceselect={workspaceselect}
                      currentdata={currentdata[3]}
                      IsLoading={isLoading}
                    />
                  );
                } else if (workspaceselect === 4) {
                  return (
                    <Maincontainer5
                      availabledata={currentdata[4]}
                      subC={subscriptionCount}
                      resGC={resourceGroupCount}
                      adfCount={ADFCount}
                      pipelineC={pipelineCount}
                      flag={true}
                      workspaces={selectedOptions}
                      workspaceselect={workspaceselect}
                      currentdata={currentdata[4]}
                      IsLoading={isLoading}
                    />
                  );
                } else {
                  return (
                    <Maincontainer
                      availabledata={currentdata[5]}
                      subC={subscriptionCount}
                      resGC={resourceGroupCount}
                      adfCount={ADFCount}
                      pipelineC={pipelineCount}
                      flag={true}
                      workspaces={selectedOptions}
                      workspaceselect={workspaceselect}
                      currentdata={currentdata[5]}
                      IsLoading={isLoading}
                    />
                  );
                }
              })()
            ) : (
              <Landingcomp
                subC={subscriptionCount}
                resGC={resourceGroupCount}
                adfCount={ADFCount}
                pipelineC={pipelineCount}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
