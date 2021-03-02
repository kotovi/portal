function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

function checktestType(list,testType) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].testType == testType)&&(testType!=0)) {
            return list[i].id;
        }
    }
    return 0;
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

var testApi = Vue.resource('/test/{id}');

Vue.component('test-card' , {
    props: ['test', 'editMethod', 'tests', 'lang'],
    template:
        '<div class="card">'+
            '<div v-if="test.questionsCount > test.questions.length" class="card-header text-white bg-danger"># {{tests.indexOf(test) + 1}}</div>'+
            '<div v-else class="card-header text-white bg-primary"># {{tests.indexOf(test) + 1}}</div>'+

                '<ul v-if="lang==1" class="list-group list-group-flush">'+
                    '<li  class="list-group-item"><b>Тестирование: </b>{{test.testName}}</li>'+
                    '<li v-if="test.testType==1" class="list-group-item"><b>Тип: </b>Входное</li>'+
                    '<li v-if="test.testType==2" class="list-group-item"><b>Тип: </b>Промежуточное</li>'+
                    '<li v-if="test.testType==3" class="list-group-item"><b>Тип: </b>Итоговое</li>'+
                    '<li v-if="test.questions==null" class="list-group-item"><b>Заполнено:</b> 0 из {{test.questionsCount}}</li>'+
                    '<li v-if="test.questionsCount > test.questions.length" class="list-group-item"><b>Заполнено:</b> {{test.questions.length}} из {{test.questionsCount}}</li>'+
                    '<li  class="list-group-item"><b>Вопросов: </b>{{test.questionsCount}}</li>'+
                    '<li  class="list-group-item"><b>Вопросов пользователю: </b>{{test.questionsCountForUser}}</li>'+
                    '<li  class="list-group-item"><b>Порог прохождения: </b>{{test.minimalBall}} %</li>'+
                '</ul>'+
                '<ul v-else class="list-group list-group-flush">'+
                    '<li v-if="test.enTestName!=null" class="list-group-item"><b>Test name: </b>{{test.enTestName}}</li>'+
                    '<li v-if="test.enTestName==null" class="list-group-item"><b>Test name: </b>{{test.testName}}</li>'+
                    '<li v-if="test.testType==1" class="list-group-item"><b>Type: </b>Entrance</li>'+
                    '<li v-if="test.testType==2" class="list-group-item"><b>Type: </b>Intermediate</li>'+
                    '<li v-if="test.testType==3" class="list-group-item"><b>Type: </b>Final</li>'+
                    '<li v-if="test.questions==null" class="list-group-item"><b>Filled in:</b> 0 из {{test.questionsCount}}</li>'+
                    '<li v-if="test.questionsCount > test.questions.length" class="list-group-item"><b>Filled in:</b> {{test.questions.length}} from {{test.questionsCount}}</li>'+
                    '<li  class="list-group-item"><b>Questions count: </b>{{test.questionsCount}}</li>'+
                    '<li  class="list-group-item"><b>Questions count for user: </b>{{test.questionsCountForUser}}</li>'+
                    '<li  class="list-group-item"><b>Threshold: </b>{{test.minimalBall}} %</li>'+
                '</ul>'+
                '<div v-if="lang==1" class="card-footer">'+
                    '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                    '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Вопросы" @click="addQuestions" />'+
                    '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
                '</div>'+
                '<div v-else class="card-footer">'+
                    '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                    '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Questions" @click="addQuestions" />'+
                    '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
                '</div>'+
        '</div>',

    methods: {
        edit: function(){
            this.editMethod(this.test);
            this.$root.showInputForm=true;
        },
        addQuestions: function(){
            window.location.href = '/questionmaker?testId='+this.test.id;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением записи необходимо завершить редактирование!");
            } else {
                testApi.remove({id: this.test.id}).then(result => {
                    if (result.ok) {
                        this.tests.splice(this.tests.indexOf(this.test), 1)
                    }
                })
            }

        }
    }


});



