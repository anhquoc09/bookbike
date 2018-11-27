function getDefaultData(){
    return{
        idmanager: "",
        username: "",
        password: "",
        repassword: "",
        fullname: "",
        email: "",
        phone: "",
        dob: "",
        requests: [],
        acToken: "",
        rfToken: "",
        address: "257 Nguyễn Văn Cừ Quận 5",
        geocoder: {lat: 10.7623314, lng: 106.6820053},
        loginVisible: true,
        bodyVisible: false,
        navbarVisible: false,
        index: 0,
        tranLat: 0,
        tranLng: 0,
        numDeltas: 100,
    }
}

var vm = new Vue({
    el: '#app3',
    data: getDefaultData(),
    methods: {
        login: function () {
            var self = this;
            if (self.loginVisible) {
                axios.post('http://localhost:3000/userController/adminlogin', {
                    username: self.username,
                    password: self.password
                }).then(function (response) {
                    self.bodyVisible = true;
                    self.loginVisible = false;
                    self.navbarVisible = true;
                    self.acToken = response.data.access_token;
                    self.rfToken = response.data.refresh_token;
                    self.iduser = response.data.user.iduser;
                    self.getAllRequest();
                }).catch(function (err) {
                    alert("username và password không đúng !!!");
                    self.bodyVisible = false;
                    self.navbarVisible = false;
                    self.login();
                });
            } else {
                self.loginVisible = true;
                self.bodyVisible = false;
            }
        },

        getAllRequest: function () {
            var self = this;
            axios.get('http://localhost:3000/requestManagement/getAllRequest', {headers: {token: self.acToken}})
                .then(response => {
                    var i = 0;
                    self.requests = response.data;
                    for (i = 0; i < self.requests.length; i++) {
                        if (self.requests[i].status === 1) {
                            self.requests[i].drivername = "";
                        }
                    }
                    self.rfTable();
                })
                .catch(err => {
                    console.log(err);
                    if (err.response.status === 401) {
                        new Promise(function (resolve) {
                            self.refreshToken();
                        }).then(() => {
                            if (self.bodyVisible === true) {
                                self.getAllRequest();
                            }
                        });
                        return;
                    }
                })
                .then(function () {
                })
        },

        rfTable: function(){
          new Promise(function (resolve,reject) {
              $('#dataTable').DataTable().destroy();
              resolve();
          }).then(function(){
              var table = $('#dataTable').DataTable({
                  "paging":false,
                  "scrollY": 500,
                  "info": false
              });
              $('#dataTable tbody').on('click','tr',function(){
                  if($(this).hasClass('selected')){
                      $(this).removeClass('selected');
                  }else{
                      table.$('tr.selected').removeClass('selected');
                      $(this).addClass('selected');
                  }
              })
          })
        },

        refreshToken: function () {
            var self = this;
            axios.post('http://localhost:3000/requestManagement/rfToken', {
                rfToken: self.rfToken
            })
                .then(response => {
                    self.acToken = response.data.access_token;
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        self.loginVisible = true;
                        self.bodyVisible = false;
                    }
                })
                .then(function () {
                })
        },

        setupSSE: function(){
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
                self.requests.push(data);
                self.rfTable();
                $('#dataTable tbody').on('click','tr',function(){
                    if($(this).hasClass('selected')){
                        $(this).removeClass('selected');
                    }else{
                        $('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            },false);

            var remove = new EventSource('http://localhost:3000/requestRemoveEvent');

            remove.onerror = function (e) {
                console.log('error : ' + e);
            };

            remove.addEventListener('EVENT_REMOVE',function(e){
                var data = JSON.parse(e.data);
                self.getAllRequest();
            },false);
        },

        initMap: function () {
            var self = this;
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': self.address}, function (result, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    self.geocoder.lat = result[0].geometry.location.lat();
                    self.geocoder.lng = result[0].geometry.location.lng();
                    var myOptions = {
                        zoom: 16,
                        center: self.geocoder,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById('map'), myOptions);
                    marker = new google.maps.Marker({
                        position: self.geocoder,
                        draggable: true,
                        map: map,
                        title: "Lat :" + geocoder.lat + " | Lng :" + geocoder.lng
                    });

                    marker.addListener('click', self.toggleBounce);

                    google.maps.event.addListener(map, 'click', function (event) {
                        var result = [event.latLng.lat(), event.latLng.lng()];
                        self.transition(result);
                    })
                } else {
                    alert("Địa chỉ không được tìm thấy !!!");
                    var myOptions = {
                        zoom: 16,
                        center: self.geocoder,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    var map = new google.maps.Map(document.getElementById('map'), myOptions);
                    marker = new google.maps.Marker({
                        position: self.geocoder,
                        map: map,
                        title: "Lat: " + geocoder.lat + " | Lng: " + geocoder.lng
                    });

                    google.maps.event.addListener(map, 'click', function (event) {
                        var result = [event.latLng.lat(), event.latLng.lng()];
                        self.transition(result);
                    })
                }
            })
        },

        transition: function (result) {
            var self = this;
            self.index = 0;
            self.tranLat = (result[0] - self.geocoder.lat) / self.numDeltas;
            self.tranLng = (result[0] - self.geocoder.lng) / self.numDeltas;
            self.moveMarker();
        },

        toggleBounce: function () {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        },

        getGeocoder: function () {
            // if($('#dataTable').DataTable().row('.selected').data() === undefined ){
            //     alert("Vui lòng chọn chuyến cần xem ");
            //     return;
            // }else{
            //     var self = this;
            //     // new Promise(function(resolve,reject){
            //     //     var i;
            //     //     for (i=0;i<self.requests.length;i++){
            //     //         if(self.requests[i].id_request === parseInt($('#dataTable').DataTable().row('.selected').data()[0])){
            //     //             self.address = self.requests[i].address;
            //     //
            //     //             resolve('success');
            //     //         }
            //     //     }
            //     // }).then(function(value){
            //     //     self.initMap();
            //     //     console.log(value)
            //     // });
            //
            // }
            if ($('#dataTable').DataTable().row('.selected').data() === undefined) {
                alert("Vui lòng chọn chuyến cần xem ");
                return;
            } else {
                var self = this;
                new Promise(function (resolve, reject) {
                    var i;
                            for (i=0; i < self.requests.length; i++) {
                                if (self.requests[i].id_request === parseInt($('#dataTable').DataTable().row('.selected').data()[0])) {
                                    self.address = self.requests[i].address;
                                }
                            }
                    resolve('success');
                }).then(function (value) {
                    console.log(value);
                    self.initMap();
                })
            }
        },

        logout: function(){
            var self = this;
            var def = getDefaultData();
            Object.assign(this.$data,def);
            console.log(self.username);
        }
    }
});