
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
function msToTime(duration) {
    var
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds ;
}

var app;
var lectionsListForStudentApi = Vue.resource('/lectionsListForStudent{/id}');
var lectionViewsApi = Vue.resource('/lectionviews{/id}');

window.onbeforeunload = function (evt) {
    if ((window.lectionId!=null)&(window.watchTime!=null)){
        var message = "Завершите просмотр лекции! В противном случае данные о просмотре могут не сохраниться.";
        var time = new Date() - window.watchTime;
        var seance = {
            lectionId: window.lectionId,
            watchTime: time,};
        lectionViewsApi.save({}, seance);
        evt.returnValue = message;
        return message;
    }
}

Vue.component('cfs-row' , {
    props: [ 'lection', 'lections', 'lang'],
    template:

        '<div v-if="lection.testType==1" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5 v-if="lang==1">Вступительное тестирование для курса: "{{lection.courceName}}"</h5><h5 v-else-if="((lang!=1)&(lection.enCourceName!=null))">Introductory testing for the course: "{{lection.enCourceName}}"</h5><h5 v-else-if="((lang!=1)&(lection.enCourceName==null))">Introductory testing for the course: "{{lection.courceName}}"</h5></li>'+
                    '<li v-if="((lection.testSuccess==true)&(lang==1))" class="list-group-item"><p  class="card-text">Вступительное тестирование пройдено</p><p v-if="((lection.testSuccess==true)&(lang!=1))" class="card-text">Entrance testing passed</p></li>'+
                    '<li v-if="((!lection.testSuccess)&(lang==1))" class="list-group-item"><p  class="card-text">Для доступа к лекциям необходимо пройти вступительное тестирование</p><p v-if="((!lection.testSuccess)&(lang!=1))" class="card-text">To access the lectures, you must pass an introductory test</p></li>'+
                '</ul>'+
            '</div>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Результат тестирования" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Пройти тестирование" @click="enteranceTest" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Test result" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Get tested" @click="enteranceTest" />'+
            '</div>'+
        '</div>'+

        '<div v-else-if="((lection.testType==2)&(lang==1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5>{{lection.lectionName}}</h5></li>'+
                    '<li v-if="lection.accessBegin==false" class="list-group-item"><p  class="card-text">Доступ закрыт</p></li>'+
                    '<li v-else-if="lection.testSuccess==true" class="list-group-item"><p  class="card-text">Тестирование пройдено</p></li>'+
                    '<li v-else-if="lection.testSuccess==false" class="list-group-item"><p  class="card-text">Для доступа к следующей лекции необходимо пройти тестирование!</p></li>'+
                '</ul>'+
            '</div>'+
            '<div v-if="lection.accessBegin==true" class="card-footer">'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Просмотр" @click="watch" />'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Результат тестирования" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Пройти тестирование" @click="enteranceTest" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<p>Доступ будет открыт {{lection.accessBeginDate}}</p>'+
            '</div>'+
        '</div>'+
        '<div v-else-if="((lection.testType==2)&(lang!=1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5 v-if="lection.enLectionName==null">{{lection.lectionName}}</h5><h5 v-else>{{lection.enLectionName}}</h5></li>'+
                    '<li v-if="lection.accessBegin==false" class="list-group-item"><p  class="card-text">Access is closed</p></li>'+
                    '<li v-else-if="lection.testSuccess==true" class="list-group-item"><p  class="card-text">Testing passed</p></li>'+
                    '<li v-else-if="lection.testSuccess==false" class="list-group-item"><p  class="card-text">You must be tested to access the next lesson!</p></li>'+
                '</ul>'+
            '</div>'+
            '<div v-if="lection.accessBegin==true" class="card-footer">'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Viewing a lecture" @click="watch" />'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Test result" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Get tested" @click="enteranceTest" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<p>Access will be open {{lection.accessBeginDate}}</p>'+
            '</div>'+
        '</div>'+


        '<div v-else-if="((lection.testType==3)&(lang==1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
            '<ul class="list-group list-group-flush">'+
                '<li class="list-group-item"><h5>Финальное тестирование для курса "{{lection.courceName}}"</h5></li>'+
                '<li v-if="lection.testSuccess==true" class="list-group-item"><p  class="card-text">Финальное тестирование пройдено</p></li>'+
                '<li v-else class="list-group-item"><p  class="card-text">Необходимо пройти финальное тестирование!</p></li>'+
            '</ul>'+
            '</div>'+
            '<div class="card-footer">'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Посмотреть результат" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Пройти тестирование" @click="enteranceTest" />'+
            '</div>'+
        '</div>'+

        '<div v-else-if="((lection.testType==3)&(lang!=1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5>Final testing for the course: "{{lection.courceName}}"</h5></li>'+
                    '<li v-if="lection.testSuccess==true" class="list-group-item"><p  class="card-text">Final testing passed</p></li>'+
                    '<li v-else class="list-group-item"><p  class="card-text">Final testing required!</p></li>'+
                '</ul>'+
            '</div>'+
            '<div class="card-footer">'+
                '<input v-if="lection.testSuccess==true" style="margin: 5px;" type = "button"  class="btn btn-success" value="Test result" @click="enteranceTest" />'+
                '<input v-else style="margin: 5px;" type = "button"  class="btn btn-danger" value="Get tested" @click="enteranceTest" />'+
            '</div>'+
        '</div>'+

        '<div v-else-if="((lection.testType==0)&(lang==1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5>{{lection.lectionName}}</h5></li>'+
                    '<li v-if="lection.accessBegin==true" class="list-group-item"><p  class="card-text">Доступ открыт</p></li>'+
                '</ul>'+
            '</div>'+
            '<div v-if="lection.accessBegin==true" class="card-footer">'+
                '<input  v-if="this.lection.lectionUrl!=null" style="margin: 5px;" type = "button"  class="btn btn-primary" value="Просмотр" @click="watch" />'+
                '<div v-for="r in lection.fileList">'+
                    '<a target="_blank" v-bind:href="`/downloadFile/${r.randomFileName}`"> {{ r.fileName }} </a>'+
                '</div>'+
            '</div>'+
            '<div v-if="lection.accessBegin==false" class="card-footer">'+
                '<p class="card-text">Доступ откроется {{lection.accessBeginDate}}</p>'+
            '</div>'+
        '</div>'+
        '<div v-else-if="((lection.testType==0)&(lang!=1))" class="card">'+
            '<h5 class="card-header text-white bg-primary" >#{{lections.indexOf(lection) + 1}}</h5>'+
            '<div class="card-body">'+
                '<ul class="list-group list-group-flush">'+
                    '<li class="list-group-item"><h5>{{lection.lectionName}}</h5></li>'+
                    '<li v-if="lection.accessBegin==true" class="list-group-item"><p class="card-text">Access is open</p></li>'+
                '</ul>'+
            '</div>'+
            '<div v-if="lection.accessBegin==true" class="card-footer">'+
                '<input  v-if="this.lection.lectionUrl!=null" style="margin: 5px;" type = "button"  class="btn btn-primary" value="Viewing a lecture" @click="watch" />'+
                '<div v-for="r in lection.fileList">'+
                    '<a target="_blank" v-bind:href="`/downloadFile/${r.randomFileName}`"> {{ r.fileName }} </a>'+
                '</div>'+
            '</div>'+
            '<div v-if="lection.accessBegin==false" class="card-footer">'+
                '<p class="card-text">Access will open {{lection.accessBeginDate}}</p>'+
            '</div>'+
        '</div>'
    ,
    methods: {
        watch: function() {
            this.$root.watchUrl=atob(this.lection.lectionUrl);
            this.$root.showFrame=true;
            this.$root.courceName=this.lection.courceName;
            this.$root.lectionName =this.lection.lectionName;
            this.$root.lectionId = this.lection.id;

            this.$root.watchTime = new Date();
            window.watchTime = new Date();
            window.lectionId = this.lection.id;

        },
        enteranceTest: function() {
            window.location.href = this.lection.testUrl;

        }
    }

});

