$(document).ready(function () {
    var data = {};
    data.name = "";
    data.phone = "";
    data.address = "";
    data.note = "";
    $("#submit").click(function () {
        data.name = $('#name').val();
        data.phone = $('#phone').val();
        data.address = $('#address').val();
        data.note = $('#note').val();
        if (data.name === "") {
            alert("Vui lòng điền tên")
        }
        else if (data.phone === "") {
            alert("Vui lòng điền số điện thoại để tài xế liên lạc")
        }
        else if (data.address === "") {
            alert("Vui lòng điền địa chỉ đón")
        }
        else {
            $.ajax({
                url: 'http://localhost:3000/requestReceiver',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                timeout: 10000
            }).done(function (data) {
                alert("Đang tìm tài xế cho bạn vui lòng chờ điện thoại !!!");
            })
        }
    })
});
