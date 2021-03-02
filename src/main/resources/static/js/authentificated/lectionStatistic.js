var stompClient = null
const handlers = []

function connect() {
    const socket = new SockJS('/gs-guide-websocket')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/activity', lection => {
            handlers.forEach(handler => handler(JSON.parse(lection.body)))
        })
    })
}

function msToTime(duration) {
    var
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + " часов " + minutes + " минут " + seconds +" секунд " ;
}

function addHandler(handler) {
    handlers.push(handler)
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect()
    }
    console.log("Disconnected")
}

function sendLection(lection) {
    stompClient.send("/app/changeLection", {}, JSON.stringify(lection))
}


function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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
        if (property=="lastname"){
            var result = (a.user[property] < b.user[property]) ? -1 : (a.user[property] > b.user[property]) ? 1 : 0;
        } else {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        }

        return result * sortOrder;
    }
}





Vue.component('lectionView',{
    props: ['lectionView', 'lectionViews'],

    template:
        '<tr>'+
            '<td align="left" width="5%">{{lectionViews.indexOf(lectionView) + 1}}</td>'+
            '<td align="left" width="35%">{{lectionView.user.lastname}} {{lectionView.user.firstname}} {{lectionView.user.secname}}</td>'+
            '<td align="left" width="20%">{{lectionView.addTime}}</td>'+
            '<td align="left" width="20%">{{lectionView.user.userStudyGroupInMirIsmu}}</td>'+
            '<td align="left" width="20%">{{lectionView.watchTime}}</td>'+
        '</tr>'
    ,
});

Vue.component('lectionViewCard',{
    props: ['lectionView', 'lectionViews', 'lang'],

    template:
         '<div class="card">'+
           '<div class="card-header text-white bg-primary"># {{lectionViews.indexOf(lectionView) + 1}}</div>'+
           '<ul v-if="lang==1" class="list-group list-group-flush">'+
              '<li class="list-group-item"><b>Слушатель: </b>{{lectionView.user.lastname}} {{lectionView.user.firstname}} {{lectionView.user.secname}}</li>'+
               '<li class="list-group-item"><b>Учебная группа: </b> {{lectionView.user.userStudyGroupInMirIsmu}}</li>'+
              '<li class="list-group-item"><b>Дата просмотра: </b>{{lectionView.addTime}}</li>'+
              '<li class="list-group-item "><b>Длительность просмотра(приблизительно): </b>{{lectionView.watchTime}}</li>'+
           '</ul>'+
           '<ul v-else class="list-group list-group-flush">'+
              '<li class="list-group-item"><b>Listener: </b>{{lectionView.user.lastname}} {{lectionView.user.firstname}} {{lectionView.user.secname}}</li>'+
        '<li class="list-group-item"><b>Study group: </b> {{lectionView.user.userStudyGroupInMirIsmu}}</li>'+
              '<li class="list-group-item"><b>Date viewed: </b>{{lectionView.addTime}}</li>'+
              '<li class="list-group-item"><b>View duration (approximate): </b>{{lectionView.watchTime}}</li>'+
           '</ul>'+
         '</div>',
});

Vue.component('lectionUserTest',{
    props: ['lectionUserTest', 'lectionUserTests'],
    template:
        '<tr>'+
        '<td align="left" width="5%">{{lectionUserTests.indexOf(lectionUserTest) + 1}}</td>'+
        '<td align="left" width="30%">{{lectionUserTest.user.lastname}} {{lectionUserTest.user.firstname}} {{lectionUserTest.user.secname}}</td>'+
        '<td align="left" width="20%">{{lectionUserTest.beginDate}}</td>'+
        '<td align="left" width="20%">{{lectionUserTest.endDate}}</td>'+
        '<td align="left" width="20%">{{lectionUserTest.user.userStudyGroupInMirIsmu}}</td>'+
        '<td v-if="lectionUserTest.userFinalBallConfirm" align="left" width="5%"><div class="alert alert-success" role="alert"><a :href="\'/testAttemptAnalysis?attemptId=\'+lectionUserTest.id">{{lectionUserTest.finalBall}}</a></div></td>'+
        '<td v-if="!lectionUserTest.userFinalBallConfirm" align="left" width="5%"><div class="alert alert-danger" role="alert"><a :href="\'/testAttemptAnalysis?attemptId=\'+lectionUserTest.id">{{lectionUserTest.finalBall}}</a></div></td>'+
        '</tr>'
    ,

});

