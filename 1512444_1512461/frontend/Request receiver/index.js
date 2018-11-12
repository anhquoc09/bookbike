$(document).ready(function(){
    $("#submit").click(function(){
        var data = {};
        data.name= $('#name').val();
        data.phone= $('#phone').val();
        data.address= $('#address').val();
        data.note= $('#note').val();
        $.ajax({
            url: 'http://localhost:3000/requestReceiver',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            timeout: 10000
        }).done(function(data) {
            // console.log(data);
            alert("Đang tìm tài xế cho bạn vui lòng chờ điện thoại !!!");
        })
    })
});