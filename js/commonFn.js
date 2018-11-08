
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
                                    '<input type="radio" class="standard" id="'+ kpiObjectNext[m].id + '" name="'+ id +'" value="' + m + '" onclick="commonFn.changeScoreStandardValue(this.name,this.value)" />' +
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

    }

    /*
 * 辅助录入树的弹窗 param id 目标输入框的id element 资源标识 flag单选和多选的标识（0代表单选，1代表有多选框的）
 */
  /*  ip.showAssitTree = function(id, element, flag, viewModel, areaId, ele_name, callBack,condition,parentFlag) {
    var current_url = location.search;
    var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8, current_url.indexOf("tokenid") + 48);
    var id_p = id.indexOf("-btn");
    if (id_p != -1) {
        id = id.substr(0, id_p);
    }
    var ele_value = "";
    if(condition == undefined) {
        condition = "";
    }
    var all_options = {
        "element": element,
        "tokenid": tokenid,
        "ele_value": ele_value,
        "ajax": "noCache",
        "condition": condition
    };
    $.ajax({
        url: "/df/dic/dictree.do",
        type: "GET",
        async: false,
        data: ip.getCommonOptions(all_options),
        success: function(data) {
            ip.treeChoice(id, data.eleDetail, flag, viewModel, areaId, ele_name, parentFlag,callBack);
        }
    });
}*/
};
