function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
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
    var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmn_+-!pqrstuvwxyz123456789";

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

function is_empty(x)
{
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
        (x.replace(/\s/g,"") == "")
        ||
        (!/[^\s]/.test(x))
        ||
        (/^\s*$/.test(x))
    );
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);


}

function  checkEmailExist(req) {
    axios.get(req).then(responce => {
        if(responce.data.userExist==1) {
            return true;
        } else {
            return false;
        }

    });

}

function win2unicode(str) {
    var charmap   = unescape(
        "%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+
        "%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+
        "%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+
        "%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457")
    var code2char = function(code) {
        if(code >= 0xC0 && code <= 0xFF) return String.fromCharCode(code - 0xC0 + 0x0410)
        if(code >= 0x80 && code <= 0xBF) return charmap.charAt(code - 0x80)
        return String.fromCharCode(code)
    }
    var res = ""
    for(var i = 0; i < str.length; i++) res = res + code2char(str.charCodeAt(i))
    return res
}
/*
function win2unicode (str){
    if (str == null){ return null;}
    var result = "";
    var o_code = "";
    var i_code = "";
    for (var I=0; I < str.length; I++){
        i_code = str.charCodeAt(I);

        if (i_code == 184){
            o_code = 1105;
        } else if (i_code == 168){
            o_code = 1025;
        } else if (i_code > 191 && i_code < 256){
            o_code = i_code + 848;
        } else {
            o_code = i_code;
        }
        result = result + String.fromCharCode(o_code);
    }

    return result;
}
*/
var userApi = Vue.resource('/students{/id}');

Vue.directive('phone', {
    bind(el) {
        el.oninput = function(e) {
            if (!e.isTrusted) {
                return;
            }

            let x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            this.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            el.dispatchEvent(new Event('input'));
        }
    }
});

