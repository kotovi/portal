
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
var userApi = Vue.resource('/userlist{/id}');
Vue.component('multiselect', window.VueMultiselect.default);

Vue.component('user-form', {
    props: ['users', 'userAttr','groups', 'fil', 'lang'],
    data: function() {
        return {
            id:'',
            firstname:'',
            lastname:'',
            secname:'',
            username:'',
            password:'',
            active:13,
            idInMirIsmu: '',
            userEmail:'',
            userPasswordConfirm:'',
            userRole:'',
            userGroup:'',
            userGroupObject:null,
            generatedPassword:false,
            roles:[],
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
            this.idInMirIsmu = newVal.idInMirIsmu;
            this.userEmail = newVal.userEmail;
            this.userPasswordConfirm = newVal.userPasswordConfirm;
            this.userRole = newVal.userRole;
            this.userGroup = newVal.userGroup;
            this.secname=newVal.secname;
            this.roles = newVal.roles;
            this.userGroupObject = this.groups.filter(v => v.id === this.userGroup)[0];
        }
    },
    template:
        '<div>'+
            '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;" >Управление пользователями</h1>'+
            '<h1  v-else class="display-4 mt-5 mb-5" style="padding-top:20px;" >User management</h1>'+

            '<div v-if="lang==1">'+
                '<input  style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary " value="Добавить" @click="addUser">'+
                '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary " value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '</div>'+
            '<div v-if="lang!=1">'+
                '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary " value="Create" @click="addUser">'+
                '<input style="margin: 5px;" v-if="$root.showInputForm==false" type="button" class="btn btn-primary " value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '</div>'+
            '<div v-if="$root.showInputForm==true">' +
                '<div v-if="lang==1">'+
                    '<div class="card"  style="margin: 5px; width: 80%;">'+
                        '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h5 v-if="lang==1">Добавить пользователя</h5></div>'+
                        '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h5 v-if="lang==1">Редактирование пользователя</h5></div>'+
                        '<div class="card-body">'+
                            '<form>'+
                                '<div class="form-group col" style="width: 90%;">'+
                                    '<label for="lastname">Фамилия</label>'+
                                    '<input type="text" class="form-control" id="lastname" v-model="lastname" placeholder="Фамилия">'+
                                    '<p class="alert alert-danger" v-show ="$root.userLastnameAlert">Укажите Фамилию пользователя!</p>'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="firstname">Имя</label>'+
                                    '<input type="text" class="form-control" id="firstname" v-model="firstname" placeholder="Имя">'+
                                    '<p class="alert alert-danger" v-show ="$root.userFirstnameAlert">Укажите Имя пользователя!</p>'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="secname">Отчество</label>'+
                                    '<input type="text" class="form-control" id="secname" v-model="secname" placeholder="Отчество">'+
                                '</div>'+

                                '<div   class="form-group col" style="width: 90%;">'+
                                    '<label for="custom-control custom-checkbox">Сгенерировать пароль</label>'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="generatePassword"  v-on:change="generatePassword" switch></b-form-checkbox>'+
                                    '</div>'+
                                    '<label v-show="(generatedPassword==true)" for="password">Пароль: {{password}}</label>'+
                                '</div>'+

                                '<div v-if="((($root.editClicked == false) || ($root.changePassword == true))&  (generatedPassword==false))" >'+
                                    '<div  class="form-group col" style="width: 90%;">'+
                                        '<label for="password">Пароль</label>'+
                                        '<input type="password" class="form-control" id="password" v-model="password" placeholder="Пароль">'+
                                        '<p class="alert alert-danger" v-show ="$root.userPasswordAlert">Укажите пароль!</p>'+
                                    '</div>'+
                                    '<div   class="form-group col" style="width: 90%;">'+
                                        '<label for="userPasswordConfirm">Подтверждение пароля</label>'+
                                        '<input type="password" class="form-control" id="userPasswordConfirm" v-model="userPasswordConfirm" placeholder="Подтверждение пароля">'+
                                        '<p class="alert alert-danger" v-show ="$root.userPasswordConfirmAlert">Укажите подьтверждение пароля!</p>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userPasswordMismatchAlert">Пароль и подьтверждение пароля не совпадают!</p>'+
                                    '<p class="alert alert-danger" v-show ="$root.userPasswordLenghAlert">Пароль должен быть не меньше 10 символов!</p>'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="userEmail">Email</label>'+
                                    '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="Email">'+
                                    '<p class="alert alert-danger" v-show ="$root.userEmailAlert">Укажите Email!</p>'+
                                    '<p class="alert alert-danger" v-show ="(($root.invalidEmail)&&($root.userEmailAlert==false))">Укажите валидный Email!</p>'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="idInMirIsmu">ID в КИС ИГМУ</label>'+
                                    '<input type="text" class="form-control" id="idInMirIsmu" v-model="idInMirIsmu" placeholder="ID in ISMU">'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="username">Логин для входа в систему</label>'+
                                    '<input type="text" class="form-control" id="username" v-model="username" placeholder="Имя пользователя">'+
                                    '<p class="alert alert-danger" v-show ="$root.usernameAlert">Необходимо указать имя пользователя для входа в систему!</p>'+
                                    '<p class="alert alert-danger" v-show ="$root.userExistAlert">Данное имя пользователя уже занято!</p>'+
                                '</div>'+

                                '<div  class="form-group col" style="width: 90%;">'+
                                    '<label for="active">Пользователь активен?</label>'+
                                    '<select class="custom-select" id="active" v-model="active">'+
                                        '<option selected value="13" >Выбрать...</option>'+
                                        '<option  value="true">Да</option>'+
                                        '<option  value="false">Нет</option>'+
                                    '</select>'+
                                    '<p class="alert alert-danger" v-show ="$root.userActiveAlert">Укажите активен ли пользователь</p>'+
                                '</div>'+

                                '<div class="form-group col" style="width: 90%;">'+
                                    '<label for="roles">Роли: {{ roles }} </label>'+
                                    '<select v-model="roles" multiple class="custom-select" >'+
                                        '<option>USER</option>'+
                                        '<option>LECTOR</option>'+
                                        '<option>STUDENT</option>'+
                                        '<option>MODERATOR</option>'+
                                        '<option>ADMIN</option>'+
                                    '</select>'+
                                '</div>'+

                                '<div v-if="(groups!==null)" class="form-group col" style="width: 90%;">'+
                                    '<label for="userGroupObject">Группа</label>'+
                                    '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Выбрать группу">' +
                                        '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
                                        '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
                                        '<template slot="noResult" slot-scope="{noResult}">Группа не найдена. Поиск осуществляется только по названию!</template>'+
                                    '</multiselect>'+
                                    '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Укажите состоит ли пользователь в какой либо из групп!</p>'+
                                '</div>'+
        '                   </form>'+
                        '</div>'+
                        '<div class="card-footer">'+
                            '<div class="col-sm-10">'+
                                '<input style="margin: 5px;" v-if="$root.editClicked == false" type = "button"  class="btn btn-primary " value="Создать" @click="save"/>'+
                                '<input style="margin: 5px;" v-if="$root.editClicked == true"  type = "button"  class="btn btn-primary " value="Сохранить" @click="save"/>'+
                                '<input style="margin: 5px;"  type="button" class="btn btn-danger " value="Отменить" @click="cancel">'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                    '<div v-else>'+
                         '<div class="card"  style="margin: 5px; width: 80%;">'+
                            '<div v-if="($root.editClicked == false)" class="card-header text-white bg-primary"><h5>User creating</h5></div>'+
                            '<div v-if="($root.editClicked == true)"class="card-header text-white bg-primary"><h5>User editing</h5></div>'+
                                '<div class="card-body">'+
                                    '<form>'+
                                        '<div class="form-group col" style="width: 90%;">'+
                                            '<label for="lastname">Surname</label>'+
                                            '<input type="text" class="form-control" id="lastname" v-model="lastname" placeholder="Surname">'+
                                            '<p class="alert alert-danger" v-show ="$root.userLastnameAlert">Enter the User\'s Surname!</p>'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="firstname">Name</label>'+
                                            '<input type="text" class="form-control" id="firstname" v-model="firstname" placeholder="Name">'+
                                            '<p class="alert alert-danger" v-show ="$root.userFirstnameAlert">Enter  User name!</p>'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="secname">Middle name</label>'+
                                            '<input type="text" class="form-control" id="secname" v-model="secname" placeholder="Middle name">'+
                                        '</div>'+

                                        '<div   class="form-group col" style="width: 90%;">'+
                                            '<label for="custom-control custom-checkbox">Generate password</label>'+
                                            '<div class="custom-control custom-checkbox">' +
                                                '<b-form-checkbox type="checkbox" class="form-check-input" id="generatePassword"  v-on:change="generatePassword" switch></b-form-checkbox>'+
                                            '</div>'+
                                            '<label v-show="(generatedPassword==true)" for="password">Password: {{password}}</label>'+
                                        '</div>'+

                                        '<div v-if="((($root.editClicked == false) || ($root.changePassword == true))&  (generatedPassword==false))" >'+
                                            '<div  class="form-group col" style="width: 90%;">'+
                                                '<label for="password">Password</label>'+
                                                '<input type="password" class="form-control" id="password" v-model="password" placeholder="Password">'+
                                                '<p class="alert alert-danger" v-show ="$root.userPasswordAlert">Enter your password!</p>'+
                                            '</div>'+
                                            '<div   class="form-group col" style="width: 90%;">'+
                                                '<label for="userPasswordConfirm">Password confirmation</label>'+
                                                '<input type="password" class="form-control" id="userPasswordConfirm" v-model="userPasswordConfirm" placeholder="Password confirmation">'+
                                                '<p class="alert alert-danger" v-show ="$root.userPasswordConfirmAlert">Enter a password confirmation!</p>'+
                                            '</div>'+
                                            '<p class="alert alert-danger" v-show ="$root.userPasswordMismatchAlert">Password and confirmation password do not match!</p>'+
                                            '<p class="alert alert-danger" v-show ="$root.userPasswordLenghAlert">Password must be at least 10 characters!</p>'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="userEmail">Email</label>'+
                                            '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="Email">'+
                                            '<p class="alert alert-danger" v-show ="$root.userEmailAlert">Enter your Email!</p>'+
                                            '<p class="alert alert-danger" v-show ="(($root.invalidEmail)&&($root.userEmailAlert==false))">Enter a valid Email!</p>'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="idInMirIsmu">ID in KIS IGMU</label>'+
                                            '<input type="text" class="form-control" id="idInMirIsmu" v-model="idInMirIsmu" placeholder="ID in ISMU">'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="username">Login</label>'+
                                            '<input type="text" class="form-control" id="username" v-model="username" placeholder="Login">'+
                                            '<p class="alert alert-danger" v-show ="$root.usernameAlert">You must provide a username to login!</p>'+
                                            '<p class="alert alert-danger" v-show ="$root.userExistAlert">This username is already taken!</p>'+
                                        '</div>'+

                                        '<div  class="form-group col" style="width: 90%;">'+
                                            '<label for="active">Is the user active?</label>'+
                                            '<select class="custom-select" id="active" v-model="active">'+
                                                '<option selected value="13" >Select...</option>'+
                                                '<option  value="true">Yes</option>'+
                                                '<option  value="false">No</option>'+
                                            '</select>'+
                                            '<p class="alert alert-danger" v-show ="$root.userActiveAlert">Is the user active?</p>'+
                                        '</div>'+

                                        '<div class="form-group col" style="width: 90%;">'+
                                            '<label for="roles">Roles: {{ roles }} </label>'+
                                            '<select v-model="roles" multiple class="custom-select" >'+
                                                '<option>USER</option>'+
                                                '<option>LECTOR</option>'+
                                                '<option>STUDENT</option>'+
                                                '<option>MODERATOR</option>'+
                                                '<option>ADMIN</option>'+
                                            '</select>'+
                                        '</div>'+

                                        '<div v-if="(groups!==null)" class="form-group col" style="width: 90%;">'+
                                            '<label for="userGroupObject">Group</label>'+
                                            '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Select group">' +
                                                '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
                                                '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
                                                '<template slot="noResult" slot-scope="{noResult}">The group was not found. Search is carried out by name only!</template>'+
                                            '</multiselect>'+
                                            '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Indicate whether the user is a member of any of the groups!</p>'+
                                        '</div>'+
                                    '</form>'+
                                '</div>'+
                                '<div class="card-footer">'+
                                    '<div class="col-sm-10">'+
                                         '<input style="margin: 5px;" v-if="$root.editClicked == false" type = "button"  class="btn btn-primary " value="Create" @click="save"/>'+
                                         '<input style="margin: 5px;" v-if="$root.editClicked == true"  type = "button"  class="btn btn-primary " value="Save" @click="save"/>'+
                                         '<input style="margin: 5px;"  type="button" class="btn btn-danger " value="Cancel" @click="cancel">'+
                                    '</div>'+
                                '</div>'+

                         '</div>'+
        '</div>'+
        '</div>'+
                '</div>'+

        '</div>',


    methods: {

        generatePassword: function(){
            this.generatedPassword=!this.generatedPassword;
            if(this.generatedPassword){
                this.password = makePassword(10);
                console.log("this.password: "+ this.password);
            }

        },
        addUser: function(){
            this.$root.showInputForm=true;
           if(this.$root.editBeenClicked==true){

               this.id = '';
               this.firstname = '';
               this.lastname = '';
               this.username = '';
               this.password = '';
               this.active = 13;
               this.idInMirIsmu = '';
               this.userEmail = '';
               this.userPasswordConfirm = '';
               this.userRole = '';
               this.userGroup = '';
               this.secname = '';
               this.roles = '';


                this.user = this.$root.tempUser;
                const index = this.users.findIndex(item => item.id === this.user.id)

                if (index > -1) {
                    this.users.splice(index, 1, this.user)
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
                this.userGroupObject = null;
                this.idInMirIsmu = '';
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

            if((this.userGroupObject==null)||(this.userGroupObject==undefined)){
                this.$root.userGroupNameAlert = true;
            } else {
                this.$root.userGroupNameAlert = false;
                this.userGroup = this.userGroupObject.id;
            }


            if (is_empty(this.firstname)) {
                this.$root.userFirstnameAlert = true;
            } else this.$root.userFirstnameAlert = false;

            if (is_empty(this.lastname)) {
                this.$root.userLastnameAlert = true;
            } else this.$root.userLastnameAlert = false;



            if (this.active.length == 13) {
                this.$root.userActiveAlert= true;
            } else this.$root.userActiveAlert = false;


            if (is_empty(this.password)) {
                this.$root.userPasswordAlert = true;
            } else this.$root.userPasswordAlert = false;

            if (is_empty(this.userPasswordConfirm)) {
                this.$root.userPasswordConfirmAlert = true;
            } else this.$root.userPasswordConfirmAlert = false;


            if (this.generatedPassword==false){
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

                var user = {
                    firstname: capitalizeFirstLetter(this.firstname),
                    lastname: capitalizeFirstLetter(this.lastname),
                    username: this.username,
                    password: this.password,
                    userPasswordConfirm: this.userPasswordConfirm,
                    active: this.active,
                    userEmail: this.userEmail,
                    userRole: this.userRole,
                    userGroup: this.userGroupObject.id,
                    generatePassword: this.generatePassword,
                    secname: this.secname,
                    idInMirIsmu: this.idInMirIsmu,
                    roles: this.roles,
                };

               // this.user.userGroup=this.userGroupObject.id;

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
                                    this.active = 13
                                    this.userGroup =''
                                    this.secname = ''
                                    this.idInMirIsmu = ''
                                    this.roles = ''
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
                                    this.active = 13
                                    this.userGroup =''
                                    this.secname = ''
                                    this.idInMirIsmu = ''
                                    this.roles = ''
                                })
                        )
                        this.$root.showInputForm=false;
                    }
                }
            }
        }
});

