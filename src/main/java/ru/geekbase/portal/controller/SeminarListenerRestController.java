package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.NotificationRepo;
import ru.geekbase.portal.repos.SeminarListenerRepo;
import ru.geekbase.portal.repos.SeminarRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.time.LocalDateTime;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@Api(description = "контроллер  для  управления слушателями семинара(единичные пользователи)")
public class SeminarListenerRestController {
    private final SeminarListenerRepo seminarListenerRepo;
    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;
    private final SeminarRepo seminarRepo;

    @Autowired
    public SeminarListenerRestController(SeminarListenerRepo seminarListenerRepo,
                                         UserRepo userRepo,
                                         NotificationRepo notificationRepo,
                                         SeminarRepo seminarRepo){
        this.seminarListenerRepo = seminarListenerRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.seminarRepo = seminarRepo;
    }

    @GetMapping("/seminarListener")
    @ApiOperation("мапинг для вывода слушателей, добавленный текущим пользователем из авторизации")
    @JsonView(LectionView.MinimalList.class)
    public List<SeminarListener> seminarList(@AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(Roles.USER)){
            return  seminarListenerRepo.findAllByCreatorId(user.getId());
        }
        else return null;
    }

    @GetMapping("/seminarListener/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг отдает список пользователей для вебинара с текущим id")
    public List<SeminarListener> seminar(@AuthenticationPrincipal User user,
                           @PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(Roles.USER)){
            if (seminarRepo.findById(Long.valueOf(id)).isPresent()){
                return seminarListenerRepo.findAllBySeminarId(Long.valueOf(id));
            }  else return null;
        }
        else return  null;
    }

    @PostMapping("/seminarListener")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг добавляет слушателя и отправляет уведомление")
    public SeminarListener createSeminarListener(
            @AuthenticationPrincipal User user,
            @RequestBody SeminarListener seminarListener,
            Notification notification){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.USER)
        ){

            seminarListener.setCreatorId(user.getId());
            seminarListener.setCreateDate(LocalDateTime.now());

            seminarListener.setUser(userRepo.findById(seminarListener.getListenerId()).get());

            SeminarListener createdListener =  seminarListenerRepo.save(seminarListener);

            notification.setNotificationRecipient(seminarListener.getUser().getUserEmail());
            notification.setNotificationSubject("Участие в семинаре на платформе цифровизации ИГМУ");
            notification.setUnsubscribeUUID(user.getNotificationUUID());
            notification.setNotificationBody(
                    "Здравствуйте," + seminarListener.getUser().getLastname() + " " + seminarListener.getUser().getFirstname() + " " + seminarListener.getUser().getSecname() + "! \n" +
                            "Вы добавлены в качестве участника в семинаре \""+ seminarRepo.findById(seminarListener.getSeminarId()).get().getSeminarName()+"\" платформы цифровизации ИГМУ! \n" +
                            "Семинар запланирован на:" + seminarRepo.findById(seminarListener.getSeminarId()).get().getSeminarBeginDate() +
                            "\n Для участия в семинаре Вам необходимо перейти на https://portal.ismu.baikal.ru в раздел \"Семинары\", как только семинар будет запущен организатором, Вы сможете присоедениться."+
                            "\n Для работы с ситемой требуется браузер Google Chrome или Mozilla Firefox, так же есть возможность участия с мобильных устройств под управлением iOS bkb Android." +
                            "\n \n Это письмо было отправлено Вам, так как адрес " + seminarListener.getUser().getUserEmail() + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                            "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + seminarListener.getUser().getNotificationUUID());
            notification.setCreateNotificationDateTime(LocalDateTime.now());
            notification.setNotificationStatus(0);
            notificationRepo.save(notification);

            return createdListener;

        }
        else return null;
    }

    @DeleteMapping("/seminarListener/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг для удаления слушателя")

    public void delete(@PathVariable("id") SeminarListener seminarListener,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getId().equals(seminarListener.getCreatorId())) ||
            (user.getRoles().contains(Roles.ADMIN))
        ) {
            seminarListenerRepo.delete(seminarListener);
        }
    }







}
