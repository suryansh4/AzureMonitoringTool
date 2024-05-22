import React from "react";
import "./Maincontainer.css";
import Cardcomp from "./Cardcomp";
import Tablecomp from "./Tablecomp2";
import PieChart from "./PieChart";
// import {subscriptionCount, resourceGroupCount, ADFCount,PipelineCount} from "./Sidebar";

const Maincontainer = (props) => {
  const [statusList, setPipelineStatus] = React.useState({ "InProgress": 4, "Failed": 3, "Succeeded": 5, "Cancelled": 10, "Queued": 6, "Cancelling": 7 });
  console.log(statusList);
  return (
    <div className="maincontainer card-container">
      <div className="row">
        <div className="col">
          <Cardcomp name={"No. of Subsciption"} count={props.subC} />
        </div>
        <div className="col">
          <Cardcomp name={"No. of ResourceGroup"} count={props.resGC} />
        </div>
        <div className="col">
          <Cardcomp name={"No. of ADF"} count={props.adfCount} />
        </div>
        <div className="col">
          <Cardcomp name={"No. of Pipeline"} count={props.pipelineC} />
        </div>
      </div>
      <div className="row table-container">
        <div className="col-9 table-heading">Pipeline Details</div>
          {/* dropworn starts from here */}
          <div className="dropdown col-3">
        <h6 className="remove-margin">Select Status</h6>
        <button
          class="remove-margin text-end buttontext btn btn-sm border-primary text-dark dropdown-toggle dropdown-style"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="float-start"></span>
        </button>
        <ul className="dropdown-menu">
          <li className="static-li">InProgress</li>
        </ul>
        </div>

        {/* drop down ends here */}

        <div className="col-9">
          <Tablecomp
            availabledata={props.availabledata}
            flag={props.flag}
            adflist={props.workspaces}
            getStatus={setPipelineStatus}
            workspaceselect={props.workspaceselect}
            globalPipeline={props.globalPipeline}
          />
        </div>
        <div className="col-3 ">
        
          <PieChart setStatus={statusList} />
        </div>
      </div>
    </div>
  );
};

export default Maincontainer;
