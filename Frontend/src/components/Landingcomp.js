import React from 'react'
import Landingcard from './Landingcard';
const Landingcomp = (props) => {
  const {subC, resGC, adfCount, pipelineC} = props;
  return (
    <div>
      <div className="textbox-costum">
        <div class="card text-center">
          <div class="card-header">About Us</div>
          <div class="card-body">
            <h5 class="card-title">Azure Monitoring tool</h5>
            <p class="card-text">
              This app helps you to track pipeline status.
            </p>
          </div>
         
        </div>
      </div>
      <div className="row">
        <div className="col-6 landing-div">
          <Landingcard name  = {"Subscriptions"}   Count = {subC} description = {"Azure Portal offers flexible subscription plans for accessing and managing cloud resources and services in a secure and cost-effective manner"}/>
        </div>
        <div className="col-6 landing-div">
          <Landingcard name = {"Resource Group"}  Count = {resGC} description ={"Resource groups in Azure Portal provide a logical container to organize, manage, monitor and govern related resources within a subscription"}/>
        </div>
        <div className="col-6 landing-div">
          <Landingcard name = {"Data Factory"}   Count = {adfCount} description ={"Azure Data Factory (ADF) in Azure Portal is a powerful data integration service that allows you to create, schedule, and orchestrate data workflows, enabling seamless extraction, transformation, and loading (ETL)."}/>
        </div>
        <div className="col-6 landing-div">
          <Landingcard name = {"Pipeline"}   Count = {pipelineC} description = {"Azure Pipelines in Azure Portal is a fully-featured continuous integration and delivery (CI/CD) platform that automates software builds, testing, and deployment processes, enabling seamless delivery of applications to various environments."}/>
        </div>
      </div>
    </div>
  );
}

export default Landingcomp
