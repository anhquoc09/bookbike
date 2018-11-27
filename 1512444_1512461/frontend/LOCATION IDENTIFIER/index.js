window.onload = function () {
    vm.setupSSE();
};

function getDefaultData(){
    return {
        iduser: "",
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
        geocoder: {lat: 10.7623314, lng: 106.6820053},
        address: "257 Nguyễn Văn Cừ Quận 5",
        addressReverseIndex: "",
        idUpdate: 0,
        msg: "",
        err: "",
        loginVisible: true,
        registVisible: false,
        requestVisible: false,
        mapVisible: false,
        navbarVisible: false,
        numDeltas: 100,
        tranLat: 0,
        tranLng: 0,
        index: 0
    }
}

var vm = new Vue({
    el: '#app2',
    data: getDefaultData(),
    methods: {
        login: function () {
            var self = this;
            if (self.loginVisible) {
                axios.post('http://localhost:3000/userController/login', {
                    username: self.username,
                    password: self.password
                }).then(function (response) {
                    self.requestVisible = true;
                    self.loginVisible = false;
                    self.registVisible = false;
                    self.mapVisible = false;
                    self.navbarVisible = true;
                    self.acToken = response.data.access_token;
                    self.rfToken = response.data.refresh_token;
                    self.iduser = response.data.user.iduser;
                    vm.initMap();
                    self.getAllRequest();
                }).catch(function (err) {
                    alert("username và password không đúng !!!");
                    self.requestVisible = false;
                    self.navbarVisible = false;
                    self.login();
                });
            } else {
                self.loginVisible = true;
                self.registVisible = false;
                self.requestsVisible = false;
                self.mapVisible = false;
            }
        },

        regist: function () {
            var self = this;
            if (self.registVisible) {
                if (self.checkRegist()) {
                    axios.post('http://localhost:3000/userController/', {
                        username: self.username,
                        password: self.password,
                        name: self.fullname,
                        email: self.email,
                        phone: self.phone,
                        permission: 0,
                        DOB: self.dob,
                    }).then(response => {
                        self.loginVisible = true;
                        self.registVisible = false;
                    }).catch(err => {
                        alert(err);
                    })
                }
            } else {
                self.username = "";
                self.password = "";
                self.registVisible = true;
                self.loginVisible = false;
            }

        },

        checkRegist: function () {
            var self = this;
            if (self.repassword != self.password) {
                alert("Mật khẩu không trùng khớp");
                return false;
            }
            if(self.username == "") {
                alert("Không được bỏ trống tên đăng nhập");
                return false;
            }
            if (self.password == "") {
                alert("Không được bỏ trống mật khẩu");
                return false;
            }
            if (self.fullname == "") {
                alert("Không được bỏ trống họ và tên");
                return false;
            }
            if (self.email == "") {
                alert("Không được bỏ trống email");
                return false;
            }
            if (self.phone == "") {
                alert("Không được bỏ trống số điện thoại");
                return false;
            }
            if (self.dob == "") {
                alert("Không được bỏ trống ngày sinh");
                return false;
            }
            return true;
        },

        getAllRequest: function () {
            var self = this;
            axios.get('http://localhost:3000/locaIdController/getRequestReceiver', {headers: {token: self.acToken}})
                .then(response => {
                    console.log(response.data);
                    self.requests = response.data;
                    self.rfTable();
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
                    if (err.response.status === 401) {
                        self.loginVisible = true;
                        self.requestVisible = false;
                    }
                })
                .then(function () {
            })
        },

        setupSSE: function () {
            var self = this;
            if (typeof(EventSource) === 'undefined') {
                console.log('not support');
                return;
            }

            var add = new EventSource('http://localhost:3000/requestAddedEvent');

            add.onerror = function (e) {
                console.log('error : ' + e);
            };

            add.addEventListener('EVENT_ADDED', function (e) {
                var data = JSON.parse(e.data);
                self.requests.push(data);
                self.rfTable();
                $('#tableOrder tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        $('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            }, false);

            var remove = new EventSource('http://localhost:3000/requestRemoveEvent');
            remove.onerror = function (e) {
                console.log(e);
            };

            remove.addEventListener('EVENT_REMOVE', function (e) {
                var data = JSON.parse(e.data);
                self.getAllRequest();
            }, false);
        },

        rfTable: function () {
            new Promise(function (resolve, reject) {
                $('#tableOrder').DataTable().destroy();
                resolve();
            }).then(function () {
                var table = $('#tableOrder').DataTable({
                    "paging": false,
                    "scrollY": 180,
                    "info": false
                });
                $('#tableOrder tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            })
        },

        initMap: function () {
            var self = this;
            geocoder = new google.maps.Geocoder();
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
                    self.reverseGeocoding(marker);

                    // google.maps.event.addListener(map, 'click', function (event) {
                    //     var result = [event.latLng.lat(), event.latLng.lng()];
                    //     self.transition(result);
                    // });

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            map.setCenter(pos);
                            marker.setPosition(pos);
                        });
                    }
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
            });
            console.log(self.geocoder);
        },

        toggleBounce: function () {
            if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        },

        changeAddress: function (address) {
            geocoder.geocode({'address': address}, function (results, status) {
                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
                    marker.setPosition(results[0].geometry.location);
                } else {
                    console.log('err : ' + status);
                }
            });
        },

        reverseGeocoding: function (marker) {
            var self = this;
            var geocoder = new google.maps.Geocoder();
            google.maps.event.addListener(marker, 'dragend', function (evt) {
                self.geocoder.lat = evt.latLng.lat();
                self.geocoder.lng = evt.latLng.lng();
                geocoder.geocode({'location': evt.latLng}, function (results, status) {
                    if (status == "OK") {
                        if (results[0]) {
                            self.addressReverseIndex = results[0].formatted_address;
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                })
            });

            google.maps.event.addListener(marker, 'drag', function (evt) {
                console.log("marker is being dragged");
            });
        },

        updateGeocode: function(){
          var self = this;
          console.log(self.geocoder);
          if(self.addressReverseIndex === ""){
              alert("Vui lòng chọn địa chỉ mới trên bản đồ !!!")
          }else{
              axios.post('http://localhost:3000/locaIdController/reverseAddress', {
                  id_request: self.idUpdate,
                  addressReverse: self.addressReverseIndex,
                  geocoder: self.geocoder,
              },{ headers: { token: self.acToken } }).then(function (response) {
                  self.getAllRequest();
                  self.addressReverseIndex = "";
              }).catch(function (err) {
                  console.log('err : ' + err);
              });
          }
        },

        transition: function (result) {
            var self = this;
            self.index = 0;
            self.tranLat = (result[0] - self.geocoder.lat) / self.numDeltas;
            self.tranLng = (result[0] - self.geocoder.lng) / self.numDeltas;
            self.moveMarker();
        },

        moveMarker: function () {
            var self = this;
            self.msg = "";
            self.err = "";
            self.geocoder.lat += self.tranLat;
            self.geocoder.lng += self.tranLng;

            var latLng = new google.maps.LatLng(self.geocoder.lat, self.geocoder.lng);
            marker.setTitle("Lat: " + +" | Lnd: " + self.geocoder.lng);
            if (self.i != self.numDeltas) {
                self.i++;
                setTimeout(self.moveMarker(), 100);
            }
        },

        getGeocoder: function () {
            if ($('#tableOrder').DataTable().row('.selected').data() === undefined) {
                alert("Vui lòng chọn chuyến cần nhận !!!");
                return;
            } else {
                var self = this;
                self.idUpdate = parseInt($('#tableOrder').DataTable().row('.selected').data()[0]);
                self.requestVisible = true;
                self.mapVisible = true;

                new Promise(function (resolve, reject) {
                    var i;
                    for (i = 0; i < self.requests.length; i++) {
                        if (self.requests[i].id_request === parseInt($('#tableOrder').DataTable().row('.selected').data()[0])) {
                            self.address = self.requests[i].address;

                            resolve();
                        }
                    }
                }).then(function () {
                    self.initMap();
                })
            }
        },

        receiveRequest: function () {
            var self=this;
            axios.post('http://localhost:3000/locaIdController/receiveRequest', {
                id_request: self.idUpdate,
                idUser: self.iduser,
                geocoder: self.geocoder
            },{ headers: { token: self.acToken } })
                .then(function (response) {
                    console.log(response.data);
                    self.msg="Cập nhật thành công";
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            resolve();
                        }).then(function () {
                            if (self.mapVisible===true){
                                self.getGeocoder();
                            }
                        });
                        return;
                    }else {
                        self.err="Không thể cập nhật";
                    }
                }).then(function () {

            });
        },

        closeMap: function(){
            var self = this;
            self.mapVisible = false;
            self.requestsVisible = true;
            self.msg="";
            self.err="";
        },

        logout: function(){
            var self = this;
            var def = getDefaultData();
            Object.assign(this.$data,def);
            console.log(self.username);
        },
    }
});