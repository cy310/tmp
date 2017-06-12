/**
 * Created by yc on 2017/4/13.
 */
/*
function setCookies(cookie_name, value, expireDays ) {
    let exDate = new Date();
    exDate.setDate( exDate.getDate() + expireDays);
    document.cookie  =  cookie_name + "=" +encodeURIComponent(value) + ( (expireDays === null) ? "" : ";" + exDate.toDateString())
}




function getCookie( cookie_name) {
    let cookies = document.cookie;
    if(cookies.length > 0 ) {

        let cn_start = cookies.indexOf(cookie_name + "=");//cookie_name起始位置
        if (cn_start !== -1){
            cn_start += cookie_name.length+1;
            let cn_end = cookies.indexOf(";", cn_start);//cookie结束位置
            if(cn_end === -1){
                cn_end = cookies.length;
            }

            return decodeURIComponent(cookies.slice(cn_start, cn_end));
        }
    }
    return "";
}




setCookies("ifClick", 'document?phone');
let allCookies = document.cookie;
console.log(allCookies);


let cookie_result = getCookie("ifClick");
console.log(cookie_result);



/!*
function getCookie1(c_name)
{
    if (document.cookie.length>0)
    {
        let c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1
            let c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return decodeURIComponent(document.cookie.substring(c_start,c_end))
        }
    }
    return ""
}


console.log(getCookie('ifClick'));*!/


let str = "ifClick=document%3Fphone; Hm_lvt_8e283b73777db7bf96d9ea8afab7bf67=1492135799; Hm_lpvt_8e283b73777db7bf96d9ea8afab7bf67=1492135799; _ga=GA1.2.2052840330.1492135806; Hm_lvt_39edd8e76884f07399be96cd422c9af3=1492135806; Hm_lpvt_39edd8e76884f07399be96cd422c9af3=1492136316";
console.log(str.indexOf(";"));
let substr = str.slice(0,str.indexOf(";"));
console.log(substr);

*/


function getCookie(name) {
    var arr, reg =new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    } else {
        return null;
    }
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    alert('保存token成功');
}

function apiSign(ts, data) {
    var token = getCookie('token');
    return md5(token + ts + data);
}

function apiDo(msg_type, msg_params, success) {
    var msg_wrapper = {
        'data': JSON.stringify(msg_params),
        'msgType': msg_type,
    }

    var params = {
        'wrapper': JSON.stringify(msg_wrapper),
    }

    var uid = 213;
    var ts = Date.parse(new Date()) / 1000;
    var sign = apiSign(ts, params['wrapper']);
    $.ajax({
        type: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "uid": uid,
            "ts": ts,
            "sign": sign,
        },
        url: "http://101.201.150.158:8084/api/rpc",
        data: params,
        success: function(msg_wrapper) {
            var msg_type = msg_wrapper['msgType'];
            if (msg_type === -1) {
                alert("错误，请稍后重试");
                return;
            }
            var msg_data = msg_wrapper['data'];
            var msg = JSON.parse(msg_data);
            if (msg['code'] != 0) {
                alert("错误，请稍后重试");
                return;
            }
            success(msg);
        },
    });
}

function loadBills(max_bill_id, success) {
    var params = {
        "billID": max_bill_id,
    }
    apiDo(0x00000701, params, success);
}

function agreeBill(bill_id, success) {
    var params = {
        "billID": bill_id,
    }
    apiDo(0x00000703, params, success);
}

function disagreeBill(bill_id, success) {
    var params = {
        "billID": bill_id,
    }
    apiDo(0x00000705, params, success);
}