Vue.component('test-form', {

    props: ['tests', 'testAttr', 'lang'],
    data: function() {
        return {
            id:'',
            testType:0,
            testName:'',
            testDescription:'',
            questionsCount:0,
            questionsCountForUser:0,
            getQuestionsCountForUser:0,
            minimalBall:0,
        }
    },

    watch:{
        testAttr: function(newVal, oldVal){
            this.id = newVal.id;
            this.questionsCount = newVal.questionsCount;
            this.questionsCountForUser = newVal.questionsCountForUser;
            this.testType = newVal.testType;
            this.testName = newVal.testName;
            this.testDescription = newVal.testDescription;
            this.minimalBall = newVal.minimalBall;
        }
    },
    template:
        '<div>'+

            '<div v-if="($root.showInputForm==true)" class="card" style="margin: 5px;">'+
                '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Параметры тестирования</h5><h5 v-else>Test parameters</h5></div>'+
                    '<div class="card-body">'+
                        '<form>'+
                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testType">Тип тестирования</label>'+
                                '<select class="custom-select" id="testType" v-model="testType">'+
                                    '<option value="0">Выбрать...</option>'+
                                    '<option value="1">Вводное тестирование для курса</option>'+
                                    '<option value="2">Промежуточное тестирование для лекции</option>'+
                                    '<option value="3">Итоговое тестирование для курса </option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.testTypeAlert">Необходимо выбрать тип тестирования</p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testType">Test type</label>'+
                                '<select class="custom-select" id="testType" v-model="testType">'+
                                    '<option value="0">Select...</option>'+
                                    '<option value="1">Introductory testing for the course</option>'+
                                    '<option value="2">Interim testing for a lecture</option>'+
                                    '<option value="3">Final testing for the course</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.testTypeAlert">You must select the type of testing</p>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testName">Название тестирования</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="testName" v-model="testName" placeholder="Название тестирования" :maxlength="1000" required>'+
                                    '<div v-show="testName.length>0" class="input-group-prepend">' +
                                       '<div class="input-group-text" v-text="1000 - testName.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.testNameAlert">Необходимо указать название тестирования</p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testName">Testing name</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="testName" v-model="testName" placeholder="Testing name" :maxlength="1000" required>'+
                                    '<div v-show="testName.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - testName.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.testNameAlert">You must specify the name of the test</p>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testDescription">Аннотация тестирования</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="testDescription" v-model="testDescription" placeholder="Аннотация тестирования" :maxlength="1000" required>'+
                                    '<div v-show="testDescription.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - testDescription.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.testDescriptionAlert">Необходимо заполнить аннотацию тестирования</p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="testDescription">Test summary</label>'+
                                '<div class="input-group">'+
                                    '<input type="text" class="form-control" id="testDescription" v-model="testDescription" placeholder="Test summary" :maxlength="1000" required>'+
                                    '<div v-show="testDescription.length>0" class="input-group-prepend">' +
                                        '<div class="input-group-text" v-text="1000 - testDescription.length">@</div>' +
                                    '</div>'+
                                '</div>'+
                                '<p class="alert alert-danger" v-show="$root.testDescriptionAlert">It is necessary to fill in the test annotation</p>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="questionsCount">Всего вопросов</label>'+
                                '<select class="custom-select" id="questionsCount" v-model="questionsCount">'+
                                    '<option value="0">Выбрать...</option>'+
                                    '<option :value="n" v-for=" n in 50">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountAlert">Укажите количество вопросов в тестировании</p>'+
                                '<p class="alert alert-warning" v-show ="$root.questionsCountForUserAlertOverhead">Возможно данное значение стоит увеличить</p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="questionsCount">Total Questions</label>'+
                                '<select class="custom-select" id="questionsCount" v-model="questionsCount">'+
                                    '<option value="0">Select...</option>'+
                                    '<option :value="n" v-for=" n in 50">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountAlert">Indicate the number of questions in testing</p>'+
                                '<p class="alert alert-warning" v-show ="$root.questionsCountForUserAlertOverhead">Perhaps this value should be increased</p>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="questionsCountForUser">Количество вопросов для тестирования слушателя</label>'+
                                '<select class="custom-select" id="questionsCountForUser" v-model="questionsCountForUser">'+
                                    '<option value="0">Выбрать...</option>'+
                                    '<option :value="n" v-for=" n in 50">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountForUserAlert">Укажите количество вопросов в тестировании слушателя</p>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountForUserAlertOverhead">Количество вопросов в тестировании не может быть больше общего количества вопросов! </p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="questionsCountForUser">Number of questions to test the listener</label>'+
                                '<select class="custom-select" id="questionsCountForUser" v-model="questionsCountForUser">'+
                                    '<option value="0">Select...</option>'+
                                    '<option :value="n" v-for=" n in 50">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountForUserAlert">Indicate the number of questions in the test of the listener!</p>'+
                                '<p class="alert alert-danger" v-show ="$root.questionsCountForUserAlertOverhead">The number of questions in testing cannot be more than the total number of questions! </p>'+
                            '</div>'+

                            '<div v-if="lang==1" class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="minimalBall">Минимальный % правильных ответов для успешного прохождения тестирования</label>'+
                                '<select class="custom-select" id="minimalBall" v-model="minimalBall">'+
                                    '<option value="0">Выбрать...</option>'+
                                    '<option :value="n" v-for=" n in 100">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.minimalBallAlert">Укажите минимальный порог успешного завершения, в %</p>'+
                            '</div>'+
                            '<div v-else class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="minimalBall">Minimum% of correct answers for successful testing</label>'+
                                '<select class="custom-select" id="minimalBall" v-model="minimalBall">'+
                                    '<option value="0">Select...</option>'+
                                    '<option :value="n" v-for=" n in 100">{{n}}</option>'+
                                '</select>'+
                                '<p class="alert alert-danger" v-show ="$root.minimalBallAlert">Specify the minimum threshold for successful completion, in%</p>'+
                            '</div>'+
        '</form>'+
        '</div>'+


                            '<div class="card-footer">'+
                                '<div v-if="lang==1" class="col-sm-10">'+
                                    '<input v-if="($root.editClicked == false)" type="button"  class="btn btn-primary " value="Создать" @click="save">'+
                                    '<input v-if="$root.editClicked == true" type="button"  class="btn btn-primary " value="Сохранить" @click="save">'+
                                    '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Отменить" @click="cancelAddTest">'+
                                '</div>'+
                                '<div v-else class="col-sm-10">'+
                                    '<input v-if="($root.editClicked == false)" type="button"  class="btn btn-primary " value="Create" @click="save">'+
                                    '<input v-if="$root.editClicked == true" type="button"  class="btn btn-primary " value="Save" @click="save">'+
                                    '<input style="margin: 5px;" type="button"  class="btn btn-danger " value="Cancel" @click="cancelAddTest">'+
                                '</div>'+
                            '</div>'+

                '</div>'+
        '</div>',

    methods: {


        cancelAddTest: function(){
            if(this.$root.editClicked){
                this.$root.editClicked=false;
            } else {
                this.testName = '';
                this.testDescription = '';
                this.questionsCount = 0;
                this.questionsCountForUser = 0;
                this.testType = 0;
                this.minimalBall = 0;
            }
            this.$root.showInputForm=false;
        },

        save: function () {

            var test = {
                testName: capitalizeFirstLetter(this.testName),
                testDescription: capitalizeFirstLetter(this.testDescription),
                testType: this.$root.testType,
                questionsCount: this.questionsCount,
                questionsCountForUser: this.questionsCountForUser,
                testType: this.testType,
                minimalBall: this.minimalBall,
            };

            if (is_empty(this.testName)) {
                this.$root.testNameAlert = true;
            } else {
                this.$root.testNameAlert = false;
            }

            if (this.minimalBall===0) {
                this.$root.minimalBallAlert = true;
            } else {
                this.$root.minimalBallAlert = false;
            }

            if (is_empty(this.testDescription)) {
                this.$root.testDescriptionAlert = true;
            } else {
                this.$root.testDescriptionAlert = false;
            }

            if (this.questionsCount===0) {

                this.$root.questionsCountAlert = true;
            } else {
                this.$root.questionsCountAlert = false;
            }

            if (this.questionsCountForUser===0) {
                this.$root.questionsCountForUserAlert = true;
            } else {
                this.$root.questionsCountForUserAlert = false;
            }

            if (this.testType===0) {
                this.$root.testTypeAlert = true;
            } else {
                this.$root.testTypeAlert = false;
            }

            if ((!this.$root.testNameAlert) &&
                (!this.$root.testDescriptionAlert) &&
                (!this.$root.questionsCountAlert) &&
                (!this.$root.questionsCountForUserAlert) &&
                (!this.$root.testTypeAlert) &&
                (!this.$root.minimalBallAlert)
            ) {

                if (this.questionsCount < this.questionsCountForUser) {
                    this.$root.questionsCountForUserAlertOverhead = true;
                } else {
                    this.$root.questionsCountForUserAlertOverhead = false;

                    if (this.id) {

                            testApi.update({id: this.id}, test).then(result =>
                            result.json().then(data => {
                                var index = getIndex(this.tests, data.id);
                                this.tests.splice(index, 1, data);
                                this.id = ''
                                this.testName = ''
                                this.testDescription = ''
                                this.questionsCount = 0
                                this.questionsCountForUser = 0
                                this.testType = 0
                                this.minimalBall = 0

                            })
                            )

                            this.$root.editClicked = false;
                            this.$root.showInputForm=false;

                    } else {

                            testApi.save({}, test).then(result =>
                                result.json().then(data => {
                                    this.tests.push(data);
                                    this.testName = ''
                                    this.testDescription = ''
                                    this.questionsCount = 0
                                    this.questionsCountForUser = 0
                                    this.testType = 0
                                    this.minimalBall = 0
                                })
                            )
                        this.$root.testTypeConflictAlert=false;
                        this.$root.showInputForm=false;

                    }
                }
            }
        }
    }
});

