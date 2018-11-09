$(document).ready(function(){
    $("#submit").click(function(){
        console.log($('#name').val());
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
            console.log(data);
        })
    })
});