Vue.component('user-card' , {
    props: ['user', 'editMethod', 'users', 'lang'],
    template:
        '<div class="card">'+
            '<div class="card-header text-white bg-primary"># {{users.indexOf(user) + 1}}</div>'+
            '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>Пользователь: </b>{{user.lastname}} {{user.firstname}} {{user.secname}}</li>'+
                '<li class="list-group-item"><b>E-mail: </b>{{user.userEmail}}</li>'+
                '<li class="list-group-item "><b>Роли: </b> {{user.roles}}</li>'+
                '<li class="list-group-item"><b>Id: </b>{{user.id}}</li>'+
                '<li class="list-group-item"><b>ID в ISMU: </b>{{user.idInMirIsmu}}</li>'+
                '<li v-if="user.phoneNumber!=null"  class="list-group-item"><b>Телефон: </b>{{user.phoneNumber}}</li>'+
                '<li v-if="user.userAgreement" class="list-group-item"><b>Пользовательское соглашение: </b>Есть</li>'+
                '<li v-else class="list-group-item"><b>Пользовательское соглашение: </b>Нет</li>'+
                '<li v-if="user.notificationAgree" class="list-group-item"><b>Согласие на оповещение: </b>Есть</li>'+
                '<li v-else class="list-group-item"><b>Согласие на оповещение: </b>Нет</li>'+
                '<li v-if="user.personalDataAgree" class="list-group-item"><b>Согласие на обработку ПД: </b>Есть</li>'+
                '<li v-else class="list-group-item"><b>Согласие на обработку ПД: </b>Нет</li>'+
            '</ul>'+
            '<ul v-else class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>User: </b>{{user.lastname}} {{user.firstname}} {{user.secname}}</li>'+
                '<li class="list-group-item"><b>E-mail: </b>{{user.userEmail}}</li>'+
                '<li class="list-group-item "><b>Roles: </b> {{user.roles}}</li>'+
                '<li class="list-group-item"><b>Id: </b>{{user.id}}</li>'+
                '<li class="list-group-item"><b>ID in ISMU: </b>{{user.idInMirIsmu}}</li>'+
                '<li v-if="user.phoneNumber!=null" class="list-group-item"><b>Phone nomber: </b>{{user.phoneNumber}}</li>'+
                '<li v-if="user.userAgreement" class="list-group-item"><b>Terms of use: </b>Yes</li>'+
                '<li v-else class="list-group-item"><b>Terms of use: </b>No</li>'+
                '<li v-if="user.notificationAgree" class="list-group-item"><b>Consent to notification: </b>Yes</li>'+
                '<li v-else class="list-group-item"><b>Consent to notification: </b>No</li>'+
                '<li v-if="user.personalDataAgree" class="list-group-item"><b>Consent to the processing of personal data: </b>Yes</li>'+
                '<li v-else class="list-group-item"><b>Consent to the processing of personal data: </b>No</li>'+
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input style="margin: 5px;" type = "button"  class="btn  btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                '<input style="margin: 5px;" type = "button"  class="btn  btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
        '</div>',

    methods: {
        edit: function(){
            this.editMethod(this.user);
            this.$root.showInputForm =true;
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

Vue.component('user-row' , {
    props: ['user', 'editMethod', 'users', 'lang'],
    template:
        '<tr>'+
            '<td width="34%" align="left">{{user.lastname}} {{user.firstname}} {{user.secname}}</td>'+
            '<td width="12%" align="center">{{user.userEmail}}</td>'+
            '<td width="12%" align="center">{{user.roles}}</td>'+
            '<td v-if="lang==1" width="12%" align="center"><p v-if="user.active==0">Нет</p><p v-if="user.active==1">Да</p></td>'+
            '<td v-else width="12%" align="center"><p v-if="user.active==0">No</p><p v-if="user.active==1">Yes</p></td>'+
            '<td width="30%" align="center">'+
                '<input v-if="lang==1" style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input v-else style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                '<input style="margin: 5px;" type = "button"  class="btn  btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.user);
            this.$root.showInputForm =true;
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
    props: ['users', 'groups', 'lang'],
    data: function(){
        return {
            user: null,
            search: '',
            pageNumber: 0,
            tableView:'',
            noteCount:'',
        }
    },

    template:
        '<div  style="position: relative;">'+
           '<user-form :users="users" :userAttr="user" :groups="groups" :lang="lang"/>'+

        '<div v-if="$root.showViewConfig">'+
        '<div class="modal-mask">'+
        '<div class="modal-wrapper">'+
        '<div v-if="lang==1" class="modal-container">'+
        '<div class="modal-title">'+
        '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
        'Параметры отображения'+
        '</div>'+
        '<hr>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="custom-control custom-checkbox">Вид</label>'+
        '<div style ="margin-left: 2px;" class="row">'+
        '<div class="custom-control custom-checkbox">' +
        '<b-form-checkbox type="checkbox" class="form-check-input" id="tableView"  v-on:change="tableView=!tableView" switch></b-form-checkbox>'+
        '</div>'+
        '<label v-if="tableView">Таблица</label>'+
        '<label v-else>Карточки</label>'+
        '</div>'+
        '</div>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="noteCount">Записей на страницу</label>'+
        '<select class="custom-select" id="noteCount" v-model="noteCount" required>'+
        '<option value="5">5</option>'+
        '<option selected value="10">10</option>'+
        '<option value="15">15</option>'+
        '<option value="20">20</option>'+
        '<option value="25">25</option>'+
        '<option value="30">30</option>'+
        '</select>'+
        '</div>'+
        '<br>'+
        '<div class="modal-footer">'+
        '<button class="btn btn-primary" @click="closeViewConfigWindow">Ок</button>'+
        '</div>'+
        '</div>'+
        '<div v-else class="modal-container">'+
        '<div class="modal-title">'+
        '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
        'Display options'+
        '</div>'+
        '<hr>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="custom-control custom-checkbox">View</label>'+
        '<div style ="margin-left: 2px;" class="row">'+
        '<div class="custom-control custom-checkbox">' +
        '<b-form-checkbox type="checkbox" class="form-check-input" id="tableView"  v-on:change="tableView=!tableView" switch></b-form-checkbox>'+
        '</div>'+
        '<label v-if="tableView">Table</label>'+
        '<label v-else>Cards</label>'+
        '</div>'+
        '</div>'+
        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="noteCount">Posts per page</label>'+
        '<select class="custom-select" id="noteCount" v-model="noteCount" required>'+
        '<option value="5">5</option>'+
        '<option selected value="10">10</option>'+
        '<option value="15">15</option>'+
        '<option value="20">20</option>'+
        '<option value="25">25</option>'+
        '<option value="30">30</option>'+
        '</select>'+
        '</div>'+
        '<br>'+
        '<div class="modal-footer">'+
        '<button class="btn btn-primary" @click="closeViewConfigWindow">Ок</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+

                '<div v-if="$root.showInputForm==false" class="card" style="margin-top: 15px; min-width: 90%;">'+
                    '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Пользователи системы</h5><h5 v-else >System users</h5></div>'+

                        '<div v-if="($root.showLoader)" class="card-body" style="margin-top: 100 px; margin-bottom: 100px;">'+
                            '<div  class="spinner-border text-primary" role="status" style="position: absolute; left: 50%;  top: 50%;  margin-right: -50%; ">'+
                                '<span class="sr-only" style="position: absolute; left: 50%;  top: 50%;  margin-right: -50%; ">Загрузка...</span>'+
                            '</div>'+
                        '</div>'+
                        '<div v-else class="card-body">'+
                            '<div v-if="lang==1" class="input-group mb-3">'+
                                '<input  v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                                '<div class="input-group-append">'+
                                    '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"  @click="clearSearch" type="button">Очистить</button>'+
                                '</div>'+
                            '</div>'+
                            '<div v-else class="input-group mb-3">'+
                                '<input v-model="search" id="search" class="form-control"  placeholder="Search">'+
                                '<div class="input-group-append">'+
                                    '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"   @click="clearSearch" type="button">Clear</button>'+
                                '</div>'+
                            '</div>'+
                            '<div v-if="tableView">'+
                                '<table v-if="($root.editClicked == false)"  class="table">'+
                                    '<thead>'+
                                        '<tr v-if="lang==1">'+
                                            '<th width="34%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byLastname" @click="byLastname">Имя</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byUserEmail" @click="byUserEmail">E-mail</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byRoles" @click="byRoles">Роль</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byRoles" @click="byRoles">Активен</a></th>'+
                                            '<th width="30%" scope="col" style="text-align: center;">Действие</th>'+
                                        '</tr>'+
                                        '<tr v-else>'+
                                            '<th width="34%" scope="col" style="text-align: center;"><a href="#"  v-bind:class="byLastname" @click="byLastname">Name</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byUserEmail" @click="byUserEmail">E-mail</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byRoles" @click="byRoles">Rles</a></th>'+
                                            '<th width="12%" scope="col" style="text-align: center;"><a href="#" v-bind:class="byRoles" @click="byRoles">User is active</a></th>'+
                                            '<th width="30%" scope="col" style="text-align: center;">Action</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                        '<user-row v-for="user in  paginatedData" :key="user.id" :user = "user" :editMethod="editMethod" :users="filteredUsers" :lang="lang"/>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>'+
                            '<div v-else>'+
                                '<hr>'+
                                '<div class="card-columns">'+
                                    '<user-card v-for="user in  paginatedData" :key="user.id" :user = "user" :editMethod="editMethod" :users="filteredUsers" :lang="lang"/>' +
                                '</div>'+
                                '<hr>'+
                            '</div>'+







        '</div>'+

            '</div>'+

        '<div v-if="(((pageCount!=1)&&($root.editClicked ==false)&&($root.showInputForm==false))&(lang==1))"  align="center" style="margin: 15px;">'+
        '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
        '</div>'+
        '<div v-if="(((pageCount!=1)&&($root.editClicked ==false)&&($root.showInputForm==false))&(lang==2))"  align="center" style="margin: 15px;">'+
        '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
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
                s = 20;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * 20,
                end = start + 20;
            return this.filteredUsers.slice(start, end);
        }
        },
    watch: {
        tableView(newTableView) {
            if(newTableView){
                localStorage.userTableView=1;
            } else{
                localStorage.userTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.userNoteCount != newNoteCount){
                localStorage.userNoteCount = newNoteCount;
            }
        },
        search(newSearch) {
            if(localStorage.userSearch != newSearch){
                localStorage.userSearch = newSearch;
            }
        },
    },
    mounted() {
        if (localStorage.userNoteCount) {
            this.noteCount = localStorage.userNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.userSearch) {
            this.search = localStorage.userSearch;
        } else {
            this.search='';
        }

        if (localStorage.userTableView) {
            if(localStorage.userTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

    },

    methods: {
        clearSearch: function (){
            this.search='';
        },
        closeViewConfigWindow: function(){
            this.$root.showViewConfig=false;
        },
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
            '<users-list :users="users" :groups="groups" :lang="lang"/> ' +
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
        sortKey: 'lastname',
        showLoader:true,
        lang:'',
        showViewConfig:false,

    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {
        axios.get('/usergroup').then(result => {
            this.groups=result.data
        });

        userApi.get({id: this.$root.id}).then(result =>
                    result.json().then(data =>{
                        this.users = data
                    }).then(this.$root.showLoader=false)
        );
    },
});