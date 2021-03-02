

Vue.component('greeting-row' , {

    template:
    <!-- Header -->
    '<div class="container">'+
        '<div style="position: relative; background: #fff;">'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top: 30px;">Справка по работе с ситемой</h1>'+
            '<div class="col" style="margin: 5px;">'+
                '<h4 class="card-subtitle mb-2 text-muted">1. Как войти в систему</h4>'+
                 '<div class="video-container">'+
                    '<iframe width="640" height="360"  src="https://www.youtube.com/embed/e22iBUA0LNA?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" showinfo="0" allowfullscreen></iframe>'+
                '</div>'+
            '</div>'+
            '<div class="col" style="margin: 5px;">'+
                '<h4 class="card-subtitle mb-2 text-muted">2. Как сформировать курс из записанных лекций</h4>'+
                '<div class="video-container">'+
                    '<iframe width="640" height="360" src="https://www.youtube.com/embed/X7coxq_fUvE?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'+
                '</div>'+
            '</div>'+
            '<div class="col" style="margin: 5px;">'+
                '<h4 class="card-subtitle mb-2 text-muted">3. Организация семинарного занятия</h4>'+
                '<div class="video-container">'+
                    '<iframe width="640" height="360" src="https://www.youtube.com/embed/s-Us38J3P8g?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'+
                '</div>'+
            '</div>'+
        <!-- Footer -->
        '</div>'+
    '</div>',

});
app2 = new Vue({
    el: '#app-greeting',
    template:
        '<div>'+
        '<greeting-row/>'+
        '</div>',
    data: {
        nav:'',
        userId:'',
        userGroup:'',
    },

    created: function () {


    },
});