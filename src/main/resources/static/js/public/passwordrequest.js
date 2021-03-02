function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
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


Vue.component('user-form', {
    props: ['userAttr'],
    data: function() {
        return {
            userEmail: '',
        }
    },


    watch: {
        userAttr: function (newVal) {

            this.userEmail = newVal.userEmail;
        }

        },

        template:
            '<div>' +

            '<modal v-if="showModal" @close="$root.showModal = false">' +
            '<h3 slot="header">{{this.$root.modalHeader}}</h3>' +
            '<div slot="modalGreeting">{{this.$root.modalGreeting}}</div>' +
            '<div slot="body">{{this.$root.modalBody}}</div>' +
            '</modal>' +

            '<h1 class="display-4 mt-5 mb-5" style="padding-top:40px;">Восстановления пароля</h1>' +

            '<div class="card col-md-8">' +

            '<div class="card-body">' +
            '<form>' +

            '<div class="form-row">' +
                '<div class="form-group col-md-8">' +
                '<label for="userEmail">Email</label>' +
                    '<div class="input-group">' +
                        '<input type="email" class="form-control" id="userEmail" v-model="userEmail" placeholder="Email" :maxlength="30">' +
                        '<div v-show="userEmail.length>0" class="input-group-prepend">' +
                            '<div class="input-group-text" v-text="30 - userEmail.length">@</div>' +
                        '</div>' +
                    '</div>' +
                    '<p class="alert alert-danger" v-show ="$root.userEmailAlert">Укажите Email!</p>' +
                    '<p class="alert alert-danger" v-show ="(($root.invalidEmail)&&($root.userEmailAlert==false))">Укажите валидный Email!</p>' +
                '</div>' +
            '</div>' +

            '<div class="form-row">' +
                '<div  class="form-group col-md-6">' +
                    '<label for="custom-control custom-checkbox">Подтверждаю сброс пароля</label>' +
                        '<div class="custom-control custom-checkbox">' +
                            '<b-form-checkbox type="checkbox" class="form-check-input" id="personalDataAgree"  v-model="personalDataAgree" switch></b-form-checkbox>' +
                            '<p class="alert alert-danger" v-show ="$root.personalDataAgreeAlert">Небходимо дать согласие на сброс пароля!</p>' +
                        '</div>' +
                '</div>' +
            '</div>' +

            '<div class="form-group row">' +
                '<div class="col-sm-10">' +
                    '<input type="button"  class="btn btn-primary" style="margin-top: 20px; alignment: center" value="Запросить сброс пароля" @click="save"/>' +
                '</div>' +
            '</div>' +

            '</form>' +
            '</div>' +

            '</div>' +
            '</div>' +

            '</div>',

        methods: {
            save: function () {
                var user = {
                    userEmail: this.userEmail.toLowerCase(),
                };

                if (is_empty(this.userEmail)) {
                    this.$root.userEmailAlert = true;
                } else this.$root.userEmailAlert = false;

                if (!this.personalDataAgree) {
                    this.$root.personalDataAgreeAlert = true;
                } else this.$root.personalDataAgreeAlert = false;

                if (validateEmail(this.userEmail.toLowerCase())) {
                    this.$root.invalidEmail = false
                } else {
                    this.$root.invalidEmail = true;
                }

                if ((!this.$root.userEmailAlert) &&
                    (!this.$root.personalDataAgreeAlert) &&
                    (!this.$root.invalidEmail)
                ) {
                   // alert( "Работает!" + this.userEmail);

                    //userApi.save({}, user);
                    window.location.href = "/reqpassword/"+this.userEmail;
                    this.userEmail = ''
                    this.personalDataAgree = ''

                }
            },
        }
});



var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
        '<user-form :userAttr="user" />' +
        '</div>',
    data: {
        user:[],
        personalDataAgreeAlert:false,
        userEmailAlert:false,
        invalidEmail: false,
    },


});

Vue.component('modal', {
    template: '#modal-template'
})

