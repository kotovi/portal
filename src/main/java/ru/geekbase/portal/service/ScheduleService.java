package ru.geekbase.portal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.dto.EventType;
import ru.geekbase.portal.dto.ObjectType;
import ru.geekbase.portal.repos.*;
import ru.geekbase.portal.util.WsSender;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;


import static ru.geekbase.portal.util.GoogleTranslate.translate;

@Component
public class ScheduleService {

    private final LectionRepo lectionRepo;
    private final NotificationRepo notificationRepo;
    private final ServerRepo serverRepo;
    private final MailSender mailSender;
    private final UserRepo userRepo;
    private final SeminarRepo seminarRepo;
    private final QuestionRepo questionRepo;
    private final AnswerRepo answerRepo;
    private final CourceRepo courceRepo;
    private final BiConsumer<EventType, Lection> lectionWsSender;
    private final BiConsumer<EventType, SeminarForList> wsSender;


    @Autowired
    public ScheduleService( LectionRepo lectionRepo,
                            NotificationRepo notificationRepo,
                            ServerRepo serverRepo,
                            MailSender mailSender,
                            UserRepo userRepo,
                            SeminarRepo seminarRepo,
                            WsSender wsSender,
                            WsSender lectionWsSender,
                            QuestionRepo questionRepo,
                            AnswerRepo answerRepo,
                            CourceRepo courceRepo){
        this.lectionRepo = lectionRepo;
        this.notificationRepo = notificationRepo;
        this.serverRepo = serverRepo;
        this.mailSender = mailSender;
        this.userRepo = userRepo;
        this.seminarRepo = seminarRepo;
        this.wsSender = wsSender.getSender(ObjectType.SEMINARFORLIST, LectionView.ForFront.class);
        this.lectionWsSender = wsSender.getSender(ObjectType.LECTION, LectionView.MinimalList.class);
        this.questionRepo = questionRepo;
        this.answerRepo = answerRepo;
        this.courceRepo = courceRepo;

    }

    private final boolean enableMailSender =true;
    private final boolean enableTranslateData =true;
    private final boolean enableCheckActiveSeminars =true;
    private final boolean enableCheckSeminarsRecords =true;
    private final boolean enableCheckLectionUrl =true;