Vue.component('test-row' , {
    props: ['test', 'editMethod', 'tests', 'lang'],
    template:
        '<tr>'+
            '<td v-if="((lang==1)||((lang!=1)&(test.enTestName==null)))" style="text-align: center; width: 35%; align-content: center;">{{test.testName}}</td>'+
            '<td v-else-if="(lang!=1)&(test.enTestName!==null)" style="text-align: center; width: 35%; align-content: center;">{{test.enTestName}}</td>'+

            '<td v-if="lang==1" style="text-align: center; width: 5%; align-content: center;">' +
                '<p v-if="test.testType==1" class="alert alert-primary" role="alert">Входное</p>' +
                '<p v-if="test.testType==2" class="alert alert-success" role="alert">Промежуточное</p>' +
                '<p v-if="test.testType==3" class="alert alert-info" role="alert">Итоговое</p>' +
            '</td>'+
            '<td v-else style="text-align: center; width: 5%; align-content: center;">' +
                '<p v-if="test.testType==1" class="alert alert-primary" role="alert">Entrance</p>' +
                '<p v-if="test.testType==2" class="alert alert-success" role="alert">Intermediate</p>' +
                '<p v-if="test.testType==3" class="alert alert-info" role="alert">Final</p>' +
            '</td>'+

            '<td v-if="lang==1" style="text-align: center; width: 25%; align-content: center;">' +
                '<div v-if="test.questions==null" class="alert alert-danger" role="alert"><p>Заполнено: 0 из {{test.questionsCount}}</p><p>Пользователю: {{test.questionsCountForUser}}</p><p>Порог: {{test.minimalBall}} %</p></div>' +
                '<div v-else-if="test.questionsCount > test.questions.length" class="alert alert-danger" role="alert"><p>Заполнено: {{test.questions.length}} из {{test.questionsCount}}</p><p>Пользователю: {{test.questionsCountForUser}}</p><p>Порог: {{test.minimalBall}} %</p></div>' +
                '<div v-else class="alert alert-success" role="alert"><p>Заполнено: {{test.questions.length}} из {{test.questionsCount}}</p><p>Пользователю: {{test.questionsCountForUser}}</p><p>Порог: {{test.minimalBall}} %</p></div>' +
            '</td>'+
            '<td v-else style="text-align: center; width: 25%; align-content: center;">' +
                '<div v-if="test.questions==null" class="alert alert-danger" role="alert"><p>Filled in: 0 from {{test.questionsCount}}</p><p>For user: {{test.questionsCountForUser}}</p><p>Threshold: {{test.minimalBall}} %</p></div>' +
                '<div v-else-if="test.questionsCount > test.questions.length" class="alert alert-danger" role="alert"><p>Filled in: {{test.questions.length}} from {{test.questionsCount}}</p><p>For user: {{test.questionsCountForUser}}</p><p>Threshold: {{test.minimalBall}} %</p></div>' +
                '<div v-else class="alert alert-success" role="alert"><p>Filled in: {{test.questions.length}} from {{test.questionsCount}}</p><p>For user: {{test.questionsCountForUser}}</p><p>Threshold: {{test.minimalBall}} %</p></div>' +
            '</td>'+

            '<td v-if="lang==1" style="text-align: center; width: 35%; align-content: center;">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Изменить" @click="edit" />' +
                '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Вопросы" @click="addQuestions" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
            '<td v-else style="text-align: center; width: 35%; align-content: center;">'+
                '<input style="margin: 5px;" type = "button" v-on:click="$root.editClicked = true" class="btn btn-sm btn-primary" value="Change" @click="edit" />' +
                '<input style="margin: 5px;" type = "button" class="btn btn-sm btn-success" value="Questions" @click="addQuestions" />'+
                '<input style="margin: 5px;" type = "button"  class="btn btn-sm btn-danger" value="X" @click="del" />'+
            '</td>'+
        '</tr>',
    methods: {
        edit: function(){
            this.editMethod(this.test);
            this.$root.showInputForm=true;
        },
        addQuestions: function(){
                window.location.href = '/questionmaker?testId='+this.test.id;
        },
        del: function() {
            if (this.$root.editClicked == true) {
                alert("Пееред удалением записи необходимо завершить редактирование!");
            } else {
                testApi.remove({id: this.test.id}).then(result => {
                    if (result.ok) {
                    this.tests.splice(this.tests.indexOf(this.test), 1)
                }
            })
            }

        }
    }

});

