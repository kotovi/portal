function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}
function checkUsername(list,username) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].username == username)&&(username.length>0)) {
            return list[i].id;
        }
    }
    return 0;
}

function makePassword(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function is_empty(x) {
    return (
        (typeof x == 'undefined')
        ||
        (x == null)
        ||
        (x == false)  //same as: !x
        ||
        (x.length == 0)
        ||
        (x == "")
        ||
        (x.toString().replace(/\s/g,"") == "")
        ||
        (!/[^\s]/.test(x))
        ||
        (/^\s*$/.test(x))
    );
}
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
var userApi = Vue.resource('/students{/id}');

Vue.component('user-form', {
    props: ['users', 'userAttr','groups', 'fil'],
    data: function() {
        return {
            id:'',
            firstname:'',
            lastname:'',
            secname:'',
            username:'',
            password:'',
            active:'',
            userEmail:'',
            userPasswordConfirm:'',
            userRole:'',
            userGroup:'',
            userAgreement:'',
            personalDataAgree:'',
            notificationAgree:'',
            phoneNumber:'',
            generatePassword:false,
        }
    },


    watch:{
        userAttr: function(newVal){
            this.id = newVal.id;
            this.firstname = newVal.firstname;
            this.lastname = newVal.lastname;
            this.username = newVal.username;
            this.password = newVal.password;
            this.active = newVal.active;
            this.userEmail = newVal.userEmail;
            this.userPasswordConfirm = newVal.userPasswordConfirm;
            this.userRole = newVal.userRole;
            this.userGroup = newVal.userGroup;
            this.secname=newVal.secname;
            this.userAgreement=newVal.userAgreement;
            this.personalDataAgree=newVal.personalDataAgree;
            this.notificationAgree=newVal.notificationAgree;
            this.phoneNumber=newVal.phoneNumber
        }
    },
    template:
        '<div>'+
        '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Слушатели</h1>'+
        '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary " value="Добавить" @click="addUser">'+

        '<div v-if="$root.showInputForm==true">' +

        '<div class="card" style="margin: 15px;">'+
        '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h3>Добавить  слушателя</h3></div>'+
        '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h3>Редактирование слушателя</h3></div>'+

        '<div class="card-body">'+
        '<form>'+


            '<div class="form-group col">'+
                '<label for="lastname">Фамилия</label>'+
                '<input type="text" class="form-control" id="lastname" v-model="lastname" placeholder="Фамилия">'+
                '<p class="alert alert-danger" v-show ="$root.userLastnameAlert">Укажите Фамилию слушателя!</p>'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="firstname">Имя</label>'+
                '<input type="text" class="form-control" id="firstname" v-model="firstname" placeholder="Имя">'+
                '<p class="alert alert-danger" v-show ="$root.userFirstnameAlert">Укажите Имя слушателя!</p>'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="secname">Отчество</label>'+
                '<input type="text" class="form-control" id="secname" v-model="secname" placeholder="Отчество">'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="userEmail">Email</label>'+
                '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="Email">'+
                '<p class="alert alert-danger" v-show ="$root.userEmailAlert">Укажите Email!</p>'+
                '<p class="alert alert-danger" v-show ="(($root.invalidEmail)&&($root.userEmailAlert==false))">Укажите валидный Email!</p>'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="username">Логин для входа в систему</label>'+
                '<input type="text" class="form-control" id="username" v-model="username" placeholder="Имя пользователя">'+
                '<p class="alert alert-danger" v-show ="$root.usernameAlert">Необходимо указать имя пользователя для входа в систему!</p>'+
                '<p class="alert alert-danger" v-show ="$root.userExistAlert">Данное имя пользователя уже занято!</p>'+
            '</div>'+

            '<div  class="form-group col">'+
                '<label for="custom-control custom-checkbox">Сгенерировать новый пароль</label>'+
                '<div class="custom-control custom-checkbox">' +
                    '<b-form-checkbox type="checkbox" class="form-check-input" id="generatePassword"  v-model="generatePassword" switch></b-form-checkbox>'+
                '</div>'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="userEmail">Контактный телефон</label>'+
                '<input type="email" class="form-control" id="phoneNumber" v-model="phoneNumber" placeholder="+7XXXXXXXXXX">'+
            '</div>'+

            '<div class="form-group col">'+
                '<label for="userGroup">Группа</label>'+
                '<select class="custom-select" id="userGroup"  v-model="userGroup" >'+
                    '<option selected value="0" >Нет</option>'+
                    '<option v-for="group in groups"  v-bind:value="group.id">{{group.groupName}} {{group.id}}</option>'+
                '</select>'+
                '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Пользователь должен быть привязан к группе!</p>'+
            '</div>'+

            '<div  class="form-group col">'+
                '<label for="custom-control custom-checkbox">Слушатель активен?</label>'+
                '<div class="custom-control custom-checkbox">' +
                    '<b-form-checkbox type="checkbox" class="form-check-input" id="active"  v-model="active" switch></b-form-checkbox>'+
                    '<p class="alert alert-danger" v-show ="$root.personalDataAgreeAlert">Небходимо дать согласие на обработку персональных данных!</p>'+
                '</div>'+
            '</div>'+

            '<div  class="form-group col">'+
                '<label for="custom-control custom-checkbox">Cогласие на обработку ПД</label>'+
                '<div class="custom-control custom-checkbox">' +
                    '<b-form-checkbox type="checkbox" class="form-check-input" id="personalDataAgree"  v-model="personalDataAgree" switch></b-form-checkbox>'+
                    '<p class="alert alert-danger" v-show ="$root.personalDataAgreeAlert">Небходимо дать согласие на обработку персональных данных!</p>'+
                '</div>'+
            '</div>'+

            '<div  class="form-group col">'+
                '<label for="custom-control custom-checkbox">Пользовательское соглашение</label>'+
                '<div class="custom-control custom-checkbox">' +
                    '<b-form-checkbox type="checkbox" class="form-check-input" id="userAgreement"  v-model="userAgreement" switch></b-form-checkbox>'+
                    '<p class="alert alert-danger" v-show ="$root.userAgreeAlert">Небходимо принять условия пользовательского соглашения</p>'+
                '</div>'+
            '</div>'+

            '<div  class="form-group col">'+
                '<label for="custom-control custom-checkbox">Согласие на рассылку</label>'+
                '<div class="custom-control custom-checkbox">' +
                    '<b-form-checkbox type="checkbox" class="form-check-input" id="notificationAgree"  v-model="notificationAgree" switch></b-form-checkbox>'+
                    '<p class="alert alert-danger" v-show ="$root.userAgreeAlert">Небходимо Дать согласие на отправку уведомлений</p>'+
                '</div>'+
            '</div>'+

            '<hr>'+

            '<div class="form-group row">'+
                '<div class="col-sm-10">'+
                    '<input style="margin: 5px;" v-if="$root.editClicked == false" type = "button"  class="btn btn-primary " value="Создать" @click="save"/>'+
                    '<input style="margin: 5px;" v-if="$root.editClicked == true"  type = "button"  class="btn btn-primary " value="Сохранить" @click="save"/>'+
                    '<input style="margin: 5px;" type = "button" class="btn btn-success" value="Домой" @click="backToRoot" />'+
                    '<input style="margin: 5px;"  type="button" class="btn btn-danger " value="Отменить" @click="cancel">'+
                '</div>'+
            '</div>'+

        '</form>'+
        '</div>'+
        '</div>'+
        '</div>'+

        '</div>',


    methods: {
        backToRoot: function(){
            window.location.href = '/';
        },
        addUser: function(){
            this.$root.showInputForm=true;
            if(this.$root.editBeenClicked==true){

                this.id = '';
                this.firstname = '';
                this.lastname = '';
                this.username = '';
                this.password = '';
                this.active = '';
                this.userEmail = '';
                this.userPasswordConfirm = '';
                this.userRole = '';
                this.userGroup = '';
                this.secname = '';
                this.userAgreement = '';
                this.personalDataAgree='';
                this.notificationAgree='';
                this.phoneNumber='';
                this.generatePassword='';


                this.user = this.$root.tempUser;
                const index = this.users.findIndex(item => item.id === this.user.id)

                if (index > -1) {
                    this.userss.splice(index, 1, this.user)
                } else {
                    this.users.push(this.user)
                }
                this.$root.tempUser = null;
                this.$root.editBeenClicked=false;

            }


        },
        cancel: function() {

            if(this.$root.editClicked==true) {
                this.$root.showInputForm=false;
            }
            if((this.$root.editClicked==false)){
                this.$root.showInputForm=false;
                this.id = '';
                this.firstname = '';
                this.lastname = '';
                this.username = '';
                this.password = '';
                this.active = '';
                this.userEmail = '';
                this.userPasswordConfirm = '';
                this.userRole = '';
                this.userGroup = '';
                this.secname = '';
                this.userAgreement = '';
                this.personalDataAgree = '';
                this.notificationAgree='';
                this.phoneNumber='';
            }
            this.$root.editClicked=false;
            this.$root.courceNameAlert=false;
            this.$root.courceDescriptionAlert=false;
            this.$root.lectionCountAlert=false;
            this.$root.testEnableAlert=false;
            this.$root.userFirstnameAlert=false;
            this.$root.userLastnameAlert=false;
            this.$root.userPasswordAlert=false;
            this.$root.userPasswordConfirmAlert=false;
            this.$root.userPasswordMismatchAlert=false;
            this.$root.userEmailAlert=false;
            this.$root.usernameAlert=false;
            this.$root.userActiveAlert=false;
            this.$root.userRoleAlert=false;
            this.$root.userPasswordLenghAlert=false;
            this.$root.invalidEmail=false;
            this.$root.changePassword=false;
            this.$root.userExistAlert=false;
            this.$root.userGroupNameAler=false;
            this.$root.showInputForm=false;

        },

        save: function () {
            if(this.generatePassword) {
                this.password=makePassword(10);
                alert("пароль сгенерирован автоматичеки"+ this.password);
            }
            var user = {
                firstname: capitalizeFirstLetter(this.firstname),
                lastname: capitalizeFirstLetter(this.lastname),
                username: this.username,
                password: this.password,
                userPasswordConfirm: this.userPasswordConfirm,
                active: this.active,
                userEmail: this.userEmail,
                userRole: this.userRole,
                userGroup: this.userGroup,
                generatePassword: this.generatePassword,
                secname: this.secname,
                userAgreement:this.userAgreement,
                personalDataAgree: this.personalDataAgree,
                notificationAgree: this.notificationAgree,
                phoneNumber: this.phoneNumber,
            };

            if (!isNumeric(this.userGroup)) {
                this.$root.userGroupNameAlert = true;
            } else this.$root.userGroupNameAlert = false;

            if (is_empty(this.firstname)) {
                this.$root.userFirstnameAlert = true;
            } else this.$root.userFirstnameAlert = false;

            if (is_empty(this.lastname)) {
                this.$root.userLastnameAlert = true;
            } else this.$root.userLastnameAlert = false;



            if (this.active.length < 3) {
                this.$root.userActiveAlert= true;
            } else this.$root.userActiveAlert = false;


            if (is_empty(this.password)) {
                this.$root.userPasswordAlert = true;
            } else this.$root.userPasswordAlert = false;

            if (is_empty(this.userPasswordConfirm)) {
                this.$root.userPasswordConfirmAlert = true;
            } else this.$root.userPasswordConfirmAlert = false;


            if (this.generatePassword==false){
                if ((this.$root.userPasswordConfirmAlert == false)&&(this.$root.userPasswordAlert == false)) {

                    if(this.password.toString().length > 9){
                        this.$root.userPasswordLenghAlert=false;
                    } else {
                        this.$root.userPasswordLenghAlert=true;
                    }

                    if(this.password.toString().localeCompare(this.userPasswordConfirm.toString())!=0) {
                        this.$root.userPasswordMismatchAlert = true;
                    } else {
                        this.$root.userPasswordMismatchAlert = false;
                    }
                }

            } else {
                this.$root.userPasswordMismatchAlert = false;
                this.$root.userPasswordLenghAlert=false;
                this.$root.userPasswordAlert = false;
                this.$root.userPasswordConfirmAlert = false;
            }
            if ((this.$root.editClicked)&&(this.$root.changePassword==false)){
                this.$root.userPasswordAlert =false;
                this.$root.userPasswordConfirmAlert =false;
                this.$root.userPasswordMismatchAlert =false;
            }

            if (is_empty(this.userEmail)) {
                this.$root.userEmailAlert = true;
            } else {
                this.$root.userEmailAlert = false;
            }

            if(validateEmail(this.userEmail)){
                this.$root.invalidEmail=false
            } else {
                this.$root.invalidEmail=true;
            }

            if (is_empty(this.username)) {
                this.$root.usernameAlert = true;
            } else {
                this.$root.usernameAlert = false;
                if((checkUsername(this.users,this.username)==0) || (checkUsername(this.users,this.username)==this.id)) {
                    this.$root.userExistAlert=false;
                }else {
                    this.$root.userExistAlert =true;
                }
            }


            if ((!this.$root.userFirstnameAlert) &&
                (!this.$root.userLastnameAlert) &&
                (!this.$root.userPasswordAlert) &&
                (!this.$root.userPasswordConfirmAlert) &&
                (!this.$root.userPasswordMismatchAlert)&&
                (!this.$root.usernameAlert)&&
                (!this.$root.userEmailAlert)&&
                (!this.$root.userActiveAlert)&&
                (!this.$root.userExistAlert)&&
                (!this.$root.invalidEmail)&&
                (!this.$root.userPasswordLenghAlert)&&
                (!this.$root.userGroupNameAlert)
            ) {

                if (this.id) {
                    this.$root.editClicked = false;
                    userApi.update({id: this.id}, user).then(result =>
                        result.json().then(data => {
                            var index = getIndex(this.users, data.id);
                            this.$root.changePassword = false;
                            this.$root.editClicked = false;
                            this.users.splice(index, 1, data);
                            this.id = ''
                            this.firstname = ''
                            this.lastname = ''
                            this.username = ''
                            this.userEmail = ''
                            this.password = ''
                            this.active = ''
                            this.userGroup =''
                            this.secname = ''
                            this.userAgreement=''
                            this.personalDataAgree=''
                            this.notificationAgree=''
                            this.phoneNumber=''
                        })
                    )
                    this.$root.showInputForm=false;
                } else {
                    userApi.save({}, user).then(result =>
                        result.json().then(data => {
                            this.users.push(data);
                            this.firstname = ''
                            this.lastname = ''
                            this.username = ''
                            this.userEmail = ''
                            this.password = ''
                            this.active = ''
                            this.userGroup =''
                            this.secname = ''
                            this.userAgreement =''
                            this.personalDataAgree =''
                            this.notificationAgree =''
                            this.phoneNumber=''
                        })
                    )
                    this.$root.showInputForm=false;
                }
            }
        }
    }
});

Vue.component('user-row' , {
    props: ['user', 'editMethod', 'users'],
    template:
        '<tr>'+
        '<td width="30%" align="left">{{user.lastname}} {{user.firstname}} {{user.secname}}</td>'+
        '<td width="12%" align="center">{{user.userEmail}}</td>'+
        '<td width="12%" align="center">{{user.roles}}</td>'+
        '<td width="12%" align="center"><p v-if="user.active==0">Нет</p><p v-if="user.active==1">Да</p></td>'+
        '<td width="34%" align="center">'+
        '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
        '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.user);
            this.$root.showInputForm =true;
            this.$root.editBeenClicked=true;
            this.$root.tempUser = this.user;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением необходимо завершить редактирование!");
            } else {
                userApi.remove({id: this.user.id}).then(result => {
                    if (result.ok) {
                        this.users.splice(this.users.indexOf(this.user), 1)

                    }
                })
            }

        }
    }

});