    @Scheduled(fixedRate = 60000)
    public void translateCource (){
        if(enableTranslateData){
            if(courceRepo.findAllByEnCourceNameIsNullAndDeleteDateIsNull().isPresent()){
                List<Cource> courcesForTranslate = courceRepo.findAllByEnCourceNameIsNullAndDeleteDateIsNull().get();
                for (Cource cource : courcesForTranslate) {
                    try {
                        String enCourceName = translate(cource.getCourceName());
                        String enCourceDescription = translate(cource.getCourceDescription());
                        cource.setEnCourceName(enCourceName);
                        cource.setEnCourceDescription(enCourceDescription);
                        courceRepo.save(cource);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

    }

    @Scheduled(fixedRate = 60000)
    public void translateLections (){
        if(enableTranslateData){
            if(lectionRepo.findAllByEnLectionNameIsNullAndDeletedIsFalse().isPresent()){
                List<Lection> lectionsForTranslate = lectionRepo.findAllByEnLectionNameIsNullAndDeletedIsFalse().get();
                for (Lection lection : lectionsForTranslate) {
                    try {
                        String enLectionName = translate(lection.getLectionName());
                        String enLectionDescription = translate(lection.getLectionDescription());
                        lection.setEnLectionName(enLectionName);
                        lection.setEnLectionDescription(enLectionDescription);
                        lectionRepo.save(lection);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }

    }

    @Scheduled(fixedRate = 60000)
    public void translateQuestions (){
        if(enableTranslateData){
            if(questionRepo.findAllByEnQuestionBodyIsNull().isPresent()){
                List<Question> questionsForTranslate = questionRepo.findAllByEnQuestionBodyIsNull().get();
                for (Question question : questionsForTranslate) {
                    try {
                        String enQuestionBody = translate(question.getQuestionBody());
                        question.setEnQuestionBody(enQuestionBody);
                        questionRepo.save(question);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 60000)
    public void translateAnswers (){
        if(enableTranslateData){
            if(answerRepo.findAllByEnAnswerBodyIsNull().isPresent()){
                List<Answer> answersForTranslate = answerRepo.findAllByEnAnswerBodyIsNull().get();
                for (Answer answer : answersForTranslate) {
                    try {
                        String enAnswerBody = translate(answer.getAnswerBody());
                        answer.setEnAnswerBody(enAnswerBody);
                        answerRepo.save(answer);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 18000)
    public void checkSeminarRooms() {
        if(enableCheckActiveSeminars) {
            if(serverRepo.findByServerDefault(1).isPresent()){
                Srv bbbServer = serverRepo.findByServerDefault(1).get();
                String serverURL = bbbServer.getServerUrl();
                String secret = bbbServer.getServerSalt();

                //Проверяем убита ли комната, если комнаты нет - записываем в БД
                if (seminarRepo.findByMeetingStatusAndMeetingIdIsNotNull(1).isPresent()) {
                    List<Seminar> seminarsForCheck = (seminarRepo.findByMeetingStatusAndMeetingIdIsNotNull(1)).get();
                    for (Seminar seminar : seminarsForCheck) {
                        if (BBBService.GetMeetingInfoUrl(
                                serverURL,
                                secret,
                                seminar.getMeetingId(),
                                "wfsdfsdfe3Def").equals("unsuccess")) {

                            seminar.setMeetingStatus(3);
                            seminarRepo.save(seminar);

                            SeminarForList seminarForList = new SeminarForList();
                            seminarForList.setId(seminar.getId());
                            seminarForList.setSeminarName(seminar.getSeminarName());
                            seminarForList.setSeminarCreator(seminar.getUser().getLastname() +
                                    " " + seminar.getUser().getFirstname() +
                                    " " + seminar.getUser().getSecname());
                            seminarForList.setMeetingStatus(seminar.getMeetingStatus());
                            seminarForList.setSeminarBeginDate(seminar.getSeminarBeginDate());

                            wsSender.accept(EventType.UPDATE, seminarForList);

                        } else {
                            System.out.println("Семинар с id: "+ seminar.getMeetingId()+" жив");
                        }
                    }
                }
            }
        }
    }

    //чекаем семинары на наличие записи
    @Scheduled(fixedRate = 20000)
    public void CheckSeminarUrl() {
        if(enableCheckSeminarsRecords) {
            if(serverRepo.findByServerDefault(1).isPresent()){
                Srv bbbServer = serverRepo.findByServerDefault(1).get();
                String serverURL = bbbServer.getServerUrl();
                String secret = bbbServer.getServerSalt();

                //чекаем семинары на наличие записи
                if (seminarRepo.findAllByMeetingStatusAndMeetingRecordUrlIsNull(3).isPresent()) {

                    List<Seminar> seminarForCheckOnRecordList = seminarRepo.findAllByMeetingStatusAndMeetingRecordUrlIsNull(3).get();

                    for (Seminar seminar : seminarForCheckOnRecordList) {
                        String recordUrl = BBBService.getRecordingUrlById(
                                serverURL,
                                secret,
                                seminar.getMeetingId());

                        if (recordUrl.length() > 4) {
                            seminar.setMeetingRecordUrl(recordUrl);
                            //опраляем сокетом кнопочку
                            SeminarForList seminarForList = new SeminarForList();
                            seminarForList.setId(seminar.getId());
                            seminarForList.setSeminarName(seminar.getSeminarName());
                            seminarForList.setSeminarCreator(seminar.getUser().getLastname() +
                                    " " + seminar.getUser().getFirstname() +
                                    " " + seminar.getUser().getSecname());
                            seminarForList.setMeetingStatus(seminar.getMeetingStatus());
                            seminarForList.setSeminarBeginDate(seminar.getSeminarBeginDate());
                            seminarForList.setRecordUrl(recordUrl);

                            wsSender.accept(EventType.UPDATE, seminarForList);

                            seminarRepo.save(seminar);

                            if (userRepo.findById(seminar.getCreatorId()).isPresent()) {
                                if (userRepo.findById(seminar.getCreatorId()).get().getNotificationAgree() != null) {
                                    Notification notification = new Notification();
                                    String unsubscribeUUID = userRepo.findById(seminar.getUser().getId()).get().getNotificationUUID();
                                    notification.setSourceId(seminar.getId());
                                    notification.setNotificationRecipient(seminar.getUser().getUserEmail());
                                    notification.setNotificationStatus(0);
                                    notification.setNotificationType(1);
                                    notification.setCreateNotificationDateTime(LocalDateTime.now());
                                    notification.setUnsubscribeUUID(unsubscribeUUID);
                                    notification.setNotificationSubject("Готова запись семинара: \"" + seminar.getSeminarName() + "\".");
                                    notification.setNotificationBody("Здравствуйте! \n" +
                                            "Просмотр записи семинара \"" + seminar.getSeminarName() + "\" доступен по ссылке: " + seminar.getMeetingRecordUrl() +
                                            "\n \n Это письмо было отправлено Вам, так как адрес " + seminar.getUser().getUserEmail() + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                                            "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + unsubscribeUUID);
                                    notificationRepo.save(notification);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    @Scheduled(fixedRate = 20000)
    public void sendLectionUrl() {
        if(enableCheckLectionUrl){
            if(serverRepo.findByServerDefault(1).isPresent()){
                Srv bbbServer = serverRepo.findByServerDefault(1).get();
                //Проверяем убита ли комната, если комнаты нет - записываем в БД
                List<Lection> lectiosForCheck = lectionRepo.findByMeetingStatus(1);

                for (Lection lection : lectiosForCheck) {
                    if (BBBService.GetMeetingInfoUrl(bbbServer.getServerUrl(),
                            bbbServer.getServerSalt(),
                            lection.getMeetingID(),
                            "EFewgfsdrFDE").equals("unsuccess")) {
                        lection.setMeetingStatus(0);
                        lectionRepo.save(lection);
                    }
                }
                // Проверяем готова ли запись у завершенных комнат
                List<Lection> lectiosForCheckOnRecord = lectionRepo.findByMeetingStatusAndRecordStatus(0, 1);

                for (Lection lection : lectiosForCheckOnRecord) {

                    String recordUrl = BBBService.getRecordingUrlById(bbbServer.getServerUrl(),
                            bbbServer.getServerSalt(),
                            lection.getMeetingID());

                    if (!recordUrl.equals("none")) {
                        lection.setLectionUrl(recordUrl);
                        lection.setRecordStatus(2);
                        String mailForReport = lection.getMailForReport();

                        lectionRepo.save(lection);
                        lectionWsSender.accept(EventType.UPDATE, lection);

                        if (userRepo.findByUserEmail(mailForReport).isPresent()) {
                            if (userRepo.findByUserEmail(mailForReport).get().getNotificationAgree()) {
                                Notification notification = new Notification();
                                String unsubscribeUUID = userRepo.findByUserEmail(mailForReport).get().getNotificationUUID();
                                notification.setSourceId(lection.getId());
                                notification.setNotificationRecipient(mailForReport);
                                notification.setNotificationStatus(0);
                                notification.setNotificationType(1);
                                notification.setCreateNotificationDateTime(LocalDateTime.now());
                                notification.setUnsubscribeUUID(unsubscribeUUID);
                                notification.setNotificationSubject("Готова запись лекции: \"" + lection.getLectionName() + "\".");
                                notification.setNotificationBody("Здравствуйте! \n" +
                                        "Просмотр лекции \"" + lection.getLectionName() + "\" доступен по ссылке: " + lection.getLectionUrl() +
                                        "\n \n Это письмо было отправлено Вам, так как адрес " + mailForReport + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                                        "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + unsubscribeUUID);
                                notificationRepo.save(notification);
                            }
                        }
                    }
                }
            }
        }
    }


   @Scheduled(fixedRate = 30000)
   public void mailNotificator(){
       if(enableMailSender){
           List <Notification> notification;
           try {
               notification = notificationRepo.findByNotificationStatus(0);
               if (notification.size()>0) {
                       for (Notification value : notification) {
                           mailSender.send(value.getNotificationRecipient(),
                                           value.getNotificationSubject(),
                                           value.getNotificationBody(), value.getUnsubscribeUUID());
                                           value.setNotificationStatus(1);
                                           value.setCompliteNotificationDateTime(LocalDateTime.now());
                           notificationRepo.save(value);
                       }
               }
           } catch (Exception e) {
               System.out.println("Ошибка при получении списка уведомлений");
               e.printStackTrace();
           }
       }
       }
}
