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

var answerApi = Vue.resource('/answer{/id}');
var questionInfoApi = Vue.resource('/question/info{/id}');

Vue.component('answer-form', {
    props: ['answers', 'answerAttr', 'question', 'lang'],
    data: function() {
        return {
            id:'',
            questionId:'',
            answerBody:'',
            answerIsTrue:2,
            testId:'',
        }
    },

    watch:{
        answerAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.questionId = newVal.questionId;
            this.answerBody = newVal.answerBody;
            this.answerIsTrue = newVal.answerIsTrue;
            this.testId = newVal.testId;

        }
    },
    template:
        '<div>'+

        '<div class="card" v-if="$root.showInputForm" style="margin: 5px;">'+
            '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Параметры ответа</h5><h5 v-else>Response options </h5></div>'+
            '<div class="card-body">'+
                '<form>'+

                    '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="answerBody">Вопрос</label>'+
                        '<textarea  type="text" class="form-control" id="answerBody" v-model="answerBody" placeholder="Ответ"></textarea>'+
                        '<p class="alert alert-danger" v-show="$root.answerBodyAlert" >Необходимо указать тело ответа</p>'+
                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="answerBody">Question</label>'+
                        '<textarea  type="text" class="form-control" id="answerBody" v-model="answerBody" placeholder="Answer"></textarea>'+
                        '<p class="alert alert-danger" v-show="$root.answerBodyAlert" >You must specify the body of the answer</p>'+
                    '</div>'+

                    '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="answerBody">Ответ верен?</label>'+

                            '<select class="custom-select" id="answerIsTrue" v-model="answerIsTrue">'+
                                '<option value="2">Выбрать...</option>'+
                                '<option value="1">Да</option>'+
                                '<option value="0">Нет</option>'+
                            '</select>'+
                            '<p class="alert alert-danger" v-show ="$root.answerIsTrueAlert">Укажите Верен ли ответ!</p>'+

                    '</div>'+
                    '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                        '<label for="answerBody">Is the answer correct?</label>'+

                            '<select class="custom-select" id="answerIsTrue" v-model="answerIsTrue">'+
                                '<option value="2">Select...</option>'+
                                '<option value="1">Yes</option>'+
                                '<option value="0">No</option>'+
                            '</select>'+
                            '<p class="alert alert-danger" v-show ="$root.answerIsTrueAlert">Indicate whether the answer is correct!</p>'+
                    '</div>'+
                '</form>'+
        '</div>'+
        '<div  class="card-footer">'+
        '<div v-if="lang==1">'+
        '<input style="margin: 5px;" v-if="(($root.editClicked == false)&&(this.answers.length < Number(question.answersCount)))"  type="button"  class="btn btn-primary " value="Создать" @click="save">'+
        '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button"  class="btn btn-primary " value="Сохранить" @click="save">'+
        '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Отменить" @click="cancelAddAnswer">'+
        '</div>'+
        '<div v-else>'+
        '<input style="margin: 5px;" v-if="(($root.editClicked == false)&&(this.answers.length < Number(question.answersCount)))"  type="button"  class="btn btn-primary " value="Create" @click="save">'+
        '<input style="margin: 5px;" v-if="$root.editClicked==true" type="button"  class="btn btn-primary " value="Save" @click="save">'+
        '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Cancel" @click="cancelAddAnswer">'+
        '</div>'+
        '</div>'+
        '</div>'+

        '</div>'+

        '</div>',



    methods: {


        cancelAddAnswer: function(){
            if(this.$root.editClicked){
                this.$root.editClicked=false;
            } else {
                //this.id = ''
                this.answerBody = ''
                this.answerIsTrue = ''
                this.testId = ''
            }
            this.$root.showInputForm=false;
        },
        save: function () {
            var answer = {
                answerBody: capitalizeFirstLetter(this.answerBody),
                questionId: this.$root.questionId.toString(),
                answerIsTrue: this.answerIsTrue,
            };


            if (is_empty(this.answerBody)) {
                this.$root.answerBodyAlert = true;
            } else {
                this.$root.answerBodyAlert = false;
            }

            if (parseInt(this.answerIsTrue)==2) {

                this.$root.answerIsTrueAlert = true;
            } else {
                this.$root.answerIsTrueAlert = false;
            }

            if ((!this.$root.answerBodyAlert) &&
                (!this.$root.answerIsTrueAlert)
            ) {

                if (this.id) {

                    this.$root.editClicked = false;
                    this.$root.showInputForm=false;

                    answerApi.update({id: this.id}, answer).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.answers, data.id);
                    this.answers.splice(index, 1, data);

                    this.id = ''
                    this.answerBody = ''
                    this.answerIsTrue = 2
                    this.testId = ''
                })
                )
                } else {

                    this.$root.defaultanswerConflictAlert=false;
                    this.$root.showInputForm=false;
                    answerApi.save({}, answer).then(result =>
                    result.json().then(data => {
                        this.answers.push(data);
                    this.answerBody = ''
                    this.answerIsTrue = 2
                    this.testId = ''
                })
                )
                }
            }
        }
    }
});

