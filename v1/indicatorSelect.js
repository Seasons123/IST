var tdNum = 0;
var kpiTableInfoGlobal=[];
var evalContent=[];
var levelNum;
var kpiLevelName = ["一级指标","二级指标","三级指标","四级指标","五级指标","六级指标","七级指标","八级指标","九级指标","十级指标"];
var htmlTableBody = '<tr>';
var kpiObjectNextGlobal;
var saveTaskKpiDataArrayResponse;

TablecommonFn = {

    initTableHeader: function () {
        //总共的列数为：指标级次数levelNum+5
        var html = '<tr>';
        for(var i=0; i < levelNum + 1; i++){
            html += '<th id="colName'+ (i+1) +'" class="aa" width="" >' + kpiLevelName[i] + '</th>';
        }
        html += '<th id="colWeight" class="aa" width="100px" >分数</th>';
        html += '<th id="colStander" class="aa" width="300px" colspan="5">评分标准</th>';
        html += '<th id="colOperation" class="aa" width="250px" colspan="5">操作</th>';
        html += '<th id="colOperation" class="aa" width="10px" colspan="1" style="display:none;">序号</th>';
        html += '</tr>';
        $('#tableHeader').append(html);
    },

    //不确定共有几级指标，表格左侧内容动态生成+获取分值显示
    initTable: function (tableInfo) {
        //行排序
        kpiTableInfoGlobal = tableInfo.sort(commonFn.sortByPro('orderNum'));
        for(var i = 0;i < kpiTableInfoGlobal.length ;i ++) {
            evalContent.push(kpiTableInfoGlobal[i].kpi);   //每次都push一行
        }
        console.log(evalContent);
        //表格左侧json数据转换start
        var data = [];
        //计算saveTaskKpiDataArrayResponse中它们的直接父级共几个
        var saveTaskKpiDataArrayResponseParent = {};
        for(var i=0; i< saveTaskKpiDataArrayResponse.length; i++){
           var id = saveTaskKpiDataArrayResponse[i].kpi.parent.id;
           if(!saveTaskKpiDataArrayResponseParent[id]){
                saveTaskKpiDataArrayResponseParent[id] = [];
            }
            saveTaskKpiDataArrayResponseParent[id].push(id);
        }
        var trNum = evalContent.length + saveTaskKpiDataArrayResponse.length - commonFn.getJsonLength(saveTaskKpiDataArrayResponseParent); //计算总行数
        levelNum = parseInt(evalContent[0].kpiLevel); //一共有几级指标，不包含要设置的下级指标
        TablecommonFn.initTableHeader(levelNum);
        $("#colName" + levelNum ).css("width","200px");
        $("#colName" + (levelNum + 1) ).css("width","200px");
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
            var parent = "parentKpi" + num ;
            var parentIdValue = ""; //id的值，用于对比
            for(var m = 0;m < evalContent.length; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parent && parentIdValue == "")|| (n == parent && parentIdValue != evalContent[m][n].id)) {
                        parentIdValue = evalContent[m][n].id;
                        window[parentIdValue + "Count"] = 0;
                    }
                }
            }
        }
        function mergeRowsCal(num) {
            var parent = "parentKpi" + num ;
            var parentIdValue = "";
            for(var m = 0;m < evalContent.length + 1; m++) {
                for (var n in evalContent[m]) {
                    if (n == parent) {
                        parentIdValue = evalContent[m][n].id;
                        window[parentIdValue + "Count"]++;
                    }
                }
            }

        }
        function create_indicatorArray(num){
            var parent = "parentKpi" + num ;
            var parentIdValue = "";
            for(var m = 0;m < evalContent.length; m++) {
                for (var n in evalContent[m]) {
                    if ((n == parent && parentIdValue == "")|| (n == parent && parentIdValue != evalContent[m][n].id)) {
                        //定义对象,拿三个数据：指标的id、指标的名字、指标的合并行
                        parentValue = evalContent[m][n];
                        parentIdValue = evalContent[m][n].id;
                        mergeRows = window[parentIdValue + "Count"];
                        indicatorObject = {
                            id: parentValue.id,
                            level: num,
                            name: parentValue.kpiName,
                            rows: mergeRows,
                            weight: parentValue.kpiWeight,
                            explain: parentValue.kpiExplain
                        };
                        indicatorArray.push(indicatorObject);
                    }
                }
            }
        }
        //向指标对象中塞入末级指标对象
        for(var i= 0; i < evalContent.length; i++) {
            indicatorObject = {
                id: evalContent[i].id,
                level: evalContent[i].kpiLevel,
                name: evalContent[i].kpiName,
                rows: 1,
                weight: evalContent[i].kpiWeight,
                explain: evalContent[i].kpiExplain,
                standard: evalContent[i].kpiStand,
                type: evalContent[i].valueType,
            };
            indicatorArray.push(indicatorObject);
        }
        //遍历saveTaskKpiDataArrayResponse，向指标对象中塞入存在的下级指标对象
        if(saveTaskKpiDataArrayResponse){
            for(var i=0; i < saveTaskKpiDataArrayResponse.length; i++){
                indicatorObject = {
                    id: saveTaskKpiDataArrayResponse[i].kpi.id,
                    level: saveTaskKpiDataArrayResponse[i].kpi.kpiLevel,
                    name: saveTaskKpiDataArrayResponse[i].kpi.kpiName,
                    rows: 1,
                    weight: saveTaskKpiDataArrayResponse[i].kpiWeight,
                    explain: saveTaskKpiDataArrayResponse[i].kpi.kpiExplain,
                    standard: saveTaskKpiDataArrayResponse[i].kpiStandard,
                    type: saveTaskKpiDataArrayResponse[i].kpi.kpivalueType,
                    order: saveTaskKpiDataArrayResponse[i].orderNum,
                };
                indicatorArray.push(indicatorObject);
            }
        }
        //修改父级的合并行
        for(var ever in saveTaskKpiDataArrayResponseParent ) {
            for(var i=0; i<evalContent.length; i++){
                if(evalContent[i].id == ever){
                    var kpi = evalContent[i];//直接父级
                    if(saveTaskKpiDataArrayResponseParent[ever].length > 1){
                        for(var m=0; m< indicatorArray.length; m++){
                            if(indicatorArray[m].id == ever){
                                indicatorArray[m].rows = indicatorArray[m].rows + saveTaskKpiDataArrayResponseParent[ever].length - 1;
                            }
                        }
                        for(var j=1; j < levelNum ; j++){
                            var parentId = "parentKpi" + j ;
                            var id = kpi[parentId].id; //要修改的父级合并行的id
                            for(var m=0; m< indicatorArray.length; m++){
                                if(indicatorArray[m].id == id){
                                    indicatorArray[m].rows = indicatorArray[m].rows + saveTaskKpiDataArrayResponseParent[ever].length - 1;
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(indicatorArray);

        //生成目标行列json空值数据
        for(var i = 0;i < trNum ;i ++) {
            //每一行即每一个json对象的键和值都需要动态生成
            var row = {};
            for(var j = 1;j <= tdNum + 1; j++){
                var name = "t" + j; //先自动生成键
                row[name] = {};
            }
            data.push(row);   //每次都push一行
        }
        console.log(data);

        //遍历indicatorArray，向data中塞值
        for(var i = 0; i< indicatorArray.length; i ++){
            var num = indicatorArray[i].level;
            var tdIndicatorName = "t" + num;
            var tdIndicatorNameTrCount = "td" + num + "trCount";
            var temp = window[tdIndicatorNameTrCount];
            if(indicatorArray[i].order){ //下一级选择指标渲染
                var trOrder = indicatorArray[i].order - 1;
                for (var n in data[trOrder]) {
                    if (n == tdIndicatorName) {
                        data[trOrder][n] = {
                            name: indicatorArray[i].name,
                            weight: indicatorArray[i].weight,
                            rows: indicatorArray[i].rows,
                            explain: indicatorArray[i].explain,
                            id: indicatorArray[i].id,
                            standard: indicatorArray[i].standard,
                            type: indicatorArray[i].type,
                        };
                        window[tdIndicatorNameTrCount] = window[tdIndicatorNameTrCount] + 1 ;
                        temp = window[tdIndicatorNameTrCount];
                    }
                }
            }else{
                for(var j = 0; j < indicatorArray[i].rows ; j ++){
                    for (var n in data[temp]) {
                        if (n == tdIndicatorName) {
                            data[temp][n] = {
                                name: indicatorArray[i].name,
                                weight: indicatorArray[i].weight,
                                rows: indicatorArray[i].rows,
                                explain: indicatorArray[i].explain,
                                id: indicatorArray[i].id,
                                standard: indicatorArray[i].standard,
                                type: indicatorArray[i].type,
                            };
                            window[tdIndicatorNameTrCount] = window[tdIndicatorNameTrCount] + 1 ;
                            temp = window[tdIndicatorNameTrCount];
                        }
                    }
                }
            }

        }
        console.log(data);
        //表格左侧json数据转换end

        //批量定义
        for (var i = 1; i <= (tdNum - 1); i++) {
            create_variable(i);
        }

        function create_variable(num) {
            var name = "t" + num; //生成函数名
            window[name];
        }
        //渲染主体表格页面  start
        $.each(data, function (i, item) {
            for (var j = 1; j <= (tdNum - 1); j++) { //动态生成当前末级指标的父级指标的所有列
                var tdKey = "t" + j;
                var kpiObject;
                for (var m in item) {
                    if (m == tdKey) {
                        kpiObject = item[m];
                    }
                }
                if (window[tdKey] == '' || window[tdKey] != kpiObject.id) {
                    htmlTableBody += '<td class="cc" id="'+ kpiObject.id +'Name'+ j +'" title="'+ kpiObject.explain +'" rowspan="' + kpiObject.rows + '">' + kpiObject.name  + "（" +  kpiObject.weight+ "分）" + '</td>';
                    window[tdKey] = kpiObject.id;
                }
            }

            //渲染当前末级指标列start
            var tdKey = "t" + tdNum;
            var kpiObjectFinal;
            //拿到末级指标对象
            for (var m in item) {
                if (m == tdKey) {
                    kpiObjectFinal = item[m];
                }
            }
            if (window[tdKey] == '' || window[tdKey] != kpiObjectFinal.id) {
                htmlTableBody += '<td class="cc" id="'+ kpiObjectFinal.id +'Name'+ levelNum +'" title="'+ kpiObjectFinal.explain +'" rowspan="' + kpiObjectFinal.rows + '">' + kpiObjectFinal.name  + "（" +  kpiObjectFinal.weight+ "分）" + '</td>';//当前末级指标
                window[tdKey] = kpiObjectFinal.id;
            }
            //渲染当前末级指标列end

            //渲染下级待选择指标内容start
            var tdKey = "t" + (tdNum+1);
            var kpiObjectFinalNext;
            //拿到末级指标对象
            for (var m in item) {
                if (m == tdKey) {
                    kpiObjectFinalNext = item[m];
                }
            }
            if(kpiObjectFinalNext.id){
                htmlTableBody += '<td class="cc '+ kpiObjectFinal.id +'Name'+ (levelNum+1) +'"><textarea id="row' + kpiObjectFinalNext.id + 'colName'+ (levelNum + 1) +'num'+ commonFn.random(1,100000) +'" class="easyui-validatebox name" required="true" >'+ kpiObjectFinalNext.name +'</textarea>&nbsp;' +  //名称列
                    '<a href="#" class="easyui-linkbutton radioButton" iconCls="icon-select" id="'+ kpiObjectFinal.id  +'num'+ commonFn.random(1,100000) +'" onclick="commonFn.showNextKPITree(this.id);return false;" ></a>' +
                    '</td>';
                htmlTableBody += '<td class="cc '+ kpiObjectFinal.id +'Weight"><textarea id="row' + kpiObjectFinalNext.id + 'colWeight'+ commonFn.random(1,100000) +'" class="easyui-validatebox weight" required="true" onchange="" >'+ kpiObjectFinalNext.weight +'</textarea></td>';//权重列
                htmlTableBody += '<td class="aa '+ kpiObjectFinal.id +'Standard" colspan="5"><textarea id="row' + kpiObjectFinalNext.id + 'colStandard'+ commonFn.random(1,100000) +'" class="easyui-validatebox standard" required="true" onchange="" >'+ kpiObjectFinalNext.standard +'</textarea></td>';//评分标准列

            }else{
                htmlTableBody += '<td class="cc '+ kpiObjectFinal.id +'Name'+ (levelNum+1) +'"><textarea id="row' + kpiObjectFinal.id + 'colName'+ (levelNum + 1) +'num'+ commonFn.random(1,100000) +'" class="easyui-validatebox name" required="true" ></textarea>&nbsp;' +  //名称列
                    '<a href="#" class="easyui-linkbutton radioButton" iconCls="icon-select" id="'+ kpiObjectFinal.id  +'num'+ commonFn.random(1,100000) +'" onclick="commonFn.showNextKPITree(this.id)" ></a>' +
                    '</td>';
                htmlTableBody += '<td class="cc '+ kpiObjectFinal.id +'Weight"><textarea id="row' + kpiObjectFinal.id + 'colWeight'+ commonFn.random(1,100000) +'" class="easyui-validatebox weight" required="true" onchange="" ></textarea></td>';//权重列
                htmlTableBody += '<td class="aa '+ kpiObjectFinal.id +'Standard" colspan="5"><textarea id="row' + kpiObjectFinal.id + 'colStandard'+ commonFn.random(1,100000) +'" class="easyui-validatebox standard" required="true" onchange="" ></textarea></td>';//评分标准列
            }
            //渲染下级待选择指标内容end

            htmlTableBody += '<td class="ee '+ kpiObjectFinal.id +'Operation" colspan="5">' +
                '<a href="#" class="easyui-linkbutton editButton" iconCls="icon-edit" onclick="commonFn.editContent();return false;">修改</a>&nbsp;' +
                '<a href="#" class="easyui-linkbutton addButton" iconCls="icon-add" onclick="commonFn.addTableRow(this);return false;">增加</a>&nbsp;' +
                '<a href="#" class="easyui-linkbutton removeButton" iconCls="icon-remove" onclick="commonFn.removeTableRow(this);return false;">删除</a>' +
                '</td>';//最后一列操作列
            htmlTableBody += '<td class="serial" colspan="1" style="display:none;"></td>';//序号列
            htmlTableBody += '</tr>';
        });
        //渲染主体表格页面  end
        $('#tableBody').append(htmlTableBody);
        commonFn.initSerial();
        commonFn.cssStyleControl(saveTaskKpiDataArrayResponse);
    }
};

var getInfo = function(){
    var data = {
        "evalObject.id":1,
        "fetchProperties":"*,kpi[*,parent[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi1[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi2[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi3[id,kpiName,kpiWeight,kpiLevel,kpiExplain],parentKpi4[id,kpiName,kpiWeight,kpiLevel,kpiExplain]]"
    };
    $.ajax({
        type: 'get',
        url: 'http://10.15.1.34:8081/df-pe/api/KpiConfig?',
        dataType: 'json',
        data:data,
        contentType: "application/json; charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        async: false,
        success: function (map) {
            if(map.message){
                $.messager.alert('错误', map.message, 'error');
            }else{
                TablecommonFn.initTable(map);
            }
        }
    });
};
commonFn.getSaveTaskKpiDataArray();
getInfo();