Vue.component('cfs-list', {
    props: ['lections', 'lang'],
    data: function(){
        return {
            lection: null,
            search: '',
        }
    },
    mounted(){
        if (localStorage.lectionWatchListSearch) {
            this.search = localStorage.lectionWatchListSearch;
        } else {
            this.search='';
        }
    },
    watch: {
        search(newSearch){
            if (localStorage.lectionWatchListSearch != newSearch) {
                localStorage.lectionWatchListSearch = newSearch;
            }
        }
    },


    template:
        '<div style="position: relative;">'+
            '<h1 v-show="((!this.$root.showFrame)&(lang==1))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Лекции курса: "{{$root.courceName}}"</h1>'+
            '<h1 v-show="((!this.$root.showFrame)&(lang!=1))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Course lectures: "{{$root.courceName}}"</h1>'+
            '<h1 v-show="this.$root.showFrame" class="display-4 mt-5 mb-5" style="padding-top:20px;">{{this.$root.lectionName}}({{this.$root.courceName}})</h1>'+
            '<input v-if="((!this.$root.showFrame)&(lang==1))" style="margin: 5px;"  type = "button" class="btn btn-primary" value="К списку курсов" @click="backToCourceList" />'+
            '<input v-if="((!this.$root.showFrame)&(lang!=1))" style="margin: 5px;"  type = "button" class="btn btn-primary" value="To the list of courses" @click="backToCourceList" />'+
            '<div v-if="this.$root.showFrame">'+
                '<div class="modal-mask">'+
                    '<div class="modal-video-wrapper">'+
                        '<div class="modal-video-container">'+
                            '<div class="modal-title">'+
                                '<button class="close" @click="closeFrame">&times;</button>'+
                            '</div>'+
                            '<div class="embed-responsive embed-responsive-21by9">'+
                                '<iframe class="embed-responsive-item" :src="this.$root.watchUrl" allowfullscreen></iframe>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div v-show="!this.$root.showFrame"   class="card" style="margin-top: 16px; margin-bottom: 16px; position: relative;">'+
                '<div v-if="lang==1" class="card-header bg-primary text-white"><h5>Доступные лекции</h5></div>'+
                '<div v-else class="card-header bg-primary text-white"><h5>Available lectures</h5></div>'+
                    '<div class="card-body">'+
                        '<div v-if="lang==1" class="input-group mb-3">'+
                            '<input  v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                            '<div class="input-group-append">'+
                                '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"  @click="clearSearch" type="button">Очистить</button>'+
                            '</div>'+
                        '</div>'+
                        '<div v-else class="input-group mb-3">'+
                            '<input v-model="search" id="search" class="form-control"  placeholder="Search">'+
                            '<div class="input-group-append">'+
                                '<button v-show="search.length>0"  class="btn btn-danger"  style="margin: 0px;"  @click="clearSearch" type="button">Clear</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="card-columns">'+
                    '<cfs-row v-for="lection in fSortedLectionsList" :key="lection.id" :lection = "lection" :lang="lang" :lections = "lections"/>' +
                '</div>'+
            '</div>',
    computed: {

        fSortedLectionsList() {
            const s = this.search.toLowerCase();
            return this.lections.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
        },
    },

    methods: {
        clearSearch: function (){
            this.search='';
        },

        backToCourceList: function(){
            window.location.href = '/courceWatchList';

        },
        closeFrame() {
            this.$root.showFrame = false;
            var time = new Date() - this.$root.watchTime;
            //alert("Ваш просмотр длился: " + msToTime(time) );

            var seance = {
                lectionId: this.$root.lectionId,
                watchTime: time,
            };
            lectionViewsApi.save({}, seance);
            window.watchTime = null;
            window.lectionId = null;
        },
    }
});

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; ">'+
            '<cfs-list :lections="lections" :lang="lang" /> ' +
        '</div>',
    data: {
        lections: [],
        lectionViews:[],
        courсeId: courceId,
        //sortKey:"id",
        watchUrl:'',
        showFrame:false,
        lectionName:'',
        courceName:'',
        watchTime:'',
        lang:''

    },
    mounted(){
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }

    },

    created: function () {
        console.log("courceId: "+ this.$root.courсeId);

        lectionsListForStudentApi.get({id: this.$root.courсeId}).then(result =>
            result.json().then(data =>
                            data.forEach(lection => {
                                this.lections.push(lection);
                                if(this.courceName==''){
                                    this.courceName = lection.courceName;
                                }
                                console.log("this.$root.courсeId="+this.$root.courсeId );
                                console.log("LectionsSize: " + this.lections.length);
                            })

            ));

    }
});