

TablecommonFn = {
    initTable: function () {
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
                TablecommonFn.initTable(map.data.kpi_score_detail_info);//使用本地json数据
            }else{
                ip.ipInfoJump(map.error_msg, 'error');
            }
        }
    });
};

getInfo();