Vue.component('users-list', {
    props: ['users', 'groups'],
    data: function(){
        return {
            user: null,
            search: '',
            pageNumber: 0,
        }
    },

    template:
        '<div  style="position: relative;">'+
            '<user-form :users="users" :userAttr="user" :groups="groups"/>'+
            '<div v-if="$root.showInputForm==false" class="card" style="margin-top: 15px; min-width: 900px;">'+
                '<div class="card-header text-white bg-primary">Слушатели системы</div>'+
                '<div class="card-body">'+
                    '<input v-model="search" id="search" class="form-control m-2" placeholder="Поиск">'+
                    '<table v-if="($root.editClicked == false)"  class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th width="30%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byLastname" @click="byLastname">Имя</a></th>'+
                                '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byUserEmail" @click="byUserEmail">E-mail</a></th>'+
                                '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byUserEmail" @click="byRoles">Роль</a></th>'+
                                '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byUserEmail" @click="byActive">Активен</a></th>'+
                                '<th width="34%" scope="col" style="text-align: center;">Действие</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<user-row v-for="user in paginatedData" :key="user.id" :user = "user" :editMethod="editMethod" :users="filteredUsers"/>' +
                        '</tbody>' +
                    '</table>' +
                '</div>'+
            '</div>'+
        '<div v-if="((pageCount>1)&&($root.showInputForm==false))" align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"> < Назад</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">Вперед > </button>'+
            '</div>'+
        '</div>',
    computed: {
        sortedUsers() {
            const k = this.$root.sortKey;
            return this.users.sort(dynamicSort(k));
        },
        filteredUsers() {
            const s = this.search.toLowerCase();
            //return this.sortedUsers.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedUsers.filter(sortedUser =>
                _.some(sortedUser, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.filteredUsers.length,
                s = 10;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * 10,
                end = start + 10;

            return this.filteredUsers.slice(start, end);

        }
    },
    methods: {
        byLastname: function(){
            this.$root.sortKey="lastname";
        },
        byActive: function(){
            this.$root.sortKey="active";
        },
        byRoles: function(){
            this.$root.sortKey="roles";
        },


        byUserEmail: function(){
            this.$root.sortKey="userEmail";
        },
        editMethod: function(user){
            this.user = user;
            this.user.userPasswordConfirm = this.user.password;
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        }

    }

});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<users-list :users="users" :groups="groups"/> ' +
        '</div>',
    data: {
        users: [],
        groups:[],

        reverse: false,
        editClicked:false,
        userFirstnameAlert:false,
        userLastnameAlert:false,
        userPasswordAlert:false,
        userPasswordConfirmAlert:false,
        userPasswordMismatchAlert:false,
        userEmailAlert:false,
        usernameAlert:false,
        userActiveAlert:false,
        userRoleAlert:false,
        userPasswordLenghAlert:false,
        invalidEmail:false,
        changePassword:false,
        userExistAlert:false,
        userGroupNameAler:false,
        showInputForm:false,
        editBeenClicked:false,
        tempUser:null,
        sortKey: 'lastname'
    },

    created: function () {
        axios.get('/studentgroup').then(result => {
            this.groups=result.data
        });

        userApi.get({id: this.$root.id}).then(result =>
            result.json().then(data =>
                data.forEach(user => {this.users.push(user);})
            )
        )
    },
});