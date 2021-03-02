var stompClient = null
var stompClient = null
const handlers = []

function connect() {
    const socket = new SockJS('/gs-guide-websocket')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, frame => {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/activity', cource => {
            handlers.forEach(handler => handler(JSON.parse(cource.body)))
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

var courceApi = Vue.resource('/cource{/id}');
Vue.component('multiselect', window.VueMultiselect.default);


Vue.component('cource-form', {
    props: ['cources', 'courceAttr', 'groups', 'lang'],
    data: function() {
        return {
            id:'',
            courceName:'',
            courceDescription:'',
            lectionsCount:-1,
            testEnable:-1,
            userGroup:'',
            userGroupObject: null,
        }
    },

    watch:{
        courceAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.courceName = newVal.courceName;
            this.courceDescription = newVal.courceDescription;
            this.lectionsCount = newVal.lectionsCount;
            this.testEnable = newVal.testEnable;
            this.userGroup = newVal.userGroup;
            this.userGroupObject = this.groups.filter(group => group.id === this.userGroup)[0];
        }
    },
    template:
        '<div>'+
            '<h1 v-if="lang===1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Управление курсами</h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;">Course management</h1>'+
            '<input style="margin: 5px;" v-if="(($root.showInput==false)&(lang==1))" type="button" class="btn btn-primary " value="Добавить курс" @click="addCource">'+
            '<input style="margin: 5px;" v-if="(($root.showInput==false)&(lang!=1))" type="button" class="btn btn-primary " value="Add course" @click="addCource">'+
            '<input style="margin: 5px;" v-if="(($root.showInput==false)&(lang==1))" type="button" class="btn btn-primary " value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
            '<input style="margin: 5px;" v-if="(($root.showInput==false)&(lang!=1))" type="button" class="btn btn-primary " value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+
        '<div v-if="$root.showInput==true" class="card" style="margin: 15px;">'+
                '<div v-if="(($root.editClicked == false)&(lang==1))" class="card-header text-white bg-primary"><h5>Создание курса</h5></div>'+
                '<div v-if="(($root.editClicked == false)&(lang!=1))" class="card-header text-white bg-primary"><h5>Course creation</h5></div>'+
                '<div v-if="(($root.editClicked == true)&(lang==1))" class="card-header text-white bg-primary"><h5>Редактирование курса</h5></div>'+
                '<div v-if="(($root.editClicked == true)&(lang!=1))" class="card-header text-white bg-primary"><h5>Editing a course</h5></div>'+
                    '<div class="card-body">'+
                        '<form v-if="lang==1">'+
                                '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                    '<label for="courceName">Название курса</label>'+
                                    '<div class="input-group">'+
                                        '<input type="text" class="form-control" id="courceName" v-model="courceName" placeholder="Название курса" required :maxlength="255">'+
                                        '<div v-show="courceName.length>0" class="input-group-prepend">' +
                                            '<div class="input-group-text" v-text="255 - courceName.length">@</div>' +
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show="$root.courceNameAlert" >Необходимо заполнить название курса</p>'+
                                '</div>'+

                                '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                    '<label for="courceDescription">Аннотация курса</label>'+
                                    '<div class="input-group">'+
                                        '<textarea type="text" class="form-control" id="courceDescription" v-model="courceDescription" placeholder="Аннотация курса" required :maxlength="3000"></textarea>'+
                                        '<div v-show="courceDescription.length>0" class="input-group-prepend">' +
                                            '<div class="input-group-text" v-text="3000 - courceDescription.length">@</div>' +
                                        '</div>'+
                                    '</div>'+
                                    '<p class="alert alert-danger" v-show="$root.courceDescriptionAlert" >Необходимо заполнить аннотацию курса</p>'+
                                '</div>'+

                                '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                    '<label for="lectionsCount">Количество лекций</label>'+
                                    '<select class="custom-select" id="lectionsCount" v-model="lectionsCount" required>'+
                                            '<option value="-1">Выбрать...</option>'+
                                            '<option :value="n" v-for=" n in 50">{{n}}</option>'+
                                    '</select>'+
                                    '<p class="alert alert-danger" v-show="$root.lectionCountAlert" >Необходимо указать количество лекций курса</p>'+
                                    '<p class="alert alert-danger" v-show="$root.editLectionCountAlert" >{{$root.editLectionCountAlertBody}}</p>'+
                                '</div>'+

                                '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                    '<label for="testEnable">Тестирование</label>'+
                                    '<select class="custom-select" id="testEnable" v-model="testEnable" required>'+
                                        '<option value="-1">Выбрать...</option>'+
                                        '<option value="0">Не тестировать</option>'+
                                        '<option value="1">Вводное тестирование</option>'+
                                        '<option value="2">Промежуточное тестирование</option>'+
                                        '<option value="3">Вводное и финальное тестирование</option>'+
                                        '<option value="4">Вводное, финальное и промежуточное тестирование</option>'+
                                    '</select>'+
                                    '<p class="alert alert-danger" v-show="$root.testEnableAlert" >Необходимо указать, тестировать ли слушателей между лекциями</p>'+
                                '</div>'+

                                '<div v-if="$root.isAdmin==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                    '<label for="userGroupObject">Группа</label>'+
                                    '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Выбрать группу">' +
                                        '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
                                        '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
                                        '<template slot="noResult" slot-scope="{noResult}">Группа не найдена. Поиск осуществляется только по названию!</template>'+
                                    '</multiselect>'+
                                    '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Укажите состоит ли пользователь в какой либо из групп!</p>'+
                                '</div>'+

                                '<div class="form-group row" style="width: 90%; margin-top: 10px;">'+
                                    '<div class="col">'+
                                        '<input style="margin: 5px;" v-if="$root.editClicked==false" type="button"  class="btn btn-primary " value="Создать" @click="save">'+
                                        '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Сохранить" @click="save">'+
                                        '<input style="margin: 5px;"  type="button" class="btn btn-danger " value="Отменить" @click="cancel">'+
                                    '</div>'+
                                '</div>'+
                        '</form>'+
                        '<form v-else>'+
                            '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="courceName">Course name</label>'+
                                '<div class="input-group">'+
        '<input type="text" class="form-control" id="courceName" v-model="courceName" placeholder="Course name" required :maxlength="255">'+
        '<div v-show="courceName.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="255 - courceName.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.courceNameAlert" >Course name must be filled</p>'+
        '</div>'+

        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="courceDescription">Course abstract</label>'+
        '<div class="input-group">'+
        '<textarea type="text" class="form-control" id="courceDescription" v-model="courceDescription" placeholder="Course abstract" required :maxlength="3000"></textarea>'+
        '<div v-show="courceDescription.length>0" class="input-group-prepend">' +
        '<div class="input-group-text" v-text="3000 - courceDescription.length">@</div>' +
        '</div>'+
        '</div>'+
        '<p class="alert alert-danger" v-show="$root.courceDescriptionAlert" >You must fill out the course annotation</p>'+
        '</div>'+

        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="lectionsCount">Number of lectures</label>'+
        '<select class="custom-select" id="lectionsCount" v-model="lectionsCount" required>'+
        '<option value="-1">Select...</option>'+
        '<option :value="n" v-for=" n in 50">{{n}}</option>'+
        '</select>'+
        '<p class="alert alert-danger" v-show="$root.lectionCountAlert" >It is necessary to indicate the number of lectures of the course</p>'+
        '<p class="alert alert-danger" v-show="$root.editLectionCountAlert" >{{$root.editLectionCountAlertBody}}</p>'+
        '</div>'+

        '<div class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="testEnable">Testing</label>'+
        '<select class="custom-select" id="testEnable" v-model="testEnable" required>'+
        '<option value="-1">Select...</option>'+
        '<option value="0">Do not test</option>'+
        '<option value="1">Introductory testing</option>'+
        '<option value="2">Intermediate testing</option>'+
        '<option value="3">Introductory and final testing</option>'+
        '<option value="4">Introductory, final and interim testing</option>'+
        '</select>'+
        '<p class="alert alert-danger" v-show="$root.testEnableAlert" >It is necessary to specify whether to test the audience between lectures</p>'+
        '</div>'+

        '<div v-if="$root.isAdmin==1" class="col" style="width: 90%; margin-top: 10px;">'+
        '<label for="userGroupObject">Group</label>'+
        '<multiselect v-model="userGroupObject" id="userGroupObject" style="width: 100%"  :options="groups" track-by="groupName" label="groupName"  :allow-empty="true" placeholder="Select group">' +
        '<template slot="option" slot-scope="{option}">{{option.groupName}}(ID: {{option.id}})</template>'+
        '<template slot="singleLabel" slot-scope="{ option }">{{option.groupName}} </strong></template>'+
        '<template slot="noResult" slot-scope="{noResult}">The group was not found. Search is carried out by name only!</template>'+
        '</multiselect>'+
        '<p class="alert alert-danger" v-show ="$root.userGroupNameAlert">Indicate whether the user is a member of any of the groups!</p>'+
        '</div>'+

        '<div class="form-group row" style="width: 90%; margin-top: 10px;">'+
        '<div class="col">'+
        '<input style="margin: 5px;" v-if="$root.editClicked==false" type="button"  class="btn btn-primary " value="Create" @click="save">'+
        '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button" class="btn btn-primary " value="Save" @click="save">'+
        '<input style="margin: 5px;"  type="button" class="btn btn-danger " value="Cancel" @click="cancel">'+
        '</div>'+
        '</div>'+
        '</form>'+


                    '</div>'+
        '</div>'+
        '</div>',

    methods: {
        confirmAlarm: function() {
            this.$root.showModal = false;
            this.$root.alarmBoby = '';

            if (this.$root.confirmAlarm) {
                this.$root.confirmAlarm = false;
                courceApi.remove({id: this.$root.courceId}).then(result => {
                    if (result.ok) {

                        this.cources.splice(this.cources.indexOf(this.$root.cource), 1)
                    }
                })
            }
        },
        closeAlarmWindow: function(){
            this.$root.confirmAlarm=false;
            this.$root.showModal=false;
            this.$root.alarmBoby='';
        },
        addCource: function(){
            this.$root.showInput=true;
            if(this.$root.editBeenClicked==true){
                this.id='';
                this.courceName = '';
                this.courceDescription = '';
                this.lectionsCount = -1;
                this.testEnable = 0;
                this.userGroup = 0;
                this.cource = this.$root.tempCource;
                const index = this.cources.findIndex(item => item.id === this.cource.id)
                if (index > -1) {
                    this.cources.splice(index, 1, this.cource)
                } else {
                    this.cources.push(this.cource)
                }
                this.$root.tempCource = null;
                this.$root.editBeenClicked=false;
            }
        },
        cancel: function() {

            if(this.$root.editClicked==true) {
                this.$root.showInput=false;
            }
            if((this.$root.editClicked==false)){
                this.$root.showInput=false;
                this.courceName = '';
                this.courceDescription = '';
                this.lectionsCount = -1;
                this.testEnable = -1;
                this.userGroup = 0;

            }
            this.$root.editClicked=false;
            this.$root.courceNameAlert=false;
            this.$root.courceDescriptionAlert=false;
            this.$root.lectionCountAlert=false;
            this.$root.testEnableAlert=false;


        },
        save: function() {
            if(this.userGroupObject!=null){
                this.userGroup=this.userGroupObject.id;
                this.$root.userGroupNameAlert = false;
            } else {
                this.$root.userGroupNameAlert = true;
            }

            var cource = {
                courceName: capitalizeFirstLetter(this.courceName),
                courceDescription: capitalizeFirstLetter(this.courceDescription),
                lectionsCount: this.lectionsCount,
                testEnable: this.testEnable,
                userGroup:this.userGroup,

            };
            if(this.$root.editClicked){
                if(this.lectionsCount < this.$root.editLectionsCount){
                this.$root.editLectionCountAlert=true;
                this.$root.editLectionCountAlertBody="В текущий момент курс содержит в себе больше чем "+this.lectionsCount+" лекций! " +
                    "Для уменьшения количества лекций необходимо удалить из курса ненужные лекции!"
                } else {
                    this.$root.editLectionCountAlert=false;
                    this.$root.editLectionCountAlertBody="";
                    this.$root.editLectionsCount=0;
                }
            }
            if (is_empty(this.courceName)) {
                this.$root.courceNameAlert=true;
            } else {
                this.$root.courceNameAlert=false;
            }
            if (is_empty(this.courceDescription)){
                this.$root.courceDescriptionAlert=true;
            } else {
                this.$root.courceDescriptionAlert=false;
            }
            if (this.lectionsCount<0) {
                this.$root.lectionCountAlert=true;
            } else {
                this.$root.lectionCountAlert=false;
            }
            if (this.testEnable<0) {
                this.$root.testEnableAlert=true;
            } else {
                this.$root.testEnableAlert=false;
            }
               if((!this.$root.courceNameAlert)&&(!this.$root.courceDescriptionAlert)&&(!this.$root.lectionCountAlert)&&(!this.$root.testEnableAlert)&&(!this.$root.editLectionCountAlert)){
                if (this.id) {
                    this.$root.editClicked = false;

                    courceApi.update({id: this.id}, cource).then(result =>
                        result.json().then(data => {
                            const index = this.cources.findIndex(item => item.id === data.id)
                            this.cources.splice(index, 1, data)


                        })
                    )
                    this.id = ''
                    this.courceName = ''
                    this.courceDescription = ''
                    this.lectionsCount = -1
                    this.testEnable = -1
                    this.userGroupObject = null
                } else {

                    courceApi.save({}, cource).then(result =>
                        result.json().then(data => {
                            const index = this.cources.findIndex(item => item.id === data.id)

                            if (index > -1) {
                                this.cources.splice(index, 1, data)
                            } else {
                                this.cources.push(data)
                            }
                })
                )
                    this.courceName = ''
                    this.courceDescription = ''
                    this.lectionsCount = -1
                    this.testEnable = -1
                    this.userGroupObject = null
                }
                   this.$root.showInput=false;
            }
        }
    }
});

Vue.component('cource-row' , {
    props: ['cource', 'editMethod', 'cources', 'lang'],
    template:
    '<tr>'+
        '<td align="left" width="5%">{{cources.indexOf(cource) + 1}}</td>'+
            '<td v-if="lang==1" align="left" width="35%">{{cource.courceName}} (Создатель - {{cource.user.lastname}} {{cource.user.firstname}})</td>'+
            '<td v-if="((lang!=1)&(cource.enCourceName!==null))"align="left" width="35%">{{cource.enCourceName}} (Creator - {{cource.user.lastname}} {{cource.user.firstname}})</td>'+
            '<td v-if="((lang!=1)&(cource.enCourceName===null))"align="left" width="35%">{{cource.courceName}} (Creator - {{cource.user.lastname}} {{cource.user.firstname}})</td>'+
            '<td v-if="lang!=1" style="text-align: center; width: 15%; align-content: center;">' +
                '<div v-if="cource.lections==null" class="alert alert-danger" role="alert">0 из {{cource.lectionsCount}}</div>' +
                '<div v-else-if="cource.lectionsCount > cource.lections.length" class="alert alert-danger" role="alert">{{cource.lections.length}} из {{cource.lectionsCount}}</div>' +
                '<div v-else class="alert alert-success" role="alert">{{cource.lections.length}} из {{cource.lectionsCount}}</div>' +
            '</td>'+
            '<td v-else style="text-align: center; width: 15%; align-content: center;">' +
                '<div v-if="cource.lections==null" class="alert alert-danger" role="alert">0 from {{cource.lectionsCount}}</div>' +
                '<div v-else-if="cource.lectionsCount > cource.lections.length" class="alert alert-danger" role="alert">{{cource.lections.length}} from {{cource.lectionsCount}}</div>' +
                '<div v-else class="alert alert-success" role="alert">{{cource.lections.length}} from {{cource.lectionsCount}}</div>' +
            '</td>'+

            '<td v-if="lang==1"  align="center" width="10%"><p v-if="cource.testEnable==0">Нет</p><p v-if="cource.testEnable==1">Вводное</p><p v-if="cource.testEnable==2">Промежуточное</p><p v-if="cource.testEnable==3">Вводное и финальное</p><p v-if="cource.testEnable==4">Вводное, финальное и промежуточное</p></td>'+
            '<td v-else align="center" width="10%"><p v-if="cource.testEnable==0">Not</p><p v-if="cource.testEnable==1">Entrance</p><p v-if="cource.testEnable==2">Intermediate</p><p v-if="cource.testEnable==3">Introductory and final</p><p v-if="cource.testEnable==4">Introductory, final and intermediate</p></td>'+
            '<td v-if="lang==1" align="left" width="35%">'+
                '<input style="margin: 2px;" v-show="((cource.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Лекции" @click="addlection" />'+
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Слушатели" @click="addStudents" />'+
                '<input v-if="((cource.testEnable==1)|| (cource.testEnable==3)||(cource.testEnable==4))" style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Вводное" @click="addInputTest" />'+
                '<input v-if="((cource.testEnable==3)||(cource.testEnable==4))"style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Финальное" @click="addFinalTest" />'+
                '<input style="margin: 2px;" v-show="(cource.user.id==$root.userId)" type = "button" class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
            '<td v-else align="left" width="35%">'+
                '<input style="margin: 2px;" v-show="((cource.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Lections" @click="addlection" />'+
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Listeners" @click="addStudents" />'+
                '<input v-if="((cource.testEnable==1)|| (cource.testEnable==3)||(cource.testEnable==4))" style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Entrance test" @click="addInputTest" />'+
                '<input v-if="((cource.testEnable==3)||(cource.testEnable==4))"style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Final test" @click="addFinalTest" />'+
                '<input style="margin: 2px;" v-show="(cource.user.id==$root.userId)" type = "button" class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
    '</tr>',
    methods: {
        edit: function(){
            if ((this.cource.user.id==userId)||(this.$root.isAdmin==1)) {
            this.$root.showInput =true;
            this.$root.editBeenClicked=true;
            this.$root.tempCource = this.cource;
            this.$root.editLectionsCount = this.cource.lections.length;
            // this.$root.editLectionsCount = this.cource.lectionsCount;
            this.editMethod(this.cource);
            } else {
                if (this.lang===1){
                    this.$root.alarmBoby="У Вас нет прав на изменение курса "+ this.cource.courceName + "!  Данный курс может изменить только его создатель - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                } else {
                    this.$root.alarmBoby="You are not entitled to change course "+ this.cource.courceName + "! This course can only be changed by its creator - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                }
                this.$root.showModal=true;
            }

        },
        addlection: function(){
            window.location.href = '/lectionmaker?courceId='+this.cource.id+'&courceName='+ this.cource.courceName + '&lectionCount='+ this.cource.lectionsCount+'&testEnable='+this.cource.testEnable;

        },
        addStudents: function(){

            //налепим суда пипкину тучу проверок наполнели ли лекции тестированием, если оно включено
            console.log("this.cource.lections.length: " + this.cource.lections.length);
            console.log("this.cource.lectionsCount: " + this.cource.lectionsCount);
            if(this.cource.lections.length !== this.cource.lectionsCount){
                this.$root.courceNotFineshed=true;
            } else{
                this.$root.courceNotFineshed=false;
            }
            var testCount =0;
            //проверка вводного тестирования
            if((this.cource.testEnable==1)||(this.cource.testEnable==3)||(this.cource.testEnable==4)){
                this.cource.noLectionTests.forEach(item=>{
                    if(item.testType==1){
                        if(item.defaultTest==1){

                            this.$root.enteranceTestFail=false;
                            if(item.questionsCount==item.questions.length){
                                this.$root.enteranceTestQuestionsFail=false;
                                item.questions.forEach(question=>{
                                    if(question.answersCount==question.answers.length){
                                        this.$root.enteranceTestAnswersFail=false;
                                    } else {
                                        this.$root.enteranceTestAnswersFail=true;
                                    }
                                })
                            } else {
                                this.$root.enteranceTestQuestionsFail=true;
                            }
                        } else{
                            this.$root.enteranceTestFail=true;

                        }
                        }
                })
            }

            //проверка промежуточного тестирования
            if ((this.cource.testEnable==4)||(this.cource.testEnable==2)){
                this.cource.lections.forEach(item =>
                    {lectionTest=item.test;
                    testCount++;

                    if (lectionTest.questionsCount==lectionTest.questions.length){

                        this.$root.questionCountMisMatch=false;
                        lectionTest.questions.forEach(testQuestion =>{
                            if (testQuestion.answersCount==testQuestion.answers.length){
                                this.$root.answerCountMisMatch=false;
                            } else {
                                this.$root.answerCountMisMatch=true;
                                this.$root.failedAnswersLections.push(item.lectionName);
                            }
                        })
                    } else {
                        this.$root.questionCountMisMatch=true;
                        this.$root.failedQuestionsLections.push(item.lectionName);
                    }
                })

                if(this.cource.lections.length==testCount){

                    this.$root.lectionDefaultTestNotExistAlert=false;
                } else {
                    this.$root.lectionDefaultTestNotExistAlert=true;
                }
                //проверка финального тестирования
                if((this.cource.testEnable==3)||(this.cource.testEnable==4)){
                    this.cource.noLectionTests.forEach(item=>{
                        if(item.testType==3){
                            if (item.defaultTest == 1) {
                                this.$root.finalTestFail = false;
                                if (item.questionsCount == item.questions.length) {
                                    this.$root.finalTestQuestionsFail = false;
                                    item.questions.forEach(question => {
                                        if (question.answersCount == question.answers.length) {
                                            this.$root.finalTestAnswersFail = false;
                                        } else {
                                            this.$root.finalTestAnswersFail = true;
                                        }
                                    })
                                } else {
                                    this.$root.finalTestQuestionsFail = true;
                                }
                            } else {
                                this.$root.finalTestFail = true;
                            }
                        }
                    })
                }
                }

            if((!this.$root.answerCountMisMatch)&(!this.$root.questionCountMisMatch)&(!this.$root.lectionDefaultTestNotExistAlert)
                &(!this.$root.finalTestFail)&(!this.$root.finalTestQuestionsFail)&(!this.$root.finalTestAnswersFail)
                &(!this.$root.enteranceTestFail)&(!this.$root.enteranceTestQuestionsFail)&(!this.$root.enteranceTestAnswersFail)
                &(!this.$root.courceNotFineshed)
            ){

                window.location.href = '/accesstocource?id='+this.cource.id;

            } else {

                this.$root.showModalCourceConsistenceAlert=true;
            }




        },
        addInputTest: function(){
            if (this.cource.user.id==userId) {
                window.location.href = '/testmaker?lectionName="' + this.cource.courceName + '"&courceId=' + this.cource.id+ '&testType=1';
                //window.location.href = '/testmaker?courceId=' + this.cource.id+ '&testType=1';
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы не являетесь автором данного курса! Добавить тест может только создатель курса!";
                } else {
                    this.$root.alarmBoby="You are not the author of this course! Only the course creator can add a test!";
                }
                this.$root.showModal=true;
            }

        },
        addFinalTest: function(){
            if (this.cource.user.id==userId) {
                window.location.href = '/testmaker?lectionName="' + this.cource.courceName + '"&courceId=' + this.cource.id+ '&testType=3';
                //window.location.href = '/testmaker?courceId=' + this.cource.id+ '&testType=3';
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы не являетесь автором данного курса! Добавить тест может только создатель курса!";
                } else {
                    this.$root.alarmBoby="You are not the author of this course! Only the course creator can add a test!";
                }
                this.$root.showModal=true;
            }

        },
        del: function() {
            if (this.cource.user.id==userId) {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы действительно хотитее удалить курс " + this.cource.courceName + "? Вместе с курсом будут удалены все зависимые материалы курса!";
                } else {
                    this.$root.alarmBoby="Do you really want to delete the course " + this.cource.courceName + "? All dependent course materials will be deleted along with the course!";
                }
                    this.$root.showModal=true;
                    this.$root.confirmModalAlert=true;
                    this.$root.deleteCourceAlarm=true;
                    this.$root.courceId = this.cource.id;
                    this.$root.cource = this.cource;
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="У Вас нет прав для удаления курса "+ this.cource.courceName + "!  Данный курс может удалить только его создатель - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                } else {
                    this.$root.alarmBoby="You are not authorized to delete a course "+ this.cource.courceName + "!  This course can only be deleted by its creator - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                }
                this.$root.showModal=true;
            }
        }
    }

});

