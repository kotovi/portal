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


Vue.component('answerCard',{
    props: ['studentTestAttemptAnswer','lang'],

    template:
               '<div>'+
                    '<div v-if="((studentTestAttemptAnswer.originalAnswer.answerIsTrue==1)&(studentTestAttemptAnswer.answerIsTrue))"  class="alert alert-success" role="alert">{{studentTestAttemptAnswer.answerBody}} <b>*</b></div>'+
                    '<div v-if="((studentTestAttemptAnswer.originalAnswer.answerIsTrue==0)&(!studentTestAttemptAnswer.answerIsTrue))"  class="alert alert-primary" role="alert">{{studentTestAttemptAnswer.answerBody}}</div>'+
                    '<div v-if="((studentTestAttemptAnswer.originalAnswer.answerIsTrue==1)&(!studentTestAttemptAnswer.answerIsTrue))"  class="alert alert-warning" role="alert">{{studentTestAttemptAnswer.answerBody}}</div>'+
                    '<div v-if="((studentTestAttemptAnswer.originalAnswer.answerIsTrue==0)&(studentTestAttemptAnswer.answerIsTrue))"  class="alert alert-danger" role="alert">{{studentTestAttemptAnswer.answerBody}} <b>*</b></div>'+
                    '<br>'+
               '</div>',
});

Vue.component('questionCard',{
    props: ['studentTestAttemptQuestion', 'studentTestAttemptQuestions', 'lang'],

    template:
        '<div class="card" style="margin-top: 20px;">'+
            '<div v-if="lang==1" class="card-header text-white bg-primary">Вопрос № {{studentTestAttemptQuestions.indexOf(studentTestAttemptQuestion) + 1}}: {{studentTestAttemptQuestion.questionBody}} </div>'+
            '<div v-else class="card-header text-white bg-primary">Question № {{studentTestAttemptQuestions.indexOf(studentTestAttemptQuestion) + 1}}: {{studentTestAttemptQuestion.questionBody}} </div>'+
        '<div class="card-body">'+
                    '<answerCard v-for="studentTestAttemptAnswer in studentTestAttemptQuestion.studentTestAttemptAnswers" :key="studentTestAttemptAnswer.id" :studentTestAttemptAnswer = "studentTestAttemptAnswer"  :lang="lang"/>' +
            '</div>'+
        '</div>',
});



var testAttempAnalysisApp;