Vue.component('user-form', {
    props: ['userAttr', 'showModal', 'groups'],
    data: function() {
        if (this.$root.clearOptionsList.length==0){
            return {
                id:'',
                firstname: '',
                lastname: '',
                secname: '',
                userEmail: '',
                phoneNumber: '',
                personalDataAgree: '',
                password: '',
                passwordConfirm: '',
                userGroup: '',
                userAgreement: false,
                notificationAgree: false,
                personalDataAgree: false,
            }
        } else {
            return {
                id:'',
                firstname: this.$root.clearOptionsList[1],
                lastname: this.$root.clearOptionsList[0],
                secname: this.$root.clearOptionsList[2],
                userEmail: this.$root.clearOptionsList[3],
                phoneNumber: this.$root.clearOptionsList[4].slice(1,11),
                personalDataAgree: '',
                password: '',
                passwordConfirm: '',
                userGroup: this.$root.userGroupFromIsmu,
                userAgreement: false,
                notificationAgree: false,
                personalDataAgree: false,
            }
        }

    },


    watch:{
        userAttr: function(newVal){
            this.id = newVal.id;
            this.firstname = newVal.firstname;
            this.lastname = newVal.lastname;
            this.secname = newVal.secname;
            this.userEmail = newVal.userEmail;
            this.phoneNumber = newVal.phoneNumber;
            this.personalDataAgree = newVal.personalDataAgree;
            this.password = newVal.password;
            this.passwordConfirm = newVal.passwordConfirm;
            this.userGroup = newVal.userGroup;
        }
    },
    template:
      '<div>'+

        '<div v-if="$root.showModal">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div class="modal-container">'+
                        '<div class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Внимание!'+
                            '<hr>'+
                        '</div>'+
                            '<label v-if="$root.confirmRegistredDataAlarm==false" for="custom-control custom-checkbox">Выявленны следующие ошибки:<ul><li v-for="value in $root.alarmMessages">{{value}}</li></ul></label>'+
                            '<label  v-else for="custom-control custom-checkbox">Внимательно проверьте и подтвердите корректность указанных данных! Адрес и контактный телефон используются для оповещения и восстановления доступа к системе. В качестве логина необходимо использовать адрес электронной почты.' +
                            '<ul>' +
                                '<li>Фамилия: {{this.lastname}}</li>'+
                                '<li>Имя: {{this.firstname}}</li>'+
                                '<li>Отчество: {{this.secname }}</li>'+
                                '<li>E-mail: {{this.userEmail}}</li>'+
                                '<li>Телефон: {{this.phoneNumber}}</li>'+
                                '<li>Группа: {{this.$root.clearOptionsList[6]}}</li>'+
                                '</ul></label>'+

                        '<br>'+
                        '<div v-if="$root.confirmRegistredDataAlarm">'+
                            '<label for="custom-control custom-checkbox">Подтвердить:</label>'+
                            '<div class="custom-control custom-checkbox">'+
                                '<b-form-checkbox type="checkbox" class="form-check-input" id="$root.confirmAlarm"  v-model="$root.confirmAlarm" switch></b-form-checkbox>'+
                            '</div>'+
                            '<br>'+
                        '</div>'+
                        '<div v-if="$root.confirmRegistredDataAlarm" class="modal-footer">'+
                            '<button class="btn btn-primary" @click="confirmAlarmMessage">Ок</button>'+
                            '<button class="btn btn-danger" @click="closeAlarmWindow">Отмена</button>'+
                        '</div>'+
                        '<div v-if="$root.confirmRegistredDataAlarm==false" class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeAlarmWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+



        '<div style="background: #fff;">'+
                        '<h1 class="display-4 mt-5 mb-5" style="padding-top:40px;">Регистрация слушателя</h1>'+
                    '</div>'+
                    '<div class="card">'+
                        '<h5 class="text-white  card-header" style="background: #007bff;">Ввод данных для регистрации слушателя</h5>'+
                        '<div class="card-body">'+
                        '<form>'+
                            '<div class="form-row">'+
                                '<div class="form-group col-md-4">'+
                                    '<label for="lastname">Фамилия</label>'+
                                        '<div class="input-group">'+
                                            '<input type="text" class="form-control" id="lastname" v-model="lastname" placeholder="Фамилия" :maxlength="40">'+
                                                '<div v-show="lastname.length>0" class="input-group-prepend">' +
                                                    '<div class="input-group-text" v-text="40 - lastname.length">@</div>' +
                                                '</div>'+
                                         '</div>'+
                                     '<p class="alert alert-danger" v-show ="$root.userLastnameAlert">Укажите Фамилию!</p>'+
                                '</div>'+
                                '<div class="form-group col-md-4">'+
                                    '<label for="firstname">Имя</label>'+
                                    '<div class="input-group rounded">'+
                                        '<input type="text" class="form-control" id="firstname" v-model="firstname" placeholder="Имя" :maxlength="40">'+
                                        '<div v-show="firstname.length>0" class="input-group-prepend">' +
                                            '<div class="input-group-text" v-text="40 - firstname.length">@</div>' +
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userFirstnameAlert">Укажите Имя!</p>'+
                                '</div>'+

                                '<div class="form-group col-md-4">'+
                                    '<label for="secname">Отчество</label>'+
                                    '<div class="input-group">'+
                                        '<input type="text" class="form-control" id="secname" v-model="secname" placeholder="Отчество" :maxlength="40">'+
                                        '<div v-show="secname.length>0" class="input-group-prepend">' +
                                            '<div class="input-group-text" v-text="40 - secname.length">@</div>' +
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userSecnameAlert">Укажите Отчество!</p>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-row">'+
                                '<div class="form-group col-md-6">'+
                                    '<label for="userEmail">Email(используется для входа в систему)</label>'+
                                    '<div class="input-group">'+
                                        '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="Email" :maxlength="80" @input="dynamicEmail">'+
                                        '<div v-show="userEmail.length>0" class="input-group-prepend">' +
                                            '<div class="input-group-text" v-text="80 - userEmail.length">@</div>' +
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userEmailAlert">Укажите Email!</p>'+
                                    '<p class="alert alert-danger" v-show ="(($root.invalidEmail)&&($root.userEmailAlert==false))">Укажите валидный Email!</p>'+
                                    '<p class="alert alert-danger" v-show ="(($root.existEmail)&&($root.invalidEmail==false)&&($root.userEmailAlert==false))">Данный адрес электронной почты уже зарегистрирован в системе, регистрация более одной учетной записи на один адрес электронной почты не допустима!  </p>'+
                                '</div>'+
                                '<div class="form-group col-md-6">'+
                                    '<label for="phoneNumber">Контактный телефон в международном формате</label>'+

                                    '<div class="form-group">'+
                                        '<div class="input-group">'+
                                            '<div class="input-group-prepend">'+
                                                '<span class="input-group-text" id="basic-addon1">+7</span>'+
                                            '</div>'+
                                            '<input type="tel" class="form-control" id="phoneNumber" name="phone" v-model="phoneNumber" placeholder="(555) 555-5555" :maxlength="14" v-phone pattern="[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}" required>'+
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userPhoneNumberAlert">Необходимо указать контактный телефон в международном формате!</p>'+

                                '</div>'+
                            '</div>'+

                            '<div class="form-row">'+
                                '<div class="form-group col-md-4">'+
                                    '<label for="userEmail">Пароль(не менее 10 символов)</label>'+
                                    '<div class="input-group">'+
                                        '<input type="password" class="form-control" id="password" v-model="password" placeholder="Пароль" :maxlength="30" required>'+
                                            '<div v-show="userEmail.length>0" class="input-group-prepend">' +
                                                '<div class="input-group-text" v-text="30 - password.length">@</div>' +
                                            '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userPasswordAlert">Укажите Пароль!</p>'+
                                    '<p class="alert alert-danger" v-show ="$root.passwordMismatchAlert">Пароли не совпадают!</p>'+
                                    '<p class="alert alert-danger" v-show ="$root.passwordLenghAlert">Пароль не может быть короче 10 символов!</p>'+
                                '</div>'+
                                '<div class="form-group col-md-4">'+
                                    '<label for="passwordConfirm">Подтверждение пароля</label>'+
                                    '<div class="input-group">'+
                                        '<input type="password" class="form-control" id="passwordConfirm" v-model="passwordConfirm" placeholder="Подтверждение пароля" :maxlength="30" required>'+
                                            '<div v-show="passwordConfirm.length>0" class="input-group-prepend">' +
                                                '<div class="input-group-text" v-text="30 - passwordConfirm.length">@</div>' +
                                            '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show ="$root.userPasswordConfirmAlert">Укажите подтверждение пароля!</p>'+

                                '</div>'+
                                '<div class="form-group col-md-4">'+
                                    '<label for="userGroup">Группа</label>'+
                                    '<select class="custom-select" id="userGroup"  v-model="userGroup" disabled >'+
                                        '<option selected value="0" >Нет</option>'+
                                        '<option v-for="group in groups"  v-bind:value="group.id">{{group.groupName}}</option>'+
                                    '</select>'+
                                    '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Нужно выбрать группу пользоателей, к которой Вы относитесь!</p>'+
                                '</div>'+

                            '</div>'+


                            '<div class="form-row">'+
                                '<div  class="form-group col-md-4">'+
                                    '<label for="custom-control custom-checkbox">Cогласие на обработку ПД</label>'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="personalDataAgree"  v-model="personalDataAgree" switch></b-form-checkbox>'+
                                        '<p class="alert alert-danger" v-show ="$root.personalDataAgreeAlert">Небходимо дать согласие на обработку персональных данных!</p>'+
                                    '</div>'+
                                '</div>'+
                                '<div  class="form-group col-md-4">'+
                                    '<label for="custom-control custom-checkbox">Пользовательское соглашение</label>'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="userAgreement"  v-model="userAgreement" switch></b-form-checkbox>'+
                                        '<p class="alert alert-danger" v-show ="$root.userAgreementAlert">Небходимо принять условия пользовательского соглашения</p>'+
                                    '</div>'+
                                '</div>'+
                                '<div  class="form-group col-md-4">'+
                                    '<label for="custom-control custom-checkbox">Согласие на рассылку</label>'+
                                    '<div class="custom-control custom-checkbox">' +
                                        '<b-form-checkbox type="checkbox" class="form-check-input" id="notificationAgree"  v-model="notificationAgree" switch></b-form-checkbox>'+
                                        '<p class="alert alert-danger" v-show ="$root.notificationAgreeAlert">Небходимо Дать согласие на отправку уведомлений</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group row">'+
                                '<div class="col-sm-10">'+
                                    '<input v-if="($root.editClicked == false)" type="button"  class="btn btn-primary" style=" margin-top: 20px;" value="Зарегистрироваться" @click="save"/>'+
                                '</div>'+
                            '</div>'+
                        '</form>'+
                    '</div>'+
                '</div>'+
        '</div>'+

      '</div>',


    methods: {
        dynamicEmail(){
            console.log("dynamic email: "+ this.userEmail);
            if(validateEmail(this.userEmail.toLowerCase())){
                console.log(this.userEmail+" - корректный адрес элнктронной почты");
                this.$root.invalidEmail=false;

                axios.get("/checkUser/"+this.userEmail.toLowerCase()).then(responce => {

                    if(responce.data.userExist==1) {
                        console.log("Пользоватнель уже зарегистрирован");
                        this.$root.alarmMessages.push("Пользоватнель уже зарегистрирован!");
                        this.$root.existEmail = true;
                    } else  {
                        this.$root.existEmail = false;
                        console.log("Имя пользователя свободно");
                    }
                });

            } else {
                console.log(this.userEmail+"-не корректный адрес электронной почты");
                this.$root.alarmMessages.push("Не корректный адрес электронной почты!");
                this.$root.invalidEmail=true;
            }

        },

        closeAlarmWindow: function(){
            this.$root.showModal=false;
            this.$root.alarmMessages=[];
            this.$root.confirmRegistredDataAlarm = false;

        },
        confirmAlarmMessage:function(){
            console.log("Приступаем к сохранению");
            console.log("this.$root.confirmAlarm: "+this.$root.confirmAlarm);
            console.log("this.$root.alarmMessages.length: "+this.$root.alarmMessages.length);
            if((!this.$root.confirmAlarm)){
                alert("Перед сохранением необходимо подтвердить данные!");

            }else{
                if(this.$root.alarmMessages.length==0){
                    console.log("сохраняем пользователя");
                    userApi.save({}, this.$root.user).then(result => {
                        if (result.ok) {
                            this.id='';
                            this.firstname ='';
                            this.lastname = '';
                            this.secname = '';
                            this.userEmail = '';
                            this.userGroup = '';
                            this.phoneNumber = '';
                            this.password = '';
                            this.passwordConfirm = '';
                            this.userAgreement = false;
                            this.personalDataAgree = false;
                            this.notificationAgree = false;
                            window.location = '/login';
                        } else {

                            console.log("сохранение обделалось");
                        }

                    });

                    this.$root.showModal=false;
                    this.$root.alarmMessages=[];
                    this.$root.confirmRegistredDataAlarm=false;

                }

            }


        },

        save: function () {

            var user = {
                firstname: capitalizeFirstLetter(this.firstname),
                lastname: capitalizeFirstLetter(this.lastname),
                secname: capitalizeFirstLetter(this.secname),
                userEmail: this.userEmail.toLowerCase(),
                phoneNumber: this.phoneNumber,
                password: this.password,
                passwordConfirm: this.passwordConfirm,
                userAgreement: this.userAgreement,
                personalDataAgree: this.personalDataAgree,
                notificationAgree: this.notificationAgree,
                userGroup: this.userGroup,
                idInMirIsmu: this.$root.clearOptionsList[5],
                userStudyGroupInMirIsmu:this.$root.clearOptionsList[6],
            };

            if (!this.userAgreement){
                this.$root.userAgreementAlert=true;
                this.$root.alarmMessages.push("Не принято пользовательское соглашение!");
                console.log("Не принято пользовательское соглашение!");
            } else this.$root.userAgreementAlert=false;

            if (!this.personalDataAgree){
                this.$root.personalDataAgreeAlert=true;
                this.$root.alarmMessages.push("Не дано согласие на обработку персональных данных!");
                console.log("Не дано согласие на обработку персональных данных!");
            } else this.$root.personalDataAgreeAlert=false;

            if (!this.notificationAgree){
                this.$root.notificationAgreeAlert=true;
                this.$root.alarmMessages.push("Не дано согласие на оповещения!");
                console.log("Не дано согласие на оповещения!");
            } else this.$root.notificationAgreeAlert=false;


            if (is_empty(this.password)) {
                this.$root.userPasswordAlert = true;
                this.$root.alarmMessages.push("Не указан пароль!");
                console.log("Не указан пароль!");
            } else {

                this.$root.userPasswordAlert = false;

                if (this.password.length <10) {
                    this.$root.passwordLenghAlert = true;
                    this.$root.alarmMessages.push("Пароль не может быть менее 10 символов!");
                    console.log("Пароль не может быть менее 10 символов!");
                } else {
                    this.$root.passwordLenghAlert = false;

                    if (is_empty(this.passwordConfirm)) {
                        this.$root.userPasswordConfirmAlert = true;
                        this.$root.alarmMessages.push("Не указано подтверждение пароля!");
                        console.log("Не указано подтверждение пароля!");
                    } else {
                        this.$root.userPasswordConfirmAlert = false;

                        if (this.passwordConfirm!==this.password) {
                            this.$root.passwordMismatchAlert = true;
                            this.$root.alarmMessages.push("Пароль и подтверждение не совпадают!");
                            console.log("Пароль и подтверждение не совпадают!");
                        } else this.$root.passwordMismatchAlert = false;
                    }
                }

            }
                if(this.$root.existEmail){
                    this.$root.alarmMessages.push("Данный адрес электронной почты уже зарегистрирован в системе, повторная регистрация не возможна!");
                    console.log("Данный адрес электронной почты уже зарегистрирован в системе, повторная регистрация не возможна!");

                }

                if (!isNumeric(this.userGroup)) {
                    this.$root.userGroupNameAlert = true;
                    this.$root.alarmMessages.push("Не указана группа!");
                    console.log("Не указана группа!");
                } else this.$root.userGroupNameAlert = false;

                if (is_empty(this.firstname)) {
                    this.$root.userLastnameAlert = true;
                    this.$root.alarmMessages.push("Не указано имя!");
                    console.log("Не указано имя!");
                } else this.$root.userFirstnameAlert = false;

                if (is_empty(this.lastname)) {
                    this.$root.userLastnameAlert = true;
                    this.$root.alarmMessages.push("Не указана фамилия!");
                    console.log("Не указана фамилия!");
                } else this.$root.userLastnameAlert = false;

                if (is_empty(this.secname)) {
                    this.$root.userSecnameAlert = true;
                    this.$root.alarmMessages.push("Не указано отчество!");
                    console.log("Не указано отчество!");
                } else this.$root.userSecnameAlert = false;

                if (is_empty(this.phoneNumber)) {
                    this.$root.userPhoneNumberAlert = true;
                    this.$root.alarmMessages.push("Не указан контактный телефон!");
                    console.log("Не указан контактный телефон!");
                } else this.$root.userPhoneNumberAlert = false;

                if (is_empty(this.userEmail)) {
                    this.$root.userEmailAlert = true;
                    this.$root.alarmMessages.push("Не указад адрес электронной почты!");
                    console.log("Не указад адрес электронной почты!");
                } else {
                    this.$root.userEmailAlert = false;

                if (validateEmail(this.userEmail.toLowerCase())) {
                    this.$root.invalidEmail = false;
                } else {
                    this.$root.invalidEmail = true;
                    this.$root.alarmMessages.push("Указан не корректный адрес электронной почты!");
                    console.log("Указан не корректный адрес электронной почты!");
                }

                if((this.$root.userGroupFromIsmu>5094)&(this.$root.userIdInISMU>0)){
                    console.log("Удачный переход по ссылке регистрации");
                } else {
                    this.$root.alarmMessages.push("Не корректные параметры при регистрации! Обратитесь в отдел Информационных технологий и информационной безопасности ИГМУ!");
                    console.log("Не корректные параметры при регистрации! Обратитесь в отдел Информационных технологий и информационной безопасности ИГМУ!")
                }
            }

            console.log("Ошибок после проверки: " + this.$root.alarmMessages.length);
            if (this.$root.alarmMessages.length>0) {
                console.log("FAIL")
                this.$root.confirmRegistredDataAlarm = false;
                this.$root.showModal=true;

            } else {
                console.log("WIN")
                this.$root.confirmRegistredDataAlarm = true;
                this.$root.user = user;
                this.$root.showModal=true;
            }

        },
    }

});


