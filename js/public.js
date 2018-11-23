var sever = "1";
var formUrl = {} ;
switch (sever){
    case  "1":
        formUrl = {
            "KpiConfig": '../data/target.json',
            "queryNextKpi": '../data/nextKpi.json',
            "saveEvalKPI": '../data/saveTarget.json'
        };
        break;
    case  "2":
        formUrl = {
            "KpiConfig": 'http://127.0.0.1:8081/df-pe/api/KpiConfig?',
            "queryNextKpi": 'http://127.0.0.1:8081/df-pe/api/Kpi?'
        }
}