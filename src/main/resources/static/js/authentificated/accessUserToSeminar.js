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





var seminarListenersApi = Vue.resource('/seminarListener{/id}');

var seminarForStudentsApi = Vue.resource('/seminarsForStudents{/id}');

var seminarApi = Vue.resource('/seminar{/id}');

Vue.component('multiselect', window.VueMultiselect.default);


Vue.component('sfs-form', {
    props: ['seminarForStudents', 'seminarForStudentAttr', 'users'],

    data: function() {
        return {
            id:'',
            userGroupId:'',
            selectedListener:[],
        }
    },

    watch:{
        seminarForStudentAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.userGroupId = newVal.userGroupId;
        }
    },
    template:
        '<div class="card" style="margin: 15px;  width: 100%;">'+
            '<div class="card-header text-white bg-primary">Доступные слушатели:</div>'+
            '<div class="card-body">'+
                '<form>'+
                    '<div class="form-group row">'+
                        '<label for="beginDate" class="col-sm-2 col-form-label">Слушатель:</label>'+

                        '<div>'+
                            '<multiselect v-model="selectedListener" id="selectedListener" style=" width: 400px;"  :options="users" track-by="lastname" label="lastname"  :allow-empty="false" placeholder="Выберите слушателя">' +
                            '<template slot="option" slot-scope="{option}">{{option.lastname}} {{option.firstname}} {{option.secname}} </template>'+
                            '<template slot="singleLabel" slot-scope="{ option }">{{option.lastname}} {{option.firstname}} {{option.secname}}</strong></template>'+
                            '<template slot="noResult" slot-scope="{noResult}">Пользователь не найден. Поиск осуществляется только по фамилии!</template>'+
                            '</multiselect>'+
                            '<p class="alert alert-danger" v-show ="$root.userGroupIdAlert">Слушатель не выбран!</p>'+
                        '</div>'+

                    '</div>'+
                    '<div  class="form-group row">'+
                        '<div class="col-sm-10">'+
                            '<input style="margin: 5px;"  type="button"  class="btn btn-primary " value="Добавить" @click="save">'+
                            '<input style="margin: 5px;"  type="button"  class="btn btn-danger " value="Отмена" @click="cancel">'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>'+
        '</div>',

    methods: {

        cancel: function(){
            this.$root.showInputForm = false;
        },

        save: function() {
            console.log("Selected: "+ this.selectedListener.id);

           if(is_empty(this.selectedListener.id)){
                console.log("Слушатель не выбран!");
                this.$root.userGroupIdAlert=true;
            } else{
                this.$root.userGroupIdAlert=false;
            }

            if(this.$root.userGroupIdAlert==false){

                var seminarForStudent = {
                    seminarId: this.$root.seminarId,
                    listenerId: this.selectedListener.id,
                };

                if (this.seminarForStudents.find(x => x.listenerId === this.selectedListener.id)!==undefined){
                    alert("Слушатель уже добавлен!");
                    this.listenerId='';
                    this.$root.showInputForm=false;
                } else {

                    console.log("Сохраняем");
                    seminarListenersApi.save({}, seminarForStudent).then(result =>
                        result.json().then(data => {
                            const index = this.seminarForStudents.findIndex(item =>item.id ===data.id)
                            if (index > -1) {
                                this.seminarForStudents.splice(index, 1, data)
                            } else {
                                this.seminarForStudents.push(data)
                            }
                        })
                    );
                    this.listenerId='';
                    this.$root.showInputForm=false;

                }
            }


        }
    }
});

Vue.component('sfs-row' , {
    props: ['seminarForStudent', 'editMethod', 'seminarForStudents'],
    template:
        '<tr>'+
        '<td align="center" width="5%" >{{seminarForStudent.id}}</td>'+
        '<td align="center" width="40%" >{{seminarForStudent.user.lastname}} {{seminarForStudent.user.firstname}}</td>'+
        '<td align="center" width="40%" >{{seminarForStudent.createDate}}</td>'+
        '<td align="center" width="15%">'+
        '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        del: function() {
            if (confirm("Вы действительно хотите убрать доступ у группы " + this.seminarForStudent.userGroupId + "?")) {

                seminarListenersApi.remove({id: this.seminarForStudent.id}).then(result => {
                    if (result.ok){
                        const ldIndex = this.seminarForStudents.indexOf(this.seminarForStudent);
                        if (ldIndex > -1 ){
                            this.seminarForStudents.splice(ldIndex , 1)
                        }

                    }
                })
            }
        }
    }

});