var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<user-form :userAttr="user" :showModal="showModal" :groups="groups"/>' +
        '</div>',
    data: {
        user:[],
        groups:[],
        editClicked:false,

        userFirstnameAlert:false,
        userLastnameAlert:false,
        userSecnameAlert:false,
        userEmailAlert:false,
        userPhoneNumberAlert:false,
        personalDataAgreeAlert:false,
        invalidEmail:false,
        userExistAlert:false,
        userGroupNameAler:false,
        showModal: false,
        passwordLenghAlert: false,
        passwordMismatchAlert: false,
        userPasswordAlert: false,
        userPasswordConfirmAlert: false,
        existEmail: false,
        userAgreementAlert: false,
        personalDataAgreeAlert: false,
        notificationAgreeAlert: false,
        userGroupNameAler:false,

        secretTokenFromIsmu: tokenFromIsmu,
        clearOptionsList:[],
        userGroupFromIsmu:0,
        userIdInISMU:0,

        alarmBoby:'',
        alarmMessages:[],
        confirmRegistredDataAlarm:false,
        confirmAlarm:false,

        incorerrectEmail:false,


    },
    created: function () {
        axios.get('/studentgroup').then(result => {
            this.groups = result.data
        });
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

     //  if(base64regex.test(this.secretTokenFromIsmu)) {
            console.log(this.secretTokenFromIsmu);
        console.log("decoded: "+ Base64Decode(this.secretTokenFromIsmu));

            //console.log("decoded: "+atob(this.secretTokenFromIsmu) );
           // var utf8TokenFromIsmu =  win2unicode( atob(this.secretTokenFromIsmu));
            var optionsList = Base64Decode(this.secretTokenFromIsmu).split('&');
       // var optionsList = atob(this.secretTokenFromIsmu).split('&');
            optionsList.forEach(item => {
                console.log(item);
                this.clearOptionsList.push(item.substring(item.indexOf('=')+1));
            });
            console.log("ClearList:");
            this.clearOptionsList.forEach(item =>{console.log(item);})
            var localUserGroup = this.clearOptionsList[6];
            console.log("localUserGroup: "+ this.clearOptionsList[6]);

            this.userIdInISMU=this.clearOptionsList[5];
            console.log("userIdInISMU: "+ this.clearOptionsList[5]);

            axios.get("/checkUser/"+this.clearOptionsList[3].toLowerCase()).then(responce => {

                if(responce.data.userExist==1) {
                    console.log("USER EXIST");
                    this.existEmail = true;
                } else  {
                    this.existEmail = false;
                    console.log("USER NOT EXIST");
                }
            });

           if((localUserGroup.slice(0,1)==2)&(localUserGroup.includes("ИСД"))) {
               this.userGroupFromIsmu = 5339;

           } else if((localUserGroup.slice(0,1)==1)&(localUserGroup.includes("ЛЛД"))){
                this.userGroupFromIsmu= 5095;
            } else if((localUserGroup.slice(0,1)==2)&(localUserGroup.includes("ЛЛД"))) {
                this.userGroupFromIsmu = 5096;
            }else if((localUserGroup.slice(0,1)==3)&(localUserGroup.includes("ЛЛД"))) {
                this.userGroupFromIsmu =5097;
            }else if((localUserGroup.slice(0,1)==4)&(localUserGroup.includes("ЛЛД"))) {
                this.userGroupFromIsmu =5098;
            }else if((localUserGroup.slice(0,1)==5)&(localUserGroup.includes("ЛЛД"))) {
                this.userGroupFromIsmu =5099;
            }else if((localUserGroup.slice(0,1)==6)&(localUserGroup.includes("ЛЛД"))) {
                this.userGroupFromIsmu =5100;
            } else if((localUserGroup.slice(0,1)==7)&(localUserGroup.includes("ЛЛВ"))) {
                this.userGroupFromIsmu =5338;
            }

            else if((localUserGroup.slice(0,1)==1)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5101;
            }else if((localUserGroup.slice(0,1)==2)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5102;
            }else if((localUserGroup.slice(0,1)==3)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5103;
            }else if((localUserGroup.slice(0,1)==4)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5104;
            }else if((localUserGroup.slice(0,1)==5)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5105;
            }else if((localUserGroup.slice(0,1)==6)&(localUserGroup.includes("ППД"))) {
                this.userGroupFromIsmu =5106;
            }

            else if((localUserGroup.slice(0,1)==1)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5113;
            }else if((localUserGroup.slice(0,1)==2)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5114;
            }else if((localUserGroup.slice(0,1)==3)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5115;
            }else if((localUserGroup.slice(0,1)==4)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5116;
            }else if((localUserGroup.slice(0,1)==5)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5117;
            }else if((localUserGroup.slice(0,1)==6)&(localUserGroup.includes("ММД"))) {
                this.userGroupFromIsmu =5118;
            }
            else if((localUserGroup.slice(0,1)==1)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5107;
            }else if((localUserGroup.slice(0,1)==2)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5108;
            }else if((localUserGroup.slice(0,1)==3)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5109;
            }else if((localUserGroup.slice(0,1)==4)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5110;
            }else if((localUserGroup.slice(0,1)==5)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5111;
            }else if((localUserGroup.slice(0,1)==6)&(localUserGroup.includes("ССД"))) {
                this.userGroupFromIsmu =5112;
            }
            else if((localUserGroup.slice(0,1)==1)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5124;
            }else if((localUserGroup.slice(0,1)==2)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5125;
            }else if((localUserGroup.slice(0,1)==3)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5126;
            }else if((localUserGroup.slice(0,1)==4)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5127;
            }else if((localUserGroup.slice(0,1)==5)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5128;
            }else if((localUserGroup.slice(0,1)==6)&((localUserGroup.includes("ФХД"))||(localUserGroup.includes("ФХД")))) {
                this.userGroupFromIsmu =5129;
            }
           else if((localUserGroup.slice(0,1)==1)&((localUserGroup.includes("ФФД"))||(localUserGroup.includes("ФФД")))) {
               this.userGroupFromIsmu =5119;
           }else if((localUserGroup.slice(0,1)==2)&((localUserGroup.includes("ФФД"))||(localUserGroup.includes("ФФД")))) {
               this.userGroupFromIsmu =5120;
           }else if((localUserGroup.slice(0,1)==3)&((localUserGroup.includes("ФФД"))||(localUserGroup.includes("ФФД")))) {
               this.userGroupFromIsmu =5121;
           }else if((localUserGroup.slice(0,1)==4)&((localUserGroup.includes("ФФД"))||(localUserGroup.includes("ФФД")))) {
               this.userGroupFromIsmu =5122;
           }else if((localUserGroup.slice(0,1)==5)&((localUserGroup.includes("ФФД"))||(localUserGroup.includes("ФФД")))) {
               this.userGroupFromIsmu =5123;
           }

           else if(localUserGroup.includes("17-1")) {
               this.userGroupFromIsmu =5350;
           }else if(localUserGroup.includes("17-2")) {
               this.userGroupFromIsmu =5351;
           }else if(localUserGroup.includes("17-3")) {
               this.userGroupFromIsmu =5352;
           }else if(localUserGroup.includes("17-4")) {
               this.userGroupFromIsmu =5353;
           }
           else if(localUserGroup.includes("18-1")) {
               this.userGroupFromIsmu =5354;
           } else if(localUserGroup.includes("18-2")) {
               this.userGroupFromIsmu =5355;
           } else if(localUserGroup.includes("18-3")) {
               this.userGroupFromIsmu =5356;
           } else if(localUserGroup.includes("18-4")) {
               this.userGroupFromIsmu =5357;
           }
           else if(localUserGroup.includes("19-1")) {
               this.userGroupFromIsmu =5358;
           }else if(localUserGroup.includes("19-2")) {
               this.userGroupFromIsmu =5359;
           }else if(localUserGroup.includes("19-3")) {
               this.userGroupFromIsmu =5360;
           }else if(localUserGroup.includes("19-4")) {
               this.userGroupFromIsmu =5361;
           }else if(localUserGroup.includes("19-5")) {
               this.userGroupFromIsmu =5362;
           }else if(localUserGroup.includes("19-6")) {
               this.userGroupFromIsmu =5363;
           }
           else if(localUserGroup.includes("19-7")) {
               this.userGroupFromIsmu =5364;
           }
           else if(localUserGroup.includes("18-5")) {
               this.userGroupFromIsmu =5365;
           }
           else if(localUserGroup.includes("17-5")) {
               this.userGroupFromIsmu =5366;
           }

        //}
    },
});

Vue.component('modal', {
    template: '#modal-template'
})