Vue.component('lectionUserTestCard',{
    props: ['lectionUserTest', 'lectionUserTests', 'lang'],

    template:
         '<div class="card">'+
           '<div class="card-header text-white bg-primary"># {{lectionUserTests.indexOf(lectionUserTest) + 1}}</div>'+
           '<ul v-if="lang==1" class="list-group list-group-flush">'+
              '<li class="list-group-item"><b>Слушатель: </b>{{lectionUserTest.user.lastname}} {{lectionUserTest.user.firstname}} {{lectionUserTest.user.secname}}</li>'+
        '<li class="list-group-item"><b>Учебная группа: </b> {{lectionUserTest.user.userStudyGroupInMirIsmu}}</li>'+
              '<li class="list-group-item"><b>Дата начала тестирования: </b>{{lectionUserTest.beginDate}}</li>'+
              '<li class="list-group-item"><b>Дата окончания тестирования: </b>{{lectionUserTest.endDate}}</li>'+
              '<li v-if="lectionUserTest.userFinalBallConfirm" class="list-group-item"><b>Подтвержденный пользователем балл: </b>{{lectionUserTest.finalBall}}</li>'+
              '<li v-if="!lectionUserTest.userFinalBallConfirm"class="list-group-item"><b>Не подтвержденный пользователем балл: </b>{{lectionUserTest.finalBall}}</li>'+
           '</ul>'+
           '<ul v-else class="list-group list-group-flush">'+
              '<li class="list-group-item"><b>Listener: </b>{{lectionUserTest.user.lastname}} {{lectionUserTest.user.firstname}} {{lectionUserTest.user.secname}}</li>'+
        '<li class="list-group-item"><b>Study group: </b> {{lectionUserTest.user.userStudyGroupInMirIsmu}}</li>'+
        '<li class="list-group-item"><b>Test start date: </b>{{lectionUserTest.beginDate}}</li>'+
              '<li class="list-group-item"><b>End date of testing: </b>{{lectionUserTest.endDate}}</li>'+
              '<li v-if="lectionUserTest.userFinalBallConfirm" class="list-group-item"><b>User Confirmed Score: </b><a :href="\'/testAttemptAnalysis?attemptId=\'+lectionUserTest.id">{{lectionUserTest.finalBall}}</a></li>'+
              '<li v-if="!lectionUserTest.userFinalBallConfirm"class="list-group-item"><b>Unconfirmed score: </b><a :href="\'/testAttemptAnalysis?attemptId=\'+lectionUserTest.id">{{lectionUserTest.finalBall}}</a></li>'+
           '</ul>'+
         '</div>',
});


