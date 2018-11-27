function getDefaultData() {
    return {
        iduser: "",
        username: "",
        password: "",
        repassword: "",
        fullname: "",
        email: "",
        phone: "",
        dob: "",
        acToken: "",
        rfToken: "",
        loginVisible: true,
        registVisible: false,
        bodyVisible: false,
        navbarVisible:false,
        nameRequest: "",
        phoneRequest: "",
        addressRequest: "",
        noteRequest: "",
    }
}

var vm = new Vue({
   el: '#app1',
   data: getDefaultData(),
    methods: {
       login: function(){
           var self = this;
           if (self.loginVisible) {
               axios.post('http://localhost:3000/userController/receiverlogin', {
                   username: self.username,
                   password: self.password
               }).then(function (response) {
                   self.bodyVisible = true;
                   self.loginVisible = false;
                   self.navbarVisible = true;
                   self.registVisible = false;
                   self.acToken = response.data.access_token;
                   self.rfToken = response.data.refresh_token;
                   self.iduser = response.data.user.iduser;
                   console.log(self.acToken);
                   console.log(self.rfToken);
                   console.log(self.iduser);
               }).catch(function (err) {
                   alert("username và password không đúng !!!");
                   self.bodyVisible = false;
                   self.navbarVisible = false;
                   self.login();
               });
           } else {
               self.loginVisible = true;
               self.registVisible = false;
               self.bodyVisible = false;
           }
       },

        regist: function(){
            var self = this;
            if (self.registVisible){
                if(self.checkRegist()){
                    axios.post('http://localhost:3000/userController/addreceiver', {
                        username: self.username,
                        password: self.password,
                        name: self.fullname,
                        email: self.email,
                        phone: self.phone,
                        permission: 2,
                        DOB: self.dob,
                    }).then(response => {
                        self.loginVisible = true;
                        self.registVisible = false;
                        self.bodyVisible = false;
                    }).catch(err => {
                        alert(err);
                    })
                }
            } else{
                self.username = "";
                self.password = "";
                self.registVisible = true;
                self.loginVisible = false;
            }
        },

        checkRegist: function(){
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

        booking: function(){
            var self = this;
            if (self.checkRequest()) {
                axios.post('http://localhost:3000/requestReceiver', {
                    iduser: self.iduser,
                    name: self.nameRequest,
                    phone: self.phoneRequest,
                    address: self.addressRequest,
                    note: self.noteRequest
                }, {headers: {token: self.acToken}})
                    .then(response => {
                        alert("Bạn vui lòng chờ điện thoại từ  tài xế !!!");
                    })
                    .catch(err => {
                        if (err.response.status === 401) {
                            new Promise(function (resole) {
                                self.refreshToken();
                            }).then(() => {
                            });
                            return;
                        }
                    }).then(function () {
                });
            }
        },

        checkRequest: function() {
            var self = this;
            if (self.nameRequest == "") {
                alert("Không được bỏ trống tên");
                return false;
            }
            if (self.phoneRequest == "") {
                alert("Không được bỏ trống số điện thoại");
                return false;
            }
            if (self.addressRequest == "") {
                alert("Không được bỏ trống địa chỉ");
                return false;
            }
            return true;
        },

        refreshToken: function(){
          var self = this;
          axios.post('http://localhost:3000/userController/rfToken',{
              rfToken: self.rfToken
          })
              .then(response => {
                  self.acToken = response.data.access_token;
              })
              .catch(err =>{
                  if(err.response.status === 401){
                      self.loginVisible = true;
                      self.bodyVisible = false;
                  }
              })
              .then(function () {
              })
        },

        logout: function(){
           var self = this;
           var def = getDefaultData();
           Object.assign(this.$data,def);
           console.log(self.username);
        },
    }
});
