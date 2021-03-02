var app_footer;
app_footer = new Vue({
    el: '#app_footer',
    template:
        '<div id="footer">'+
        '<footer class="py-5  pt-md-5 border-top bg-dark ">'+
            '<div v-if="lang==1">'+
                '<div class="container">'+
                    '<div class="row">'+
                        '<div class="col-6">'+
                            '<h5 class="text-light">Portal</h5>'+
                            '<hr class="color: white; border: 1">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li>' +
                                    '<p class="text-light  lead">Портал удаленного обучения ИГМУ</p>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="col-3">'+
                            '<h5 class="text-light">Ресурсы</h5>'+
                            '<hr class="color: white;">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li><a class="text-light" href="/">Главная</a></li>'+
                                '<li><a class="text-light" href="/politic">Политика обработки персональных данных</a></li>'+
                                '<li><a class="text-light" href="/useragreement">Пользовательское соглашение</a></li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="col-3">'+
                            '<h5 class="text-light">Контакты</h5>'+
                            '<hr class="color: white;">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li><a class="text-light" href="https://mir.ismu.baikal.ru">Иркутский государственный медицинский университет</a></li>'+
                                '<li><a class="text-light" href="https://goo.gl/maps/uKw74bXdpqnqG2Tg6"> Адрес: г.Иркутск, ул. Красного Восстания, 1</a></li>'+
                                '<li><a class="text-light" href="mailto:it@ismu.baikal.ru">E-mail: it@ismu.baikal.ru</a></li>'+
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                    '<div class="footer-copyright py-3 text-center bg-dark">'+
                        '<small class="d-block text-center text-muted"><a class="text-muted" href="mailto:kotov.irk@gmail.com">Разработка - Иван Котов</a> &copy; 2019-2021гг.</small>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div v-else>'+
                '<div class="container">'+
                    '<div class="row">'+
                        '<div class="col-6">'+
                            '<h5 class="text-light">Portal</h5>'+
                            '<hr class="color: white; border:1">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li><p class="text-light  lead">ISMU Remote Learning Portal</p></li>'+
                            '</ul>'+
                        '</div>'+
                        '<div class="col-3">'+
                            '<h5 class="text-light">Resources</h5>'+
                            '<hr class="color: white;">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li><a class="text-light" href="/">Home</a></li>'+
                                '<li><a class="text-light" href="/politic">Personal data processing policy</a></li>'+
                                '<li><a class="text-light" href="/useragreement">Terms of use</a></li>'+
                        '</ul>'+
                        '</div>'+
                        '<div class="col-3">'+
                            '<h5 class="text-light">Contacts</h5>'+
                            '<hr class="color: white;">'+
                            '<ul class="list-unstyled text-small">'+
                                '<li><a class="text-light" href="https://mir.ismu.baikal.ru">Irkutsk State Medical University</a></li>'+
                                '<li><a class="text-light" href="https://goo.gl/maps/uKw74bXdpqnqG2Tg6">Address: Irkutsk, st. Red Uprising, 1</a></li>'+
                                '<li><a class="text-light" href="mailto:it@ismu.baikal.ru">E-mail: it@ismu.baikal.ru</a></li>' +
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                    '<div class="footer-copyright py-3 text-center bg-dark">'+
                        '<small class="d-block text-center text-muted"><a class="text-muted" href="mailto:kotov.irk@gmail.com">Development - Ivan Kotov</a> &copy; 2019-2021гг.</small>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</footer>'+
        '</div>',

    data: {
        lang:'',
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }}
});