Vue.component('lectionUserTestsList', {
    props: ['lectionUserTests', 'lang', 'tableView', 'noteCount'],

    data: function(){
        return {
            test: null,
            pageNumber: 0,
            search: '',
        }
    },
    mounted(){
              if (localStorage.statisticTestSearch) {
                this.search = localStorage.statisticTestSearch;
              } else {
                this.search='';
              }
       },
    watch:{
          search(newSearch){
           if (localStorage.statisticTestSearch != newSearch) {
               localStorage.statisticTestSearch = newSearch;
           }
           }
       },


    template:

        '<div style="position: relative; ">'+
            '<div  class="card" style="margin-top: 15px; min-width: 900px;">'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Статистика выполнения тестирования по результатам просмотра лекции</h5><h5 v-else>Testing statistics based on the results of viewing a lecture</h5></div>'+
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

                    '<table v-if="tableView"  class="table">'+
                        '<thead >'+
                            '<tr v-if="lang==1">'+
                                '<th width="5%"  scope="col" style="text-align: left">#</th>'+
                                '<th width="30%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byListener" @click="byListener">Слушатель</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byBeginDate" @click="byBeginDate">Дата начала</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byEndDate" @click="byEndDate">Дата завершения</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byStudyGroup" @click="byStudyGroup">Учебная группа</a></th>'+
                                '<th width="5%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byFinalBall" @click="byFinalBall">Итог</a></th>'+
                            '</tr>'+
                            '<tr v-else>'+
                                '<th width="5%"  scope="col" style="text-align: left">#</th>'+
                                '<th width="30%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byListener" @click="byListener">Listener</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byBeginDate" @click="byBeginDate">Begin date</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byEndDate" @click="byEndDate">Final date</a></th>'+
                                '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byStudyGroup" @click="byStudyGroup">Study group</a></th>'+
                                '<th width="5%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byFinalBall" @click="byFinalBall">Final score</a></th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<lectionUserTest v-for="lectionUserTest in paginatedData" :key="lectionUserTest.id" :lectionUserTest = "lectionUserTest" :lectionUserTests = "lectionUserTests" :lang="lang"/>' +
                        '</tbody>' +
                    '</table>' +
                     '<div v-if="!tableView" class="card-columns">'+
                        '<lectionUserTestCard v-for="lectionUserTest in paginatedData" :key="lectionUserTest.id" :lectionUserTest = "lectionUserTest" :lectionUserTests = "lectionUserTests" :lang="lang"/>' +
                     '</div>'+
                '</div>'+
            '</div>'+
            '<div v-if="((pageCount > 1)&(lang==1))"  align="center" style="margin: 15px;">'+
                '<button  class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
            '<div v-if="((pageCount > 1)&(lang!=1))"  align="center" style="margin: 15px;">'+
                '<button  class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
        '</div>',

    methods:{
        clearSearch(){
            this.search='';
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        },
        byListener: function () {

            if(this.$root.testSortKey==="lastname"){
                this.$root.testSortKey = "-lastname";
            } else if(this.$root.testSortKey==="-lastname"){
                this.$root.testSortKey = "lastname";
            } else {
                this.$root.testSortKey = "lastname";
            }

        },
        byBeginDate: function () {
            if(this.$root.testSortKey==="beginDate"){
                this.$root.testSortKey = "-beginDate";
            } else if(this.$root.testSortKey==="-beginDate"){
                this.$root.testSortKey = "beginDate";
            } else {
                this.$root.testSortKey = "beginDate";
            }

        },
        byEndDate: function () {
            if(this.$root.testSortKey==="endDate"){
                this.$root.testSortKey = "-endDate";
            } else if(this.$root.testSortKey==="-endDate"){
                this.$root.testSortKey = "endDate";
            } else {
                this.$root.testSortKey = "endDate";
            }
        },
        byFinalBall: function () {
            if(this.$root.testSortKey==="finalBall"){
                this.$root.testSortKey = "-finalBall";
            } else if(this.$root.testSortKey==="-finalBall"){
                this.$root.testSortKey = "finalBall";
            } else {
                this.$root.testSortKey = "finalBall";
            }

        },
        byStudyGroup: function () {

            if(this.$root.lectionSortKey==="userStudyGroupInMirIsmu"){
                this.$root.lectionSortKey = "-userStudyGroupInMirIsmu";
            } else if(this.$root.lectionSortKey==="-userStudyGroupInMirIsmu"){
                this.$root.lectionSortKey = "userStudyGroupInMirIsmu";
            } else {
                this.$root.lectionSortKey = "userStudyGroupInMirIsmu";
            }
        },

    },

    computed: {
        sortedTests() {
            const k = this.$root.testSortKey;
            return this.lectionUserTests.sort(dynamicSort(k));
        },
        filteredTests() {
            const s = this.search.toLowerCase();


            return this.sortedTests.filter(sortedTest =>
                _.some(sortedTest, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));


        },
        pageCount(){
            let l = this.filteredTests.length,
                s = this.noteCount;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * this.noteCount,
                end = start + this.noteCount;

            return this.filteredTests.slice(start, end);

        }
    },

}),

