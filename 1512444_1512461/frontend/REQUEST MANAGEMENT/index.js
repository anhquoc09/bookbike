var vm = new Vue({
    el: '#app3',
    data: {
        idmanager: "",
        username: "",
        password: "",
        requests: [],
        acToken: "",
        rfToken: "",
        loginVisible: true,
        bodyVisible: false,
    },
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
                    self.acToken = response.data.access_token;
                    self.rfToken = response.data.refresh_token;
                    self.iduser = response.data.user.iduser;
                    self.getAllRequest();
                }).catch(function (err) {
                    alert("username và password không đúng !!!");
                    self.bodyVisible = false;
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
                }).then(function () {
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
            }

            remove.addEventListener('EVENT_REMOVE',function(e){
                var data = JSON.parse(e.data);
                self.getAllRequest();
            },false);
        },
    }
});