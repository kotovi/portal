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





var seminarForStudentsApi = Vue.resource('/seminarsForStudents{/id}');

var seminarApi = Vue.resource('/seminar{/id}');



Vue.component('sfs-form', {
    props: ['seminarForStudents', 'seminarForStudentAttr', 'groups'],

    data: function() {
        return {
            id:'',
            userGroupId:'',
        }
    },

    watch:{
        seminarForStudentAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.userGroupId = newVal.userGroupId;
        }
    },
    template:
            '<div class="card" style="margin: 15px;">'+
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

                var seminarForStudent = {
                    seminarId: this.$root.seminarId,
                    userGroupId: this.userGroupId,
                };

                if (this.seminarForStudents.find(x => x.userGroupId === this.userGroupId)!==undefined){
                    alert("Данная группа уже добавлена!");
                    this.userGroupId='';
                    this.beginDate='';
                    this.endDate='';
                } else {

                    console.log("Сохраняем");
                    seminarForStudentsApi.save({}, seminarForStudent).then(result =>
                        result.json().then(data => {
                            const index = this.seminarForStudents.findIndex(item =>item.id ===data.id)
                            if (index > -1) {
                                this.seminarForStudents.splice(index, 1, data)
                            } else {
                                this.seminarForStudents.push(data)
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

Vue.component('sfs-row' , {
    props: ['seminarForStudent', 'editMethod', 'seminarForStudents'],
    template:
        '<tr>'+
        '<td align="center" width="5%" >{{seminarForStudent.id}}</td>'+
        '<td align="left" width="20%" >{{seminarForStudent.userGroup.groupName}} </td>'+
        '<td align="left" width="15%" >{{seminarForStudent.user.lastname}} {{seminarForStudent.user.firstname}}</td>'+
        '<td align="left" width="15%" >{{seminarForStudent.createDate}}</td>'+
        '<td align="left" width="15%" >{{seminarForStudent.seminar.seminarBeginDate}}</td>'+
        '<td align="center" width="10%">'+
        '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />'+
        '</td>'+
        '</tr>',
    methods: {
        del: function() {
            if (confirm("Вы действительно хотите убрать доступ у группы " + this.seminarForStudent.userGroupId + "?")) {

                seminarForStudentsApi.remove({id: this.seminarForStudent.id}).then(result => {
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
    props: ['seminarForStudent', 'groups','seminar','seminarForStudents'],
    data: function(){
        return {
            search: '',
        }
    },


    template:
        '<div style="position: relative; width: 1000px;">'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Участники семинара "{{seminar.seminarName}}\"</h1>'+
            '<div v-show="$root.showInputForm==false"> '+
                '<input style="margin: 15px;" type="button" class="btn btn-primary " value="Добавить" @click="addListener"> '+
                '<input style="margin: 15px;" type = "button" class="btn btn-success" value="К списку семинаров" @click="backToSeminarList" />'+
            '</div>' +
            '<div v-show="$root.showInputForm==true"> '+
                '<sfs-form :seminarForStudents="seminarForStudents" :seminarForStudentsAttr="seminarForStudent" :groups="groups"/>'+
            '</div>' +
            '<div v-show="$root.showInputForm==false"> '+
                '<div  class="card" style="margin: 15px; min-width: 900px;">'+
                    '<div class="card-header text-white bg-primary">Участники семинара</div>'+
                    '<div class="card-body">'+
                        '<input style="margin: 5px;" v-model="search" id="search" class="form-control" placeholder="Поиск">'+
                        '<table  class="table">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th width="5%" scope="col"><a href="#"  v-bind:class="byId" @click="byId">id</a></th>'+
                                    '<th width="25%" scope="col"><a href="#"  v-bind:class="byuserGroupId" @click="byuserGroupId">Слушатели</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="bycreatorId" @click="bycreatorId">Кто добавил</a></th>'+
                                    '<th width="15%" scope="col"><a href="#"  v-bind:class="byCreateDate" @click="byCreateDate">Добавлено</a></th>'+
                                    '<th width="15%" scope="col">Дата проведения</th>'+
                                    '<th width="10%" scope="col">Действие</th>'+
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

var app;


connect();

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; ">'+
            '<div v-if="$root.seminarId>0">'+
                '<sfs-list :seminarForStudents="seminarForStudents"  :groups="groups" :seminar="seminar" /> ' +
            '</div>'+
            '<div v-else style="position: relative; width: 1000px;">'+
                '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;">Семинар не существует!</h1>'+
            '</div>'+

        '</div>',

    data: {
        seminarForStudents:[],
        seminarForStudent:'',
        groups:[],
        seminar:'',
        seminarName:"",
        sortKey:'id',
        seminarId: id,
        sid:'',
        showInputForm:false,
        userGroupIdAlert:false,
    },

    created: function () {

        axios.get('/studentgroup').then(result => {
            this.groups=result.data
        });

        this.$root.sid=this.seminar.id;

       if (this.$root.seminarId>0)
       {
           seminarForStudentsApi.get({id: this.$root.seminarId}).then(result =>
               result.json().then(data => (
                   data.forEach(cfs => {this.seminarForStudents.push(cfs);
                   })
               )));


           seminarApi.get({id: this.$root.seminarId}).then(result =>
               result.json().then(data => (

                   this.seminar=result.data)));
       }





        addHandler(data=> {
            if (data.objectType === 'SEMINARFORSTUDENTS') {
                if ((data.body.seminarId===this.seminarId)){

                    const index = this.seminarForStudentss.findIndex(item => item.id === data.body.id)

                    switch (data.eventType) {
                        case 'CREATE':
                        case 'UPDATE':


                                if (index > -1) {
                                    this.seminarForStudents.splice(index, 1)
                                    this.seminarForStudents =  this.seminarForStudents.sort((a, b) => (a.createDate - b.createDate))
                                }
                                break

                            if (index > -1) {
                                this.seminarForStudents.splice(index, 1, data.body)
                                this.seminarForStudents =  this.seminarForStudents.sort((a, b) => (a.createDate - b.createDate))
                            } else {
                                this.seminarForStudents.push(data.body)}
                            this.seminarForStudents =  this.seminarForStudents.sort((a, b) => (a.createDate - b.createDate))
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