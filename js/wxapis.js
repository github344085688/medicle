
$.ajax({
    type: "post",
    url: 'http://gh.zayata.com/index.php?s=/Ibox/Web/getSdkConf',
    data: {url:window.location.href},
    dataType: 'json',
}).done(function (data) {
    wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: ['chooseImage', 'uploadImage', 'downloadImage']   // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });



});
function take_a_photo() {
    //拍照或从手机相册中选图接口
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            var localId = res.localIds[0];//选择图片成功，上传到微信服务器
            wx.getLocalImgData({
                localId: localId,
                success: function (res) {
                    var localData = res.localData;

                    localData = localData.replace('jgp', 'jpeg');

                    var dataurl;
                    if (localData.indexOf('base64') < 0) {
                        dataurl = 'data:image/jpeg;base64,' + localData;
                    }else {
                        dataurl=localData;
                    }
                    var imgs = {};
                    imgs["file[0]"] =dataurl;
                    $.ajax({
                        url: 'http://api.zayata.com/index.php?s=/Home/File/uploadPicture',
                        type: 'POST',
                        data:imgs,

                    }).done(function (data) {
                        app.datas.headimgurl=data.data[0].imgurl;
                        var _this = this;
                        jsonAjax("/Home/User/api_update_member_info",JSON.stringify(
                            {
                                access_token: app.token,
                                data: app.datas,
                                uid: app.uid
                            })
                        ).done(function (data) {

                        });
                    })
                        .fail(function () {
                            console.log("error");
                        });
                }
            })

        }
    })
}



