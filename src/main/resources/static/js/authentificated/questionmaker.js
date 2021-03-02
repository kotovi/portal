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

function is_empty(x) {
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
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
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

var questionApi = Vue.resource('/question{/id}');
var testInfoApi = Vue.resource('/test/testById/{id}');

Vue.component('question-form', {
    props: ['questions', 'questionAttr', 'lang'],
    data: function() {
        return {
            id:'',
            testId:'',
            questionBody:'',
            answersCount:'',
        }
    },

    watch:{
        questionAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.testId = newVal.testId;
            this.questionBody = newVal.questionBody;
            this.answersCount = newVal.answersCount;
        }
    },
    template:
        '<div>'+
        '<form>'+
            '<div class="card" v-if="$root.showInputForm" style="margin: 5px;">'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Параметры вопроса</h5><h5 v-else>Question options</h5></div>'+
                    '<div class="card-body">'+
                        '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="questionBody">Вопрос</label>'+
                            '<textarea  type="text" class="form-control" id="questionBody" v-model="questionBody" placeholder="Вопрос"></textarea>'+
                            '<p class="alert alert-danger" v-show="$root.questionBodyAlert" >Необходимо указать тело вопроса</p>'+
                        '</div>'+
                        '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="questionBody">Question</label>'+
                            '<textarea  type="text" class="form-control" id="questionBody" v-model="questionBody" placeholder="Question"></textarea>'+
                            '<p class="alert alert-danger" v-show="$root.questionBodyAlert" >You must specify the body of the question</p>'+
                        '</div>'+

                        '<div v-if="lang==1"  class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="questionBody">Количество ответов на вопрос</label>'+
                            '<select class="custom-select" id="answersCount" v-model="answersCount">'+
                                '<option selected>Выбрать...</option>'+
                                '<option :value="n" v-for=" n in 10">{{n}}</option>'+
                            '</select>'+
                            '<p class="alert alert-danger" v-show ="$root.answersCountAlert">Укажите количество ответов на вопрос</p>'+
                        '</div>'+
                        '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="questionBody">Number of answers to the question</label>'+
                            '<select class="custom-select" id="answersCount" v-model="answersCount">'+
                                '<option selected>Select...</option>'+
                                '<option :value="n" v-for=" n in 10">{{n}}</option>'+
                            '</select>'+
                            '<p class="alert alert-danger" v-show ="$root.answersCountAlert">Indicate the number of answers to the question</p>'+
                        '</div>'+
                    '</div>'+
                    '<div class="card-footer">'+
                        '<div v-if="lang==1" class="col-sm-10">'+
                            '<input style="margin: 5px;" v-if="(($root.editClicked == false) )" type="button"  class="btn btn-primary " value="Добавить" @click="save">'+
                            '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button"  class="btn btn-primary " value="Сохранить" @click="save">'+
                            '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Отменить" @click="cancelAddQuestion">'+
                        '</div>'+
                        '<div v-else class="col-sm-10">'+
                            '<input style="margin: 5px;" v-if="(($root.editClicked == false) )" type="button"  class="btn btn-primary " value="Create" @click="save">'+
                            '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button"  class="btn btn-primary " value="Save" @click="save">'+
                            '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Cancel" @click="cancelAddQuestion">'+
                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</form>'+
            '</div>',



    methods: {


        cancelAddQuestion: function(){
            if(this.$root.editClicked){
                this.$root.editClicked=false;
            } else {

                this.questionBody='';
                this.answersCount='';

            }

            this.$root.showInputForm=false;
           // this.question = this.$root.tempQuestion;

        },
        save: function () {

            var question = {
                testId:this.$root.testId,
                questionBody: capitalizeFirstLetter(this.questionBody),
                answersCount: this.answersCount,
            };

            if (is_empty(this.questionBody)) {
                this.$root.questionBodyAlert = true;
            } else {
                this.$root.questionBodyAlert = false;
            }

            if (!isNumeric(this.answersCount)) {

                this.$root.answersCountAlert = true;
            } else {
                this.$root.answersCountAlert = false;
            }

            if ((!this.$root.questionBodyAlert) &&
                (!this.$root.answersCountAlert)
            ) {

                    if (this.id) {
                            this.$root.editClicked = false;
                            this.$root.showInputForm = false;

                            questionApi.update({id: this.id}, question).then(result =>
                                result.json().then(data => {
                                    var index = getIndex(this.questions, data.id);
                                    this.questions.splice(index, 1, data);
                                    this.id = ''
                                    this.questionBody = ''
                                    this.answersCount = ''
                                })
                             )
                    } else {
                        console.log(question);
                            this.$root.defaultquestionConflictAlert=false;
                            this.$root.showInputForm = false;

                            questionApi.save({}, question).then(result =>
                                result.json().then(data => {
                                    this.questions.push(data);
                                    this.questionBody = ''
                                    this.answersCount = ''
                                })
                        )
                    }
            }
        }
    }
});

