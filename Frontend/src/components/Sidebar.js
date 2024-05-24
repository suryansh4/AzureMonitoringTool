import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import mainIP from "../constant";
const Sidebar = (props) => {
  const [subscription, setSubscription] = useState("All");
  const [resourceGroup, setResourceGroup] = useState("All");
  const [resource, setResource] = useState("All");
  const [pipeline, setPipeline] = useState("All");
  const [ADFOptions, setADFResponseOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedPipelineOptions, setSelectedPipelineOptions] = useState([]);
  const [PipelineOptions, setPipelineResponseOptions] = useState([]);
  const [subscriptionOptions, setSubscriptionResponseOptions] = useState(1);
  const [workspaceState, setWorkspaceState] = useState({
    workspaceData: [[]],
    subscriptionName: '',
    resourceGroupName: ''
  });
  // const [subscription , setSubscription] =useState("");

  const handleReset = () => {
    setSubscription("All");
    setResourceGroup("All");
    setResource("All");
    setPipeline("All");
    setIsClicked(null);
    props.setSubC(0);
    props.setResGC(0);
    props.setADFC(0);
    props.setpipelineC(0);
    props.setADFSelectedOptions([]);
    setPipelineResponseOptions([]);
    setSelectedOptions([]);
    setADFResponseOptions([]);
    setResourceResponseOptions([]);
    setInputLTA("");
    setInputLTB("");
    props.setmaincomponent(false);
  };
  const handlepageclick = () => {
    props.setmaincomponent(true);
  
  };
  const handleSubscriptionChange = (value) => {
    setSubscription(value);
  };

  const handleResourceGroupChange = (value) => {
    setResourceGroup(value);
  };

  const handleResourceChange = (value) => {
    setResource(value);
  };

  const handlePipelineChange = (value) => {
    setPipeline(value);
  };

  const [isClicked, setIsClicked] = useState(null);
  const handleSubscriptionButtonClick = (flag) => {
    convertData3(workspaceState.workspaceData[flag], workspaceState.subscriptionName, workspaceState.resourceGroupName)
    setIsClicked(flag);
    setSubscriptionResponseOptions(flag);
    fetch(`${mainIP}/SelectedOption`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag }),
    })
      .catch((error) => {
        console.error("Error sending data to Flask:", error);
      });

  };

  const convertData2 = (data, option) => {
    const convertedData = [];
    for (const val in data) {
      convertedData.push({
        key: val,
        text: option,
        value: data[val],
      });
      // console.log(convertedData[convertedData.length - 1]);
    }

    return convertedData;
  };
  const [resourceGroupOptions, setResourceResponseOptions] = useState([]);
  const handleSubscriptionOptionClick = (option, option2) => {
    setSubscription(option2);
    fetch(`${mainIP}/resourceGroup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setResourceResponseOptions(convertData2(data, option));
      })
      .catch((error) => {
        console.error("Error sending data to Flask:", error);
      });
    setSearchTerm("");
  };
  const convertData3 = (data, option, subs) => {
    console.log(data)
    const convertedData = [];
    for (const val in data) {
      convertedData.push({
        key: data[val],
        text: option,
        value: subs,
      });
      // console.log(convertedData[convertedData.length - 1]);
    }
    console.log(convertedData)
    setADFResponseOptions(convertedData) 
    return convertedData;
  };

  console.log(PipelineOptions);
  const handleResourceGroupOptionClick = (subscription, ResourceGroup) => {
    setResourceGroup(ResourceGroup);
    fetch(`${mainIP}/ADF`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, ResourceGroup }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        setWorkspaceState({
          workspaceData: data,
          subscriptionName: subscription,
          resourceGroupName: ResourceGroup
        });
      })
      .catch((error) => {
        console.error("Error sending data to Flask:", error);
      });
    setSearchTerm("");
  };


  const convertData4 = (data, option, adf, subs) => {
    const convertedData = [];
    // console.log(data, option, adf, subs);
    convertedData.push({ key: 0, text: "test", value: "pipeline" });
    // for (const val in data) {
    //   convertedData.push({
    //     key: val,
    //     text: subs + "*" + option + "*" + adf,
    //     value: data[val],
    //   });
    return convertedData;
  };

  const handleADFOptionClick = (ADF, subscription, resourceGroup) => {
    const isSelected = selectedOptions.includes(ADF);

    if (isSelected) {
      const updatedOptions = selectedOptions.filter((option) => option !== ADF);
      setSelectedOptions(updatedOptions);
      return;
    } else {
      setSelectedOptions([...selectedOptions, ADF]);
    }

    setResource(ADF);
    setSearchTerm("");

    fetch(`${mainIP}/Pipeline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ADF, subscription, resourceGroup }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0])
        setPipelineResponseOptions([...data])
        console.log(PipelineOptions)
        // setPipelineResponseOptions(
        //   convertData4(data, ResourceGroup, ADF, subscription)
        // );
      })
      .catch((error) => {
        console.error("Error sending data to Flask:", error);
      });

    // console.log(selectedOptions);
  };
  const handlePipelineClick = (pipeline) => {
    setPipeline(pipeline);
    props.setGlobalPipeline(pipeline);
    console.log(pipeline);
    setSearchTerm("");
  };


  const [inputLTA, setInputLTA] = useState("");
  useEffect(() => {
    const data = {
      input: inputLTA,
    };
    fetch(`${mainIP}/lastTimeAfter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [inputLTA]);

  const handleLTA = (event) => {
    setInputLTA(event.target.value);
  };

  const [inputLTB, setInputLTB] = useState("");
  useEffect(() => {
    const data = {
      input: inputLTB,
    };
    fetch(`${mainIP}/lastTimeBefore`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [inputLTB]);

  const handleLTB = (event) => {
    setInputLTB(event.target.value);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredsubscriptionOptions = props.subscriptionOptions.filter((val) =>
    val.key.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredresourceGroupOptions = resourceGroupOptions.filter((val) =>
    val.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredADFOptions = ADFOptions.filter((val) =>
    val.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  props.setSubC(props.subscriptionOptions.length);
  props.setResGC(resourceGroupOptions.length);
  props.setADFC(ADFOptions.length);
  props.setpipelineC(PipelineOptions.length);
  props.setADFSelectedOptions(selectedOptions);
  return (
    <div className="">
      <div className="dropdown">
        <h6 className="remove-margin btn-headings">Subscription</h6>
        <button
          class="remove-margin text-end buttontext btn border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="float-start">{subscription}</span>
        </button>
        <ul className="dropdown-menu">
          <li className="static-li">
            <div className="input-group costum-div">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </li>
          {filteredsubscriptionOptions.map((val) => (
            <li
              key={val.key}
              onClick={() => handleSubscriptionOptionClick(val.value, val.key)}
              
            >
              {val.key}
            </li>
          ))}
        </ul>
      </div>
      <div className="dropdown  ">
        <h6 className="remove-margin btn-headings">Resource Group</h6>
        <button
          class="remove-margin text-end buttontext btn border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="float-start">{resourceGroup}</span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </li>
          {filteredresourceGroupOptions.map((val) => (
            <li
              key={val.key}
              onClick={() =>
                handleResourceGroupOptionClick(val.text, val.value)
                
              }
            >
              {val.value}
            </li>
          ))}
        </ul>
      </div>
      <div className="choice">
        <button
          onClick={() => handleSubscriptionButtonClick(0)}
          type="button"
          className={`btn ${isClicked===0 ? 'btn-costum-clicked' : 'btn-costum2'} btn-primary`}
        >
          ADF
        </button>
        <button
          onClick={() => handleSubscriptionButtonClick(1)}
          type="button"
          className={`btn ${isClicked===1 ? 'btn-costum-clicked' : 'btn-costum2'} btn-primary`}
        >
          ASA
        </button>
      </div>

      <div className="dropdown ">
        <h6 className="remove-margin btn-headings">Workspace Name</h6>
        <button
          class="remove-margin text-end buttontext btn border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="float-start w-100-scroll">
            {selectedOptions.length === 0 ? (
              <span>All</span>
            ) : (
              selectedOptions.map((option) => option + ", ")
            )}
          </span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </li>
          {filteredADFOptions.map((val) => (
            <li
              key={val.key}
              onClick={() => handleADFOptionClick(val.key, val.text, val.value)}
              className={selectedOptions.includes(val.key) ? "selected" : ""}
            >
              {val.key}
            </li>
          ))}
        </ul>
      </div>
      <div className="dropdown  ">
        <h6 className="remove-margin btn-headings">Last Run After</h6>
        <input
          value={inputLTA}
          onChange={handleLTA}
          type="datetime-local"
          className="time-input remove-margin text-end buttontext btn border-primary text-dark dropdown-style"
          id="lastRunBefore"
        />
      </div>
      <div className="dropdown  ">
        <h6 className="time-input remove-margin btn-headings">
          Last Run Before
        </h6>
        <input
          type="datetime-local"
          className="remove-margin text-end buttontext btn border-primary text-dark dropdown-style"
          id="lastRunBefore"
          value={inputLTB}
          onChange={handleLTB}
        />
      </div>
      {/* trying replicating workspace name for pipeline name sarts */}
      <div className="dropdown ">
        <h6 className="remove-margin btn-headings">Pipelines</h6>
        <button
          class="remove-margin text-end buttontext btn border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="float-start w-100-scroll">
            {selectedPipelineOptions.length === 0 ? (
              <span>All</span>
            ) : (
              selectedPipelineOptions.map((option) => option + ", ")
            )}
          </span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </li>
          {PipelineOptions.map((val) => (
            <li
              key={val.key}
              onClick={() => handlePipelineClick(val)}
            >
              {val}
            </li>
          ))}
        </ul>
      </div>
      {/* trying replicating workspace name for pipeline name ends */}

      {/* old pipeline code starts */}



      {/* <div className="dropdown  ">
        <h6 className="remove-margin btn-headings">Pipelines</h6>
        <button
          class="remove-margin text-end buttontext btn border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="float-start">{pipeline}</span>
        </button>
        <ul className="dropdown-menu">
          {PipelineOptions.map((val) => {
            return (
              <li
                key={val.key}
              >
                {val}
              </li>
            );
          })}
        </ul>
        <ul className="dropdown-menu">
          <li>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </li>
          {PipelineOptions.map((val) => (
            <li
              key={val.key}
              onClick={() => {
                handlePipelineClick(val.key);
              }}
            >
              {val.value}
            </li>
          ))}
        </ul>
      </div> */}

      {/* old pipeline code ends  */}



      <div className="choice">
        <button
          onClick={handleReset}
          type="button"
          class="btn btn-costum btn-primary"
        >
          Reset
        </button>
        <button
          type="button"
          class="btn btn-costum btn-primary"
          onClick={handlepageclick}
        >
          Go Ahead
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