Vue.component('sfs-list', {
    props: ['seminarForStudent', 'users','seminar','seminarForStudents'],
    data: function(){
        return {
            search: '',
        }
    },


    template:
        '<div  style="position: relative; width: 100%;">'+
            '<div v-show="$root.showInputForm==true"> '+
                '<sfs-form :seminarForStudents="seminarForStudents" :seminarForStudentsAttr="seminarForStudent" :users="users"/>'+
            '</div>' +
            '<div v-show="$root.showInputForm==false"> '+
                '<div  class="card" style="margin: 15px;  width: 100%;">'+
                    '<div class="card-header text-white bg-primary">Слушатели семинара</div>'+
                    '<div class="card-body">'+
                        '<form class="form-inline">'+
                            '<input style="margin: 10px; width: 88%;" v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                            '<input style="margin: 5px;" type="button" class="btn btn-primary " value="+" @click="addListener"> '+
                        '</form>'+
                        '<table style="margin:10px;" class="table">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th width="5%" style="text-align: center" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="40%" style="text-align: center" scope="col"><a href="#"  v-bind:class="bycreatorId" @click="bycreatorId">Слушатель</a></th>'+
                                    '<th width="40%" style="text-align: center" scope="col"><a href="#"  v-bind:class="byCreateDate" @click="byCreateDate">Добавлено</a></th>'+
                                    '<th width="15%" style="text-align: center" scope="col">Действие</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<sfs-row v-for="seminarForStudent in filteredSeminarForStudents"  :key="seminarForStudents.id" :seminarForStudent = "seminarForStudent" :editMethod="editMethod" :seminarForStudents="seminarForStudents"/>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
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

Vue.component('sfsg-list', {
    props: ['seminarForStudentGroup', 'groups','seminar','seminarForStudentGroups'],
    data: function(){
        return {
            search: '',
        }
    },

    template:
        '<div style="position: relative;  width: 100%;">'+
            '<div v-show="$root.showInputForm==true"> '+
                '<sfsg-form :seminarForStudentGroups="seminarForStudentGroups" :seminarForStudentsGroupAttr="seminarForStudentGroup" :groups="groups"/>'+
            '</div>' +
            '<div v-show="$root.showInputForm==false"> '+
                '<div  class="card" style="margin: 15px;  width: 100%;">'+
                    '<div class="card-header text-white bg-primary">Группы слушателей семинара</div>'+
                    '<div class="card-body">'+
                        '<form class="form-inline">'+
                            '<input style="margin: 10px; width: 88%;" v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                            '<input style="margin: 5px;" type="button" class="btn btn-primary " value="+" @click="addListener"> '+
                        '</form>'+
                        '<table style="margin:10px;" class="table">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th width="5%"  style="text-align: center" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="40%" style="text-align: center" scope="col"><a href="#"  v-bind:class="byuserGroupId" @click="byuserGroupId">Слушатели</a></th>'+
                                    '<th width="40%" style="text-align: center" scope="col"><a href="#"  v-bind:class="byCreateDate" @click="byCreateDate">Добавлено</a></th>'+
                                    '<th width="15%" style="text-align: center" scope="col">Действие</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<sfsg-row v-for="seminarForStudentGroup in filteredSeminarForStudentGroups"  :seminarForStudentGroup="seminarForStudentGroup" :key="seminarForStudentGroup.id" :seminarForStudentGroups="seminarForStudentGroups"/>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',

    computed: {
        sortedSeminarForStudentGroups() {
            const k = this.$root.sortKey;
            return this.seminarForStudentGroups.sort(dynamicSort(k));

        },
        filteredSeminarForStudentGroups() {
            const s = this.search.toLowerCase();
            return this.sortedSeminarForStudentGroups.filter(sortedSeminarForStudentGroups =>
                _.some(sortedSeminarForStudentGroups, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        }

    },

    methods: {

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

Vue.component('sfsg-row' , {
    props: ['seminarForStudentGroup',  'seminarForStudentGroups'],
    template:
        '<tr>'+
            '<td align="center" width="5%" >{{seminarForStudentGroup.id}}</td>'+
            '<td align="center" width="40%" >{{seminarForStudentGroup.userGroup.groupName}} </td>'+
            '<td align="center" width="40%" >{{seminarForStudentGroup.createDate}}</td>'+
            '<td align="center" width="15%">'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="x" @click="del" />'+
            '</td>'+
        '</tr>',
    methods: {
        del: function() {
            if (confirm("Вы действительно хотите убрать доступ у группы " + this.seminarForStudentGroup.userGroupId + "?")) {

                seminarForStudentsApi.remove({id: this.seminarForStudentGroup.id}).then(result => {
                    if (result.ok){
                        const ldIndex = this.seminarForStudentGroups.indexOf(this.seminarForStudentGroup);
                        if (ldIndex > -1 ){
                            this.seminarForStudentGroups.splice(ldIndex , 1)
                        }

                    }
                })
            }
        }
    }

});

Vue.component('sfsg-form', {
    props: ['seminarForStudentGroups', 'seminarForStudentGroupAttr', 'groups'],

    data: function() {
        return {
            id:'',
            userGroupId:'',
        }
    },

    watch:{
        seminarForStudentGroupAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.userGroupId = newVal.userGroupId;
        }
    },
    template:
        '<div class="card" style="margin: 15px;  width: 100%;">'+
            '<div class="card-header text-white bg-primary">Группы слушателей для добавления</div>'+
            '<div class="card-body">'+
                '<form>'+
                    '<div class="form-group row">'+
                        '<label for="beginDate" class="col-sm-2 col-form-label">Группа</label>'+
                        '<div class="col-sm-10">'+
                            '<select class="custom-select" id="userGroupId"  v-model="userGroupId" >'+
                                '<option selected value="" >Выбрать</option>'+
                                '<option v-for="group in groups"  v-bind:value="group.id">{{group.groupName}} {{group.id}}</option>'+
                            '</select>'+
                            '<p class="alert alert-danger" v-show ="$root.userGroupIdAlert">Семинар должен быть привязан к группе!</p>'+
                        '</div>'+
                    '</div>'+
                    '<div  class="form-group row">'+
                        '<div class="col-sm-10">'+
                            '<input style="margin: 5px;"  type="button"  class="btn btn-primary " value="Добавить" @click="save">'+
                            '<input style="margin: 5px;"  type="button"  class="btn btn-danger " value="Отмена" @click="cancel">'+
                        '</div>'+
                    '</div>'+
                '</form>'+
            '</div>'+
        '</div>',

    methods: {

        cancel: function(){
            this.$root.showInputForm = false;
        },

        save: function() {

            if(is_empty(this.userGroupId)){
                console.log("не указана группа пользователей!");
                this.$root.userGroupIdAlert=true;
            } else{
                this.$root.userGroupIdAlert=false;
            }

            if(this.$root.userGroupIdAlert==false){

                var seminarForStudentGroup = {
                    seminarId: this.$root.seminarId,
                    userGroupId: this.userGroupId,
                };

                if (this.seminarForStudentGroups.find(x => x.userGroupId === this.userGroupId)!==undefined){
                    alert("Данная группа уже добавлена!");
                    this.userGroupId='';
                    this.beginDate='';
                    this.endDate='';
                    this.$root.showInputForm=false;
                } else {

                    console.log("Сохраняем");
                    seminarForStudentsApi.save({}, seminarForStudentGroup).then(result =>
                        result.json().then(data => {
                            const index = this.seminarForStudentGroups.findIndex(item =>item.id ===data.id)
                            if (index > -1) {
                                this.seminarForStudentGroups.splice(index, 1, data)
                            } else {
                                this.seminarForStudentGroups.push(data)
                            }
                        })
                    );
                    this.userGroupId='';
                    this.$root.showInputForm=false;
                }
            }
        }
    }
});


var app;


connect();

app = new Vue({
    el: '#app',
    template:
        '<div  v-if="((this.groups.length!=0)&(this.users.length!=0))" style="position: relative; width: 900px;">'+

            '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Слушатели Семинара \"{{seminar.seminarName}}\"</h1>'+
                '<div style="padding-left: 9px;" class="btn-group" role="group" aria-label="Слушатели семинара">'+
                    '<button type="button" class="btn btn-primary"  @click="seminarListeners">Слушатели</button>'+
                    '<button type="button" class="btn btn-primary"  @click="seminarListenersGroup">Группы слушателей</button>'+
                    '<button type="button" class="btn btn-primary"  @click="backToSeminarsList">К семинарам</button>'+
                '</div>'+

                '<div v-if="$root.seminarId>0">'+
                    '<div v-if="showSeminarListeners">'+
                        '<sfs-list :seminarForStudents="seminarForStudents"  :users="users" :seminar="seminar" /> ' +
                    '</div>'+
                    '<div v-if="!showSeminarListeners">'+
                        '<sfsg-list :seminarForStudentGroups="seminarForStudentGroups"  :groups="groups" :seminar="seminar" /> ' +
                    '</div>'+
                '</div>'+

                '<div v-else style="position: relative; width: 100%;">'+
                    '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Семинар не существует!</h1>'+
                '</div>'+

        '</div>'+
        '<div v-else style="margin-top: 200px; margin-left: 360px; margin-bottom: 200px; margin-right: 360px; width: 800px; position: center;">' +
                '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>'+
            '</div>',

    data: {
        seminarForStudents:[],
        seminarForStudentGroups:[],
        seminarForStudent:'',
        seminarForStudentGroup:'',
        users:[],
        groups:[],
        seminar:'',
        seminarName:"",
        sortKey:'id',
        seminarId: id,
        sid:'',
        showInputForm:false,
        userGroupIdAlert:false,
        showSeminarListeners:true,
        showSeminarListenersGroup:false,

    },
    methods:{
        seminarListeners(){
            this.$root.showSeminarListeners=true;
            this.$root.showSeminarListenersGroup=false;
        },
        seminarListenersGroup(){
            this.$root.showSeminarListeners=false;
            this.$root.showSeminarListenersGroup=true;
        },
        backToSeminarsList(){
            window.location.href = '/seminars';
        },



    },

    created: function () {



        this.$root.sid=this.seminar.id;

        if (this.$root.seminarId>0)

        {
            seminarApi.get({id: this.$root.seminarId}).then(result =>
                result.json().then(data => (
                    this.seminar=result.data)));

           // if (this.$root.showSeminarListeners){
                axios.get('/userForSelectList').then(result => {
                    this.users=result.data
                });

                seminarForStudentsApi.get({id: this.$root.seminarId}).then(result =>
                    result.json().then(data => (
                        this.seminarForStudentGroups=data)));
           // } else {
                axios.get('/studentgroup').then(result => {
                    this.groups=result.data
                });

                seminarListenersApi.get({id: this.$root.seminarId}).then(result =>
                    result.json().then(data => (
                        this.seminarForStudents=data)));
           // }
        }



        addHandler(data=> {
            if (data.objectType === 'SEMINARFORSTUDENTS') {
                if ((data.body.seminarId===this.seminarId)){

                    const index = this.seminarForStudentGroups.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':


                            if (index > -1) {
                                this.seminarForStudentGroups.splice(index, 1)
                                this.seminarForStudentGroups =  this.seminarForStudentGroups.sort((a, b) => (a.createDate - b.createDate))
                            }
                            break

                            if (index > -1) {
                                this.seminarForStudentGroups.splice(index, 1, data.body)
                                this.seminarForStudentGroups =  this.seminarForStudentGroups.sort((a, b) => (a.createDate - b.createDate))
                            } else {
                                this.seminarForStudentGroups.push(data.body)}
                            this.seminarForStudentGroups =  this.seminarForStudentGroups.sort((a, b) => (a.createDate - b.createDate))
                            break
                        case 'REMOVE':
                            console.error('REMOVE')
                            this.seminarForStudentGroups.splice(index, 1)
                            this.seminarForStudentGroups =  this.seminarForStudentGroups.sort((a, b) => (a.createDate - b.createDate))
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