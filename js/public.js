var dataMode = 1; //0为使用本地模拟json数据，1为使用服务器数据

//本地服务器 http://127.0.0.1:8081
//内网服务器 http://10.15.1.34:8081
var serverUrl = "http://10.15.1.34:8081";
var functionCollection = {
    "KpiConfig":  ['../data/target.json', "/df-pe/api/KpiConfig?"],
    "QueryNextKpi":['../data/nextKpi.json', '/df-pe/api/Kpi?'],
    "TaskKpi": ['../data/saveTaskKpiResponse.json', '/df-pe/api/TaskKpi?']
};


var formUrl = {};
var initFormUrl = function() {
    for(var key in functionCollection){
        if(dataMode == 0){
            formUrl[key] = functionCollection[key][dataMode];
        }else if(dataMode == 1){
            formUrl[key] = serverUrl + functionCollection[key][dataMode];
        }
    }
};
initFormUrl();