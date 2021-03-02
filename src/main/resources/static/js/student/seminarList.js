function paddNum(num, padsize) {

    return typeof num !== 'undefined'
        ? num.toString().length > padsize
            ? num
            : new Array(padsize - num.toString().length + 1).join('0') + num
        : undefined
        ;
}

function chunkArray(inputArray, chunkSize) {

    const results = [];

    while (inputArray.length) {
        results.push(inputArray.splice(0, chunkSize));
    }
    return results;
}

function areSameDates(date1, date2) {

    return (date1.getDate() === date2.getDate()) &&
        (date1.getMonth() === date2.getMonth()) &&
        (date1.getFullYear() === date2.getFullYear())
        ;

}

function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

var stompClient = null
const handlers = []

function connect() {
    const socket = new SockJS('/gs-guide-websocket')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/activity', seminarForStudents => {
            handlers.forEach(handler => handler(JSON.parse(seminarForStudents.body)))
        })
    })
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
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

var seminarForStudentsApi = Vue.resource('/seminarsForStudent');

Vue.component('sfs-row' , {
    props: ['seminarForStudent', 'editMethod', 'seminarForStudents', 'lang'],
    template:
        '<tr v-if="lang==1">'+
            '<td style="text-align: center" width="10%">{{seminarForStudent.id}}</td>'+
            '<td style="text-align: center" width="30%" >{{seminarForStudent.seminarName}}</td>'+
            '<td style="text-align: center" width="30%" >{{seminarForStudent.seminarCreator}}</td>'+
            '<td v-if="seminarForStudent.meetingStatus==0" style="text-align: center" width="30%" >Семинар запланирован на {{seminarForStudent.seminarBeginDate}}</td>'+
            '<td v-else-if="seminarForStudent.meetingStatus==1" style="text-align: center" width="30%">'+
                '<input   style="margin: 5px;" type = "button"  class="btn btn-danger" value="Присоединиться" @click="go" />'+
            '</td>'+
            '<td v-else-if="((seminarForStudent.meetingStatus==3)&(seminarForStudent.recordUrl==null))"  align="center" width="20%">Семинар завершен</td>'+
            '<td v-else-if="((seminarForStudent.meetingStatus==3)&(seminarForStudent.recordUrl!=null))"  align="center" width="20%">' +
                '<input style="margin: 2px;"  type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Просмотр" @click="play" />' +
            '</td>'+
        '</tr>'+
        '<tr v-else>'+
            '<td style="text-align: center" width="10%">{{seminarForStudent.id}}</td>'+
            '<td style="text-align: center" width="30%" >{{seminarForStudent.seminarName}}</td>'+
            '<td style="text-align: center" width="30%" >{{seminarForStudent.seminarCreator}}</td>'+
            '<td v-if="seminarForStudent.meetingStatus==0" style="text-align: center" width="30%" >The workshop is scheduled on {{seminarForStudent.seminarBeginDate}}</td>'+
            '<td v-else-if="seminarForStudent.meetingStatus==1" style="text-align: center" width="30%">'+
                '<input   style="margin: 5px;" type = "button"  class="btn btn-danger" value="Join" @click="go" />'+
            '</td>'+
            '<td v-else-if="((seminarForStudent.meetingStatus==3)&(seminarForStudent.recordUrl==null))"  align="center" width="20%">Seminar completed</td>'+
            '<td v-else-if="((seminarForStudent.meetingStatus==3)&(seminarForStudent.recordUrl!=null))"  align="center" width="20%">' +
                '<input style="margin: 2px;"  type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="View" @click="play" />' +
            '</td>'+
        '</tr>'
    ,
    methods: {
        go: function() {
            window.location.href = '/seminar/begin/'+this.seminarForStudent.id;
        },
        play: function() {
            this.$root.watchUrl=this.seminarForStudent.recordUrl;
            this.$root.showFrame=true;
        },
    }

});

