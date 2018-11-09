
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
                    $('#dialog').dialog('open').html("");
                    var htmlDialog = "";
                    var len = map.data.length;
                    for(var i=0; i<len; i++){
                        if(id == map.data[i].id){
                            var kpiObjectNext = map.data[i].kpi_final;
                            for(var m=0; m < kpiObjectNext.length; m++){//末级指标评分标准
                                htmlDialog += '<p style="width:300px;">' +
                                    '<label>' +  kpiObjectNext[m].kpi_name + '</label>' +
                                    '<input type="radio" class="nextKPISelect" id="'+ kpiObjectNext[m].kpi_id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeNextKPISelect(this.name,this.value)" />' +
                                    '</p>';
                            }
                        }
                    }
                   $('#dialog').append(htmlDialog);
                }else{
                    ip.ipInfoJump(map.error_msg, 'error');
                }
            }
        });
    },
    changeNextKPISelect: function(id,value){
        $("input[name='"+ id +"']").each(function(index,domEle){
            domEle.attr("checked",false);
        });
        $("input[name='"+ id +"'][value="+value+"]").attr("checked",true);
    },
    dialogSave: function(){
        alert($("#dialog").children(':first').children()[1].id);

    },
    dialogClose: function(){
        $("#dialog").dialog({
            onClose: function () {
                $(this).dialog('destroy');//销毁
            }
        });
    }

};
