
/* 公共函数类  class commonFn */
var commonFn = {
    /*行排序*/
    sortByPro: function (pro) {
        return function (a, b) {
            var value1 = a[pro];
            var value2 = b[pro];
            return value1 - value2;
        }
    },
    /**
     * 产生随机整数，包含下限值，但不包括上限值
     * @param {Number} lower 下限
     * @param {Number} upper 上限
     * @return {Number} 返回在下限到上限之间的一个随机整数
     */
    random: function (lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    },
    /**
    * 修改指标选择信息
    */
    editEvalKPI: function () {
        if ($('#editBtn').linkbutton('options').disabled == false) {
            //commonFn.setEditCellColor(true);
            //commonFn.setEdit();
            $('#saveBtn').linkbutton('enable');
            $('#cancelBtn').linkbutton('enable');
            $('#confirmBtn').linkbutton('enable');
            $('#editBtn').linkbutton('disable');
        }
    },
    /**
     * 显示下一级待选择末级指标树
     */
    showNextKPITree : function(value){
        var id = value.split("num")[0];
        var idNameTextArea = $("#" + value).prev().attr("id");
        var idWeightTextArea = $("#" + value).parent().next().children().attr("id");
        var idStandardTextArea = $("#" + value).parent().next().next().children().attr("id");
        $('#dialogContent').dialog({ //用js创建dialog
            title: '末级指标选择',
            width: 350,
            height: 300,
            closed: true,
            resizable:true,
            modal: true,
            queryParams: {
                parentId: id ,
                nameTextAreaId: idNameTextArea,
                weightTextAreaId: idWeightTextArea,
                standardTextAreaId: idStandardTextArea},//值传递
            buttons:[{
                text:'保存',
                handler:commonFn.dialogSave
            },{
                text:'关闭',
                handler:commonFn.dialogClose
            }]
        });
        var data = {  //当前kpi的id，需要向后台发送的唯一请求参数
            "parent.id":id
        };
        $.ajax({
            type: 'get',
            url: formUrl.queryNextKpi,
            dataType: 'json',
            data:data,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (map) {
                if(map.message){
                    $.messager.alert('错误', map.message, 'error');
                }else{
                    $('#dialogContent').dialog('open').html("");
                    var htmlDialog = "";
                    //1.使用本地json数据start
                    var len = map.length;
                    for(var i=0; i<len; i++){
                        if(id == map[i].id){
                            kpiObjectNextGlobal = map[i].next_kpi_list;
                            for(var m=0; m < kpiObjectNextGlobal.length; m++){//末级指标评分标准
                                htmlDialog += '<p style="width:300px;">' +
                                    '<label>' +  kpiObjectNextGlobal[m].kpiName + '</label>' +
                                    '<input type="radio" class="nextKPISelect" id="'+ kpiObjectNextGlobal[m].id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeNextKPISelect(this.name,this.value)" />' +
                                    '</p>';
                            }
                        }
                    }
                    //1.使用本地json数据end
                    /*//2.使用本地服务器数据start
                    kpiObjectNextGlobal = map;
                    for(var m=0; m < kpiObjectNextGlobal.length; m++){//末级指标评分标准
                        htmlDialog += '<p style="width:300px;">' +
                            '<label>' +  kpiObjectNextGlobal[m].kpiName + '</label>' +
                            '<input type="radio" class="nextKPISelect" id="'+ kpiObjectNextGlobal[m].id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeNextKPISelect(this.name,this.value)" />' +
                            '</p>';
                    }
                    //2.使用本地服务器数据end*/
                    $('#dialogContent').append(htmlDialog);
                }
            }
        });
    },
    changeNextKPISelect: function(id,value){
        $("input[name='"+ id +"']").each(function(index,domEle){
            if(domEle.value == value){
                $("#"+domEle.id).attr("checked",true);
            }else{
                $("#"+domEle.id).attr("checked",false);
            }
        });
    },
    dialogSave: function(){
        var obj = $('#dialogContent').dialog('options');
        var id = obj["queryParams"].parentId; //末级的父级指标id值
        var idFinalKPIOld = obj["queryParams"].nameTextAreaId; //选择前末级的id值，名字单元格id
        var weightTextAreaIdOld = obj["queryParams"].weightTextAreaId; //选择前末级权重值单元格dom元素的id
        var standardTextAreaIdOld = obj["queryParams"].standardTextAreaId; //选择前末级评分标准单元格dom元素的id
        var idFinalKPI = $("input[name='"+ id +"']:checked").attr('id'); //当前末级指标id值
        if(idFinalKPI){
            for(var i=0; i<kpiObjectNextGlobal.length; i++) {
                if (kpiObjectNextGlobal[i].id == idFinalKPI) {
                    var idFinalKPINew =  idFinalKPI + "num" + commonFn.random(1,100000); //有可能末级指标重复选择，保证dom元素id值唯一性
                    var weightTextAreaIdNew =  idFinalKPI + "colWeight" + commonFn.random(1,100000);
                    var standardTextAreaIdNew =  idFinalKPI + "colStandard" + commonFn.random(1,100000);
                    $('#' + idFinalKPIOld).text(kpiObjectNextGlobal[i].kpiName).attr("id", idFinalKPINew);
                    $('#' + weightTextAreaIdOld).attr("id", weightTextAreaIdNew);
                    $('#' + standardTextAreaIdOld).attr("id", standardTextAreaIdNew);

                    obj["queryParams"].nameTextAreaId = idFinalKPINew; //更新
                    obj["queryParams"].weightTextAreaId = weightTextAreaIdNew; //更新
                    obj["queryParams"].standardTextAreaId = standardTextAreaIdNew; //更新
                }
             }
        }else{
            $.messager.alert('信息', '请选择末级指标', 'info');
        }

    },
    dialogClose: function(){
        $('#dialogContent').dialog('close');
    },
    addTableRow: function(that){
        var id = that.parentNode.className.split(" ")[1].split("Operation")[0];//当前末级指标的父级id
        var num = parseInt(that.parentNode.parentNode.lastChild.innerHTML);//获取是第几行

        //新增一行start
        var trHTML = "<tr>";
        trHTML += '<td class="cc '+ id +'Name'+ (levelNum+1) +'"><textarea id="row' + id + 'colName'+ (levelNum + 1) +'num'+ commonFn.random(1,100000) +'" class="easyui-validatebox name" required="true" ></textarea>&nbsp;' +  //名称列
            '<a href="#" class="easyui-linkbutton l-btn l-btn-small" iconcls="icon-select" id="'+ id  +'num'+ commonFn.random(1,100000) +'" onclick="commonFn.showNextKPITree(this.id)" group>' +
            '  <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text l-btn-empty">&nbsp;</span><span class="l-btn-icon icon-select">&nbsp;</span></span>' +
            '</a>' +
            '</td>';
        trHTML += '<td class="cc '+ id + 'Weight"><textarea id="row' + id + 'colWeight'+ commonFn.random(1,100000) +'" class="easyui-validatebox weight" required="true" onchange="" ></textarea></td>';//权重列
        trHTML += '<td class="aa '+ id + 'Standard" colspan="5"><textarea id="row' + id + 'colStandard'+ commonFn.random(1,100000) +'" class="easyui-validatebox standard" required="true" onchange="" ></textarea></td>';//评分标准列

        trHTML += '<td class="ee '+ id +'Operation" colspan="5">' +
            '<a href="#" class="easyui-linkbutton l-btn l-btn-small" iconcls="icon-edit" id="editBtn" onclick="commonFn.editContent()" group>' +
            '  <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">修改</span><span class="l-btn-icon icon-edit">&nbsp;</span></span>' +
            '</a>' +
            '<a href="#" class="easyui-linkbutton l-btn l-btn-small" iconcls="icon-add" id="addBtn" onclick="commonFn.addTableRow(this)" group>' +
            '  <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">增加</span><span class="l-btn-icon icon-add">&nbsp;</span></span>' +
            '</a>' +
            '<a href="#" class="easyui-linkbutton l-btn l-btn-small" iconcls="icon-remove" id="removeBtn" onclick="commonFn.removeTableRow(this)" group>' +
            '  <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">删除</span><span class="l-btn-icon icon-remove">&nbsp;</span></span>' +
            '</a>' +
            '</td>';//最后一列操作列
        trHTML += '<td class="serial" colspan="1" style="display:none;"></td>';//序号列
        trHTML += '</tr>';
        //新增一行end
        $("#select_table tr:eq("+ num +")").after(trHTML);

        //修改父级的合并行
        var rowspanOld = $("#"+ id + "Name"+ levelNum).attr("rowspan");
        $("#"+ id + "Name"+ levelNum).attr("rowspan",parseInt(rowspanOld)+1);
        for(var i=0 ;i<evalContent.length; i++){
            if(evalContent[i].id == id){
                for(var j=1; j<levelNum; j++){
                    var parentId = "parentKpi" + j ;
                    var old = $("#"+ evalContent[i][parentId].id + "Name" + j).attr("rowspan");
                    $("#"+ evalContent[i][parentId].id + "Name" + j).attr("rowspan",parseInt(old)+1);
                }
            }
        }
        commonFn.initSerial();//序列号重排
    },
    removeTableRow: function(that){
        var id = that.parentNode.className.split(" ")[1].split("Operation")[0];//当前末级指标的父级id
        $.messager.confirm('Confirm','确认删除?',function(r){
            if (r){
                //删除该行
                that.parentNode.parentNode.remove();
                //修改父级的合并行
                var rowspanOld = $("#"+ id + "Name"+ levelNum).attr("rowspan");
                $("#"+ id + "Name"+ levelNum).attr("rowspan",parseInt(rowspanOld)-1);
                for(var i=0 ;i<evalContent.length; i++){
                    if(evalContent[i].id == id){
                        for(var j=1; j<levelNum; j++){
                            var parentId = "parentKpi" + j ;
                            var old = $("#"+ evalContent[i][parentId].id + "Name" + j).attr("rowspan");
                            $("#"+ evalContent[i][parentId].id + "Name" + j).attr("rowspan",parseInt(old)-1);
                        }
                    }
                }
                commonFn.initSerial();//序列号重排
            }
        });
    },
    initSerial: function(){
        var i = 1;
        $(".serial").each(function(){
            $(this).html(i++);
        })
    },
    /**
     * 提交指标选择信息
     */
    submitSaveTaskKpi : function(){
        var saveTaskKpiDataArray = [];
        $(".serial").each(function(){
            var weightDomID = $(this).prev().prev().prev().children().attr("id");
            var standardDomID= $(this).prev().prev().children().attr("id");
            var kpi_id = weightDomID.split("colWeight")[0];
            var taskAPI = {};
            taskAPI["id"] = "";
            taskAPI["orderNum"] = $(this).html();
            taskAPI["evalObject"] = { //这个对象值上流页面带过来的信息
                "id":1,
                "lastModifiedVersion":0
            };
            taskAPI["kpi"] = {
                "id":kpi_id,
                "lastModifiedVersion":0 //执行第一次保存时lastModifiedVersion默认传值0
            };
            taskAPI["kpiWeight"] = $('#' + weightDomID).val();
            taskAPI["kpiStandard"] = $('#' + standardDomID).val();
            taskAPI["remark"] = "";
            saveTaskKpiDataArray.push(taskAPI);

        });
        console.log(JSON.stringify(saveTaskKpiDataArray));
        $.ajax({
            type: 'POST',
            url: formUrl.saveTaskKpi,
            dataType: 'json',
            data: JSON.stringify(saveTaskKpiDataArray),
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (map) {
                if(map.message){
                    $.messager.alert('警告', map.message, 'warning');
                }else{
                    /*commonFn.refresh();*/
                    $('#editBtn').linkbutton('disable');
                    $('#confirmBtn').linkbutton('disable');
                    commonFn.setReadonly();
                    commonFn.setEditCellColor(false);
                    $.messager.alert('信息', '提交成功', 'info');
                }
            }
        });
    },
};