Vue.component('question-row' , {
    props: ['question', 'editMethod', 'questions', 'lang'],
    template:
        '<tr v-if="lang==1">'+
                '<td style="width: 30%; text-align: center;">{{question.questionBody}}</td>'+
                '<td style="text-align: center; width: 20%">' +
                    '<div v-if="question.answers==null" class="alert alert-danger" role="alert">Заполнено 0 из {{question.answersCount}}</div>' +
                    '<div v-else-if="question.answersCount > question.answers.length" class="alert alert-danger" role="alert">Заполнено {{question.answers.length}} из {{question.answersCount}}</div>' +
                    '<div v-else class="alert alert-success" role="alert">Заполнено {{question.answers.length}} из {{question.answersCount}}</div>' +
                '</td>'+
                '<td style="width: 40%; text-align: center;">'+
                    '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Ответы" @click="addAnswers" />'+
                    '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />'+
                    '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
                '</td >'+
        '</tr>'+
        '<tr v-else>'+
            '<td v-if="(question.enQuestionBody==null)" style="width: 30%; text-align: center;">{{question.questionBody}}</td>'+
            '<td v-if="(question.enQuestionBody!=null)" style="width: 30%; text-align: center;">{{question.enQuestionBody}}</td>'+
            '<td  style="text-align: center; width: 20%">' +
                '<div v-if="question.answers==null" class="alert alert-danger" role="alert">Filled in 0 from {{question.answersCount}}</div>' +
                '<div v-else-if="question.answersCount > question.answers.length" class="alert alert-danger" role="alert">Filled in {{question.answers.length}} from {{question.answersCount}}</div>' +
                '<div v-else class="alert alert-success" role="alert">Filled in {{question.answers.length}} from {{question.answersCount}}</div>' +
            '</td>'+
            '<td  style="width: 40%; text-align: center;">'+
                '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Answers" @click="addAnswers" />'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td >'+
        '</tr>'

    ,
    methods: {
        edit: function(){
            this.$root.showInputForm=true;
            this.editMethod(this.question);

        },
        addAnswers: function(){
            window.location.href = '/answermaker?questionId='+this.question.id;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Перед удалением записи необходимо завершить редактирование!");
            } else {
                questionApi.remove({id: this.question.id}).then(result => {
                    if (result.ok) {
                    this.questions.splice(this.questions.indexOf(this.question), 1)

                }
            })
            }

        }
    }

});

