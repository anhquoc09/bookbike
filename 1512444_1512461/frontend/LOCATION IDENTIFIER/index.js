window.onload = function () {
    vm.setupSSE();
};

var vm = new Vue({
    el: '#app2',
    data: {
        username: "",
        password: "",
        requests: [],
        acToken: "",
        rfToken: "",
        geocoder: {lat: 10.7623314, lng: 106.6820053},
        address: "",
        msg: "",
        err: "",
        loginVisible: true,
        requestVisible: false,
        numDeltas : 100,
        tranLat: 0,
        tranLng: 0,
        index: 0

    },
    methods: {
        login: function () {
            var self = this;
            axios.post('http://localhost:3000/userController/login', {
                username: self.username,
                password: self.password
            }).then(response => {
                self.requestVisible = true;
                self.loginVisible = false;
                self.acToken = response.data.access_token;
                self.rfToken = response.data.refresh_token
            }).catch(err => {
                alert(err);
            }).then(() => {
                self.getAllRequest();
            })
        },

        getAllRequest: function () {
            var self = this;
            axios.get('http://localhost:3000/locaIdController/getRequestReceiver', {headers: {token: self.acToken}})
                .then(response => {
                    self.requests = response.data;
                    console.log(response.data);
                    console.log(self.rfTable());
                    // self.rfTable();
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        new Promise(function (resolve) {
                            self.refreshToken();
                        }).then(() => {
                            if (self.requestVisible === true) {
                                self.getAllRequest()
                            }
                        });
                        return;
                    }
                }).then(() => {
            })
        },

        refreshToken: function () {
            var self = this;
            axios.post('http://localhost:3000/userController/rfToken', {
                rfToken: self.rfToken
            })
                .then(response => {
                    self.acToken = response.data.access_token;
                })
                .catch(err => {
                    if (err.response.statusCode === 401) {
                        self.loginVisible = true;
                        self.requestVisible = false;
                    }
                }).then(function () {
            })
        },

        setupSSE : function() {
            var self = this;
            if(typeof(EventSource) === 'undefined'){
                console.log('not support');
                return;
            }

            var add = new EventSource('http://localhost:3000/requestAddedEvent');

            add.onerror = function(e){
                console.log('error : ' + e);
            };

            add.addEventListener('EVENT_ADDED',function(e){
                var data = JSON.parse(e.data);
                console.log(data);
                self.requests.push(data);
                self.rfTable();
                $('#tableOrder tbody').on('click','tr',function(){
                    if($(this).hasClass('selected')){
                        $(this).removeClass('selected');
                    }else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            },false);

            var remove = new EventSource('http://localhost:3000/requestRemoveEvent');
            remove.onerror = function(e){
                console.log(e);
            };

            remove.addEventListener('EVENT_REMOVE',function(e){
                var data = JSON.parse(e.data);
                console.log(data);
                self.getAllRequest();
            },false);
        },

        rfTable: function(){
            new Promise(function(resolve,reject) {
                $('#tableOrder').DataTable().destroy();
                resolve();
            }).then(function(){
                var table = $('#tableOrder').DataTable();
                $('#tableOrder tbody').on('click','tr',function(){
                    if($(this).hasClass('selected')){
                        $(this).removeClass('selected');
                    }else{
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            })
        },

        initMap: function () {
            var self = this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': self.address}, function (result, status) {
                if(status == google.maps.Geostatus.OK){
                    self.geocoder.lat = result[0].geometry.location.lat();
                    self.geocoder.lng = result[0].geometry.location.lng();
                    var myOptions = {
                        zoom: 16,
                        center: self.geocoder,
                        mapTypeId:  google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById('map'),myOptions);
                    marker = new google.maps.Marker({
                        position: self.geocoder,
                        map: map,
                        title: "Lat :" + geocoder.lat + " | Lng :" + geocoder.lng
                    });

                    google.maps.event.addListener(map,'click',function(event){
                        var result = [event.latLng.lat(),event.latLng.lng()];
                        self.transition(result);
                    })
                }else{
                    alert("Địa chỉ không được tìm thấy !!! ");
                    var myOptions = {
                        zoom : 16,
                        center: self.geocoder,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById('map'),myOptions);
                    marker = new google.maps.Marker({
                        position: self.geocoder,
                        map: map,
                        title: "Lat: " + geocoder.lat + " | Lng: " + geocoder.lng
                    });

                    google.maps.event.addListener(map,'click',function(event){
                        var result  = [event.latLng.lat(),event.latLng.lng()];
                        self.transaction(result);
                    })
                }
            })

        },

        transaction: function(result){
            var self = this;
            self.i = 0;
            self.tranLat = (result[0] - self.geocoder.lat)/self.numDeltas;
            self.tranLng = (result[0] - self.geocoder.lng)/self.numDeltas;
            self.moveMarker();
        },

        moveMarker: function(){
            var self=this;
            self.msg="";
            self.err="";
            self.geocoder.lat += self.tranLat;
            self.geocoder.lng += self.tranLng;

            var latLng = new google.maps.LatLng(self.geocoder.lat,self.geocoder.lng);
            marker.setTitle("Lat: " + + " | Lnd: " + self.geocoder.lng);
            if(self.i!=self.numDeltas){
                self.i ++ ;
                setTimeout(self.moveMarker(), 100);
            }
        },

        editGeocoder: function(){
            if ($('#tableOrder').DataTable().row('.selected').data()===undefined){
                return
            }else {
                console.log($('#tableOrder').DataTable().row('.selected').data())
            }
        },

        updateGeocoder: function(){

        }

    }
});