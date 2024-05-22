from azure.identity import InteractiveBrowserCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.resource import SubscriptionClient
from azure.mgmt.datafactory import DataFactoryManagementClient
from azure.mgmt.datafactory.models import *
from azure.synapse.artifacts import ArtifactsClient
from azure.synapse.artifacts.models import RunFilterParameters, RunQueryOrderBy
from azure.identity import DefaultAzureCredential,InteractiveBrowserCredential
from datetime import datetime, timedelta
import pytz
import re

credential = InteractiveBrowserCredential(tenant_id='b06dbb52-c0ee-412f-852a-151897b0cd7c')

class RunHistory:
    def __init__(self, list, flag, last_updated_after, last_updated_before):
        self.list = list
        self.last_updated_after = last_updated_after
        self.last_updated_before = last_updated_before
        self.flag = flag

    def timeConversion(TimeInSec):
        if TimeInSec < 60:
            return str(TimeInSec) + " Sec"
        elif TimeInSec < 3600:
            return str(round(TimeInSec / 60,2)) + " Min"
        else:
            return str(round(TimeInSec / 3600,2)) + " Hrs"
    
    def printFailureMessage(RunMsz):
        if RunMsz == "":
            return "No Error"
        else:
            return RunMsz

    def format_LTA_LTB(time):
        return time+":00.0000000Z"
    
    def ConvertUTCtoIST(time_string):
        time_string = str(time_string)
        return time_string[:19]

    # For Azure Datafactory
    def GetADFMasterPipeline(subscription_id, resource_group_name, data_factory_name, pipelineNameList,last_updated_after,last_updated_before):
        client = DataFactoryManagementClient(credential=credential,subscription_id=subscription_id)
        CompleteData = []

        for pipelineName in pipelineNameList:
            try:
                pipeline_runs = client.pipeline_runs.query_by_factory(
                        resource_group_name=resource_group_name,
                        factory_name=data_factory_name,
                        filter_parameters={
                            "filters": [{"operand": "PipelineName", "operator": "Equals", "values": [pipelineName]}],
                            "lastUpdatedAfter": RunHistory.format_LTA_LTB(last_updated_after),
                            "lastUpdatedBefore": RunHistory.format_LTA_LTB(last_updated_before),
                        },
                    )
                for run in pipeline_runs.value:
                    if run is not None:
                        # print("VivekSharma")
                        CompleteData.append({"ADF":data_factory_name,"RunId":run.run_id,"PipelineName":run.pipeline_name,"Status":run.status,"RunStartDate":run.run_start,"RunEndDate":run.run_end,"Duration":RunHistory.timeConversion(run.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(run.message)})                
            except Exception as e:
                print(e)
        return(CompleteData)

    # For Azure Datafactory
    def GetADFActivityList(subscription_id, resource_group_name, data_factory_name, pipeline_run_id,LastUpdateAfter,LastUpdateBefore):
        ActivityResponse = []
        if pipeline_run_id != "":    
            adf_client =  DataFactoryManagementClient(credential, subscription_id)
            try:
                filter_params = RunFilterParameters(
                    last_updated_after=RunHistory.format_LTA_LTB(LastUpdateAfter),
                    last_updated_before=RunHistory.format_LTA_LTB(LastUpdateBefore),
                )
                query_response = adf_client.activity_runs.query_by_pipeline_run(
                    resource_group_name,
                    data_factory_name,
                    pipeline_run_id,
                    filter_params,
                )    
                for out in query_response.value:
                    if out.activity_type == "ExecutePipeline":
                        ActivityResponse.append({"ActivityRunId":out.activity_run_id,"Type":"Execute Activity","ActivityName":out.input["pipeline"]["referenceName"],"Status":out.status,"RunStartDate":out.activity_run_start,"RunEndDate":out.activity_run_end,"Duration":RunHistory.timeConversion(out.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(out.error["message"])})
                    else:
                        ActivityResponse.append({"ActivityRunId":out.activity_run_id,"Type":"Activity","ActivityName":out.activity_name,"Status":out.status,"RunStartDate":out.activity_run_start,"RunEndDate":out.activity_run_end,"Duration":RunHistory.timeConversion(out.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(out.error["message"])})                     
            except Exception as e:
                print(e) 
        else:
            print("")
        return ActivityResponse

    # For Azure Synapse Analytics
    def GetASAMasterPipeline(SubscriptionID, ResourceGroupName, SynapseWorkspaceName, PipelineNameList,LastUpdateAfter,LastUpdateBefore):
        SynapseClient = ArtifactsClient(
                    endpoint="https://{}.dev.azuresynapse.net".format(SynapseWorkspaceName),
                    credential= credential,
                )
        CompleteData = []
        for PipelineName in PipelineNameList:
            try:
                PipelineRuns = SynapseClient.pipeline_run.query_pipeline_runs_by_workspace(
                    filter_parameters = RunFilterParameters(
                        last_updated_after = RunHistory.format_LTA_LTB(LastUpdateAfter),
                        last_updated_before = RunHistory.format_LTA_LTB(LastUpdateBefore),
                        filters = [{"operand": "PipelineName", "operator": "Equals", "values": [PipelineName]}],
                        order_by = [RunQueryOrderBy(order_by="PipelineName", order="asc")],
                    )
                )
                for run in PipelineRuns.value:
                    if run is not None:
                        # print("VivekSharma")
                        CompleteData.append({"ASA":SynapseWorkspaceName,"RunId":run.run_id,"PipelineName":run.pipeline_name,"Status":run.status,"RunStartDate":RunHistory.ConvertUTCtoIST(run.run_start),"RunEndDate":RunHistory.ConvertUTCtoIST(run.run_end),"Duration":RunHistory.timeConversion(run.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(run.message),"Workspace": SynapseWorkspaceName})                
            except Exception as e:
                print(e)
        return CompleteData
    
    # For Azure Synapse Analytics
    def GetASAActivityList(SubscriptionID, PipelineName, SynapseWorkspaceName, PipelineRunID,LastUpdateAfter,LastUpdateBefore):
        ActivityResponse = []
        if PipelineRunID != "":    
            SynapseClient = ArtifactsClient(
                    endpoint="https://{}.dev.azuresynapse.net".format(SynapseWorkspaceName),
                    credential= credential,
                )
            try:                                            
                QueryResponse = SynapseClient.pipeline_run.query_activity_runs(
                    pipeline_name = PipelineName,
                    run_id = PipelineRunID,
                    filter_parameters = RunFilterParameters(
                        last_updated_after = RunHistory.format_LTA_LTB(LastUpdateAfter),
                        last_updated_before = RunHistory.format_LTA_LTB(LastUpdateBefore),
                        order_by = [RunQueryOrderBy(order_by="ActivityRunStart", order="asc")],
                    ) 
                )  
                # print(QueryResponse)
                for out in QueryResponse.value:
                    print(out)
                    if out.activity_type == "ExecutePipeline":
                        ActivityResponse.append({"ActivityRunId":out.activity_run_id,"Type":out.activity_type,"ActivityName":"Invoke "+ out.input["pipeline"]["referenceName"],"Status":out.status,"RunStartDate":RunHistory.ConvertUTCtoIST(out.activity_run_start),"RunEndDate":RunHistory.ConvertUTCtoIST(out.activity_run_end),"Duration":RunHistory.timeConversion(out.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(out.error["message"])})
                    else:
                        ActivityResponse.append({"ActivityRunId":out.activity_run_id,"Type": out.activity_type,"ActivityName":out.activity_name,"Status":out.status,"RunStartDate":RunHistory.ConvertUTCtoIST(out.activity_run_start),"RunEndDate":RunHistory.ConvertUTCtoIST(out.activity_run_end),"Duration":RunHistory.timeConversion(out.duration_in_ms/1000),"ErrorMessage":RunHistory.printFailureMessage(out.error["message"])})                     
            except Exception as e:
                print(e) 
        else:
            print("")
        return ActivityResponse
    
class SubscriptionDetail:

    def getListOfADFPipelines(resourceGroupName,dataFactoryName,subscriptionID):
        datafactory_client =  DataFactoryManagementClient(credential,subscriptionID)
        pipelines = datafactory_client.pipelines.list_by_factory(
            resource_group_name=resourceGroupName,
            factory_name=dataFactoryName
        )
        PipelineList = []
        for pipeline in pipelines:
            PipelineList.append(pipeline.name)
        return PipelineList
    
    def getListOfASAPipelines(resourceGroupName,SynapseWorkspaceName,subscriptionID):
        SynapseClient = ArtifactsClient(
            endpoint="https://{}.dev.azuresynapse.net".format(SynapseWorkspaceName),
            credential= credential,
        )
        pipelines = SynapseClient.pipeline.get_pipelines_by_workspace()    
        PipelineList = []
        for pipeline in pipelines:
            PipelineList.append(pipeline.name)
        return PipelineList
    
    def getListOfWorkspaces(subscriptionID, resourceGroupName):
        resource_client = ResourceManagementClient(credential, subscription_id=subscriptionID)
        services = resource_client.resources.list_by_resource_group(resourceGroupName)
        WorkSpaceList = [[],[]]
        for service in services:
            if (service.type == "Microsoft.DataFactory/factories"):
                WorkSpaceList[0].append(service.name)
            elif (service.type == "Microsoft.Synapse/workspaces"):
                WorkSpaceList[1].append(service.name)
        return WorkSpaceList

    def getResourceGroup(subscriptionID):
        resource_client = ResourceManagementClient(credential, subscription_id=subscriptionID)
        resources = resource_client.resource_groups.list()
        resourceGroupList = []
        for resource in resources:
            resourceGroupList.append(resource.name)
        SubscriptionDetail.getListOfWorkspaces(subscriptionID, "TestSynapseAMT")
        return resourceGroupList 
                
def getListOfSubscription():
    subscription_client = SubscriptionClient(credential)
    subscription_list = subscription_client.subscriptions.list()
    SubscriptionList={}
    for subscription in subscription_list:
        SubscriptionList[subscription.display_name]=subscription.subscription_id
        SubscriptionDetail.getResourceGroup("cffa68a9-08a9-4eed-907a-2fd9d679d9e6")
    return SubscriptionList

 
def main():
    getListOfSubscription()
    # RunHistory.get_ASA_master_pipeline("cffa68a9-08a9-4eed-907a-2fd9d679d9e6","TestSynapseAMT","azamtwp",["Pipeline 1","Pipeline 2"],"2024-05-10T00:36:44","2024-05-16T00:36:44")
    # RunHistory.GetASAActivityList("cffa68a9-08a9-4eed-907a-2fd9d679d9e6","Pipeline 1","azamtwp","ca2c1048-51c8-4d39-b909-137043bf083f","2024-05-10 00:36:44","2024-05-16 00:36:44")
    
if __name__ == "__main__":
    main()