Vue.component('cource-card' , {
    props: ['cource', 'editMethod', 'cources', 'lang'],
    template:

        '<div class="card">'+
            '<div v-if="((cource.lections==null) || (cource.lectionsCount > cource.lections.length))" class="card-header text-white bg-danger"># {{cources.indexOf(cource) + 1}}</div>'+
            '<div v-else class="card-header text-white bg-primary"># {{cources.indexOf(cource) + 1}}</div>'+
            '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li class="list-group-item"><b>Название: </b>{{cource.courceName}}</li>'+
                '<li v-if="cource.user!=null" class="list-group-item"><b>Создатель: </b>{{cource.user.lastname}} {{cource.user.firstname}}</li>'+
                '<li v-if="cource.lections==null" class="list-group-item "><b>Лекций заполнено: </b> 0 из {{cource.lectionsCount}}</li>'+
                '<li v-else class="list-group-item"><b>Лекций заполнено: </b>{{cource.lections.length}} из {{cource.lectionsCount}}</li>'+
                '<li v-if="cource.testEnable==0" class="list-group-item"><b>Тестирование: </b>Нет</li>'+
                '<li v-if="cource.testEnable==1" class="list-group-item"><b>Тестирование: </b>Вводное</li>'+
                '<li v-if="cource.testEnable==2" class="list-group-item"><b>Тестирование: </b>Промежуточное</li>'+
                '<li v-if="cource.testEnable==3" class="list-group-item"><b>Тестирование: </b>Вводное и финальное</li>'+
                '<li v-if="cource.testEnable==4" class="list-group-item"><b>Тестирование: </b>Вводное, финальное и промежуточное</li>'+
            '</ul>'+
            '<ul v-else class="list-group list-group-flush">'+
                '<li v-if="cource.enCourceName!==null" class="list-group-item"><b>Name: </b>{{cource.enCourceName}}</li>'+
                '<li v-else class="list-group-item"><b>Name: </b>{{cource.courceName}}</li>'+
                '<li v-if="cource.user!=null" class="list-group-item"><b>Creator: </b>{{cource.user.lastname}} {{cource.user.firstname}}</li>'+
                '<li v-if="cource.lections==null" class="list-group-item "><b>Lectures filled: </b> 0 from {{cource.lectionsCount}}</li>'+
                '<li v-else class="list-group-item"><b>Lectures filled: </b>{{cource.lections.length}} from {{cource.lectionsCount}}</li>'+
                '<li v-if="cource.testEnable==0" class="list-group-item"><b>Testing: </b>No</li>'+
                '<li v-if="cource.testEnable==1" class="list-group-item"><b>Testing: </b>Entrance</li>'+
                '<li v-if="cource.testEnable==2" class="list-group-item"><b>Testing: </b>Intermediate</li>'+
                '<li v-if="cource.testEnable==3" class="list-group-item"><b>Testing: </b>Entrance and final</li>'+
                '<li v-if="cource.testEnable==4" class="list-group-item"><b>Testing: </b>Entrance, final and intermediate</li>'+
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                    '<input style="margin: 2px;" v-show="((cource.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                    '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Лекции" @click="addlection" />'+
                    '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Слушатели" @click="addStudents" />'+
                    '<input style="margin: 2px;" v-if="((cource.testEnable==1)|| (cource.testEnable==3)||(cource.testEnable==4))" type = "button" class="btn btn-sm btn-success" value="Вводное" @click="addInputTest" />'+
                    '<input style="margin: 2px;" v-if="((cource.testEnable==3)||(cource.testEnable==4))" type = "button" class="btn btn-sm btn-success" value="Финальное" @click="addFinalTest" />'+
                    '<input style="margin: 2px;" v-show="(cource.user.id==$root.userId)" type = "button" class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 2px;" v-show="((cource.user.id==$root.userId)||($root.isAdmin==1))" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Edit" @click="edit" />' +
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Lections" @click="addlection" />'+
                '<input style="margin: 2px;" type = "button" class="btn btn-sm btn-success" value="Listeners" @click="addStudents" />'+
                '<input style="margin: 2px;" v-if="((cource.testEnable==1)|| (cource.testEnable==3)||(cource.testEnable==4))" type = "button" class="btn btn-sm btn-success" value="Enterence test" @click="addInputTest" />'+
                '<input style="margin: 2px;" v-if="((cource.testEnable==3)||(cource.testEnable==4))" type = "button" class="btn btn-sm btn-success" value="Final test" @click="addFinalTest" />'+
                '<input style="margin: 2px;" v-show="(cource.user.id==$root.userId)" type = "button" class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
        '</div>',
    methods: {
        edit: function(){
            if ((this.cource.user.id==userId)||(this.$root.isAdmin==1)) {
                this.$root.showInput =true;
                this.$root.editBeenClicked=true;
                this.$root.tempCource = this.cource;
                //this.$root.editLectionsCount = this.cource.lections.length;
                this.$root.editLectionsCount = this.cource.lectionsCount;
                this.editMethod(this.cource);
            } else {
                if (this.lang==1){
                    this.$root.alarmBoby="У Вас нет прав на изменение курса "+ this.cource.courceName + "!  Данный курс может изменить только его создатель - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                }  else {
                    this.$root.alarmBoby="You are not entitled to change course "+ this.cource.courceName + "!  This course can only be changed by its creator - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                }
                this.$root.showModal=true;
            }

        },
        addlection: function(){
            window.location.href = '/lectionmaker?courceId='+this.cource.id+'&courceName='+ this.cource.courceName + '&lectionCount='+ this.cource.lectionsCount+'&testEnable='+this.cource.testEnable;

        },
        addStudents: function(){

            //налепим суда пипкину тучу проверок наполнели ли лекции тестированием, если оно включено
            console.log("this.cource.lections.length: " + this.cource.lections.length);
            console.log("this.cource.lectionsCount: " + this.cource.lectionsCount);
            if(this.cource.lections.length !== this.cource.lectionsCount){
                this.$root.courceNotFineshed=true;
            } else{
                this.$root.courceNotFineshed=false;
            }
            var testCount =0;
            //проверка вводного тестирования
            if((this.cource.testEnable==1)||(this.cource.testEnable==3)||(this.cource.testEnable==4)){
                this.cource.noLectionTests.forEach(item=>{
                    if(item.testType==1){
                        if(item.defaultTest==1){

                            this.$root.enteranceTestFail=false;
                            if(item.questionsCount==item.questions.length){
                                this.$root.enteranceTestQuestionsFail=false;
                                item.questions.forEach(question=>{
                                    if(question.answersCount==question.answers.length){
                                        this.$root.enteranceTestAnswersFail=false;
                                    } else {
                                        this.$root.enteranceTestAnswersFail=true;
                                    }
                                })
                            } else {
                                this.$root.enteranceTestQuestionsFail=true;
                            }
                        } else{
                            this.$root.enteranceTestFail=true;

                        }
                    }
                })
            }

            //проверка промежуточного тестирования
            if ((this.cource.testEnable==4)||(this.cource.testEnable==2)){
                this.cource.lections.forEach(item =>
                {
                    item.tests.forEach(lectionTest =>

                    {
                        if (lectionTest.defaultTest==1){
                            testCount++;
                            //проверяем наполненность  вопросами
                            if (lectionTest.questionsCount==lectionTest.questions.length){
                                //идем проверять наполненность вопросов ответами
                                this.$root.questionCountMisMatch=false;

                                lectionTest.questions.forEach(testQuestion =>{
                                    if (testQuestion.answersCount==testQuestion.answers.length){
                                        this.$root.answerCountMisMatch=false;
                                    } else {
                                        this.$root.answerCountMisMatch=true;
                                        this.$root.failedAnswersLections.push(item.lectionName);


                                    }
                                })
                            } else {
                                this.$root.questionCountMisMatch=true;
                                this.$root.failedQuestionsLections.push(item.lectionName);
                            }
                        }
                    })
                })

                if(this.cource.lections.length==testCount){

                    this.$root.lectionDefaultTestNotExistAlert=false;
                } else {
                    this.$root.lectionDefaultTestNotExistAlert=true;
                }
                //проверка финального тестирования
                if((this.cource.testEnable==3)||(this.cource.testEnable==4)){
                    this.cource.noLectionTests.forEach(item=>{
                        if(item.testType==3){
                            if (item.defaultTest == 1) {
                                this.$root.finalTestFail = false;
                                if (item.questionsCount == item.questions.length) {
                                    this.$root.finalTestQuestionsFail = false;
                                    item.questions.forEach(question => {
                                        if (question.answersCount == question.answers.length) {
                                            this.$root.finalTestAnswersFail = false;
                                        } else {
                                            this.$root.finalTestAnswersFail = true;
                                        }
                                    })
                                } else {
                                    this.$root.finalTestQuestionsFail = true;
                                }
                            } else {
                                this.$root.finalTestFail = true;
                            }
                        }
                    })
                }

            }

            if((!this.$root.answerCountMisMatch)&(!this.$root.questionCountMisMatch)&(!this.$root.lectionDefaultTestNotExistAlert)
                &(!this.$root.finalTestFail)&(!this.$root.finalTestQuestionsFail)&(!this.$root.finalTestAnswersFail)
                &(!this.$root.enteranceTestFail)&(!this.$root.enteranceTestQuestionsFail)&(!this.$root.enteranceTestAnswersFail)
                &(!this.$root.courceNotFineshed)
            ){

                window.location.href = '/accesstocource?id='+this.cource.id;

            } else {

                this.$root.showModalCourceConsistenceAlert=true;
            }




        },
        addInputTest: function(){
            if (this.cource.user.id==userId) {
                window.location.href = '/testmaker?lectionName="' + this.cource.courceName + '"&courceId=' + this.cource.id+ '&testType=1';
                //window.location.href = '/testmaker?courceId=' + this.cource.id+ '&testType=1';
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы не являетесь автором данного курса! Добавить тест может только создатель курса!";
                }  else {
                    this.$root.alarmBoby="You are not the author of this course! Only the course creator can add a test!";
                }

                this.$root.showModal=true;
            }

        },
        addFinalTest: function(){
            if (this.cource.user.id==userId) {
                window.location.href = '/testmaker?lectionName="' + this.cource.courceName + '"&courceId=' + this.cource.id+ '&testType=3';
                //window.location.href = '/testmaker?courceId=' + this.cource.id+ '&testType=3';
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы не являетесь автором данного курса! Добавить тест может только создатель курса!";
                } else {
                    this.$root.alarmBoby="You are not the author of this course! Only the course creator can add a test!";
                }

                this.$root.showModal=true;
            }

        },
        del: function() {
            if (this.cource.user.id==userId) {
                if(this.lang==1){
                    this.$root.alarmBoby="Вы действительно хотитее удалить курс " + this.cource.courceName + "? Вместе с курсом будут удалены все зависимые материалы курса!";
                } else {
                    this.$root.alarmBoby="Do you really want to delete the course " + this.cource.courceName + "? All dependent course materials will be deleted along with the course!";
                }

                this.$root.showModal=true;
                this.$root.confirmModalAlert=true;
                this.$root.deleteCourceAlarm=true;
                this.$root.courceId = this.cource.id;
                this.$root.cource = this.cource;
            } else {
                if(this.lang==1){
                    this.$root.alarmBoby="У Вас нет прав для удаления курса "+ this.cource.courceName + "!  Данный курс может удалить только его создатель - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                } else {
                    this.$root.alarmBoby="You are not authorized to delete a course "+ this.cource.courceName + "! This course can only be deleted by its creator - "+this.cource.user.lastname+" "+this.cource.user.firstname+"!";
                }
                 this.$root.showModal=true;
            }
        }
    }

});