Vue.component('answer-row' , {
    props: ['answer', 'editMethod', 'answers', 'lang'],
    template:
        '<tr v-if="lang==1">'+
            '<td width="60%" >{{answer.answerBody}}</td>'+
            '<td width="10%" v-if="answer.answerIsTrue==1">Да</td>'+
            '<td width="10%" v-if="answer.answerIsTrue!=1">Нет</td>'+
            '<td width="30%" >'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-primary" value="Изменить" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />' +
            '</td>'+
        '</tr>'+
        '<tr v-else>'+
            '<td v-if="answer.enAnswerBody!=null" width="60%" >{{answer.enAnswerBody}}</td>'+
            '<td v-else width="60%" >{{answer.answerBody}}</td>'+
            '<td width="10%" v-if="answer.answerIsTrue==1">Yes</td>'+
            '<td width="10%" v-if="answer.answerIsTrue!=1">No</td>'+
            '<td width="30%" >'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-primary" value="Change" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />' +
            '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.answer);
            this.$root.showInputForm=true;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением записи необходимо завершить редактирование!");
            } else {
                answerApi.remove({id: this.answer.id}).then(result => {
                    if (result.ok) {
                    this.answers.splice(this.answers.indexOf(this.answer), 1)
                }
            })
            }

        }
    }

});

Vue.component('answer-card' , {
    props: ['answer', 'editMethod', 'answers', 'lang'],
    template:
        '<div class="card">'+
            '<div v-if="lang==1"  class="card-header text-white bg-primary">Ответ # {{answers.indexOf(answer) + 1}}</div>'+
            '<div v-else class="card-header text-white bg-primary">Answer # {{answers.indexOf(answer) + 1}}</div>'+
            '<ul v-if="lang==1" class="list-group list-group-flush">'+
                '<li  class="list-group-item"><b>Ответ: </b>{{answer.answerBody}}</li>' +
                '<li v-if="answer.answerIsTrue==1" class="list-group-item"><b>Ответ верный: </b>Да</li>' +
                '<li v-if="answer.answerIsTrue==0" class="list-group-item"><b>Ответ верный: </b>Нет</li>' +
            '</ul>'+
            '<ul v-else class="list-group list-group-flush">'+
                '<li v-if="answer.enAnswerBody==null" class="list-group-item"><b>Answer: </b>{{answer.answerBody}}</li>' +
                '<li v-else class="list-group-item"><b>Answer: </b>{{answer.enAnswerBody}}</li>' +
                '<li v-if="answer.answerIsTrue==1" class="list-group-item"><b>The answer is correct: </b>Yes</li>' +
                '<li v-if="answer.answerIsTrue==0" class="list-group-item"><b>The answer is correct: </b>No</li>' +
            '</ul>'+
            '<div v-if="lang==1" class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-primary" value="Изменить" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />' +
            '</div>'+
            '<div v-else class="card-footer">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-primary" value="Change" @click="edit" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-danger" value="X" @click="del" />' +
            '</div>'+
        '</div>',

    methods: {
        edit: function(){
            this.editMethod(this.answer);
            this.$root.showInputForm=true;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением записи необходимо завершить редактирование!");
            } else {
                answerApi.remove({id: this.answer.id}).then(result => {
                    if (result.ok) {
                        this.answers.splice(this.answers.indexOf(this.answer), 1)
                    }
                })
            }

        }
    }


});

