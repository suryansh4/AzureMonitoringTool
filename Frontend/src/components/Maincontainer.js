import React from "react";
import "./Maincontainer.css";
import Cardcomp from "./Cardcomp";
import Tablecomp from "./Tablecomp";
import PieChart from "./PieChart";
// import {subscriptionCount, resourceGroupCount, ADFCount,PipelineCount} from "./Sidebar";

const Maincontainer = (props) => {
  const [statusList, setPipelineStatus] = React.useState({"InProgress":4,"Failed":3,"Succeeded":5,"Cancelled":10,"Queued":6,"Cancelling":7});
  console.log(statusList);
  return (
    <div className="maincontainer card-container">
      <div className="row">
        <div className="col">
          <Cardcomp name={"No. of Subsciption"} count={props.subC}/>
        </div>
        <div className="col">
          <Cardcomp name={"No. of ResourceGroup"} count={props.resGC}/>
        </div>
        <div className="col">
          <Cardcomp name={"No. of ADF"} count={props.adfCount} />
        </div>
        <div className="col">
          <Cardcomp name={"No. of Pipeline"} count={props.pipelineC} />
        </div>
      </div>
      <div className="row table-container">
        <div className="col-12 table-heading">Pipeline Details</div>
        <div className="col-9">
          <Tablecomp availabledata={props.availabledata} flag={props.flag} adflist={props.workspaces} getStatus={setPipelineStatus}  workspaceselect={props.workspaceselect}/>
        </div>
        <div className="col-3">
          <PieChart setStatus={statusList}/>
        </div>
      </div>
    </div>
  );
};

export default Maincontainer;