Vue.component('question-card' , {
    props: ['question', 'editMethod', 'questions', 'lang'],
    template:
        '<div class="card">'+
            '<div v-if="lang==1" class="card-header text-white bg-primary">Вопрос # {{questions.indexOf(question) + 1}}</div>'+
            '<div v-if="lang!=1" class="card-header text-white bg-primary">Question # {{questions.indexOf(question) + 1}}</div>'+
            '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li  class="list-group-item" ><b>Вопрос: </b>{{question.questionBody}}</li>' +
                '<li v-if="question.answers==null" class="list-group-item"><b>Ответы: </b>Заполнено 0 из {{question.answersCount}}</li>' +
                '<li v-else-if="question.answersCount > question.answers.length" class="list-group-item"><b>Ответы: </b>Заполнено {{question.answers.length}} из {{question.answersCount}}</li>' +
                '<li v-else class="list-group-item"><b>Ответы: </b>Заполнено {{question.answers.length}} из {{question.answersCount}}</li>' +
            '</ul>'+
            '<ul v-else class="list-group list-group-flush">'+
                '<li v-if="question.enQuestionBody!=null" class="list-group-item" >{{question.enQuestionBody}}</li>' +
                '<li v-else class="list-group-item" ><b>Questions: </b>{{question.questionBody}}</li>' +
                '<li v-if="question.answers==null" class="list-group-item" ><b>Answers: </b>Filled in 0 from {{question.answersCount}}</li>' +
                '<li v-else-if="question.answersCount > question.answers.length" class="list-group-item"><b>Answers: </b>Filled in {{question.answers.length}} from {{question.answersCount}}</li>' +
                '<li v-else class="list-group-item"><b>Answers: </b>Filled in {{question.answers.length}} from {{question.answersCount}}</li>' +
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Ответы" @click="addAnswers" />'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Answers" @click="addAnswers" />'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</div>'+
        '</div>',

    methods: {
        edit: function(){
            this.editMethod(this.question);
            this.$root.showInputForm=true;
        },
        addAnswers: function(){
            window.location.href = '/answermaker?questionId='+this.question.id;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением записи необходимо завершить редактирование!");
            } else {
                questionApi.remove({id: this.question.id}).then(result => {
                    if (result.ok) {
                        this.questions.splice(this.questions.indexOf(this.question), 1)
                    }
                })
            }

        }
    }


});

