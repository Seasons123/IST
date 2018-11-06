var tdNum = 0;
var kpiTableInfoGlobal={};
var evalContent={};
var levelNum;
var kpiLevelName = ["一级指标","二级指标","三级指标","四级指标","五级指标","六级指标","七级指标","八级指标","九级指标","十级指标"];
var htmlTableBody = '<tr>';
TablecommonFn = {

    initTableHeader: function () {
        //总共的列数为：指标级次数levelNum+5
        var html = '<tr>';
        for(var i=0; i < levelNum; i++){
            html += '<th class="aa" width="100px" rowspan="2">' + kpiLevelName[i] + '</th>';
        }
        html += '<th class="aa" width="100px" rowspan="2">分数</th>';
        html += '<th class="aa" width="500px" id="003" rowspan="2" colspan="5">评分标准</th>';
        html += '</tr>';
        $('#tableHeader').append(html);
    },

    //不确定共有几级指标，表格左侧内容动态生成+获取分值显示
    initTable: function (tableInfo) {
        kpiTableInfoGlobal = tableInfo;
        //行排序
        evalContent = tableInfo.kpiSelect_content.sort(commonFn.sortByPro('select_num'));
        console.log(evalContent);
        //表格左侧json数据转换start
        var data = [];
        var trNum =evalContent.length;
        levelNum = parseInt(evalContent[0].kpi_Final[0].kpi_level); //一共有几级指标
        TablecommonFn.initTableHeader(levelNum);
        tdNum = levelNum ;
        var indicatorArray = [];
        var indicatorObject = {};

        //声明全局变量，生成计算每一列已经生成多少行，用于向data中塞值时使用
        for(var i=1;i<=trNum ;i++) {
            window["td" + i + "trCount"] = 0;
        }
        //获取每一级指标需要合并多少行。注意每一级可能会有多个，如二级指标有三个。无需计算最后一个指标的合并行，都为1。
        for(var i=1;i<levelNum;i++) {
            create_parentIdValueCount(i); //初始化合并行
            mergeRowsCal(i); //合并行计算
            create_indicatorArray(i); //创建指标对象
        }
        function create_parentIdValueCount(num){
            var parentId = "chr_id" + num ;
            var parentIdValue = ""; //id的值，用于对比
            for(var m = 0;m < trNum; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parentId && parentIdValue == "")|| (n == parentId && parentIdValue != evalContent[m][n])) {
                        parentIdValue = evalContent[m][n];
                        window[parentIdValue + "Count"] = 0;
                    }
                }
            }
        }
        function mergeRowsCal(num) {
            var parentId = "chr_id" + num ;
            var parentIdValue = "";
            for(var m = 0;m < trNum + 1; m++) {
                for (var n in evalContent[m]) {
                    if (n == parentId) {
                        parentIdValue = evalContent[m][n];
                        window[parentIdValue + "Count"]++;
                    }
                }
            }

        }
        function create_indicatorArray(num){
            var parentId = "chr_id" + num ;
            var indicatorsLevel = num ;
            var parentIdValue = ""; //id的值
            var parentIdName = "kpi_name" + num;
            var parentIdNameValue = "";
            var parentIdweight = "kpi_weight" + num;
            var parentIdweightValue = "";
            var parentIdExplain = "kpi_explain" + num;
            var parentIdExplainValue = "";
            for(var m = 0;m < trNum; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parentId && parentIdValue == "")|| (n == parentId && parentIdValue != evalContent[m][n])) {
                        //定义对象,拿三个数据：指标的id、指标的名字、指标的合并行
                        parentIdValue = evalContent[m][n];
                        mergeRows = window[parentIdValue + "Count"];
                        for (var n in evalContent[m]) {
                            if (n == parentIdName) {
                                parentIdNameValue = evalContent[m][n];
                            }
                        }
                        for (var n in evalContent[m]) {
                            if (n == parentIdweight) {
                                parentIdweightValue = evalContent[m][n];
                            }
                        }
                        for (var n in evalContent[m]) {
                            if (n == parentIdExplain) {
                                parentIdExplainValue = evalContent[m][n];
                            }
                        }
                        indicatorObject = {
                            id: parentIdValue,
                            level: indicatorsLevel,
                            name: parentIdNameValue,
                            rows: mergeRows,
                            weight: parentIdweightValue,
                            explain: parentIdExplainValue
                        };
                        indicatorArray.push(indicatorObject);

                    }
                }
            }
        }
        //向指标对象中塞入末级指标对象，末级指标对象是一个数组，包含可供选择的所有末级指标对象。
        for(var i= 0;i < trNum; i++) {
            var finalIndicatorArray = [];
            for(var j=0; j<evalContent[i].kpi_Final.length; j++){
                var finalKPI = evalContent[i].kpi_Final[j];
                indicatorObject = {
                    id: finalKPI.kpi_id,
                    level: finalKPI.kpi_level,
                    name: finalKPI.kpi_name,
                    rows: 1,
                    weight: finalKPI.kpi_weight,
                    explain: finalKPI.kpi_explain,
                    standard: finalKPI.kpi_stand,
                    type: evalContent[i].value_type
                };
                finalIndicatorArray.push(indicatorObject);
            }
            indicatorArray.push(finalIndicatorArray);
        }
        console.log(indicatorArray);

        //生成目标行列json空值数据
        for(var i = 0;i < trNum ;i ++) {
            //每一行即每一个json对象的键和值都需要动态生成
            var row = {};
            for(var j = 1;j <= tdNum ; j++){
                var name = "t" + j; //先自动生成键
                row[name] = {};
            }
            data.push(row);   //每次都push一行
        }
        console.log(data);

        //遍历indicatorArray，向data中塞值
        for(var i = 0; i< indicatorArray.length; i ++){
            var num;
            if(Array.isArray(indicatorArray[i])){
                num = indicatorArray[i][0].level;
            }else{
                num = indicatorArray[i].level;
            }
            var tdIndicatorName = "t" + num;
            //var tdtdIndicatorweight = "t" + (2 * num);
            var tdIndicatorNameTrCount = "td" + num + "trCount";
            var temp = window[tdIndicatorNameTrCount];
            if(Array.isArray(indicatorArray[i])) { //indicatorArray[i]为数组对象则是末级指标
                for (var n in data[temp]) {
                    if (n == tdIndicatorName) {
                        data[temp][n] = indicatorArray[i];
                    }
                }
                window[tdIndicatorNameTrCount]++;
                temp = window[tdIndicatorNameTrCount];
            }else{
                for (var j = 0; j < indicatorArray[i].rows; j++) {
                    for (var n in data[temp]) {
                        if (n == tdIndicatorName) {
                            data[temp][n] = {
                                name: indicatorArray[i].name,
                                weight: indicatorArray[i].weight,
                                rows: indicatorArray[i].rows,
                                explain: indicatorArray[i].explain,
                                id: indicatorArray[i].id
                            };
                            window[tdIndicatorNameTrCount]++;
                            temp = window[tdIndicatorNameTrCount];
                        }
                    }
                }
            }
        }
        console.log(data);
        //表格左侧json数据转换end

        //批量定义
        for (var i = 1; i <= (tdNum - 2); i++) {
            create_variable(i);
        }

        function create_variable(num) {
            var name = "t" + num; //生成函数名
            window[name];
        }
        //渲染主体表格页面  start
        $.each(data, function (i, item) {
            for (var j = 1; j <= (tdNum - 1); j++) { //动态生成除最后两行的所有行（非填评分值部分）
                var tdKey = "t" + j;
                var kpiObject;
                for (var m in item) {
                    if (m == tdKey) {
                        kpiObject = item[m];
                    }
                }
                if (window[tdKey] == '' || window[tdKey] != kpiObject.id) {
                    htmlTableBody += '<td class="cc" title="'+ kpiObject.explain +'" rowspan="' + kpiObject.rows + '">' + kpiObject.name  + "（" +  kpiObject.weight+ "分）" + '</td>';
                    window[tdKey] = kpiObject.id;
                }
            }

            //渲染剩余两列（非填评分值部分） start
            var tdKey = "t" + tdNum;
            var kpiObjectFinal;
            //拿到末级指标对象
            for (var m in item) {
                if (m == tdKey) {
                    kpiObjectFinal = item[m];
                }
            }
            console.log(kpiObjectFinal);
            htmlTableBody += '<td class="cc" title="'+ kpiObjectFinal.explain +'">' + kpiObjectFinal.name + '</td>';//末级指标名字
            htmlTableBody += '<td class="cc">' + kpiObjectFinal.weight + '</td>';//末级指标权重
            htmlTableBody += '<td class="aa" colspan="5">';
            for(var m=0; m < kpiObjectFinal.standard.length; m++){//末级指标评分标准
                htmlTableBody += '<p style="width:300px;">' +
                    '<label>' +  kpiObjectFinal.standard[m].kpi_stand_name + '</label>' +
                    '<input type="radio" class="standard" id="'+ kpiObjectFinal.standard[m].id + '" name="'+ kpiObjectFinal.id +'" value="' + m + '" onclick="commonFn.changeScoreStandardValue(this.name,this.value)" disabled/>' +
                    '</p>';
            }
            htmlTableBody += '</td>';
            // 渲染剩余两列（非填评分值部分） end

            //生成评分值部分，每一个单元格以id形式打标记信息，标记值包含横纵的信息（末级指标名称+末级评分名称）
            htmlTableBody += '<td class="bb"><textarea id="col004row' + kpiObjectFinal.id + '" class="easyui-validatebox quantify" required="true" onchange="commonFn.checkQuantity(value,this.id)" disabled></textarea><span></span></td>';//评价结果
            if(kpiObjectFinal.score == 0 || kpiObjectFinal.score == null){
                htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()"></textarea></td>';//专家评分
            }else{
                htmlTableBody += '<td class="bb"><textarea id="col005row' + kpiObjectFinal.id + '" class="easyui-validatebox grade" required="true" onchange="commonFn.checkGrade(value,this.id),commonFn.calScore()" disabled>' + kpiObjectFinal.score + '</textarea></td>';//专家评分
            }
            htmlTableBody += '<td class="bb"><textarea id="col006row' + kpiObjectFinal.id + '" class="easyui-validatebox remark" disabled>' + kpiObjectFinal.remark + '</textarea></td>';//扣分原因
            htmlTableBody += '</tr>';
        });
        //渲染主体表格页面  end
        TablecommonFn.generateSumRow(evalContent);
        TablecommonFn.initVal(evalContent);
        TablecommonFn.cssStyleControl(evalContent);
    }
};

var getInfo = function(){
    var data = {
        "eval_user_id":"{E6BE8909-F454-4695-B878-EF7B6AF10304}",
        "eval_obj_id":"{HGPC52C1-BE68-4EE4-9955-E6B43AED0ABC}"
    };
    $.ajax({
        type: 'GET',
        url: formUrl.getIndicator,
        dataType: 'JSON',
        data: data,
        async: false,
        success: function (map) {
            if(map.status == '0'){
                TablecommonFn.initTable(map.data.kpiSelect_detail_info);//使用本地json数据
            }else{
                ip.ipInfoJump(map.error_msg, 'error');
            }
        }
    });
};

getInfo();