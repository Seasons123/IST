var sever = "3";
var formUrl = {} ;
switch (sever){
    case  "1":
        formUrl = {
            "KpiConfig": '../data/target.json',
            "queryNextKpi": '../data/nextKpi.json',
            "saveTaskKpi": '../data/saveTaskKpi.json'
        };
        break;
    case  "2":
        formUrl = {
            "KpiConfig": 'http://127.0.0.1:8081/df-pe/api/KpiConfig?',
            "queryNextKpi": 'http://127.0.0.1:8081/df-pe/api/Kpi?',
            "saveTaskKpi": 'http://127.0.0.1:8081/df-pe/api/TaskKpi?'
        };
        break;
    case  "3":
        formUrl = {
            "KpiConfig": 'http://10.15.1.34:8081/df-pe/api/KpiConfig?',
            "queryNextKpi": 'http://10.15.1.34:8081/df-pe/api/Kpi?',
            "saveTaskKpi": 'http://10.15.1.34:8081/df-pe/api/TaskKpi?'
        }
}