Vue.component('questions-list', {
    props: ['questions', 'test', 'lang'],
    data: function(){
        return {
            question: null,
            pageNumber: 0,
            search: '',
            tableView:'',
            noteCount:'',
        }
    },

    template:
        '<div style="position: relative;">'+

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
        '<option value="10">10</option>'+
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

            '<div>'+
                '<h1 v-if="((lang==1)||((lang!=1)&(test.enTestName==null)))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Вопросы для тестирования: \"{{test.testName}}\"</h1>'+
                '<h1 v-if="((lang!=1)&(test.enTestName!=null))" class="display-4 mt-5 mb-5" style="padding-top:20px;">Вопросы для тестирования: \"{{test.enTestName}}\"</h1>'+


                '<input v-if="((questions.length < test.questionsCount)&(lang==1))" style="margin: 5px;" type = "button" class="btn btn-primary" value="Добавить вопрос" @click="addQuestion" />'+
                '<input v-if="((questions.length < test.questionsCount)&(lang!=1))" style="margin: 5px;" type = "button" class="btn btn-primary" value="Create question" @click="addQuestion" />'+

                '<input v-if="lang==1" style="margin: 5px;" type = "button" class="btn btn-primary" value="К тестированиям" @click="backToTestList" />'+
                '<input v-else style="margin: 5px;" type = "button" class="btn btn-primary" value="Back to tests" @click="backToTestList" />'+

                '<input v-if="lang==1" style="margin: 5px;" type = "button" class="btn btn-primary" value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig" />'+
                '<input v-else style="margin: 5px;" type = "button" class="btn btn-primary" value="Display options" @click="$root.showViewConfig=!$root.showViewConfig" />'+
            '</div>'+
            '<question-form :questions="questions" :questionAttr="question" :test="test" :lang="lang"/>'+

            '<div class="card" v-if="$root.showInputForm==false" style="margin: 5px; width: 90%;">'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Добавленные вопросы</h5><h5 v-else>Added questions</h5></div>'+

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
                            '<table class="table">'+
                                '<thead>'+
                                    '<tr v-if="lang==1">'+
                                        '<th style="width: 30%; text-align: center;" scope="col"><a href="#"  v-bind:class="byQuestionBody" @click="byQuestionBody">Вопрос</a></th>'+
                                        '<th style="width: 30%; text-align: center;" scope="col"><a href="#"  v-bind:class="byAnswerCount" @click="byAnswerCount">Ответов</a></th>'+
                                        '<th style="width: 40%; text-align: center;" scope="col">Действие</th>'+
                                    '</tr>'+
                                    '<tr v-else>'+
                                        '<th style="width: 30%; text-align: center;" scope="col"><a href="#"  v-bind:class="byQuestionBody" @click="byQuestionBody">Question</a></th>'+
                                        '<th style="width: 30%; text-align: center;" scope="col"><a href="#"  v-bind:class="byAnswerCount" @click="byAnswerCount">Answer count</a></th>'+
                                        '<th style="width: 40%; text-align: center;" scope="col">Action</th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody>'+
                                    '<question-row v-for="question in paginatedData" :key="question.id" :question = "question" ' +
                                    ':editMethod="editMethod" :questions="questions" :lang="lang"/>' +
                                '</tbody>' +
                            '</table>'+
                        '</div>'+
                        '<div v-else>'+
                            '<hr>'+
                            '<div class="card-columns">'+
                                '<question-card v-for="question in paginatedData" :key="question.id" :question = "question" ' +
                                ':editMethod="editMethod" :questions="questions" :lang="lang"/>' +
                            '</div>'+
                            '<hr>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang==1))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
                '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang!=1))" align="center" style="margin: 15px;">'+
                    '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
                '</div>'+
        '</div>',

    watch:{
        search(newSearch){
            if(localStorage.questionSearch!=newSearch){
                localStorage.questionSearch=newSearch
            }
        },
        tableView(newTableView) {
            if(newTableView){
                localStorage.questionTableView=1;
            } else{
                localStorage.questionTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.questionNoteCount != newNoteCount){
                localStorage.questionNoteCount = newNoteCount;
            }
        },
    },
    mounted(){
        if(localStorage.questionSearch){
            this.search=localStorage.questionSearch;
        } else {
            this.search='';
        }

        if (localStorage.questionNoteCount) {
            this.noteCount = localStorage.questionNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.questionTableView) {
            if(localStorage.questionTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }
    },
    computed: {
        sortedQuestions() {
            const k = this.$root.sortKey;
            return this.questions.sort(dynamicSort(k));
        },
        filteredQuestions() {
            const s = this.search.toLowerCase();
            //return this.sortedUsers.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedQuestions.filter(sortedUser =>
                _.some(sortedUser, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));


        },
        pageCount(){
            let l = this.filteredQuestions.length,
                s = 10;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * 10,
                end = start + 10;

            return this.filteredQuestions.slice(start, end);

        }
    },
    methods: {
        clearSearch: function (){
            this.search='';
        },
        closeViewConfigWindow: function (){
            this.$root.showViewConfig=false;
        },
        backToTestList: function(){
          window.location.href = '/testmaker';
        },
        editMethod: function (question) {
            this.question = question;
        },
        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        },
        byQuestionBody: function () {
            this.$root.sortKey = "questionBody";
        },
        byAnswerCount: function () {
            this.$root.sortKey = "answersCount";
        },

        addQuestion: function () {
            this.$root.showInputForm = true;
        },
    }
});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; width: 90%;">'+
            '<questions-list :questions="questions" :test="test" :lang="lang" /> ' +
        '</div>',
    data: {
        questions: [],
        test:'',
        tempQuestion:null,
        questionBodyAlert:false,
        answersCountAlert:false,
        answersCountOverloadAlert:false,
        testId: testId,
        editClicked:false,
        showInputForm:false,
        sortKey:'questionBody',
        showViewConfig: false,
        lang:''

    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {
        questionApi.get({id: this.$root.testId}).then(result =>
            result.json().then(data =>
                { this.questions = data;
                }));
        testInfoApi.get({id: this.$root.testId}).then(result =>
            result.json().then(data =>
            { this.test = data;
            }));
    },
});