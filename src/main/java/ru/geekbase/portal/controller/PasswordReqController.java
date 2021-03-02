package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.Notification;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.NotificationRepo;
import ru.geekbase.portal.repos.UserRepo;


import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Controller
@JsonView(LectionView.ForLectionList.class)
@RequestMapping("/reqpassword")
@Api(description = "контроллер  для запроса сброса пароля")
public class PasswordReqController {
    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;

    @Autowired
    PasswordReqController(UserRepo userRepo,
                          NotificationRepo notificationRepo){
        this.userRepo=userRepo;
        this.notificationRepo =notificationRepo;

    }

    String redirectUrl;

    @GetMapping("{email}")
    @ApiOperation("маппинг для попытки сброса пароля с помощью зарегистророванной электронки")
    public String Resetpassword(@PathVariable("email") String email, Notification notification) {
        Optional<User> user = userRepo.findByUserEmail(email);
        if (user.isPresent()) {

            user.get().setPassworResetdUUID((UUID.randomUUID().toString()));
            user.get().setLastPasswordResetRequestDate(LocalDateTime.now());

            notification.setNotificationRecipient(user.get().getUserEmail());
            notification.setNotificationSubject("Запрос сброса пароля");
            notification.setNotificationBody(
                    "Здравствуйте," + user.get().getLastname() + " " + user.get().getFirstname() + " " + user.get().getSecname() + "! \n" +
                            "Вами был сделан запрос на сброс пароля для доступа к системе! \n" +
                            "\n \n Для сброса пароля перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/resetpassword/" + user.get().getPasswordResetUUID() + "  \n" +
                            "\n \n Если Вы не запрашивали сброс пароля - просто проигнорируйте это письмо.\n" +
                            "\n \n Это письмо было отправлено Вам, так как адрес " + user.get().getUserEmail() + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                            "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + user.get().getNotificationUUID());
            notification.setCreateNotificationDateTime(LocalDateTime.now());

            notification.setNotificationStatus(0);
            notification.setNotificationType(3);
            notification.setUnsubscribeUUID(user.get().getNotificationUUID());
            notification.setSourceId(user.get().getId());
            notificationRepo.save(notification);
            userRepo.save(user.get());

            redirectUrl = "redirect:/success_req_password";
            return redirectUrl;
        } else {
            redirectUrl = "redirect:/unsuccess_req_password";
            return redirectUrl;
        }
    }
}