Vue.component('lectionViewsList', {
    props: ['lectionViews', 'lang','tableView', 'noteCount'],
    data: function(){
        return {
            lectionView: null,
            pageNumber: 0,
            search: '',
        }
    },
    mounted(){
           if (localStorage.statisticViewsSearch) {
             this.search = localStorage.statisticViewsSearch;
           } else {
             this.search='';
           }
    },
    watch: {
        search(newSearch){
            if (localStorage.statisticViewsSearch != newSearch) {
                localStorage.statisticViewsSearch = newSearch;
            }
        }
    },

    template:

        '<div style="position: relative; ">'+
                '<div  class="card" style="margin-top: 15px; min-width: 900px;">'+
                    '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Статистика просмотров лекции</h5><h5 v-else>Lecture views statistics</h5></div>'+
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

                            '<table  v-if="tableView" class="table">'+
                                '<thead>'+
                                    '<tr v-if="lang==1">'+
                                        '<th width="5%"  scope="col" style="text-align: left">#</th>'+
                                        '<th width="35%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byListener" @click="byListener">Слушатель</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byDate" @click="byDate">Дата просмотра</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byStudyGroup" @click="byStudyGroup">Учебная группа</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byDuration" @click="byDuration">Продолжительность просмотра</a></th>'+
                                    '</tr>'+
                                    '<tr v-else>'+
                                        '<th width="5%"  scope="col" style="text-align: left">#</th>'+
                                        '<th width="35%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byListener" @click="byListener">Listener</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byDate" @click="byDate">Date viewed</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byStudyGroup" @click="byStudyGroup">Study group</a></th>'+
                                        '<th width="20%"  scope="col" style="text-align: left"><a href="#"  v-bind:class="byDuration" @click="byDuration">Duration of viewing</a></th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody>'+
                                    '<lectionView v-for="lectionView in paginatedData" :key="lectionView.id" :lectionView = "lectionView" :lectionViews = "lectionViews" :lang="lang" />' +
                                '</tbody>' +
                            '</table>' +

                            '<div v-if="!tableView" class="card-columns">'+
                               '<lectionViewCard v-for="lectionView in paginatedData" :key="lectionView.id" :lectionView = "lectionView" :lectionViews = "lectionViews" :lang="lang"/>' +
                            '</div>'+
                        '</div>'+
                '</div>'+
        
                '<div v-if="((pageCount > 1)&(lang==1))"  align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
                '<div v-if="((pageCount > 1)&(lang!=1))"  align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+


        '</div>',

    methods:{
        clearSearch(){
           this.search='';
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        },
        byListener: function () {
            if(this.$root.lectionSortKey==="lastname"){
                this.$root.lectionSortKey = "-lastname";
            } else if(this.$root.lectionSortKey==="-lastname"){
                this.$root.lectionSortKey = "lastname";
            } else {
                this.$root.lectionSortKey = "lastname";
            }


        },
        byDate: function () {

            if(this.$root.lectionSortKey==="addTime"){
                this.$root.lectionSortKey = "-addTime";
            } else if(this.$root.lectionSortKey==="-addTime"){
                this.$root.lectionSortKey = "addTime";
            } else {
                this.$root.lectionSortKey = "addTime";
            }
        },
        byDuration: function () {

            if(this.$root.lectionSortKey==="watchTime"){
                this.$root.lectionSortKey = "-watchTime";
            } else if(this.$root.lectionSortKey==="-watchTime"){
                this.$root.lectionSortKey = "watchTime";
            } else {
                this.$root.lectionSortKey = "watchTime";
            }
        },
        byStudyGroup: function () {

            if(this.$root.lectionSortKey==="userStudyGroupInMirIsmu"){
                this.$root.lectionSortKey = "-userStudyGroupInMirIsmu";
            } else if(this.$root.lectionSortKey==="-userStudyGroupInMirIsmu"){
                this.$root.lectionSortKey = "userStudyGroupInMirIsmu";
            } else {
                this.$root.lectionSortKey = "userStudyGroupInMirIsmu";
            }
        },

    },

    computed: {
        sortedViews() {
            const k = this.$root.lectionSortKey;
            return this.lectionViews.sort(dynamicSort(k));
        },
        filteredViews() {
            const s = this.search.toLowerCase();
            //return this.sortedUsers.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedViews.filter(sortedView =>
                _.some(sortedView, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));


        },
        pageCount(){
            let l = this.filteredViews.length,
                s = this.noteCount;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * this.noteCount,
                end = start + this.noteCount;

            return this.filteredViews.slice(start, end);

        }
    },

})

var app;
connect();

