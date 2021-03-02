package ru.geekbase.portal.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

/*
Это страшное чудовище, формирующее дженерик для отдачи лекций пользователю с его пределенной группой.
Жутчайший какакод, нужно будет переписать.
 */
@RestController
@RequestMapping("/lectionsListForStudent")
//@JsonView(LectionView.MinimalList.class)

public class LectionsForStudentsRestController {
    private final LectionRepo lectionRepo;
    private final CourceRepo courceRepo;
    private final UserRepo userRepo;
    private final CourceForStudentsRepo courceForStudentsRepo;
    private final UserGroupRepo userGroupRepo;
    private final StudentTestAttemptRepo studentTestAttemptRepo;

    @Autowired LectionsForStudentsRestController(LectionRepo lectionRepo,
                                                 CourceRepo courceRepo,
                                                 UserRepo userRepo,
                                                 UserGroupRepo userGroupRepo,
                                                 CourceForStudentsRepo courceForStudentsRepo,
                                                 StudentTestAttemptRepo studentTestAttemptRepo){
        this.lectionRepo = lectionRepo;
        this.courceForStudentsRepo = courceForStudentsRepo;
        this.userRepo = userRepo;
        this.userGroupRepo = userGroupRepo;
        this.studentTestAttemptRepo = studentTestAttemptRepo;
        this.courceRepo = courceRepo;
    }

