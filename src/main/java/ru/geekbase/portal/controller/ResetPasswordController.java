package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
//import org.apache.commons.lang3.RandomStringUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Controller
@JsonView(LectionView.ForLectionList.class)
@RequestMapping("/resetpassword")
@Api(description = "контроллер для генерации нового пароля")
public class ResetPasswordController {

    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    ResetPasswordController(UserRepo userRepo,
                            NotificationRepo notificationRepo,
                            PasswordEncoder passwordEncoder){
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.passwordEncoder = passwordEncoder;

    }


    String redirectUrl;
    @GetMapping("{uuid}")
    @ApiOperation("мапинг генерит новый пароль и отправляет его по почте в случае совпадения uuid, в противном случае посылает")
    public String Resetpassword(@PathVariable("uuid") String uuid, Notification notification){
        Optional<User> user = userRepo.findByPasswordResetUUID(uuid);

        if(user.isPresent()){
            String paswd = generateCommonLangPassword();

            user.get().setPassword(passwordEncoder.encode(paswd));
            notification.setNotificationRecipient(user.get().getUserEmail());
            notification.setNotificationSubject("Новый пароль для авторизации на сайте");
            notification.setNotificationBody(
                    "Здравствуйте," +user.get().getLastname()+" "+user.get().getFirstname()+" "+user.get().getSecname()+"! \n" +

                            "Вами был сделан запрос на сброс пароля для доступа к системе! \n" +
                            "Для входа в систему Вам необходимо авторизоваться со следующими учетными данными:" +
                            "\n Логин: "+ user.get().getUsername()+" " +
                            "\n Пароль: " +paswd+" "+
                            "\n \n Это письмо было отправлено Вам, так как адрес "+ user.get().getUserEmail()+" был указан при регистрации на https://portal.ismu.baikal.ru"+" "+
                            "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/"+user.get().getNotificationUUID());
            notification.setCreateNotificationDateTime(LocalDateTime.now());

            notification.setNotificationStatus(0);
            notification.setNotificationType(3);
            notification.setSourceId(user.get().getId());
            notification.setUnsubscribeUUID(user.get().getNotificationUUID());

            notification.setSourceId(user.get().getId());
            notificationRepo.save(notification);
            redirectUrl = "redirect:/success_reset_password";
            return redirectUrl;
        } else {
            redirectUrl = "redirect:/unsuccess_reset_password";
            return redirectUrl;
        }


    }

    public String generateCommonLangPassword() {
        String upperCaseLetters = RandomStringUtils.random(2, 65, 90, true, true);
        String lowerCaseLetters = RandomStringUtils.random(2, 97, 122, true, true);
        String numbers = RandomStringUtils.randomNumeric(2);
        String specialChar = RandomStringUtils.random(2, 33, 47, false, false);
        String totalChars = RandomStringUtils.randomAlphanumeric(2);
        String combinedChars = upperCaseLetters.concat(lowerCaseLetters)
                .concat(numbers)
                .concat(specialChar)
                .concat(totalChars);
        List<Character> pwdChars = combinedChars.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());
        Collections.shuffle(pwdChars);
        String password = pwdChars.stream()
                .collect(StringBuilder::new, StringBuilder::append, StringBuilder::append)
                .toString();
        return password;
    }
}
