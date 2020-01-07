import TaskServices from "../../Database/TaskServices";

export async function realmToArrayObject(tableName){
    let tempArray = [];
    let listObject = TaskServices.getAllData(tableName);
    Promise.all(
        listObject.map((data)=>{
            tempArray.push(data);
        })
    );
    return tempArray;
}
