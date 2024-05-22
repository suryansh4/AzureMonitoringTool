import React from "react";
import "./cardcomp.css";

const Cardcomp = (props) => {
  return (
    <div>
      <div class="card">
        <div class="card-body">
          <h6 class="card-title">{props.name}</h6>
          <h6 class="card-title">{props.count}</h6>
        </div>
      </div>
    </div>
  );
};

export default Cardcomp;
