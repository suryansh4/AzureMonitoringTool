import React, { useState, useEffect } from "react";
import "./Tablecomp.css";
import mainIP from "../constant";

const Tablecomp = (props) => {
  const [openRows, setOpenRows] = useState([]);
  const [dummyDataList, setDummydata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSelectedPipeline, setCurrentSelectedPipeline] = useState(null);
  const [currentdata, setCurrentdata] = useState([]);
  // const[DummyData, setDummyData]=useState([])
  useEffect(() => {
    if (props.availabledata) {
      setDummydata(convertDummyDataList(props.availabledata));
      setIsLoading(props.isLoading);
      console.log(props.availabledata);
    }
  }, [props.availabledata?.length, props.isLoading]);

  let setData = {
    InProgress: 0,
    Failed: 0,
    Succeeded: 0,
    Cancelled: 0,
    Queued: 0,
    Cancelling: 0,
  };
  function convertDummyDataList(dummyDataList) {
    const convertedDataList = [];
    let parentId = 1;
    let childId = 1;
    dummyDataList.forEach((item, index) => {
      if (Array.isArray(item)) {
        const children = item.map((activity) => ({
          id: childId++,
          ActivityName: activity.PipelineName,
          Duration: activity.Duration,
          Status: activity.Status,
          Type: activity.Type,
          RunStartDate: activity.RunStartDate,
          RunEndDate: activity.RunEndDate,
          ErrorMessage: activity.ErrorMessage,
        }));

        if (convertedDataList.length > 0) {
          convertedDataList[convertedDataList.length - 1].Children = children;
          convertedDataList[convertedDataList.length - 1].id = parentId++;
        } else {
          convertedDataList.push(...children);
          parentId += children.length;
        }
      } else {
        childId = 1;
        convertedDataList.push({ ...item, id: parentId++ });
        console.log(item);
        if (item["Status"] == "Failed") setData["Failed"]++;
        else if (item["Status"] == "InProgress") setData["InProgress"]++;
        else if (item["Status"] == "Succeeded") setData["Succeeded"]++;
        else if (item["Status"] == "Cancelled") setData["Cancelled"]++;
        else if (item["Status"] == "Queued") setData["Queued"]++;
        else setData["Cancelling"]++;
      }
      props.getStatus(setData);
    });

    return convertedDataList;
  }

  //const data = convertDummyDataList(dummyDataList);

  const handleRowClick = (id) => {
    setOpenRows(
      openRows.includes(id)
        ? openRows.filter((rowId) => rowId !== id)
        : [...openRows, id]
    );
  };

  const handlePipelineClick = (ADF, RunID, RunStartDate, RunEndDate) => {
    fetch(`${mainIP}/ActivityList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ADF, RunID, RunStartDate, RunEndDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenRows(data);
        setCurrentSelectedPipeline(RunID);
      })
      .catch((error) => {
        console.error("Error sending data to Flask:", error);
      });
  };

  return (
    <div className="table-costum">
      {props.flag && isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr className="bg-light">
              <th>PipelineName</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Type</th>
              <th>Run Start</th>
              <th>Run End</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {dummyDataList.map((parent) => (
              <React.Fragment key={parent.id}>
                <tr
                  onClick={() => {
                    handlePipelineClick(
                      parent.ADF,
                      parent.RunId,
                      parent.RunStartDate,
                      parent.RunEndDate
                    );
                  }}
                >
                  <td title={parent.PipelineName}>{parent.PipelineName}</td>
                  <td title={parent.Duration}>{parent.Duration}</td>
                  <td title={parent.Status}>{parent.Status}</td>
                  <td title={parent.Type}>Pipeline</td>
                  <td title={parent.RunStartDate}>{parent.RunStartDate}</td>
                  <td title={parent.RunEndDate}>{parent.RunEndDate}</td>
                  <td title={parent.ErrorMesssage}>{parent.ErrorMesssage}</td>
                </tr>
                {currentSelectedPipeline &&
                currentSelectedPipeline == parent.RunId
                  ? openRows.map((child) => (
                      <tr className="child-rows" key={child.id}>
                        <td title={child.ActivityName}>{child.ActivityName}</td>
                        <td title={child.Duration}>{child.Duration}</td>
                        <td title={child.Status}>{child.Status}</td>
                        <td title={child.Type}>{child.Type}</td>
                        <td title={child.RunStartDate}>{child.RunStartDate}</td>
                        <td title={child.RunEndDate}>{child.RunEndDate}</td>
                        <td title={child.ErrorMesssage}>
                          {child.ErrorMesssage}
                        </td>
                      </tr>
                    ))
                  : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tablecomp;