    @GetMapping
    @ApiOperation("маппинг отдает список доступных лекций")
    public List<LectionListForStudent> list(@AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if (
            (user.getRoles().contains(Roles.USER)) ||
            (user.getRoles().contains(Roles.STUDENT))
        ){
            Long userGroupId = user.getUserGroup();
            List<CourceForStudents> courceList= courceForStudentsRepo.findAllByUserGroupIdAndAccessEndDateIsNull(userGroupId);
            List<LectionListForStudent> urlList = new ArrayList<>();
            for (CourceForStudents courceForStudents : courceList) {
                List<Lection> courceLectionList = lectionRepo.findByCourceIdAndDeletedIsFalse(courceForStudents.getCourceId());
                for (Lection lection : courceLectionList) {
                    if (lection.getLectionUrl() != null) {
                        LectionListForStudent lectionList = new LectionListForStudent();
                        lectionList.setId(lection.getId());
                        lectionList.setFileList(lection.getFiles());
                        lectionList.setCourceName(lection.getCource().getCourceName());

                        if (lection.getAccessBeginDate().isAfter(LocalDateTime.now())) {
                            lectionList.setLectionName(lection.getLectionName());
                            lectionList.setLectionUrl(lection.getLectionUrl());
                        } else {
                            lectionList.setLectionName(lection.getLectionName() + "Данная лекция будет доступна с " + lection.getAccessBeginDate());
                        }
                        try {
                            if (lection.getEnLectionName() != null) {
                                lectionList.setEnLectionName(lection.getEnLectionName());
                            }
                            if (lection.getCource().getEnCourceName() != null) {
                                lectionList.setEnCourceName(lection.getCource().getEnCourceName());
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        urlList.add(lectionList);
                    }
                }
            }
            return urlList;
        } return null;
    }


    /*
    в общем мне нужно тут отдать список  лекций потестированных
    */


    @GetMapping("{id}")
    @ApiOperation("маппинг отдает список доступных лекций для отределенного курса")
    public List<LectionListForStudent> list(@AuthenticationPrincipal User user,
                                            @PathVariable("id") String id) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getRoles().contains(Roles.USER)) ||
            (user.getRoles().contains(Roles.STUDENT))
        ) {

            if (courceRepo.findById(Long.valueOf(id)).isPresent()) {

                List<LectionListForStudent> urlList = new ArrayList<>();
                //если у курса есть прикрепленное тестирование
                /*
                 * На сколько я сейчас понимаю - мне нужно посмотреть тип тестирования, и в зависимости от этого типа
                 * нахерачить тестирований студентам.
                 *
                 * */
                if (courceRepo.findById(Long.valueOf(id)).isPresent()) {
                    Cource cource = courceRepo.findById(Long.valueOf(id)).get();
                    Integer testType = courceRepo.findById(Long.valueOf(id)).get().getTestEnable();
                    //список с лекциями да тестированием, что будем отдавать клиенту
                    LectionListForStudent enteranceTest = new LectionListForStudent();
                    boolean enterenceTestSuccess = false;
                    int lectionCountInCource = 0;
                    int successLectionTestCountInCource = 0;


                    //если к курсу прикреплено хоть какое то тестирование
                    if (testType != 0) {
                        //если есть вступительное тестирование то формируем его и проверяем решено ли оно удачно
                    /*
                    так как я поменял структуру тестирования, данный блок нужно будет переработать
                    * **/
                        if ((testType == 1) || (testType == 3) || (testType == 4)) {
                            List<StudentTestAttempt> successUserEnterenceTestAttemptList;
                            successUserEnterenceTestAttemptList = studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(), Long.valueOf(id), 1);
                            if (!successUserEnterenceTestAttemptList.isEmpty()) {
                                enterenceTestSuccess = true;
                                enteranceTest.setTestSuccess(true);
                            } else enteranceTest.setTestSuccess(false);
                            enteranceTest.setTestType(1);
                            //подумать тут
                            enteranceTest.setTestUrl("/testattempt?courceId=" + id + "&testType=1");
                            enteranceTest.setCourceName(cource.getCourceName());
                            try {
                                if (cource.getEnCourceName() != null) {
                                    enteranceTest.setEnCourceName(cource.getEnCourceName());
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            //заталкиваем в список тестирование
                            urlList.add(enteranceTest);
                        }

                        //далее смотрим есть ли тестирования, привязанные к лекциям
                        if ((testType == 2) || ((testType == 4) & (enterenceTestSuccess))) {

                            List<Lection> courceLectionsList = lectionRepo.findByCourceIdAndDeletedIsFalseOrderByLectionPositionAsc(Long.valueOf(id));
                            lectionCountInCource = courceLectionsList.size();

                            for (int i = 0; i < lectionCountInCource; i++) {
                                if (!courceLectionsList.get(i).getLectionUrl().isEmpty()) {
                                    List<StudentTestAttempt> accesAttemptList;
                                    //первую лекцию добавляем без тестирования, однако подразумеваем в дальнейшем вводное тестирование

                                    if (courceLectionsList.get(i).getLectionPosition().equals(1)) {
                                        LectionListForStudent firstLectionForList = new LectionListForStudent();
                                        firstLectionForList.setId(courceLectionsList.get(i).getId());
                                        firstLectionForList.setCourceName(courceLectionsList.get(i).getCource().getCourceName());
                                        try {
                                            if (courceLectionsList.get(i).getCource().getEnCourceName() != null) {
                                                firstLectionForList.setEnCourceName(courceLectionsList.get(i).getCource().getEnCourceName());
                                            }
                                        } catch (Exception e) {
                                            e.printStackTrace();
                                        }
                                        if (LocalDateTime.now().isAfter(courceLectionsList.get(i).getAccessBeginDate())) {
                                            try {
                                                if (courceLectionsList.get(i).getEnLectionName() != null) {
                                                    firstLectionForList.setEnLectionName(courceLectionsList.get(i).getEnLectionName());
                                                }
                                            } catch (Exception e) {
                                                e.printStackTrace();
                                            }
                                            firstLectionForList.setLectionName(courceLectionsList.get(i).getLectionName());
                                            firstLectionForList.setTestUrl("/testattempt?lectionId=" + firstLectionForList.getId() + "&testType=2");
                                            firstLectionForList.setLectionUrl(Base64.getUrlEncoder().encodeToString(courceLectionsList.get(i).getLectionUrl().getBytes()));
                                            //Добавляю список файлов
                                            if (courceLectionsList.get(i).getFiles().size() > 0) {
                                                if (courceLectionsList.get(i).getFiles().size() > 0) {
                                                    List<File> ololoFile = new ArrayList<>();
                                                    for (int j = 0; j < courceLectionsList.get(i).getFiles().size(); j++) {
                                                        File tempFile = new File();
                                                        tempFile.setCreatorId(courceLectionsList.get(i).getFiles().get(j).getCreatorId());
                                                        tempFile.setCreateDateTime(courceLectionsList.get(i).getFiles().get(j).getCreateDateTime());
                                                        tempFile.setFileDescription(courceLectionsList.get(i).getFiles().get(j).getFileDescription());
                                                        tempFile.setFileName(courceLectionsList.get(i).getFiles().get(j).getFileName());
                                                        tempFile.setLectionId(courceLectionsList.get(i).getFiles().get(j).getLectionId());
                                                        tempFile.setRandomFileName(courceLectionsList.get(i).getFiles().get(j).getRandomFileName());
                                                        ololoFile.add(tempFile);
                                                    }
                                                    firstLectionForList.setFileList(ololoFile);
                                                }
                                            }

                                            accesAttemptList = studentTestAttemptRepo.findByStudentIdAndLectionIdAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(), courceLectionsList.get(i).getId());
                                            if (!accesAttemptList.isEmpty()) {
                                                firstLectionForList.setTestSuccess(true);
                                                successLectionTestCountInCource++;
                                            } else firstLectionForList.setTestSuccess(false);
                                            firstLectionForList.setAccessBeginDate(courceLectionsList.get(i).getAccessBeginDate());
                                            firstLectionForList.setAccessBegin(true);
                                        } else {
                                            firstLectionForList.setLectionName(courceLectionsList.get(i).getLectionName());
                                            firstLectionForList.setAccessBeginDate(courceLectionsList.get(i).getAccessBeginDate());
                                            firstLectionForList.setAccessBegin(false);
                                        }
                                        firstLectionForList.setTestType(2);
                                        //нужно подумать над этим решением
                                        urlList.add(firstLectionForList);

                                    } else {

                                        if (!studentTestAttemptRepo.findByStudentIdAndLectionIdAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(), courceLectionsList.get(i - 1).getId()).isEmpty()) {
                                            LectionListForStudent lectionForList = new LectionListForStudent();
                                            lectionForList.setId(courceLectionsList.get(i).getId());
                                            lectionForList.setCourceName(courceLectionsList.get(i).getCource().getCourceName());
                                            try {
                                                if (courceLectionsList.get(i).getCource().getEnCourceName() != null) {
                                                    lectionForList.setEnCourceName(courceLectionsList.get(i).getCource().getEnCourceName());
                                                }
                                            } catch (Exception e) {
                                                e.printStackTrace();
                                            }

                                            if (LocalDateTime.now().isAfter(courceLectionsList.get(i).getAccessBeginDate())) {
                                                lectionForList.setLectionName(courceLectionsList.get(i).getLectionName());
                                                try {
                                                    if (courceLectionsList.get(i).getEnLectionName() != null) {
                                                        lectionForList.setEnLectionName(courceLectionsList.get(i).getEnLectionName());
                                                    }

                                                } catch (Exception e) {
                                                    e.printStackTrace();
                                                }
                                                //Добавляю список файлов
                                                if (courceLectionsList.get(i).getFiles().size() > 0) {
                                                    if (courceLectionsList.get(i).getFiles().size() > 0) {
                                                        List<File> ololoFile = new ArrayList<>();
                                                        for (int j = 0; j < courceLectionsList.get(i).getFiles().size(); j++) {
                                                            File tempFile = new File();
                                                            tempFile.setCreatorId(courceLectionsList.get(i).getFiles().get(j).getCreatorId());
                                                            tempFile.setCreateDateTime(courceLectionsList.get(i).getFiles().get(j).getCreateDateTime());
                                                            tempFile.setFileDescription(courceLectionsList.get(i).getFiles().get(j).getFileDescription());
                                                            tempFile.setFileName(courceLectionsList.get(i).getFiles().get(j).getFileName());
                                                            tempFile.setLectionId(courceLectionsList.get(i).getFiles().get(j).getLectionId());
                                                            tempFile.setRandomFileName(courceLectionsList.get(i).getFiles().get(j).getRandomFileName());
                                                            ololoFile.add(tempFile);
                                                        }
                                                        lectionForList.setFileList(ololoFile);
                                                    }
                                                }
                                                lectionForList.setLectionUrl(Base64.getUrlEncoder().encodeToString(courceLectionsList.get(i).getLectionUrl().getBytes()));
                                                lectionForList.setTestUrl("/testattempt?lectionId=" + courceLectionsList.get(i).getId() + "&testType=2");
                                                if (!studentTestAttemptRepo.findByStudentIdAndLectionIdAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(), courceLectionsList.get(i).getId()).isEmpty()) {
                                                    lectionForList.setTestSuccess(true);
                                                    successLectionTestCountInCource++;
                                                }
                                                lectionForList.setAccessBeginDate(courceLectionsList.get(i).getAccessBeginDate());
                                                lectionForList.setAccessBegin(true);
                                            } else {
                                                lectionForList.setAccessBeginDate(courceLectionsList.get(i).getAccessBeginDate());
                                                lectionForList.setAccessBegin(false);
                                                lectionForList.setLectionName(courceLectionsList.get(i).getLectionName());
                                                try {
                                                    if (courceLectionsList.get(i).getEnLectionName() != null) {
                                                        lectionForList.setEnLectionName(courceLectionsList.get(i).getEnLectionName());
                                                    }

                                                } catch (Exception e) {
                                                    e.printStackTrace();
                                                }
                                            }
                                            lectionForList.setTestType(2);
                                            urlList.add(lectionForList);
                                        }
                                    }
                                }
                            }
                            // ну а тут нужно проверить есть ли у нас финальное тестирование, если оно есть то заебенитть сцылку не него в список и отдать жертве
                        }
                        if ((testType == 4) || (testType == 3)) {
                            //ну а тут тупо стоит проверить успешно ли закончено вступительное тестирование
                            if (((successLectionTestCountInCource > 0) & (successLectionTestCountInCource == lectionCountInCource)) || ((testType == 3) & (enterenceTestSuccess))) {
                                LectionListForStudent finalTest = new LectionListForStudent();
                                List<StudentTestAttempt> successUserFinalTestAttemptList;
                                successUserFinalTestAttemptList = studentTestAttemptRepo.findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(user.getId(), Long.valueOf(id), 3);
                                if (!successUserFinalTestAttemptList.isEmpty()) {
                                    finalTest.setTestSuccess(true);
                                } else enteranceTest.setTestSuccess(false);

                                finalTest.setTestType(3);
                                //подумать тут
                                finalTest.setTestUrl("/testattempt?courceId=" + id + "&testType=3");
                                finalTest.setCourceName(cource.getCourceName());
                                try {
                                    if (cource.getEnCourceName() != null) {
                                        finalTest.setEnCourceName(cource.getEnCourceName());
                                    }

                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                //заталкиваем в список тестирование
                                urlList.add(finalTest);
                            }
                        }
                        return urlList;
                    }
                    //иначе отдаем весь список
                    else {
                        List<Lection> courceLectionsList = lectionRepo.findByCourceIdAndDeletedAndAccessBeginDateIsNotNullOrderByLectionPositionAsc(Long.valueOf(id), false);

                        for (Lection lection : courceLectionsList) {
                            LectionListForStudent lectionList = new LectionListForStudent();

                            lectionList.setId(lection.getId());
                            lectionList.setCourceName(lection.getCource().getCourceName());
                            try {
                                if (lection.getCource().getEnCourceName() != null) {
                                    lectionList.setEnCourceName(lection.getCource().getEnCourceName());
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            if (lection.getFiles().size() > 0) {
                                List<File> ololoFile = new ArrayList<>();
                                for (int j = 0; j < lection.getFiles().size(); j++) {
                                    File tempFile = new File();
                                    tempFile.setCreatorId(lection.getFiles().get(j).getCreatorId());
                                    tempFile.setCreateDateTime(lection.getFiles().get(j).getCreateDateTime());
                                    tempFile.setFileDescription(lection.getFiles().get(j).getFileDescription());
                                    tempFile.setFileName(lection.getFiles().get(j).getFileName());
                                    tempFile.setLectionId(lection.getFiles().get(j).getLectionId());
                                    tempFile.setRandomFileName(lection.getFiles().get(j).getRandomFileName());
                                    ololoFile.add(tempFile);
                                }
                                lectionList.setFileList(ololoFile);
                            }
                            LocalDateTime beginDate = lection.getAccessBeginDate();
                            lectionList.setAccessBeginDate(beginDate);
                            lectionList.setLectionName(lection.getLectionName());
                            try {
                                if (lection.getEnLectionName() != null) {
                                    lection.setEnLectionName(lection.getEnLectionName());
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            if (beginDate.isBefore(LocalDateTime.now())) {
                                if (lection.getLectionUrl() != null) {
                                    lectionList.setLectionUrl(Base64.getUrlEncoder().encodeToString(lection.getLectionUrl().getBytes()));
                                }
                                lectionList.setAccessBegin(true);
                            } else {
                                lectionList.setAccessBegin(false);
                            }

                            lectionList.setTestType(0);
                            lectionList.setTestSuccess(null);
                            urlList.add(lectionList);
                        }
                        return urlList;
                    }

                } else return null;
            } else return null;
        } else return null;
    }
}