testAttempAnalysisApp = new Vue({
    el: '#testAttempAnalysisApp',
    template:
        '<div style="position: center;">'+

        '<div v-if="showWTF">'+
            '<div class="modal-mask">'+
                '<div class="modal-wrapper">'+
                    '<div v-if="lang==1" class="modal-container">'+
                        '<div class="modal-title">'+
                            '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
                            'Интерпритация ответов'+
                        '</div>'+
                        '<hr>'+
                        '<div class="col" style="width: 90%; margin-top: 10px;">'+
                            '<label for="custom-control custom-checkbox">Зеленый - верный ответ, выбранный пользователем.</label>'+
                            '<label for="custom-control custom-checkbox">Желтый - верный ответ, не выбранный пользователем.</label>'+
                            '<label for="custom-control custom-checkbox">Красный - не верный ответ, выбранный пользователем.</label>'+
                            '<label for="custom-control custom-checkbox">Синий - не верный ответ, не выбранный пользователем.</label>'+
                        '</div>'+
                        '<br>'+
                        '<div class="modal-footer">'+
                            '<button class="btn btn-primary" @click="closeWTFWindow">Ок</button>'+
                            '</div>'+
                        '</div>'+
                        '<div v-else class="modal-container">'+
                            '<div class="modal-title">'+
                                '<button class="close" @click="closeViewConfigWindow">&times;</button>'+
                                'Display options'+
                            '</div>'+
                            '<hr>'+
                            '<div class="col" style="width: 90%; margin-top: 10px;">'+
                                '<label for="custom-control custom-checkbox">Green is the correct answer chosen by the user.</label>'+
                                '<label for="custom-control custom-checkbox">Yellow is the correct answer, not chosen by the user.</label>'+
                                '<label for="custom-control custom-checkbox">Red is the wrong answer chosen by the user.</label>'+
                                '<label for="custom-control custom-checkbox">Blue is not a correct answer, not chosen by the user.</label>'+
                            '</div>'+
                            '<br>'+
                            '<div class="modal-footer">'+
                                '<button class="btn btn-primary" @click="closeWTFWindow">Ок</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<h1  v-if="lang==1" class="display-4 mt-5 mb-5" style="padding-top:20px;">Анализ результатов тестирования. </h1>'+
            '<h1 v-else class="display-4 mt-5 mb-5" style="padding-top:20px;">Analysis of test results. </h1>'+
            '<button v-if="lang==1" type="button" class="btn btn-primary"  @click="backToStatystics">Вернуться к статистике</button>'+
            '<button v-else type="button" class="btn btn-primary"  @click="backToStatystics">Back to statistics</button>'+
            '<button v-if="lang==1" type="button" class="btn btn-primary"  @click="openProfile">Профиль в ISMU</button>'+
            '<button v-else type="button" class="btn btn-primary"  @click="openProfile">Profile at ISMU</button>'+
            '<button v-if="lang==1" type="button" class="btn btn-primary"  @click="openWTF">Интерпритация ответов</button>'+
            '<button v-else type="button" class="btn btn-primary"  @click="openWTF">Interpretation of responses</button>'+
                '<div v-if="lang==1" class="card" style="position: relative; width: 80%; margin-top: 20px;">'+
                    '<div class="card-header text-white bg-primary">Основные данные</div>'+
                    '<div class="card-body">'+
                        '<ul class="list-group list-group-flush">' +
                            '<li class="list-group-item"><b>Лекция:</b> {{testAnalysisData.lection.lectionName}} </li>'+
                            '<li class="list-group-item"><b>Слушатель:</b> {{testAnalysisData.user.lastname}} {{testAnalysisData.user.firstname}} {{testAnalysisData.user.secname}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.user.userStudyGroupInMirIsmu!=null"><b>Учебная группа:</b> {{testAnalysisData.user.userStudyGroupInMirIsmu}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.beginDate!=null"><b>Дата начала:</b> {{testAnalysisData.beginDate}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.endDate!=null"><b>Дата завершения:</b> {{testAnalysisData.endDate}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.finalBall!=null"><b>Итоговый балл:</b> {{testAnalysisData.finalBall}}%</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
                '<div v-else class="card" style="position: relative; width: 80%; margin-top: 20px;">'+
                    '<div class="card-header text-white bg-primary">Test data</div>'+
                    '<div class="card-body">'+
                        '<ul class="list-group list-group-flush">' +
                            '<li class="list-group-item"><b>Lection:</b> {{testAnalysisData.lection.lectionName}} </li>'+
                            '<li class="list-group-item"><b>Listener: </b>:</b> {{testAnalysisData.user.lastname}} {{testAnalysisData.user.firstname}} {{testAnalysisData.user.secname}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.user.userStudyGroupInMirIsmu!=null"><b>Study group:</b> {{testAnalysisData.user.userStudyGroupInMirIsmu}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.beginDate!=null"><b>Start date:</b> {{testAnalysisData.beginDate}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.endDate!=null"><b>Date of completion:</b> {{testAnalysisData.endDate}}</li>'+
                            '<li class="list-group-item" v-if="testAnalysisData.finalBall!=null"><b>Final ball:</b> {{testAnalysisData.finalBall}}%</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '<div style="position: relative; width: 80%;">'+
                '<questionCard v-for="studentTestAttemptQuestion in studentTestAttemptQuestions" :key="studentTestAttemptQuestion.id" :studentTestAttemptQuestion = "studentTestAttemptQuestion" :studentTestAttemptQuestions = "studentTestAttemptQuestions"  :lang="lang"/>' +
            '</div>'+
        '</div>',

    methods:{

        backToStatystics: function (){
            window.location.href = '/lectionStatistic?lectionId='+this.testAnalysisData.lectionId;
        },
        openProfile: function (){
            window.open('https://mir.ismu.baikal.ru/ismu/page_user.php?id='+this.testAnalysisData.user.idInMirIsmu);
        },
        openWTF: function (){
            this.showWTF=true;
        }
        ,
        closeWTFWindow: function (){
            this.showWTF=false;
        }
    },

    data: {
        attemptId: attemptId,
        testAnalysisData:'',
        studentTestAttemptQuestions:[],
        lang:'',
        showWTF:false,
    },
    mounted() {
        if (localStorage.lang) {
            this.lang = localStorage.lang;
        } else {
            this.lang=1;
        }},

    created: function () {
        console.log("attemptId: " + this.attemptId );

        axios.get('/testforuser/testAnalysis/'+this.attemptId).then(result => {
            this.testAnalysisData=result.data;
            this.studentTestAttemptQuestions=result.data.studentTestAttemptQuestions;
            console.log("ololo: " + this.studentTestAttemptQuestions );
        });
    },
});