Vue.component('tests-list', {
    props: ['tests', 'lang'],
    data: function(){
        return {
            test: null,
            search:'',
            pageNumber: 0,
            tableView:'',
            noteCount:'',

        }
    },
    template:
        '<div style="position: relative; width: 90%;">'+

        '<div>'+
            '<h1 v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Тестирования</h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;">Testing</h1>'+

            '<input v-if="(($root.editClicked==false)&(lang==1))" style="margin: 5px;" type = "button" class="btn btn-primary" value="Добавить" @click="addTest" />'+
            '<input v-if="(($root.editClicked==false)&(lang!=1))" style="margin: 5px;" type = "button" class="btn btn-primary" value="Create" @click="addTest" />'+

        '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang==1))" type="button" class="btn btn-primary " value="Параметры отображения" @click="$root.showViewConfig=!$root.showViewConfig">'+
        '<input style="margin: 5px;" v-if="(($root.showInputForm==false)&(lang!=1))" type="button" class="btn btn-primary " value="Display options" @click="$root.showViewConfig=!$root.showViewConfig">'+
        '</div>'+

        '<test-form :tests="tests" :testAttr="test" :lang="lang"/>'+

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

        '<div class="card" v-if="$root.showInputForm==false" style="margin: 5px; width: 90%;">'+
            '<div class="card-header text-white bg-primary">' +
                '<h5 v-if="lang==1">Тестирования</h5>' +
                '<h5 v-else>Testing</h5>' +
            '</div>'+
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
                                '<th style="width: 35%; text-align: center;" scope="col"><a href="#"  v-bind:class="byTestName" @click="byTestName">Название</a></th>'+
                                '<th style="width: 5%; text-align: center;" scope="col"><a href="#"  v-bind:class="byTestType" @click="byTestType">Тип</a></th>'+
                                '<th style="width: 25%; text-align: center;" scope="col">Вопросов</th>'+
                                '<th style="width: 35%; text-align: center;" scope="col">Действие</th>'+
                            '</tr>'+
                            '<tr v-else>'+
                                '<th style="width: 35%; text-align: center;" scope="col"><a href="#"  v-bind:class="byTestName" @click="byTestName">Name</a></th>'+
                                '<th style="width: 5%; text-align: center;" scope="col"><a href="#"  v-bind:class="byTestType" @click="byTestType">Type</a></th>'+
                                '<th style="width: 25%; text-align: center;" scope="col">Questions</th>'+
                                '<th style="width: 35%; text-align: center;" scope="col">Action</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<test-row v-for="test in filteredTests" :key="test.id" :test = "test" :editMethod="editMethod" :tests="tests" :lang="lang"/>' +
                        '</tbody>' +
                    '</table>' +
                '</div>'+
                '<div v-else>'+
                    '<hr>'+
                    '<div class="card-columns">'+
                        '<test-card v-for="test in filteredTests" :key="test.id" :test = "test" :editMethod="editMethod" :tests="tests" :lang="lang"/>' +
                    '</div>'+
                    '<hr>'+
                '</div>'+
            '</div>'+
            '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang==1))" align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Страница {{this.pageNumber + 1}} из {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
            '<div v-if="(((pageCount>1)&&($root.editClicked ==false))&(lang!=1))" align="center" style="margin: 15px;">'+
                '<button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber === 0" @click="prevPage"><</button> Page {{this.pageNumber + 1}} from {{pageCount}} <button class="btn btn-primary"  style="margin: 5px;" :disabled="pageNumber >= pageCount -1" @click="nextPage">></button>'+
            '</div>'+
        '</div>'+
    '</div>',
    computed: {
        sortedTests() {
            const k = this.$root.sortKey;
            return this.tests.sort(dynamicSort(k));
            alert(k);
        },

        filteredTests() {
            const s = this.search.toLowerCase();
            //return this.sortedLections.filter(o=>_.some(o, v =>_.toLower(v).indexOf(s)>-1));
            return this.sortedTests.filter(sortedTest =>
                _.some(sortedTest, v => {
                    if (!(v instanceof Object)) {
                        return  _.toLower(v).indexOf(s)>-1
                    } else {
                        return  _.some(v, a => _.toLower(a).indexOf(s)>-1)
                    }}));
        },
        pageCount(){
            let l = this.filteredTests.length,
                s = parseInt(this.noteCount);
            return Math.ceil(l/s);

        },
        paginatedData(){
            const start = this.pageNumber * parseInt(this.noteCount),
                end = start + parseInt(this.noteCount);

            return this.filteredTests.slice(start, end);

        }
    },
    methods: {
        editMethod: function(test){
            this.test = test;
        },
        clearSearch: function (){
            this.search=''
        },
        addTest: function(){
            this.$root.showInputForm=true;
        },
        closeViewConfigWindow: function(){
            this.$root.showViewConfig=false;
        },
        byTestType: function (){
           this.$root.sortKey='testType';
        },
        byTestName: function (){
            this.$root.sortKey='testName';
        }

    },
    watch:{
        search(newSearch){
            if(localStorage.testSearch!=newSearch){
                localStorage.testSearch=newSearch
            }
        },
        tableView(newTableView) {
            if(newTableView){
                localStorage.testTableView=1;
            } else{
                localStorage.testTableView=0;
            }
        },
        noteCount(newNoteCount) {
            if(localStorage.testNoteCount != newNoteCount){
                localStorage.testNoteCount = newNoteCount;
            }
        },

    },
    mounted(){
        if(localStorage.testSearch){
            this.search=localStorage.testSearch;
        } else {
            this.search='';
        }

        if (localStorage.testNoteCount) {
            this.noteCount = localStorage.testNoteCount;
        } else {
            this.noteCount=10;
        }

        if (localStorage.testTableView) {
            if(localStorage.testTableView==0){
                this.tableView =false;
            } else {
                this.tableView =true;
            }
        } else {
            this.tableView=true;
        }

    },





});

var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
            '<tests-list :tests="tests" :lang="lang" style="width: 90%;"  />'+
        '</div>',
    data: {
        tests:[],
        testNameAlert:false,
        minimalBallAlert:false,
        testDescriptionAlert:false,
        questionsCountAlert:false,
        questionsCountForUserAlert:false,
        testTypeAlert:false,
        questionsCountForUserAlertOverhead:false,
        testTypeConflictAlert:false,
        editClicked:false,
        showInputForm:false,
        lang:'',
        showViewConfig:false,
        sortKey:'testName',
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {
     testApi.get().then(result =>
       result.json().then(data => {
             this.tests=data;
       }
       )
     )
    },

});