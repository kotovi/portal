
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

var app;
Vue.component('cfs-row' , {
    props: [ 'cource', 'lang'],
    template:

            '<div v-if="lang==1" class="card">'+
                '<h5 class="card-header text-white bg-primary" >{{cource.cource.courceName}}</h5>'+
                    '<div class="card-body">'+
                        '<ul class="list-group list-group-flush">'+
                            '<li class="list-group-item"><b>Автор курса: </b>{{cource.cource.user.firstname}} {{cource.cource.user.secname}} {{cource.cource.user.lastname}}</li>'+
                            '<li class="list-group-item"><b>Аннотация курса: </b>{{cource.cource.courceDescription}}</li>'+
                            '<li class="list-group-item"><b>Доступен: </b><b>c</b> {{cource.accessBeginDate}} <b>по</b> {{cource.accessEndDate}}</li>'+
                       '</ul>'+
                    '</div>'+
                    '<div class="card-footer">'+
                        '<a><input style="margin: 5px;" type = "button"  class="btn btn-success" value="Лекции" @click="watch" /></a>'+
                    '</div>'+
            '</div>'+
            '<div v-else class="card">'+
                '<h5 v-if="cource.cource.enCourceName!=null" class="card-header text-white bg-primary" >{{cource.cource.enCourceName}}</h5>'+
                '<h5 v-else class="card-header text-white bg-primary" >{{cource.cource.courceName}}</h5>'+
                '<div class="card-body">'+
                    '<ul class="list-group list-group-flush">'+
                        '<li class="list-group-item"><b>Course author: </b>{{cource.cource.user.firstname}} {{cource.cource.user.secname}} {{cource.cource.user.lastname}}</li>'+
                        '<li v-if="cource.cource.enCourceDescription!=null" class="list-group-item"><b>Course abstract: </b>{{cource.cource.enCourceDescription}}</li>'+
                        '<li v-else class="list-group-item"><b>Course abstract: </b>{{cource.cource.courceDescription}}</li>'+
                        '<li class="list-group-item"><b>Available: </b><b>from</b> {{cource.accessBeginDate}} <b>to</b> {{cource.accessEndDate}}</li>'+
                    '</ul>'+
                '</div>'+
                '<div class="card-footer">'+
                    '<a><input style="margin: 5px;" type = "button"  class="btn btn-success" value="Lections" @click="watch" /></a>'+
                '</div>'+
            '</div>'

    ,


    methods: {
        watch: function() {
            window.location.href = '/lectionWatchList?courceId='+this.cource.cource.id;
        }

    }

});

Vue.component('cfs-list', {
    props: ['watchList', 'lang'],
    data: function(){
        return {
            cource:'',
            search: '',
        }
    },
    mounted(){
        if (localStorage.courceWatchListSearch) {
            this.search = localStorage.courceWatchListSearch;
        } else {
            this.search='';
        }
    },
    watch: {
        search(newSearch){
            if (localStorage.courceWatchListSearch != newSearch) {
                localStorage.courceWatchListSearch = newSearch;
            }
        }
    },


    template:
        '<div style="position: relative;">'+

            '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Доступные курсы</h1>'+
            '<h1 v-if="lang!=1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Available courses</h1>'+

            '<div v-if="((this.watchList.length==0)&(lang==1))" style=" margin-bottom: 16px; position: relative;" class="alert alert-warning" role="alert">Список назначенных курсов пуст!</div>'+
            '<div v-if="((this.watchList.length==0)&(lang!=1))" style=" margin-bottom: 16px; position: relative;" class="alert alert-warning" role="alert">The list of assigned courses is empty!</div>'+
            '<div v-if="this.watchList.length!=0" >'+
                '<div class="card" style=" margin-bottom: 16px; position: relative;">'+
                    '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Доступные курсы</h5><h5 v-else>Available courses</h5></div>'+
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
                    '<cfs-row v-for="cource in fSortedWatchList" :key="cource.id" :cource = "cource" :lang="lang" :editMethod="editMethod"/>' +
                '</div>' +
            '</div>' +
        '</div>'

    ,
    computed: {
        fSortedWatchList() {
            const s = this.search.toLowerCase();

            return this.watchList.filter(o=>_.some(o, v =>_.some(v, c =>_.toLower(c).indexOf(s)>-1)));
        },
    },

    methods: {
        clearSearch: function(){
          this.search='';
        },
        editMethod: function(courceForStudents){
            this.courceForStudents = courceForStudents;
        },




    }
});

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; ">'+
            '<cfs-list :watchList="watchList" :lang="lang"/> ' +
        '</div>',
    data: {
        watchList: [],
        lectionViews:[],
        sortKey:"id",
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
        axios.get('/courceListForStudent').then(result => {
            this.watchList=result.data
        });
    },
});