
app2 = new Vue({
    el: '#app-greeting',
    template:
        '<div>'+
            '<div style="background: #ffffff;">'+
                '<header class="py-5 mb-5" style="background: #346181;">'+
                    '<div class="container h-100">'+
                        '<div class="row h-100 align-items-center">'+
                            '<div class="col-lg-12">'+
                                '<h3 v-if="lang==1" class="display-4 text-white mt-5 mb-2">Платформа цифровизации ИГМУ</h3>'+
                                '<h3 v-else class="display-4 text-white mt-5 mb-2">ISMU digitalization platform</h3>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</header>'+
                '<div class="container h-100 " >'+
                    '<div v-if ="lang==1" class="col-md-12 mb-5">'+
                        '<p>Добро пожаловать на платформу для цифровизации процесса обучения Иркутского государственного медицинского университета. '+
                        'Платформа позволяет формировать курсы из видео лекций, предназначенных для самостоятельной подготовки обучающихся.</p>'+
                        '<p>Платформа использует JavaScript, в связи с этим для корректной работы рекомендуется использовать актуальную версию браузеров '+
                        'Google Chrome, Mozilla Firefox.</p>'+
                        '<p>В текущий момент платформа находится в стадии активной разработки, работа ведется в тестовом режиме. В случае возникновения ошибок' +
                        ' в работе платформы, или неудачной регистрации - необходимо обратиться к <a class="text-muted" href="mailto:kotov.irk@gmail.com">разработчику</a>.</p>'+
                        '<div class="alert alert-danger" role="alert">'+
                            '<p><b>Внимание!</b></p>' +
                            '<p>Вход слушателей курсов лекций осуществляется с помощью учетной записи <a href="https://mir.ismu.baikal.ru/">' +
                            'сайта университета</a>, при этом происходит обновление данных о пользователе!</p>'+
                            '<p>Если у Вас отображаются курсы за предыдущий год обучения, войдите в систему с учетными данными сайта университета по следующей <a href="/oauth_login">' +
                            'ссылке.</a></p>'+
                        '</div>'+
                    '</div>'+
                    '<div v-else class="col-md-12 mb-5" >'+
                        '<p>Welcome to the platform for digitalization of the educational process at Irkutsk State Medical University. '+
                        'The platform allows you to form courses from video lectures intended for self-preparation of students.</p>'+
                        '<p>The platform uses JavaScript, therefore, it is recommended to use the current version of browsers (Google Chrome, Mozilla Firefox) for correct operation.</p>'+
                        '<p>At the moment, the platform is under active development, the work is in test mode. In case of errors in the operation of the platform, or unsuccessful registration, you must contact the <a class="text-muted" href="mailto:kotov.irk@gmail.com">developer</a>.</p>'+
                        '<div class="alert alert-danger" role="alert">'+
                            '<p><b>Attention!</b></p>' +
                            '<p>The entrance of the students of the lecture courses is carried out using the <a href="https://mir.ismu.baikal.ru/">' +
                            'account of the university website</a>, while the data about the user is updated!!</p>'+
                            '<p>If you see courses for the previous year of study, log in with the credentials of the university website at the following <a href="/oauth_login">' +
                            'link.</a></p>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
    data: {
        nav:'',
        userId:'',
        userGroup:'',
        lang:'',

    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }
    },

    created: function () {

    },

});