app = new Vue({
    el: '#app',
    template:
    '<div>'+
        '<div v-if="showViewConfig">'+
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
        '<option value="35">35</option>'+
        '<option value="40">40</option>'+
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
        '<option value="35">35</option>'+
        '<option value="40">40</option>'+
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

        '<div v-if="lectionData!=null" style="position: center; ">'+

            '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Статистика лекции: "{{lectionData.lectionName}}" (Курс -  "{{lectionData.cource.courceName}}"). </h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;">Statistics for a lecture: "{{lectionData.lectionName}}" (Cource: -  "{{lectionData.cource.courceName}}"). </h1>'+
            '<div v-if="lang==1">'+
                '<button type="button" class="btn btn-primary"  @click="showLectionViewsMethod">Просмотры</button>'+
                '<button type="button" class="btn btn-primary"  @click="showLectionUserTestsMethod">Тестирования</button>'+
                '<button type="button" class="btn btn-primary"  @click="backToLectionList">К курсу</button>'+
                '<button type="button" class="btn btn-primary"  @click="showViewConfigWindow">Параметры отображения</button>'+
            '</div>'+
            '<div v-else>'+
                '<button type="button" class="btn btn-primary"  @click="showLectionViewsMethod">Views</button>'+
                '<button type="button" class="btn btn-primary"  @click="showLectionUserTestsMethod">Testing</button>'+
                '<button type="button" class="btn btn-primary"  @click="backToLectionList">Go to cource</button>'+
                '<button type="button" class="btn btn-primary"  @click="showViewConfigWindow">Display options</button>'+
            '</div>'+



            '<div v-if="this.showLectionViews">'+
                '<lectionViewsList :lectionViews="lectionViews" :lang="lang" :noteCount="noteCount" :tableView="tableView" /> ' +
            '</div>'+
            '<div v-if="this.showLectionUserTests">'+
                '<lectionUserTestsList :lectionUserTests="lectionUserTests" :lang="lang" :noteCount="noteCount" :tableView="tableView" /> ' +
            '</div>'+
        '</div>'+
        '<div v-else style="margin-top: 200px; margin-left: 360px; margin-bottom: 200px; margin-right: 360px; width: 800px; position: center;">' +
                '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>'+
        '</div>'+
        '</div>',
    methods:{
        showViewConfigWindow: function(){
            this.showViewConfig = true;
        },
        closeViewConfigWindow: function (){
            this.showViewConfig=false;
        },

        showLectionViewsMethod: function(){
            this.showLectionViews=true;
            this.showLectionUserTests=false;
        },
        showLectionUserTestsMethod: function () {
            this.showLectionViews=false;
            this.showLectionUserTests=true;
        },

        backToLectionList: function(){
            window.location.href = '/lectionmaker?courceId='+this.lectionData.courceId;
        },


    },

    data: {
        lectionViews:[],
        lectionUserTests:[],
        lectionId: lectionId,
        showLectionViews:true,
        showLectionUserTests:false,
        lectionSortKey:'lastname',
        testSortKey:'lastname',
        lectionData:null,
        showViewConfig:false,
        tableView:'',
        noteCount:'',
        lang:''

    },
    watch: {
        tableView(newTableView) {
            if(newTableView){
                localStorage.statisticTableView=1;
            } else{
                localStorage.statisticTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.statisticNoteCount != newNoteCount){
                localStorage.statisticNoteCount = newNoteCount;
            }
        },
        showLectionUserTests(newShowLectionUserTests){

                if(newShowLectionUserTests){
                    localStorage.statisticShowLectionUserTests=1;
                } else{
                    localStorage.statisticShowLectionUserTests=0;
                }

        }





    },
    mounted(){
        if(localStorage.statisticNoteCount){
            this.noteCount = localStorage.statisticNoteCount;
        }  else {
            this.noteCount = 10;
        }

          if (localStorage.statisticTableView) {
             if(localStorage.statisticTableView==0){
                this.tableView =false;
             } else {
               this.tableView =true;
             }
          } else {
             this.tableView=true;
          }

          if (localStorage.lang) {
             this.lang = localStorage.lang;
          } else {
             this.lang=1;
          }

        if (localStorage.statisticShowLectionUserTests) {
           if(localStorage.statisticShowLectionUserTests==1){
               this.showLectionViews=false;
               this.showLectionUserTests=true;
           } else {
               this.showLectionViews=true;
               this.showLectionUserTests=false;
           }
        }



    },

    created: function () {
        console.log("lectionId: "+ this.lectionId);
        console.log("courceId: "+ this.courceId);

        axios.get('/lection/info/'+this.lectionId).then(result => {
            this.lectionData =result.data;
        });

        axios.get('/lectionStatistics/lectionViews/'+this.lectionId).then(result => {
            result.data.forEach(lectionView => {
                lectionView.watchTime=msToTime(lectionView.watchTime);
                this.lectionViews.push(lectionView);

            })
        });
        axios.get('/lectionStatistics/studentTestAttempts/'+this.lectionId).then(result => {
            this.lectionUserTests = result.data;
        });





        addHandler(data=> {
            if (data.objectType === 'LECTION') {
                if ((data.body.courceId===courceId)&&((data.body.creatorId===window.userId) || (data.body.userGroup===window.userGroup))){
                    const index = this.lections.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':
                            if (data.body.deleted){
                                if (index > -1) {
                                    this.lections.splice(index, 1)
                                    this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                                }
                                break
                            }
                            if (index > -1) {
                                this.lections.splice(index, 1, data.body)
                                this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            } else {
                                this.lections.push(data.body)}
                            this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            break
                        case 'REMOVE':
                            this.lections.splice(index, 1)
                            this.lections =  this.lections.sort((a, b) => (a.lectionPosition - b.lectionPosition))
                            break
                        default:
                            console.error(`Произошедшее событие - неведомая бубуйня: "${data.eventType}"`)
                    }
                }

            } else {
                console.error(`Прилетевший обьект какая то неведомая бубуйня: "${data.objectType}"`)
            }
        })


    },
});