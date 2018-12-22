//走网关用端口8081，直接走后台服务用端口8000
var sever = "1";
var formUrl = {} ;
switch (sever){
    case "0":
        formUrl = {
            "KpiConfig": '../data/target.json',
            "QueryNextKpi": '../data/nextKpi.json',
            "TaskKpi": '../data/saveTaskKpiResponse.json'
        };
        break ;
    case  "1":
        formUrl = {
            "KpiConfig": 'http://10.10.65.43:8081/df-peeval/api/KpiConfig?',
            "QueryNextKpi": 'http://10.10.65.43:8081/df-peeval/api/Kpi?',
            "TaskKpi": 'http://10.10.65.43:8081/df-peeval/api/TaskKpi?'
        };
        break;
    case  "2":
        formUrl = {
            "KpiConfig": ' http://10.15.1.34:8081/df-peeval/api/KpiConfig?',
            "QueryNextKpi": 'http://10.15.1.34:8081/df-peeval/api/Kpi?',
            "TaskKpi": 'http://10.15.1.34:8081/df-peeval/api/TaskKpi?'
        };
        break;
    case  "3":
        formUrl = {
            "KpiConfig": 'http://127.0.0.1:8081/df-peeval/api/KpiConfig?',
            "QueryNextKpi": 'http://127.0.0.1:8081/df-peeval/api/Kpi?',
            "TaskKpi": 'http://127.0.0.1:8081/df-peeval/api/TaskKpi?'
        }
}