var sever = "1";
var formUrl = {} ;
switch (sever){
    case  "1":
        formUrl = {
            "getIndicator": '../data/target.json',
            "queryNextKpi": '../data/nextKpi.json',
            "saveEvalKPI": '../data/saveTarget.json'
        };
        break;
    case  "2":
        formUrl = {
            "getIndicator": 'http://localhost:8002/df/pe/expert/getreview.do?',
            "saveEvalKPI": 'http://localhost:8002/df/pe/expert/getreview.do?'
        }
}