function getIndex(list,id) {
    for (var i =0; i< list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}
function checkDefaultTest(list,defaultTest) {
    for (var i =0; i< list.length; i++) {
        if ((list[i].defaultTest == defaultTest)&&(defaultTest!=0)) {
            return list[i].id;
        }
    }
    return 0;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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


function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var testApi = Vue.resource('/testforuser{/id}');
var testFinalApi = Vue.resource('/testforuser/endAttempt{/id}');
var testConfirmApi = Vue.resource('/testforuser/confirmAttempt{/id}');
var enteranceTestApi = Vue.resource('/testforuser/enteranceTest{/id}');
var finalTestApi = Vue.resource('/testforuser/finalTest{/id}');


Vue.component('question-row' , {
    props: ['question', 'editMethod', 'testAttempt', 'lang'],
    data:function(){
        return {
            userAnswers:[],
        }
    },
    template:
            '<tr v-if="lang==1">'+
                '<div class="card" style="margin: 5px;">'+
                    '<div v-if="question.questionIsHurd==true" class="card-header bg-danger text-white">'+
                        '<h5>Вопрос #: {{testAttempt.studentTestAttemptQuestions.indexOf(question)+1}}</h5>'+
                    '</div>'+
                    '<div v-if="question.questionIsHurd==false" class="card-header bg-primary text-white">'+
                        '<h5>Вопрос #: {{testAttempt.studentTestAttemptQuestions.indexOf(question)+1}}</h5>'+
                    '</div>'+
                        '<div  class="card-body">'+
                            '<h5 class="card-title">{{question.questionBody}}</h5>'+

                                '<ul>'+
                                    '<li v-for="answer in question.studentTestAttemptAnswers">'+
                                        '<label class="checkbox">'+
                                            '<input type="checkbox"  :value="answer.id"  :id="answer.id" v-model="answer.answerIsTrue" :checked="answer.answerIsTrue"  @click="check($event, answer)"/>'+
                                            '<span>{{answer.answerBody}}</span>'+

                                        '</label>'+
                                    '</li>'+
                                '</ul>'+
                            '<input v-if="question.questionIsHurd==false" style="margin: 5px;" type = "button"  class="btn btn-danger" value="Пометить как сложный" @click="markHard" />'+
                            '<input v-else style="margin: 5px;" type = "button"  class="btn btn-primary" value="Снять пометку" @click="markHard" />'+
                        '</div>'+
                '</div>'+
            '</tr>' +
            '<tr v-else>'+
                '<div class="card" style="margin: 5px;">'+
                    '<div v-if="question.questionIsHurd==true" class="card-header bg-danger text-white">'+
                        '<h5>Question #: {{testAttempt.studentTestAttemptQuestions.indexOf(question)+1}}</h5>'+
                    '</div>'+
                    '<div v-if="question.questionIsHurd==false" class="card-header bg-primary text-white">'+
                        '<h5>Question #: {{testAttempt.studentTestAttemptQuestions.indexOf(question)+1}}</h5>'+
                    '</div>'+
                    '<div  class="card-body">'+
                        '<h5 v-if="((lang==1)||(question.enQuestionBody==null))" class="card-title">{{question.questionBody}}</h5>'+
                        '<h5 v-if="((lang!=1)||(question.enQuestionBody!=null))" class="card-title">{{question.enQuestionBody}}</h5>'+
                        '<ul>'+
                            '<li v-for="answer in question.studentTestAttemptAnswers">'+
                                '<label class="checkbox">'+
                                    '<input type="checkbox"  :value="answer.id"  :id="answer.id" v-model="answer.answerIsTrue" :checked="answer.answerIsTrue"  @click="check($event, answer)"/>'+
                                    '<span v-if="((lang==1)||(answer.enAnswerBody==null))" >{{answer.answerBody}}</span>'+
                                    '<span v-if="((lang!=1)||(answer.enAnswerBody!=null))" >{{answer.enAnswerBody}}</span>'+
                                '</label>'+
                            '</li>'+
                        '</ul>'+
                        '<input v-if="question.questionIsHurd==false" style="margin: 5px;" type = "button"  class="btn btn-danger" value="Mark as difficult" @click="markHard" />'+
                        '<input v-else style="margin: 5px;" type = "button"  class="btn btn-primary" value="Unmark" @click="markHard" />'+
                    '</div>'+
                '</div>'+
            '</tr>'
        ,
    methods: {
        edit: function(){
            this.editMethod(this.question);
        },
        markHard: function () {
            if (this.question.questionIsHurd) {
                this.question.questionIsHurd = false;
            }else {
                this.question.questionIsHurd = true;
            }
        },
        check: function(e, a) {
            var studentTestAttemptAnswer = {
                studentTestAttemptId: a.id,
                questionId: a.questionId,
                answerId: e.target.id,
                answerIsTrue: e.target.checked,

            };
            console.log("e.target.checked: "+e.target.checked);
            testApi.update({id: e.target.id}, studentTestAttemptAnswer);
        },

    }

});

Vue.component('questions-list', {
    props: [ 'testAttempt', 'lang'],
    data: function(){
        return {
            question: null,
            localTestAttempt:'',
        }
    },

    template:
        '<div style="position: relative; width: 1000px;">'+
            '<div v-if="lang==1">'+
                '<h1 v-if="testAttempt.testType==1">Вводное тестирование</h1>'+
                '<h1 v-else-if="testAttempt.testType==2">Промежуточное тестирование</h1>'+
                '<h1 v-else-if="testAttempt.testType==3">Финальное тестирование</h1>'+
            '</div>'+
            '<div v-else>'+
                '<h1 v-if="testAttempt.testType==1">Introductory testing</h1>'+
                '<h1 v-else-if="testAttempt.testType==2">Intermediate testing</h1>'+
                '<h1 v-else-if="testAttempt.testType==3">Final testing</h1>'+
            '</div>'+
                 '<table style="width: 1000px;" class="table">'+
                    '<tbody>'+
                        '<question-row v-for="question in testAttempt.studentTestAttemptQuestions" :key="question.id" :question = "question" ' +
                        ':editMethod="editMethod"  :testAttempt="testAttempt"  :lang="lang"/>' +
                    '</tbody>' +
                '</table>' +
        '</div>',

    methods: {
        editMethod: function(question){
            this.question = question;
        },
    }
});



var app;

app = new Vue({
    el: '#app',
    template:
        '<div>'+
                '<div style="margin: 20px;" v-show="(testAttempt.endDate == null)">' +
                    '<questions-list :testAttempt="testAttempt" :lang="lang" /> ' +
                    '<input v-if="lang==1" style="margin: 5px;" type = "button"  class="btn btn-primary" value="Завершить тестирование" @click="completeTestAttempt" />'+
                    '<input v-else style="margin: 5px;" type = "button"  class="btn btn-primary" value="Finish testing" @click="completeTestAttempt" />'+
                '</div>'+

                '<div  style="margin: 20px;" v-show="(testAttempt.endDate != null)">' +
                    '<div class="card">'+
                        '<div class="card-header text-white bg-primary"><h5 v-if="lang==1">Результаты выполнения тестирования</h5><h5 v-else>Test results</h5></div>'+
                        '<div v-if="lang==1" class="card-body">'+
                            '<h5 class="card-title">Вы ответили верно на: {{testAttempt.finalBall}}% вопросов! </h5>'+
                            '<p v-if="testAttempt.userFinalBallConfirm==true" class="card-text">Поздравляем, Вы успешно завершили тестирование!</p>'+
                            '<p v-if="testAttempt.userFinalBallConfirm==false" class="card-text">К сожалению Вы не смогли набрать минимальный балл для завершения тестирпования, попробуйте еще раз.</p>'+
                            '<p v-if="testAttempt.userFinalBallConfirmDate==null" class="card-text">Для продолжения необходимо подтвердить отзнакомление с результатами тестирования.</p>'+
                            '<div v-if="testAttempt.userFinalBallConfirmDate==null">'+
                                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Подтвердить завершение тестирования" @click="confirmTestAttempt" />'+
                            '</div> '+
                            '<div v-else>'+
                                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Ok" @click="backToList" />'+
                            '</div> '+
                        '</div>'+
                        '<div v-else class="card-body">'+
                            '<h5 class="card-title">You answered correctly to:  {{testAttempt.finalBall}}% questions!</h5>'+
                            '<p v-if="testAttempt.userFinalBallConfirm==true" class="card-text">Congratulations, you have successfully completed your testing!</p>'+
                            '<p v-if="testAttempt.userFinalBallConfirm==false" class="card-text">Unfortunately, you could not get the minimum score to complete the test, please try again.</p>'+
                            '<p v-if="testAttempt.userFinalBallConfirmDate==null" class="card-text">To continue, you must confirm the familiarization with the test results.</p>'+
                            '<div v-if="testAttempt.userFinalBallConfirmDate==null">'+
                                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Confirm completion of testing" @click="confirmTestAttempt" />'+
                            '</div> '+
                            '<div v-else>'+
                                '<input style="margin: 5px;" type = "button"  class="btn btn-primary" value="Ok" @click="backToList" />'+
                            '</div> '+
                        '</div>'+
                    '</div>'+
                '</div>'+
        '</div>',
    data: {
        testAttempt:'',
        testNameAlert:false,
        testDescriptionAlert:false,
        questionsCountAlert:false,
        questionsCountForUserAlert:false,
        defaultTestAlert:false,
        questionsCountForUserAlertOverhead:false,
        defaultTestConflictAlert:false,
        lectionId: lectionId,
        editClicked:false,
        completeConfirm:false,
        userFinalBallConfirm:false,
        localTestAttempt:'',
        counter:0,
        courceId: courceId,
        testType: testType,
        lang:'',
    },

    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},


    methods: {
        editMethod: function(question){
            this.question = question;
        },
        confirmTestAttempt: function(){

            testConfirmApi.update({id: this.testAttempt.id}, this.testAttempt).then(result =>
                result.json().then(data => {
                    this.testAttempt = data;
                    if (this.testAttempt.userFinalBallConfirmDate!=null){
                    }
                })
            );
          //  if(this.$root.testType==2){
           //     window.location.href = '/lectionWatchList?lectionId=' + this.$root.lectionId;
            //} else {
                window.location.href = '/lectionWatchList?courceId=' + this.testAttempt.courceId;
           // }
        },
        backToList: function(){

          //  if(this.$root.testType==2){
           //     window.location.href = '/lectionWatchList?lectionId=' + this.$root.lectionId;
         //   } else {
                window.location.href = '/lectionWatchList?courceId=' + this.testAttempt.courceId;
          //  }
        },

        completeTestAttempt: function(){
            console.log("Завершаем попытку, приступаем к сохранению данных");
            testFinalApi.update({id: this.testAttempt.id}, this.testAttempt).then(result =>
                result.json().then(data => {
                                            this.testAttempt = data;
                                            console.log("this.testAttempt.finalBall " + this.testAttempt.finalBall);
                                            if (this.testAttempt.finalBall!=null) {
                                                console.log("Сохранение прошло успешно, дата сохранения");
                                                }
                })
            );
            }
    },
    created: function () {
        if(testType==1){
            console.log("TEST TYPE = "+testType);

            enteranceTestApi.get({id: this.$root.courceId}).then(result =>
                result.json().then(data => {this.testAttempt = data
                })
            )
        } else if(testType==2){
            console.log("TEST TYPE = "+testType);
            console.log("LectionId: "+ this.$root.lectionId);
            testApi.get({id: this.$root.lectionId}).then(result =>
                result.json().then(data => {this.testAttempt = data
                })
            );

        } else if(testType==3){
            console.log("TEST TYPE = "+testType);
            finalTestApi.get({id: this.$root.courceId}).then(result =>
                result.json().then(data => {this.testAttempt = data
                })
            )
        }
    },
});