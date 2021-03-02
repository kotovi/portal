function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
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


var profileApi = Vue.resource('/profileApi/{id}');

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




Vue.component('profile-form', {
    props: ['profile', 'profileAttr'],
    data: function(){
        return {
            userEmail:'',
            phoneNumber:'',
            personalDataAgree:'',
            password:'',
            passwordConfirm:'',
            userAgreement:'',
            notificationAgree:'',
            userEmailAlert:false,
            userPhoneNumberAlert:false,
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


            alarmBoby:'',
            alarmMessages:[],
            confirmRegistredDataAlarm:false,
            confirmAlarm:false,
            incorerrectEmail:false,

            generatedPassword:false,
            changePassword:false,
        }
    },
    watch:{
        profileAttr: function(newVal, oldVal){
                if(!is_empty(newVal.userEmail)){
                    this.userEmail = newVal.userEmail;
                }
                this.phoneNumber = newVal.phoneNumber;
                this.personalDataAgree = newVal.personalDataAgree;
                this.userAgreement = newVal.userAgreement;
                this.notificationAgree = newVal.notificationAgree;

        }
    },

    template:
    '<div>'+
        '<div style="background: #fff;">'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top:40px;">Мой профиль</h1>'+
        '</div>'+
        '<div class="card">'+
            '<h5 class="text-white  card-header" style="background: #007bff;">{{profile.lastname}} {{profile.firstname}} {{profile.secname}}</h5>'+
            '<div class="card-body">'+
                '<form>'+
                    '<div class="form-group">'+
                        '<label for="userEmail">Email (используется для входа в систему)</label>'+
                        '<div class="input-group">'+
                            '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="name@example.com" :maxlength="80" @input="dynamicEmail">'+
                            '<div v-show="userEmail.length>0" class="input-group-append">' +
                                '<div class="input-group-text" v-text="80 - userEmail.length">@</div>' +
                            '</div>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="userEmailAlert">Укажите Email!</p>'+
                        '<p class="alert alert-danger" v-show ="((invalidEmail)&&(userEmailAlert==false))">Укажите валидный Email!</p>'+
                        '<p class="alert alert-danger" v-show ="((existEmail)&&(invalidEmail==false)&&(userEmailAlert==false))">Данный адрес электронной почты уже зарегистрирован в системе, регистрация более одной учетной записи на один адрес электронной почты не допустима!  </p>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="phoneNumber">Контактный телефон в международном формате</label>'+
                        '<div class="input-group">'+
                            '<div class="input-group-prepend">'+
                                '<span class="input-group-text" id="basic-addon1">+7</span>'+
                            '</div>'+
                            '<input ttype="tel" class="form-control" id="phoneNumber" name="phone" v-model="phoneNumber" placeholder="(555) 555-5555" :maxlength="14" v-phone pattern="[(][0-9]{3}[)] [0-9]{3}-[0-9]{4}" required>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="userPhoneNumberAlert">Необходимо указать контактный телефон в международном формате!</p>'+
                    '</div>'+


                    '<div class="form-row">'+
                        '<div  class="form-group">'+
                            '<label for="custom-control custom-checkbox">Изменить пароль</label>'+
                            '<div class="custom-control custom-checkbox">' +
                                '<b-form-checkbox type="checkbox" class="form-check-input" id="changePassword"  v-on:change="changePassword=!changePassword" switch></b-form-checkbox>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+

                    '<div v-show="(changePassword)">'+
                        '<div class="form-row">'+
                            '<div  class="form-group">'+
                                '<label for="custom-control custom-checkbox">Сгенерировать пароль</label>'+
                                '<div class="custom-control custom-checkbox">' +
                                    '<b-form-checkbox type="checkbox" class="form-check-input" id="generatePassword"  v-on:change="generatePassword" switch></b-form-checkbox>'+
                                    '<label v-show="(generatedPassword==true)" for="password">{{password}}</label>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+

                        '<div v-show="(generatedPassword==false)">'+
                            '<div class="form-group">'+
                                '<label for="password">Пароль</label>'+
                                '<div class="input-group">'+
                                    '<input type="password" class="form-control" id="password" v-model="password" placeholder="Пароль">'+
                                    '<div v-show="password.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="30 - password.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show ="$root.userPasswordAlert">Укажите пароль!</p>'+
                            '</div>'+
                            '<div  class="form-group">'+
                                '<label for="passwordConfirm">Подтверждение пароля</label>'+
                                '<div class="input-group">'+
                                    '<input type="password" class="form-control" id="passwordConfirm" v-model="passwordConfirm" placeholder="Подтверждение пароля">'+
                                    '<div v-show="passwordConfirm.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="30 - passwordConfirm.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show ="$root.userPasswordConfirmAlert">Укажите подьтверждение пароля!</p>'+
                                '<p class="alert alert-danger" v-show ="$root.userPasswordMismatchAlert">Пароль и подьтверждение пароля не совпадают!</p>'+
                                '<p class="alert alert-danger" v-show ="$root.userPasswordLenghAlert">Пароль должен быть не меньше 10 символов!</p>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+


                    '<div class="form-group">'+
                        '<label for="personalDataAgree">Cогласие на обработку персональных данных</label>'+
                        '<div class="custom-control custom-checkbox">' +
                            '<b-form-checkbox type="checkbox" class="form-check-input" id="personalDataAgree"  v-model="personalDataAgree" switch></b-form-checkbox>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show = "personalDataAgreeAlert">Небходимо дать согласие на обработку персональных данных!</p>'+
                    '</div>'+

                    '<div class="form-group">'+
                        '<label for="userAgreement">Пользовательское соглашение</label>'+
                        '<div class="custom-control custom-checkbox">' +
                            '<b-form-checkbox type="checkbox" class="form-check-input" id="userAgreement"  v-model="userAgreement" switch></b-form-checkbox>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="userAgreementAlert">Небходимо принять условия пользовательского соглашения</p>'+
                    '</div>'+

                    '<div class="form-group">'+
                        '<label for="notificationAgree">Согласие на получение оповещений</label>'+
                        '<div class="custom-control custom-checkbox">' +
                            '<b-form-checkbox type="checkbox" class="form-check-input" id="notificationAgree"  v-model="notificationAgree" switch></b-form-checkbox>'+
                        '</div>'+
                        '<p class="alert alert-danger" v-show ="notificationAgreeAlert">Небходимо Дать согласие на отправку уведомлений</p>'+
                    '</div>'+

                    '<div class="form-group row">'+
                        '<div class="col-sm-10">'+
                            '<input type="button"  class="btn btn-primary" style=" margin-top: 20px;" value="Сохранить" @click="save"/>'+
                        '</div>'+
                    '</div>'+

                '</form>'+
            '</div>'+
        '</div>'+

        '</div>',


methods: {
    dynamicEmail() {
        console.log("dynamic email: " + this.userEmail);
        if (validateEmail(this.userEmail.toLowerCase())) {
            console.log(this.userEmail + " - корректный адрес элнктронной почты");
            this.invalidEmail = false;

            axios.get("/checkUser/" + this.userEmail.toLowerCase()).then(responce => {

                if (responce.data.userExist == 1) {
                    console.log("Пользоватнель уже зарегистрирован");
                    this.alarmMessages.push("Пользоватнель уже зарегистрирован!");
                    this.existEmail = true;
                } else {
                    this.existEmail = false;
                    console.log("Имя пользователя свободно");
                }
            });

        } else {
            console.log(this.userEmail + "-не корректный адрес электронной почты");
            this.alarmMessages.push("Не корректный адрес электронной почты!");
            this.invalidEmail = true;
        }

    },
    generatePassword: function(){
        this.generatedPassword=!this.generatedPassword;
        if(this.generatedPassword){
            this.password = makePassword(10);
            console.log("this.password: "+ this.password);
        }

    },

    save: function () {

        const profileForSave = {
            id: this.profile.id,
            phoneNumber: this.phoneNumber,
            password: this.password,
            userEmail:this.userEmail,
            passwordConfirm: this.passwordConfirm,
            userAgreement: this.userAgreement,
            personalDataAgree: this.personalDataAgree,
            notificationAgree: this.notificationAgree,
        };

        if (!this.userAgreement) {
            this.userAgreementAlert = true;
            this.alarmMessages.push("Не принято пользовательское соглашение!");
            console.log("Не принято пользовательское соглашение!");
        } else this.userAgreementAlert = false;

        if (!this.personalDataAgree) {
            this.personalDataAgreeAlert = true;
            this.alarmMessages.push("Не дано согласие на обработку персональных данных!");
            console.log("Не дано согласие на обработку персональных данных!");
        } else this.personalDataAgreeAlert = false;

        if (!this.notificationAgree) {
            this.notificationAgreeAlert = true;
            console.log("Не дано согласие на оповещения!");
        } else this.notificationAgreeAlert = false;

        if(this.changePassword){
            if(!this.generatePassword){
                if (is_empty(this.password)) {
                    this.userPasswordAlert = true;
                    this.alarmMessages.push("Не указан пароль!");
                    console.log("Не указан пароль!");
                } else {

                    this.userPasswordAlert = false;

                    if (this.password.length < 10) {
                        this.passwordLenghAlert = true;
                        this.alarmMessages.push("Пароль не может быть менее 10 символов!");
                        console.log("Пароль не может быть менее 10 символов!");
                    } else {
                        this.passwordLenghAlert = false;

                        if (is_empty(this.passwordConfirm)) {
                            this.userPasswordConfirmAlert = true;
                            this.alarmMessages.push("Не указано подтверждение пароля!");
                            console.log("Не указано подтверждение пароля!");
                        } else {
                            this.userPasswordConfirmAlert = false;
                            if (this.passwordConfirm !== this.password) {
                                this.passwordMismatchAlert = true;
                                this.alarmMessages.push("Пароль и подтверждение не совпадают!");
                                console.log("Пароль и подтверждение не совпадают!");
                            } else this.passwordMismatchAlert = false;
                        }
                    }

                }
            }


        }



        if (is_empty(this.phoneNumber)) {
            this.userPhoneNumberAlert = true;
            this.alarmMessages.push("Не указан контактный телефон!");
            console.log("Не указан контактный телефон!");
        } else this.userPhoneNumberAlert = false;

        if (is_empty(this.userEmail)) {
            this.userEmailAlert = true;
            this.alarmMessages.push("Не указад адрес электронной почты!");
            console.log("Не указад адрес электронной почты!");
        } else {
            this.userEmailAlert = false;

            if (validateEmail(this.userEmail.toLowerCase())) {
                this.invalidEmail = false;
            } else {
                this.invalidEmail = true;
                this.alarmMessages.push("Указан не корректный адрес электронной почты!");
                console.log("Указан не корректный адрес электронной почты!");
            }

        }

        console.log("Ошибок после проверки: " + this.alarmMessages.length);

        // if (this.$root.alarmMessages.length > 0) {
        //      console.log("FAIL")
        //      alert("Необходимо исправит отмеченные поля!")
//
        //  } else {
        console.log("WIN")
        console.log("this.profileForSave: " + profileForSave);

        profileApi.update({id: profileForSave.id}, profileForSave).then(result => {
            if (result.ok) {
                alert("Данные успешно сохранены");
            }
        });

       // profileApi.save({},profileForSave).then(result => {
        //    if (result.ok) {
        //        alert("Данные успешно сохранены");
         //   }
       // });

    },
},


});
var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
            '<profile-form :profile="profile" :profileAttr="profile" />'+
        '</div>',


    data: {
        profile:'',
    },
    created: function () {
        axios.get('/profileApi').then(result => {
            this.profile = result.data;
        });

    }
});


