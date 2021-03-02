package ru.geekbase.portal.controller;
import com.fasterxml.jackson.annotation.JsonView;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;


@RestController

public class StudentTestAttemptRestController {
    private final LectionTestingRepo lectionTestingRepo;
    private final StudentTestAttemptRepo studentTestAttemptRepo;
    private final StudentTestAttemptQuestionRepo studentTestAttemptQuestionRepo;
    private final StudentTestAttemptAnswerRepo studentTestAttemptAnswerRepo;
    private final QuestionRepo questionRepo;
    private final AnswerRepo answerRepo;
    private final LectionRepo lectionRepo;
    private final UserRepo userRepo;
    private final TestRepo testRepo;


    @Autowired
    public StudentTestAttemptRestController(LectionTestingRepo lectionTestingRepo,
                                            StudentTestAttemptRepo studentTestAttemptRepo,
                                            StudentTestAttemptQuestionRepo studentTestAttemptQuestionRepo,
                                            QuestionRepo questionRepo,
                                            StudentTestAttemptAnswerRepo studentTestAttemptAnswerRepo,
                                            AnswerRepo answerRepo,
                                            LectionRepo lectionRepo,
                                            UserRepo userRepo,
                                            TestRepo testRepo){
        this.lectionTestingRepo = lectionTestingRepo;
        this.studentTestAttemptRepo = studentTestAttemptRepo;
        this.studentTestAttemptQuestionRepo = studentTestAttemptQuestionRepo;
        this.questionRepo = questionRepo;
        this.studentTestAttemptAnswerRepo = studentTestAttemptAnswerRepo;
        this.answerRepo = answerRepo;
        this.lectionRepo = lectionRepo;
        this.userRepo = userRepo;
        this.testRepo = testRepo;
    }
    //добавить маппинг для геттера тестирования курса

    @GetMapping("/testforuser/testAnalysis/{attemptId}")
    @JsonView(QuestionView.ForLector.class)
    @ApiOperation("Метод отдает данные для анализа попытки тестирования обучающегося")
    public StudentTestAttempt testAnalysis(@PathVariable("attemptId") long attemptId,
                                           @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(user.getRoles().contains(Roles.USER)){
            Optional<StudentTestAttempt> studentTestAttempt = studentTestAttemptRepo.findById(attemptId);
            return studentTestAttempt.orElse(null);
        }else return null;

    }


    @GetMapping("/testforuser/enteranceTest/{courceId}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод отдает данные для вступительного тестирования курса,  на текущий момент требует переработки")

    public StudentTestAttempt entaranceTestList (@PathVariable("courceId") Long courceId,
                                    @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        //для начала проверим есть ли у нас удачно завершенная попытка
        List<StudentTestAttempt>  accesAttemptList;
        accesAttemptList =   studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(),courceId,1);

        //если есть удачная(ные) попытки - отдем максисмум
        System.out.println(" List<StudentTestAttempt> :" + accesAttemptList.size());
        if (!accesAttemptList.isEmpty()) {
            return accesAttemptList.get(0);

            //если есть незавершенная попытка
        } else if (studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmDateIsNull(user.getId(),courceId, 1).isPresent()) {
            return  studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmDateIsNull(user.getId(),courceId, 1).get();
            // если нет удачно завершенных попыток то генерируем новую
        }

