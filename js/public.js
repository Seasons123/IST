var sever = "1";
var formUrl = {} ;
switch (sever){
    case  "1":
        formUrl = {
            "KpiConfig": '../data/target.json',
            "QueryNextKpi": '../data/nextKpi.json',
            "TaskKpi": '../data/saveTaskKpiResponse.json'
        };
        break;
    case  "2":
        formUrl = {
            "KpiConfig": 'http://127.0.0.1:8081/df-pe/api/KpiConfig?',
            "QueryNextKpi": 'http://127.0.0.1:8081/df-pe/api/Kpi?',
            "TaskKpi": 'http://127.0.0.1:8081/df-pe/api/TaskKpi?'
        };
        break;
    case  "3":
        formUrl = {
            "KpiConfig": 'http://10.15.1.34:8081/df-pe/api/KpiConfig?',
            "QueryNextKpi": 'http://10.15.1.34:8081/df-pe/api/Kpi?',
            "TaskKpi": 'http://10.15.1.34:8081/df-pe/api/TaskKpi?'
        }
}