Vue.component('answers-list', {
    props: ['answers', 'lang', 'question'],
    data: function(){
        return {
            answer: null,
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
        '<option value="10">10</option>'+
        '<option value="15">15</option>'+

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

        '<div v-if="lang==1">'+
            '<h1 class="display-4 mt-5 mb-5" style="padding-top:20px;" >Ответы для вопроса: \"{{question.questionBody}}\"</h1>'+
            '<input style="margin: 5px;" v-if="(this.answers.length < Number(question.answersCount))" type = "button" class="btn btn-primary" value="Добавить" @click="addAnswer" />'+
            '<input style="margin: 5px;" type = "button" class="btn btn-primary" value="К вопросам" @click="backToQuestionList" />'+
            '<input style="margin: 5px;"  type="button" class="btn btn-primary " value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
        '</div>'+
        '<div v-else>'+
            '<h1 v-if="question.enQuestionBody!=null" class="display-4 mt-5 mb-5" style="padding-top:20px;" >Answers for the question: \"{{question.enQuestionBody}}\"</h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;" >Answers for the question: \"{{question.questionBody}}\"</h1>'+
            '<input style="margin: 5px;" v-if="(this.answers.length < Number(question.answersCount))" type = "button" class="btn btn-primary" value="Create" @click="addAnswer" />'+
            '<input style="margin: 5px;" type = "button" class="btn btn-primary" value="Go to questions" @click="backToQuestionList" />'+
            '<input style="margin: 5px;" type="button" class="btn btn-primary " value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+
        '</div>'+

            '<answer-form :answers="answers" :answerAttr="answer" :lang="lang" :question="question"/>'+
                '<div class="card" v-if="$root.showInputForm==false" style="margin: 5px; width: 90%;">'+
                    '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Добавленные ответы</h5><h5 v-else>Added responses</h5></div>'+
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

                            '<div v-if="tableView">' +
                                '<table class="table">'+
                                    '<thead>'+
                                        '<tr v-if="lang==1">'+
                                            '<th width="60%"  scope="col"><a href="#"  v-bind:class="byAnswerBody" @click="byAnswerBody">Тело ответа</a></th>'+
                                            '<th width="10%"  scope="col"><a href="#"  v-bind:class="byAnswerIsTrue" @click="byAnswerIsTrue">Ответ верен?</a></th>'+
                                            '<th width="30%"  scope="col">Действие</th>'+
                                        '</tr>'+
                                        '<tr v-else>'+
                                            '<th width="60%"  scope="col"><a href="#"  v-bind:class="byAnswerBody" @click="byAnswerBody">Answer</a></th>'+
                                            '<th width="10%"  scope="col"><a href="#"  v-bind:class="byAnswerIsTrue" @click="byAnswerIsTrue">Answer is true?</a></th>'+
                                            '<th width="30%"  scope="col">Action</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                        '<answer-row v-for="answer in paginatedData" :key="answer.id" :answer = "answer" ' +
                                        ':editMethod="editMethod" :answers="answers" :lang="lang"/>' +
                                    '</tbody>' +
                                '</table>' +
                            '</div>'+
                            '<div v-else>'+
                                '<hr>'+
                                '<div class="card-columns">'+
                                    '<answer-card v-for="answer in paginatedData" :key="answer.id" :answer = "answer" ' +
                                    ':editMethod="editMethod" :answers="answers" :lang="lang"" />' +
                                '</div>'+
                                '<hr>'+
                            '</div>'+

                        '</div>'+
                '</div>'+
        '</div>',

    mounted(){
        if(localStorage.answerSearch){
            this.search=localStorage.answerSearch;
        } else {
            this.search='';
        }

        if (localStorage.answerNoteCount) {
            this.noteCount = localStorage.answerNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.answerTableView) {
            if(localStorage.answerTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }
    },
    watch:{
        search(newSearch){
            if(localStorage.answerSearch!=newSearch){
                localStorage.answerSearch=newSearch
            }
        },
        tableView(newTableView) {
            if(newTableView){
                localStorage.answerTableView=1;
            } else{
                localStorage.answerTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.answerNoteCount != newNoteCount){
                localStorage.answernNoteCount = newNoteCount;
            }
        },
    },

    methods: {
        closeViewConfigWindow: function (){
            this.$root.showViewConfig=false;

        },
        addAnswer: function(){
            this.$root.showInputForm=true;
        },
        backToQuestionList: function(){
            window.location.href = '/questionmaker?testId='+this.question.testId;
        },
        clearSearch: function (){
            this.search='';
        },
        editMethod: function(answer){
            this.answer = answer;
        },
        nextPage(){
            this.pageNumber++;
        },
        prevPage(){
            this.pageNumber--;
        },
        byAnswerBody: function () {
            this.$root.sortKey = "answerBody";
        },
        byAnswerIsTrue: function () {
            this.$root.sortKey = "answerIsTrue";
        },


    },
    computed: {
        sortedAnswers() {
            const k = this.$root.sortKey;
            return this.answers.sort(dynamicSort(k));
        },
        filteredAnswers() {
            const s = this.search.toLowerCase();
            //return this.sortedUsers.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedAnswers.filter(sortedUser =>
                _.some(sortedUser, v => {
                    if (!(v instanceof Object)) {
                        this.pageNumber=0;
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));


        },
        pageCount(){
            let l = this.filteredAnswers.length,
                s = this.noteCount;
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * this.noteCount,
                end = start + this.noteCount;

            return this.filteredAnswers.slice(start, end);

        }
    },

});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div style="position: relative; width: 90%;">'+
            '<answers-list :answers="answers" :lang="lang" :question="question"/> ' +
        '</div>',
    data: {
        answers: [],
        question:'',
        answerBodyAlert:false,
        answerIsTrueAlert:false,
        answersCountOverloadAlert:false,
        questionId: questionId,
        editClicked:false,
        showInputForm:false,
        showViewConfig:false,
        sortKey:'answerBody',
        lang:''
    },

    created: function () {
        answerApi.get({id: this.$root.questionId}).then(result =>
        result.json().then(data =>
            this.answers=data
         ));
        questionInfoApi.get({id: this.$root.questionId}).then(result =>
            result.json().then(data =>
                this.question=data
            ));
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }}
});