        else if ( accesAttemptList.isEmpty() ){
            System.out.println("Генерируем новую попытку");
            //Генерируем новую попытку
            //проверяем есть ли у курса  входное тестирование
            Long generatedId;
            StudentTestAttempt studentTestAttempt = new StudentTestAttempt();
            //
            if (lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(courceId, 1,1).isPresent()){
                Test test =  lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(courceId, 1,1).get();
                //создаем тестирование

                studentTestAttempt.setBeginDate(LocalDateTime.now());
                studentTestAttempt.setCourceId(courceId);
                studentTestAttempt.setTestType(1);
                studentTestAttempt.setStudentId(user.getId());

                //возможно оно не сработает
                studentTestAttemptRepo.saveAndFlush(studentTestAttempt);
                //забираем вопросы, перемешиваем, обрезаем.
                List<Question>  fullQuestionList = questionRepo.findAllByTestId(test.getId());
                Collections.shuffle(fullQuestionList);
                fullQuestionList.subList((test.getQuestionsCountForUser() - 1),(test.getQuestionsCount() - 1)).clear();
                //наполняем попытку вопросами
                generatedId = studentTestAttempt.getId();

                for (Question question : fullQuestionList) {
                    StudentTestAttemptQuestion sta = new StudentTestAttemptQuestion();
                    sta.setQuestionId(question.getId());
                    sta.setStudentTestAttemptId(generatedId);
                    sta.setQuestionBody(question.getQuestionBody());
                    sta.setEnQuestionBody(question.getEnQuestionBody());
                    sta.setQuestionIsHurd(false);

                    studentTestAttemptQuestionRepo.saveAndFlush(sta);

                    if (answerRepo.findAllByQuestionId(sta.getQuestionId()).isPresent()) {
                        List<Answer> answersOnQuestion = answerRepo.findAllByQuestionId(sta.getQuestionId()).get();

                        List<StudentTestAttemptAnswer> studentTestAttemptAnswers = new ArrayList<>();
                        for (Answer answer : answersOnQuestion) {
                            StudentTestAttemptAnswer staa = new StudentTestAttemptAnswer();
                            staa.setAnswerId(answer.getId());
                            staa.setAnswerIsTrue(false);
                            staa.setQuestionId(answer.getQuestionId());
                            staa.setStudentTestAttemptQuestionId(sta.getId());
                            staa.setAnswerBody(answer.getAnswerBody());
                            staa.setEnAnswerBody(answer.getEnAnswerBody());
                            studentTestAttemptAnswers.add(staa);
                            studentTestAttemptAnswerRepo.saveAndFlush(staa);
                        }
                        sta.setStudentTestAttemptAnswers(studentTestAttemptAnswers);
                        studentTestAttemptQuestionRepo.saveAndFlush(sta);
                    }
                }
                studentTestAttempt.setStudentTestAttemptQuestions(studentTestAttemptQuestionRepo.findAllByStudentTestAttemptId(studentTestAttempt.getId()));
                studentTestAttemptRepo.saveAndFlush(studentTestAttempt);
            } return studentTestAttempt;
        }else return null;
    }

    @GetMapping("/testforuser/finalTest/{courceId}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод отдает данные финального тестирования курса, на текущий момент требует переработки")
    public StudentTestAttempt finalTestList (@PathVariable("courceId") Long courceId,
                                                 @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        //для начала проверим есть ли у нас удачно завершонная попытка
        List<StudentTestAttempt>  accesAttemptList;
        accesAttemptList =   studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(),courceId,3);

        //если есть удачная(ные) попытки - отдем максисмум

        System.out.println("Количество удачных попыток: " + accesAttemptList.size());
        if (!accesAttemptList.isEmpty()) {
            System.out.println("отдаем максимальную");
            return accesAttemptList.get(0);
            //если есть незавершенная попытка
        }
        if (studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmDateIsNull(user.getId(),courceId, 3).isPresent()) {
            System.out.println("отдаем не законченную попытку");
            return  studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmDateIsNull(user.getId(),courceId, 3).get();
            // если нет удачно завершенных попыток то генерируем новую
        }

        if ( accesAttemptList.isEmpty() ){
            System.out.println("Генерируем новую попытку");
            //Генерируем новую попытку
            //проверяем есть ли у курса  входное тестирование
            Long generatedId;

            //
            StudentTestAttempt finalTestAttempt = new StudentTestAttempt();

            if (lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(courceId, 1,3).isPresent()){
                Test test =  lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(courceId, 1,3).get();
                //создаем тестирование

                finalTestAttempt.setBeginDate(LocalDateTime.now());
                finalTestAttempt.setCourceId(courceId);
                finalTestAttempt.setStudentId(user.getId());
                finalTestAttempt.setTestType(3);

                //возможно оно не сработает
                studentTestAttemptRepo.saveAndFlush(finalTestAttempt);
                //забираем вопросы, перемешиваем, обрезаем.

                List<Question>  fullQuestionList = questionRepo.findAllByTestId(test.getId());
                Collections.shuffle(fullQuestionList);
                fullQuestionList.subList((test.getQuestionsCountForUser() - 1),( test.getQuestionsCount() - 1)).clear();
                //наполняем попытку вопросами
                generatedId = finalTestAttempt.getId();

                for (Question question : fullQuestionList) {
                    StudentTestAttemptQuestion sta = new StudentTestAttemptQuestion();
                    sta.setQuestionId(question.getId());
                    sta.setStudentTestAttemptId(generatedId);
                    sta.setQuestionBody(question.getQuestionBody());
                    sta.setEnQuestionBody(question.getEnQuestionBody());
                    sta.setQuestionIsHurd(false);

                    studentTestAttemptQuestionRepo.saveAndFlush(sta);

                    if (answerRepo.findAllByQuestionId(sta.getQuestionId()).isPresent()) {
                        List<Answer> answersOnQuestion = answerRepo.findAllByQuestionId(sta.getQuestionId()).get();
                        List<StudentTestAttemptAnswer> studentTestAttemptAnswers = new ArrayList<>();
                        for (Answer answer : answersOnQuestion) {
                            StudentTestAttemptAnswer staa = new StudentTestAttemptAnswer();
                            staa.setAnswerId(answer.getId());
                            staa.setAnswerIsTrue(false);
                            staa.setQuestionId(answer.getQuestionId());
                            staa.setStudentTestAttemptQuestionId(sta.getId());
                            staa.setAnswerBody(answer.getAnswerBody());
                            staa.setEnAnswerBody(answer.getEnAnswerBody());
                            studentTestAttemptAnswers.add(staa);
                            studentTestAttemptAnswerRepo.saveAndFlush(staa);
                        }
                        sta.setStudentTestAttemptAnswers(studentTestAttemptAnswers);
                        studentTestAttemptQuestionRepo.saveAndFlush(sta);
                    }
                }
                finalTestAttempt.setStudentTestAttemptQuestions(studentTestAttemptQuestionRepo.findAllByStudentTestAttemptId(finalTestAttempt.getId()));
                studentTestAttemptRepo.saveAndFlush(finalTestAttempt);
            }return finalTestAttempt;
        } else return null;
    }


    @GetMapping("/testforuser/{lectionId}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод отдает данные для промежуточного тестирования по результатам просмотра лекции")
    
    public StudentTestAttempt list (@PathVariable("lectionId") Long lectionId,
                                    @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        //для начала проверим есть ли у нас удачно завершенная попытка
        List<StudentTestAttempt>  accesAttemptList;
        accesAttemptList =   studentTestAttemptRepo.findByStudentIdAndLectionIdAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(),lectionId);
        //если есть удачная(ные) попытки - отдем максисмум
        if (!accesAttemptList.isEmpty()) {
             return accesAttemptList.get(0);
         }
        //если есть незавершенная попытка
         else if (studentTestAttemptRepo.findByStudentIdAndLectionIdAndEndDateIsNullAndTestType(user.getId(),lectionId,2).isPresent()) {
             return  studentTestAttemptRepo.findByStudentIdAndLectionIdAndEndDateIsNullAndTestType(user.getId(),lectionId,2).get();
         }
        // если нет удачно завершенных попыток то генерируем новую
         else if ( accesAttemptList.isEmpty() ){
             Long generatedId;
             StudentTestAttempt studentTestAttempt = new StudentTestAttempt();
             Long testId;

             if (lectionRepo.findById(lectionId).isPresent()){
                 if(lectionRepo.findById(lectionId).get().getTestId()!=null){
                     testId =lectionRepo.findById(lectionId).get().getTestId();

                     if (testRepo.findById(testId).isPresent()){

                         Test test =  testRepo.findById(testId).get();
                         //создаем тестирование
                         if(lectionRepo.findById(lectionId).isPresent()){
                             studentTestAttempt.setCourceId(lectionRepo.findById(lectionId).get().getCourceId());
                         }
                         studentTestAttempt.setBeginDate(LocalDateTime.now());
                         studentTestAttempt.setLectionId(lectionId);
                         studentTestAttempt.setStudentId(user.getId());
                         studentTestAttempt.setTestType(2);

                         studentTestAttemptRepo.saveAndFlush(studentTestAttempt);
                         //забираем вопросы, перемешиваем, обрезаем.
                         List<Question>  fullQuestionList = questionRepo.findAllByTestId(test.getId());
                         Collections.shuffle(fullQuestionList);

                         fullQuestionList.subList(
                                 (test.getQuestionsCountForUser() - 1),
                                 (test.getQuestionsCount() - 1)).clear();
                         //наполняем попытку вопросами
                         generatedId = studentTestAttempt.getId();

                         for (Question question : fullQuestionList) {
                             StudentTestAttemptQuestion sta = new StudentTestAttemptQuestion();

                             sta.setQuestionId(question.getId());
                             sta.setStudentTestAttemptId(generatedId);
                             sta.setQuestionBody(question.getQuestionBody());
                             sta.setEnQuestionBody(question.getEnQuestionBody());
                             sta.setQuestionIsHurd(false);

                             studentTestAttemptQuestionRepo.saveAndFlush(sta);

                             if (answerRepo.findAllByQuestionId(sta.getQuestionId()).isPresent()) {
                                 List<Answer> answersOnQuestion = answerRepo.findAllByQuestionId(sta.getQuestionId()).get();
                                 List<StudentTestAttemptAnswer> studentTestAttemptAnswers = new ArrayList<>();
                                 for (Answer answer : answersOnQuestion) {
                                     StudentTestAttemptAnswer staa = new StudentTestAttemptAnswer();

                                     staa.setAnswerId(answer.getId());
                                     staa.setAnswerIsTrue(false);
                                     staa.setQuestionId(answer.getQuestionId());
                                     staa.setStudentTestAttemptQuestionId(sta.getId());
                                     staa.setAnswerBody(answer.getAnswerBody());
                                     staa.setEnAnswerBody(answer.getEnAnswerBody());
                                     studentTestAttemptAnswers.add(staa);
                                     studentTestAttemptAnswerRepo.saveAndFlush(staa);
                                 }
                                 sta.setStudentTestAttemptAnswers(studentTestAttemptAnswers);
                                 studentTestAttemptQuestionRepo.saveAndFlush(sta);
                             }
                         }
                         studentTestAttempt.setStudentTestAttemptQuestions(studentTestAttemptQuestionRepo.findAllByStudentTestAttemptId(studentTestAttempt.getId()));
                         studentTestAttemptRepo.saveAndFlush(studentTestAttempt);
                     }
                 }
             } return studentTestAttempt;
        } else return null;
    }


    @PutMapping("/testforuser/{id}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод для сохранения ответов на вопросы тестирования")
    public StudentTestAttemptAnswer update(@AuthenticationPrincipal User user,
                                           @PathVariable("id") StudentTestAttemptAnswer studentTestAttemptAnswerFromDB,
                                           @RequestBody StudentTestAttemptAnswer studentTestAttemptAnswer) {
        BeanUtils.copyProperties(studentTestAttemptAnswer, studentTestAttemptAnswerFromDB, "id",
                "studentTestAttemptQuestionId","questionId","answerId", "answerBody", "enAnswerBody");
        return studentTestAttemptAnswerRepo.save(studentTestAttemptAnswerFromDB);
    }

    //ЗАВЕРШАЛКА ПРОВЕРЯЛКА
    @PutMapping("/testforuser/endAttempt/{id}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод для завершения попытки тестирования и проверки результата")
    public  StudentTestAttempt create(@AuthenticationPrincipal User user,
                                      @PathVariable("id") StudentTestAttempt studentTestAttemptFromDb ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);


        Long lectionId = studentTestAttemptFromDb.getLectionId();
        Long testId = null;
        if(lectionRepo.findById(lectionId).isPresent()){
            testId = lectionRepo.findById(lectionId).get().getTestId();
        }


        if (user.getId().equals(studentTestAttemptFromDb.getStudentId())) {
            // в общем тут нам нужно завершить попытку, поставить время завершения тестирования и посчитать баллы
            //в общем тут стоит подумать. то что будет происходить ниже - это плохой метод решения данной задачи
            int attemptQuestionsCount = studentTestAttemptFromDb.getStudentTestAttemptQuestions().size();

            float maxQuestionBall = 100 / attemptQuestionsCount;
            float finalBall = 0;

            for (int i = 0; i < attemptQuestionsCount ; i++) {

                int trueAnswerCountInQuestion = 0;
                int trueAnswerCountInAttempt = 0;
                int userMistakeCount =0;
                float trueAnswerBall;
                /*
                * подсчимтываем колмичество правильных и не правильных ответов
                * */
                for (int j = 0; j <studentTestAttemptFromDb.getStudentTestAttemptQuestions().get(i).getStudentTestAttemptAnswers().size() ; j++) {

                    if(answerRepo.findAllById(studentTestAttemptFromDb.getStudentTestAttemptQuestions().get(i).getStudentTestAttemptAnswers().get(j).getAnswerId()).isPresent()){

                        Boolean userAnswerValue = studentTestAttemptFromDb.getStudentTestAttemptQuestions().get(i).getStudentTestAttemptAnswers().get(j).getAnswerIsTrue();
                        Boolean databaseAnswerValue = answerRepo.findAllById(studentTestAttemptFromDb.getStudentTestAttemptQuestions().get(i).getStudentTestAttemptAnswers().get(j).getAnswerId())
                                .get().getAnswerIsTrue().equals(1);
                        System.out.println("значение ответа пользователя:"+userAnswerValue);
                        System.out.println("значение в базе:" + databaseAnswerValue);

                        if(databaseAnswerValue.equals(true)){
                            trueAnswerCountInQuestion++;
                        }

                        if(userAnswerValue.equals(databaseAnswerValue)) {
                            if(userAnswerValue.equals(true)){
                                trueAnswerCountInAttempt++;
                            }
                        } else{
                            if((databaseAnswerValue.equals(true))&(userAnswerValue.equals(false))){
                                userMistakeCount++;
                            }
                        }
                    }
                }
                //если все совпало - отдаем полный балл
                if((trueAnswerCountInQuestion == trueAnswerCountInAttempt)&(userMistakeCount==0)){
                    System.out.println("Ошибочных ответов нет,баллов за ответ: "+maxQuestionBall);
                    finalBall=finalBall + maxQuestionBall;
                    //если есть дробный балл
                } else if(trueAnswerCountInAttempt > 0){
                    if(trueAnswerCountInQuestion!=0){
                        trueAnswerBall = maxQuestionBall / trueAnswerCountInQuestion;
                        finalBall=finalBall + (trueAnswerBall * trueAnswerCountInAttempt);
                        System.out.println("Есть частично правильные ответы, ,балл за правильный  ответ: "+ trueAnswerBall);
                    }
                }
            }
            studentTestAttemptFromDb.setFinalBall((int) finalBall);
            studentTestAttemptFromDb.setEndDate(LocalDateTime.now());

            if (studentTestAttemptFromDb.getTestType()==2){
                if(testRepo.findById(testId).isPresent()){
                    studentTestAttemptFromDb.setUserFinalBallConfirm(finalBall >= testRepo.findById(testId).get().getMinimalBall());
                }

            } else {
                if(lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(studentTestAttemptFromDb.getCourceId(),1,studentTestAttemptFromDb.getTestType()).isPresent()){
                    studentTestAttemptFromDb.setUserFinalBallConfirm(finalBall >= lectionTestingRepo.findByCourceIdAndDefaultTestAndTestType(studentTestAttemptFromDb.getCourceId(), 1, studentTestAttemptFromDb.getTestType()).get().getMinimalBall());
                }
            }
            studentTestAttemptRepo.saveAndFlush(studentTestAttemptFromDb);
        }
        return  studentTestAttemptFromDb;
    }

    //Контроллер для подтверждения финального балла
    @PutMapping("/testforuser/confirmAttempt/{id}")
    @JsonView(QuestionView.ForStudent.class)
    @ApiOperation("Метод для подтверждения пользователем результатов тестирования")
    public  StudentTestAttempt confirm(@AuthenticationPrincipal User user,
                                       @PathVariable("id") StudentTestAttempt studentTestAttemptFromDb){
        if (user.getId().equals(studentTestAttemptFromDb.getStudentId())) {
            studentTestAttemptFromDb.setUserFinalBallConfirmDate(LocalDateTime.now());
            studentTestAttemptRepo.saveAndFlush(studentTestAttemptFromDb);
        }
        return  studentTestAttemptFromDb;
    }
}
