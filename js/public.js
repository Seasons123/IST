var sever = "2";
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
            "saveEvalKPI": 'http://localhost:8002/df/pe/expert/getreview.do?'
        }
}