Vue.component('sfs-list', {
    props: ['seminarForStudent', 'groups','seminar','seminarForStudents', 'lang'],
    data: function(){
        return {
            search: '',
        }
    },
    mounted(){
        if (localStorage.seminarWatchListSearch) {
            this.search = localStorage.seminarWatchListSearch;
        } else {
            this.search='';
        }
    },
    watch: {
        search(newSearch){
            if (localStorage.seminarWatchListSearch != newSearch) {
                localStorage.seminarWatchListSearch = newSearch;
            }
        }
    },
    
    template:
        '<div style="position: relative; width: 800px;">'+
            '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Доступные семинары</h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;">Available seminars</h1>'+
             '<div  class="card" style="margin: 15px; min-width: 900px;">'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Мои семинары</h5><h5 v-else>My seminars</h5></div>'+
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


                    '<table  class="table">'+
                        '<thead>'+
                            '<tr v-if="lang==1">'+
                                '<th style="text-align: center" width="10%" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col"><a href="#"  v-bind:class="byuserGroupId" @click="byuserGroupId">Семинар</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col"><a href="#"  v-bind:class="bycreatorId" @click="bycreatorId">Автор</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col">Действие</th>'+
                            '</tr>'+
                            '<tr v-else>'+
                                '<th style="text-align: center" width="10%" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col"><a href="#"  v-bind:class="byuserGroupId" @click="byuserGroupId">Seminar</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col"><a href="#"  v-bind:class="bycreatorId" @click="bycreatorId">Author</a></th>'+
                                '<th style="text-align: center" width="30%" scope="col">Action</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<sfs-row v-for="seminarForStudent in filteredSeminarForStudents"  :key="seminarForStudents.id" :lang="lang" :seminarForStudent = "seminarForStudent" :editMethod="editMethod" :seminarForStudents="seminarForStudents"/>' +
                        '</tbody>' +
                    '</table>' +
                '</div>'+
            '</div>'+
        '</div>',
    computed: {
        sortedSeminarForStudents() {
            const k = this.$root.sortKey;
            return this.seminarForStudents.sort(dynamicSort(k));

        },
        filteredSeminarForStudents() {
            const s = this.search.toLowerCase();
            //return this.sortedseminarForStudentss.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedSeminarForStudents.filter(sortedSeminarForStudents =>
                _.some(sortedSeminarForStudents, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        }

    },

    methods: {

        clearSearch:function (){
            this.search='';
        },
        editMethod: function(seminarForStudents){
            this.seminarForStudents = seminarForStudents;
        },
        byId: function(){
            this.$root.sortKey="id";
        },
        byuserGroupId: function(){
            this.$root.sortKey="userGroupId";
        },
        bycreatorId: function(){
            this.$root.sortKey="creatorId";
        },
        byCreateDate: function(){
            this.$root.sortKey="createDate";
        },

        backToSeminarList: function(){
            window.location.href = '/seminars';

        },
        addListener: function() {
            this.$root.showInputForm = true;
        }

    }

});

var app;


connect();

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; ">'+
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
            '<sfs-list :seminarForStudents="seminarForStudents" :seminar="seminar" :lang="lang" /> ' +
        '</div>',

    data: {
        seminarForStudents:[],
        seminarForStudent:'',
        groups:[],
        seminar:'',
        seminarName:"",
        sortKey:'-id',
        sid:'',
        showInputForm:false,
        userGroupIdAlert:false,

        showFrame:false,
        watchUrl:'',
        lang:''
    },

    mounted(){
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }

    },

    methods:{
        closeFrame() {
            this.$root.showFrame = false;

        },
    },

    created: function () {
            seminarForStudentsApi.get({id: this.$root.seminarId}).then(result =>
                result.json().then(data => (
                    data.forEach(sfs => {this.seminarForStudents.push(sfs);
                    })
                )));





        addHandler(data=> {
            if (data.objectType === 'SEMINARFORLIST') {
                if ((data.body.seminarId===this.seminarId)){

                    const index = this.seminarForStudents.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'UPDATE':
                            if (index > -1) {
                                this.seminarForStudents.splice(index, 1, data.body)
                                this.seminarForStudents =  this.seminarForStudents.sort((a, b) => (a.createDate - b.createDate))
                            }
                            break
                        case 'REMOVE':
                            console.error('REMOVE')
                            this.seminarForStudents.splice(index, 1)
                            this.seminarForStudents =  this.seminarForStudents.sort((a, b) => (a.createDate - b.createDate))
                            break
                        default:
                            console.error(`Looks like the event type if unknown "${data.eventType}"`)
                    }
                }

            } else {
                console.error(`Looks like the object type if unknown "${data.objectType}"`)
            }
        })
    },
});