Vue.component('cources-list', {
    props: ['cources', 'groups', 'lang'],
    data: function(){
                return {
                    cource: null,
                    pageNumber: 0,
                    search: '',
                    showLoader:true,
                    tableView:'',
                    noteCount:'',
                }
    },
    watch: {
        tableView(newTableView) {
            if(newTableView){
                localStorage.courceTableView=1;
            } else{
                localStorage.courceTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.courceNoteCount != newNoteCount){
                localStorage.courceNoteCount = newNoteCount;
            }
        },
        search(newSearch) {
            if(localStorage.courceSearch != newSearch){
                localStorage.courceSearch = newSearch;
            }
        },
    },
    mounted() {
        if (localStorage.courceNoteCount) {
            this.noteCount = localStorage.courceNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.courceSearch) {
            this.search = localStorage.courceSearch;
        } else {
            this.search='';
        }

        if (localStorage.courceTableView) {
            if(localStorage.courceTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

        },

    template:
        '<div v-if="$root.showModal">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div class="modal-container">'+
                        '<div v-if="lang==1" class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Внимание!'+
                        '</div>'+
                        '<div v-else class="modal-title">'+
                            '<button class="close" @click="closeAlarmWindow">&times;</button>'+
                            'Attention!'+
                        '</div>'+

                        '<label for="custom-control custom-checkbox">{{$root.alarmBoby}}</label>'+
                        '<br>'+
                        '<div v-if="$root.deleteCourceAlarm">'+
                            '<label v-if="lang==1" for="custom-control custom-checkbox">Подтвердить:</label>'+
                            '<label v-else for="custom-control custom-checkbox">Confirm:</label>'+
                            '<div class="custom-control custom-checkbox">' +
                                '<b-form-checkbox type="checkbox" class="form-check-input" id="$root.confirmAlarm"  v-model="$root.confirmAlarm" switch></b-form-checkbox>'+
                            '</div>'+
                            '<br>'+
                        '</div>'+
                        '<div v-if="$root.confirmModalAlert" class="modal-footer">'+
                            '<button class="btn btn-primary" @click="confirmAlarm">Ок</button>'+
                            '<button v-if="lang==1" class="btn btn-danger" @click="closeAlarmWindow">Отмена</button>'+
                            '<button v-else class="btn btn-danger" @click="closeAlarmWindow">Cancel</button>'+
                        '</div>'+
                        '<div v-else class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeAlarmWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+

        '<div v-else-if="$root.showModalCourceConsistenceAlert">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div v-if="lang==1" class="modal-container">'+
                        '<div class="modal-title">'+
                            '<button class="close" @click="closeConsistenceAlarmWindow">&times;</button>'+
                            'Внимание!'+
                        '</div>'+
                        '<p>Не возможно добавить слушателей к тестированию! Устраните следующие ошибки:</p>'+
                        '<ul>' +
                            '<li v-if="$root.courceNotFineshed">Курс не содержит лекций, либо не наполнен в соответствии с заявленными параметрами!</li>'+
                            '<li v-if="$root.enteranceTestFail">К курсу не привязано входное тестирование, либо не выбрано входное тестирование по умолчанию!</li>'+
                            '<li v-if="$root.enteranceTestQuestionsFail">Проверьте наполнение входного тестирования по умолчанию вопросами!</li>'+
                            '<li v-if="$root.enteranceTestAnswersFail">Проверьте заполнения ответов на вопросы входного тестирования по умолчанию!</li>'+
                        '</ul>'+

                        '<ul>' +
                            '<li v-if="$root.lectionDefaultTestNotExistAlert">К одной или нескольким лекциям не привязано тестирование, либо не выбрано тестирование по умолчанию!</li>'+
                            '<li v-if="$root.questionCountMisMatch">Проверьте наполнение тестирования по умолчанию вопросами для следующих лекций:<ul><li v-for="value in $root.failedQuestionsLections">{{value}}</li></ul></li>'+
                            '<li v-if="$root.answerCountMisMatch">Проверьте наполнения ответов на вопросы тестирования по умолчанию для следующих лекций:<ul><li v-for="value in $root.failedAnswersLections">{{value}}</li></ul></li>'+
                        '</ul>'+
                        '<ul>' +
                            '<li v-if="$root.finalTestFail">К курсу не привязано финальное тестирование, либо не выбрано входное тестирование по умолчанию!</li>'+
                            '<li v-if="$root.finalTestQuestionsFail">Проверьте заполнение финального тестирования по умолчанию вопросами!</li>'+
                            '<li v-if="$root.finalTestAnswersFail">Проверьте наполнения ответов на вопросы финального тестирования по умолчанию!</li>'+
                        '</ul>'+

                        '<br>'+
                        '<div class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeConsistenceAlarmWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                    '<div v-else class="modal-container">'+
                        '<div class="modal-title">'+
                            '<button class="close" @click="closeConsistenceAlarmWindow">&times;</button>'+
                            'Attention!'+
                        '</div>'+
                        '<p>It is not possible to add listeners to testing! Resolve the following errors: </p>'+
                        '<ul>' +
                            '<li v-if="$root.courceNotFineshed">The course does not contain lectures, or is not filled in accordance with the declared parameters!</li>'+
                            '<li v-if="$root.enteranceTestFail">No entry testing is associated with the course, or entry testing is not selected by default!</li>'+
                            '<li v-if="$root.enteranceTestQuestionsFail">Check out the default entry testing content with questions!</li>'+
                            '<li v-if="$root.enteranceTestAnswersFail">Check out the default answers to the entrance testing questions!</li>'+
                        '</ul>'+

                        '<ul>' +
                            '<li v-if="$root.lectionDefaultTestNotExistAlert">Testing is not attached to one or several lectures, or testing is not selected by default!</li>'+
                            '<li v-if="$root.questionCountMisMatch">Check the default testing content with questions for the following lectures:<ul><li v-for="value in $root.failedQuestionsLections">{{value}}</li></ul></li>'+
                            '<li v-if="$root.answerCountMisMatch">Check the default test answers for the following lectures:<ul><li v-for="value in $root.failedAnswersLections">{{value}}</li></ul></li>'+
                        '</ul>'+
                        '<ul>' +
                            '<li v-if="$root.finalTestFail">Final testing is not attached to the course, or entrance testing is not selected by default!</li>'+
                            '<li v-if="$root.finalTestQuestionsFail">Check out the default final test filling with questions!</li>'+
                            '<li v-if="$root.finalTestAnswersFail">Check out the default final test answers!</li>'+
                        '</ul>'+

                        '<br>'+
                        '<div class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeConsistenceAlarmWindow">Ок</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+

        '<div v-else-if="($root.showLoader)" style="margin-top: 200px; margin-left: 360px; margin-bottom: 200px; margin-right: 360px; width: 800px; position: center;">'+
            '<div v-if="lang==1" class="spinner-border text-primary" role="status">'+
                '<span  class="sr-only">Загрузка...</span>'+
            '</div>'+
            '<div v-else class="spinner-border text-primary" role="status">'+
                '<span class="sr-only">Loading...</span>'+
            '</div>'+
        '</div>'+

        '<div v-else style="position: relative; ">'+
            '<cource-form :cources="cources" :courceAttr="cource" :groups="groups" :lang="lang" />'+
            '<div v-if="$root.showViewConfig">'+
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

            '<div v-if="($root.showInput==false)" class="card" style="margin-top: 15px;">'+
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
                                '<button v-show="search.length>0"  class="btn btn-danger" style="margin: 0px;"   @click="clearSearch" type="button">Clear</button>'+
                            '</div>'+
                        '</div>'+


                    '<div v-if="tableView">'+
                        '<table v-if="($root.editClicked == false)"   class="table">'+
                            '<thead>'+
                                '<tr v-if="lang==1">'+
                                    '<th width="5%"  scope="col" style="text-align: center">#</th>'+
                                    '<th width="35%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byСourceName" @click="byСourceName">Название</a></th>'+
                                    '<th width="15%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionsCount" @click="byLectionsCount">Лекций</a></th>'+
                                    '<th width="10%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byTest" @click="byTest">Тестирование</a></th>'+
                                    '<th width="35%"  scope="col" style="text-align: center">Действие</th>'+
                                '</tr>'+
                                '<tr v-else>'+
                                    '<th width="5%"  scope="col" style="text-align: center">#</th>'+
                                    '<th width="35%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byСourceName" @click="byСourceName">Name</a></th>'+
                                    '<th width="15%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byLectionsCount" @click="byLectionsCount">Lectures</a></th>'+
                                    '<th width="10%"  scope="col" style="text-align: center"><a href="#"  v-bind:class="byTest" @click="byTest">Test</a></th>'+
                                    '<th width="35%"  scope="col" style="text-align: center">Action</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                                '<cource-row v-for="cource in paginatedData" :key="cource.id" :cource = "cource" ' +
                                    ':editMethod="editMethod" :cources="cources" :lang="lang"/>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>'+
                    '<div v-else>'+
                        '<hr>'+
                        '<div class="card-columns">'+
                            '<cource-card v-for="cource in paginatedData" :key="cource.id" :cource = "cource" ' +
                            ':editMethod="editMethod" :cources="cources" :lang="lang"/>' +
                        '</div>'+
                        '<hr>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div v-if="(((pageCount!=1)&&($root.editClicked ==false)&&($root.showInput==false))&(lang==1))"  align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
            '<div v-if="(((pageCount!=1)&&($root.editClicked ==false)&&($root.showInput==false))&(lang==2))"  align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}}   <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
        '</div>'+

    '</div>',




    methods: {
        closeConsistenceAlarmWindow: function(){
            this.$root.lectionDefaultTestNotExistAlert=false;
            this.$root.questionCountMisMatch=false;
            this.$root.answerCountMisMatch=false;
            this.$root.showModalCourceConsistenceAlert=false;
            this.$root.failedQuestionsLections=[];
            this.$root.failedAnswersLections=[];

            this.$root.finalTestFail=false;
            this.$root.finalTestQuestionsFail=false;
            this.$root.finalTestAnswersFail=false;

            this.$root.enteranceTestFail=false;
            this.$root.enteranceTestQuestionsFail=false;
            this.$root.enteranceTestAnswersFail=false;


        },
        confirmAlarm: function() {
            //this.$root.confirmAlarm=true;
            this.$root.showModal = false;
            this.$root.alarmBoby = '';

            if (this.$root.confirmAlarm) {
                this.$root.confirmAlarm = false;
                courceApi.remove({id: this.$root.cource.id}).then(result => {
                    if (result.ok) {
                        const index = this.cources.findIndex(item => item.id === this.$root.cource.id)
                        console.log("Index:" + index);
                        if(index> -1){
                            this.cources.splice(this.cources.indexOf(this.$root.cource), 1);
                        }
                    }
                })
            }
        },
        clearSearch: function(){
            this.search='';
        },
        closeAlarmWindow: function(){
            this.$root.confirmAlarm=false;
            this.$root.showModal=false;
            this.$root.alarmBoby='';
        },
        closeViewConfigWindow: function(){
            this.$root.showViewConfig=false;
        },
        editMethod: function(cource){
            this.cource = cource;
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        },
        byСourceName: function () {
            this.$root.sortKey = "courceName";
        },
        byLectionsCount: function () {
            this.$root.sortKey = "lectionsCount";
        },
        byTest: function () {
            this.$root.sortKey = "testEnable";
        },

    },
    computed: {
        sortedCources() {

            const k = this.$root.sortKey;
            console.log("Sort key "+ k);
            console.log("coutces lengh: " + this.cources.length);
            return this.cources.sort(dynamicSort(k));
        },
        filteredCources() {
            const s = this.search.toLowerCase();
            //return this.sortedUsers.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedCources.filter(sortedUser =>
                _.some(sortedUser, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));


        },
        pageCount(){
            console.log("this.noteCount: "+ parseInt(this.noteCount));
            let l = this.filteredCources.length,
                s = parseInt(this.noteCount);
            console.log("page count: " + Math.ceil(l/s) )
            return Math.ceil(l/s);
        },
        paginatedData(){
            console.log("this.noteCount: "+parseInt(this.noteCount));

            const start = this.pageNumber * parseInt(this.noteCount),
                end = start + parseInt(this.noteCount);
            console.log("start: " + start);
            console.log("end: " + end);

            return this.filteredCources.slice(start, end);

        }
    },

});




var app;

connect()

app = new Vue({
    el: '#app',
    template:
    '<div>'+
    '<cources-list :cources="cources" :groups="groups" :lang="lang" /> ' +
    '</div>',
    data: {
        cources:[],
        groups:[],
        courceNameAlert:'',
        courceDescriptionAlert:'',
        lectionCountAlert:'',
        testEnableAlert:'',
        lectionUrl:'',
        editClicked:false,
        editBeenClicked:false,
        showInput:false,
        tempCource: null,
        userId:'',
        sortKey: 'courceName',

        showModal: false,
        alarmBoby:'',
        confirmAlarm:false,
        confirmModalAlert:false,
        deleteCourceAlarm:false,
        courceId:'',
        cource:'',
        isSuccessDeleted:false,

        editLectionCountAlert:false,
        editLectionCountAlertBody:'',
        editLectionsCount:0,

        lectionsCountNotEnoughAlert:false,
        lectionsCountNotEnoughAlertBody:'',

        showModalCourceConsistenceAlert:false,
        answerCountMisMatch:false,
        questionCountMisMatch:false,
        lectionDefaultTestNotExistAlert:false,
        failedQuestionsLections:[],
        failedAnswersLections:[],

        finalTestFail:false,
        finalTestQuestionsFail:false,
        finalTestAnswersFail:false,

        enteranceTestFail:false,
        enteranceTestQuestionsFail:false,
        enteranceTestAnswersFail:false,
        courceNotFineshed:false,
        isAdmin:false,
        showViewConfig:false,

        showLoader:true,

        lang:'',

    },


    created: function () {

        courceApi.get().then(result =>
            result.json().then(data =>{
                this.cources=data
            }).then(this.$root.showLoader=false)
    );

        axios.get('/nav').then(result => {
            this.nav=result.data;
                this.$root.userId = result.data.id;
                if(result.data.roles.includes("ADMIN")){
                    this.$root.isAdmin =1;
                    console.log("contains admin role");
                } else{
                    console.log("no admin role");
                }
        });

        axios.get('/usergroup').then(result => {
            this.groups=result.data
        });



    addHandler(data=> {
    if (data.objectType === 'COURCE') {
        const index = this.cources.findIndex(item => item.id === data.body.id)
        if( (data.body.creatorId===window.userId) || (data.body.userGroup===window.userGroup) ){
            switch (data.eventType) {
                case 'CREATE':
                case 'UPDATE':

                    if (data.body.isDeleted){
                        if (index > -1) {
                            this.cources.splice(index, 1)
                            this.cources =  this.cources.sort((a, b) => (a.courceName - b.courceName))
                        }
                        break
                    }
                    if (index > -1) {
                        this.cources.splice(index, 1, data.body)
                         this.cources =  this.cources.sort((a, b) => (a.courceName - b.courceName))
                    } else {
                        this.cources.push(data.body)}
                    this.cources =  this.cources.sort((a, b) => (a.courceName - b.courceName))
                    break
                case 'REMOVE':
                    this.cources.splice(index, 1)
                    this.cources =  this.cources.sort((a, b) => (a.courceName - b.courceName))
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

    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }}
});