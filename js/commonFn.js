
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
    showNextKPITree : function(id){
        $('#dialogContent').dialog({ //用js创建dialog
            title: '末级指标选择',
            width: 350,
            height: 300,
            closed: true,
            resizable:true,
            modal: true,
            queryParams: { value: id },//值传递
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
                            for(var m=0; m < kpiObjectNextGlobal.length; m++){//末级指标评分标准
                                htmlDialog += '<p style="width:300px;">' +
                                    '<label>' +  kpiObjectNextGlobal[m].kpi_name + '</label>' +
                                    '<input type="radio" class="nextKPISelect" id="'+ kpiObjectNextGlobal[m].kpi_id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeNextKPISelect(this.name,this.value)" />' +
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
        var id = obj["queryParams"].value; //末级的父级指标id值
        var idFinalKPI = $("input[name='"+ id +"']:checked").attr('id'); //末级指标id值
        if(idFinalKPI){
            for(var i=0; i<kpiObjectNextGlobal.length; i++){
                if(kpiObjectNextGlobal[i].kpi_id == idFinalKPI){
                    $('#row' + id + 'colName' + (levelNum + 1)).val(kpiObjectNextGlobal[i].kpi_name).attr("id", "row"+ idFinalKPI +"colName" + (levelNum + 1));
                }
            }
        }else{
            $.messager.alert('信息', '请选择末级指标', 'info');
        }

    },
    dialogClose: function(){
        /*该关闭方法不妥，弹窗会被永久销毁
        $("#dialogContent").dialog({
            onClose: function () {
                $(this).dialog('destroy');//销毁
            }
        });*/
    }

};
