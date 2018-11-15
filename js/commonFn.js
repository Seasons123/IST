
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
     * 提交指标选择信息
     */
    submitSelectEvalKPI : function(){
        var data = {
            "expert_info":"aa",
            "project_info":"bb"
        };
        console.log(JSON.stringify(data));
        $.ajax({
            type: 'POST',
            url: formUrl.saveEvalKPI,
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            async: false,
            success: function (map) {
                if(map.status == '0'){
                    /*commonFn.refresh();*/
                    $('#editBtn').linkbutton('disable');
                    $('#confirmBtn').linkbutton('disable');
                    commonFn.setReadonly();
                    commonFn.setEditCellColor(false);
                    $.messager.alert('信息', '提交成功', 'info');
                }else{
                    $.messager.alert('警告', '此状态已审核，不能修改', 'warning');
                }
            }, error: function () {
                ip.ipInfoJump(map.error_msg, 'error');
            }
        });
    },
    /**
     * 显示下一级待选择末级指标树
     */
    showNextKPITree : function(value){
        var id = value.split("num")[0];
        var idTextArea = $("#" + value).prev().attr("id");
        $('#dialogContent').dialog({ //用js创建dialog
            title: '末级指标选择',
            width: 350,
            height: 300,
            closed: true,
            resizable:true,
            modal: true,
            queryParams: { parentId: id , textAreaId: idTextArea},//值传递
            buttons:[{
                text:'保存',
                handler:commonFn.dialogSave
            },{
                text:'关闭',
                handler:commonFn.dialogClose
            }]
        });
        var data = {
            "kpi_id":id
        };
        $.ajax({
            type: 'GET',
            url: formUrl.queryNextKpi,
            dataType: 'JSON',
            data: data,
            async: false,
            success: function (map) {
                if(map.status == '0'){
                    $('#dialogContent').dialog('open').html("");
                    var htmlDialog = "";
                    var len = map.data.length;
                    for(var i=0; i<len; i++){
                        if(id == map.data[i].id){
                            kpiObjectNextGlobal = map.data[i].kpi_final;
                            for(var m=0; m < kpiObjectNextGlobal.next_kpi_list.length; m++){//末级指标评分标准
                                htmlDialog += '<p style="width:300px;">' +
                                    '<label>' +  kpiObjectNextGlobal.next_kpi_list[m].kpi_name + '</label>' +
                                    '<input type="radio" class="nextKPISelect" id="'+ kpiObjectNextGlobal.next_kpi_list[m].kpi_id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeNextKPISelect(this.name,this.value)" />' +
                                    '</p>';
                            }
                        }
                    }
                   $('#dialogContent').append(htmlDialog);
                }else{
                    ip.ipInfoJump(map.error_msg, 'error');
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
        var idFinalKPIOld = obj["queryParams"].textAreaId; //选择前末级的id值
        var idFinalKPI = $("input[name='"+ id +"']:checked").attr('id'); //末级指标id值
        if(idFinalKPI){
            for(var i=0; i<kpiObjectNextGlobal.next_kpi_list.length; i++) {
                if (kpiObjectNextGlobal.next_kpi_list[i].kpi_id == idFinalKPI) {
                    var idFinalKPINew =  idFinalKPI + "num" + commonFn.random(1,100000); //有可能末级指标重复选择，保证dom元素id值唯一性
                    $('#' + idFinalKPIOld).text(kpiObjectNextGlobal.next_kpi_list[i].kpi_name).attr("id", idFinalKPINew);
                    obj["queryParams"].textAreaId = idFinalKPINew; //更新选择前末级的id值
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
        var id = that.parentNode.id.split("row")[1].split("col")[0];//当前末级指标的父级id
        var num = parseInt(that.parentNode.parentNode.lastChild.innerHTML);//获取是第几行

        //新增一行start
        var trHTML = "<tr>";
        trHTML += '<td class="cc"><textarea id="row' + id + 'colName'+ (levelNum + 1) +'num'+ commonFn.random(1,100000) +'" class="easyui-validatebox name" required="true" ></textarea>&nbsp;' +  //名称列
            '<a href="#" class="easyui-linkbutton l-btn l-btn-small" iconcls="icon-select" id="'+ id  +'num'+ commonFn.random(1,100000) +'" onclick="commonFn.showNextKPITree(this.id)" group>' +
            '  <span class="l-btn-left l-btn-icon-left"><span class="l-btn-text l-btn-empty">&nbsp;</span><span class="l-btn-icon icon-select">&nbsp;</span></span>' +
            '</a>' +
            '</td>';
        trHTML += '<td class="cc"><textarea id="row' + id + 'colWeight" class="easyui-validatebox weight" required="true" onchange="" ></textarea></td>';//权重列
        trHTML += '<td class="aa" colspan="5"><textarea id="row' + id + 'colStandard" class="easyui-validatebox standard" required="true" onchange="" ></textarea></td>';//评分标准列

        trHTML += '<td id="row' + id + 'colOperation" class="ee" colspan="5">' +
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
                    var parentId = "chr_id" + j ;
                    var old = $("#"+ evalContent[i][parentId] + "Name" + j).attr("rowspan");
                    $("#"+ evalContent[i][parentId] + "Name" + j).attr("rowspan",parseInt(old)+1);
                }
            }
        }
        commonFn.initSerial();//序列号重排
    },
    removeTableRow: function(that){
        var id = that.parentNode.id.split("row")[1].split("col")[0];//当前末级指标的父级id
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
                            var parentId = "chr_id" + j ;
                            var old = $("#"+ evalContent[i][parentId] + "Name" + j).attr("rowspan");
                            $("#"+ evalContent[i][parentId] + "Name" + j).attr("rowspan",parseInt(old)-1);
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
    }
};
