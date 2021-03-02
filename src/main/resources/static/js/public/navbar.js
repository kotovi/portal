
var app2;
var role = "ADMIN";
app2 = new Vue({
    el: '#app-nav',
    template:
        '<div>'+
        '<nav class="navbar  navbar-expand-lg navbar-dark bg-primary">'+
            '<a class="navbar-brand" href="/">Portal</a>'+
            '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">'+
                '<span class="navbar-toggler-icon"></span>'+
            '</button>'+
            '<div class="collapse navbar-collapse" id="navbarSupportedContent">'+
                '<ul class="navbar-nav mr-auto">'+


                    '<li v-if="(($root.isAdmin) || ($root.isUser))" class="nav-item dropdown active">' +

                        '<a v-if="lang==1" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Преподавателю</a>'+
                        '<a v-else class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Teacher</a>'+

                        '<div class="dropdown-menu" aria-labelledby="navbarDropdown">'+

                            '<a v-if="lang==1" class="dropdown-item" href="/courcemaker">Курсы</a>'+
                            '<a v-if="lang==2" class="dropdown-item" href="/courcemaker">Cources</a>'+

                            '<a v-if="lang==1" class="dropdown-item" href="/testmaker">Тестирования</a>'+
                            '<a v-if="lang==2" class="dropdown-item" href="/testmaker">Testing</a>'+

                            '<a v-if="lang==1" class="dropdown-item" href="/seminars">Организация семинаров</a>'+
                            '<a v-else class="dropdown-item" href="/seminars">Organization of seminars</a>'+

                            '<a v-if="lang==1" class="dropdown-item" href="/seminarList">Участие в семинаре</a>'+
                            '<a v-else class="dropdown-item" href="/seminarList">Participation in a seminars</a>'+
                        '</div>'+
                    '</li>'+

                    '<li v-if="($root.isAdmin)" class="nav-item dropdown active">' +
                        '<a v-if="lang==1" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Пользователи</a>'+
                        '<a v-else class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Users</a>'+

                        '<div class="dropdown-menu" aria-labelledby="navbarDropdown">'+
                            '<a v-if="lang==1" class="dropdown-item" href="/usermaker">Пользователи</a>'+
                            '<a v-else class="dropdown-item" href="/usermaker">Users</a>'+

                            '<a v-if="lang==1" class="dropdown-item" href="/group">Группы пользователей</a>'+
                            '<a v-else class="dropdown-item" href="/group">User groups</a>'+

                            '<a v-if="lang==1" class="dropdown-item" href="/studentlist">Слушатели</a>'+
                            '<a v-else class="dropdown-item" href="/studentlist">Listeners</a>'+
                        '</div>'+
                    '</li>'+

                    '<li v-if="($root.isAdmin || $root.isModerator || $root.isServerAdmin)" class="nav-item dropdown active">' +
                        '<a v-if="lang==1" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Администрирование</a>'+
                        '<a v-else class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Administration</a>'+

                        '<div class="dropdown-menu" aria-labelledby="navbarDropdown">'+
                            '<a v-if="(($root.isServerAdmin)&(lang==1))" class="dropdown-item" href="/srvconf">Параметры сервера</a>'+
                            '<a v-if="(($root.isServerAdmin)&(lang!=1))" class="dropdown-item" href="/srvconf">Server parameters</a>'+

                            '<a v-if="(($root.isServerAdmin)&(lang==1))" class="dropdown-item" href="/platformConfig">Параметры системы</a>'+
                            '<a v-if="(($root.isServerAdmin)&(lang!=1))" class="dropdown-item" href="/platformConfig">System parameters</a>'+

                            '<a v-if="(($root.isAdmin)&(lang==1))" class="dropdown-item" href="/activeMeetingsList">Активные комнаты</a>'+
                            '<a v-if="(($root.isAdmin)&(lang!=1))" class="dropdown-item" href="/activeMeetingsList">Active rooms</a>'+

                            '<a v-if="(($root.isAdmin)&(lang==1))" class="dropdown-item" href="/llist">Все лекции</a>'+
                            '<a v-if="(($root.isAdmin)&(lang!=1))" class="dropdown-item" href="/llist">Lectures list</a>'+
                        '</div>'+
                    '</li>'+

                    '<li class="nav-item active">' +
                        '<a v-if="(($root.isStudent)&(lang==1))" class="nav-link" href="/courceWatchList">Доступные курсы<span class="sr-only">(current)</span></a>'+
                        '<a v-if="(($root.isStudent)&(lang!=1))" class="nav-link" href="/courceWatchList">Available courses<span class="sr-only">(current)</span></a>'+
                    '</li>'+

                    '<li class="nav-item active">' +
                        '<a v-if="(($root.isStudent)&(lang==1))" class="nav-link" href="/seminarList">Семинары<span class="sr-only">(current)</span></a>'+
                        '<a v-if="(($root.isStudent)&(lang!=1))" class="nav-link" href="/seminarList">Seminars<span class="sr-only">(current)</span></a>'+
                    '</li>'+

                    '<li class="nav-item active">' +
                        '<a v-if="(lang==1)" class="nav-link" href="/help">Справка<span class="sr-only">(current)</span></a>'+
                        '<a v-if="(lang!=1)" class="nav-link" href="/help">Help<span class="sr-only">(current)</span></a>'+
                    '</li>'+

                    '<li class="nav-item active">' +
                        '<a v-if="((lang==1)&(nav.firstname!=null))" class="nav-link" href="/profile">Профиль: {{nav.firstname}} {{nav.lastname}}<span class="sr-only">(current)</span></a>'+
                        '<a v-if="((lang!=1)&(nav.firstname!=null))" class="nav-link" href="/profile">Profile: {{nav.firstname}} {{nav.lastname}}<span class="sr-only">(current)</span></a>'+
                    '</li>'+
                '</ul>'+

                '<div style="alignment: left;">'+
                    '<a v-if="((lang==1)&((!$root.isUser)&(!$root.isStudent)))" class="btn btn-outline-light" href="/login" style="margin-left: 4px; margin-right: 4px;" >Войти</a>'+
                    '<a v-if="((lang!=1)&((!$root.isUser)&(!$root.isStudent)))" class="btn btn-outline-light" href="/login" style="margin-left: 4px; margin-right: 4px;" >Login</a>'+

                    '<a v-if="((lang==1)&(($root.isUser)||($root.isStudent)))" class="btn btn-outline-light" href="/logout" style="margin-left: 0px; margin-right: 4px;" >Выйти</a>'+
                    '<a v-if="((lang!=1)&(($root.isUser)||($root.isStudent)))" class="btn btn-outline-light" href="/logout" style="margin-left: 0px; margin-right: 4px;" >Logout</a>'+
                '</div>'+

                '<div style="alignment: left; " class="dropdown">'+
                    '<button v-show="lang==1" class="btn btn-outline-light dropdown-toggle" type="button"  id="langDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">RU</button>'+
                    '<button v-show="lang==2" class="btn btn-outline-light dropdown-toggle" type="button"  id="langDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EN</button>'+
                    '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
                        '<a class="dropdown-item" v-on:click="lang=1">RU</a>'+
                        '<a class="dropdown-item" v-on:click="lang=2">EN</a>'+
                    '</div>'+
                '</div>'+

        '</div>'+
        '</nav>'+

        '<div v-show="$root.noRoles" style="margin: 20px;">'+
        '<div v-if="lang==1"  class="alert alert-danger" role="alert">'+
        '<p><b>Внимание!</b></p>' +
        '<p>Нет данных о уровне доступа! Попробуйте войти в систему повторно, если проблема не будет устранена - необходимо обратиться в отдел информационных технологий и информационной безопасности ИГМУ.</p>'+
        '</div>'+
        '<div v-else class="alert alert-danger" role="alert">'+
        '<p><b>Attention!</b></p>' +
        '<p>No data on access level! Try to enter the system again, if the problem persists - you need to contact the department of information technology and information security of ISMU.</p>'+
        '</div>'+

        '</div>'+
        '</div>',
    data: {
        nav:'',
        userId:'',
        userGroup:'',
        isAdmin:false,
        isUser:false,
        isModerator:false,
        isServerAdmin:false,
        isStudent:false,
        noRoles:false,
        lang:1,
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        }
    },

    watch: {
        lang(newLang) {
            if(localStorage.lang != newLang){
                localStorage.lang = newLang;
                location.reload();
            }

        }
    },
    created: function () {

        axios.get('/nav').then(result => {
            this.nav=result.data;
            window.userId = result.data.id,
                window.userGroup = result.data.userGroup
           // console.log("this.nav.length: "+this.nav.length);
            if(this.nav.length!=0){
                if(this.nav.roles.includes("USER")){
                    this.$root.isUser=true;
                }
                if(this.nav.roles.includes("ADMIN")){
                    this.$root.isAdmin=true;
                }
                if(this.nav.roles.includes("SERVERADMIN")){
                    this.$root.isServerAdmin=true;
                }
                if(this.nav.roles.includes("MODERATOR")){
                    this.$root.isModerator=true;
                }
                if(this.nav.roles.includes("STUDENT")) {
                    this.$root.isStudent = true;
                }
                if(this.nav.userRole==0) {
                    this.$root.noReles = true;
                }
            }

        });









    },
});