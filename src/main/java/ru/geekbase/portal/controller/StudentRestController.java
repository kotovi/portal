package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.Notification;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.NotificationRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static ru.geekbase.portal.domain.Roles.ADMIN;
import static ru.geekbase.portal.domain.Roles.STUDENT;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/students")
public class StudentRestController {

    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    StudentRestController(UserRepo userRepo,
                          NotificationRepo notificationRepo,
                          PasswordEncoder passwordEncoder){
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.passwordEncoder = passwordEncoder;

    }


    @JsonView(LectionView.ForLectionList.class)
    @GetMapping
    @ApiOperation("мапинг отдает пользователей с ролью обучающегося")
    public List<User> list(@AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(ADMIN)) {
            return userRepo.findAllByRolesIn(Collections.singleton(STUDENT));
        } else return null;

    }

    @PostMapping
    @ApiOperation("мапинг для добавления обучающегося")
    public User create(@RequestBody User user,
                       Notification notification,
                       @AuthenticationPrincipal User sessionUser){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if(sessionUser.getRoles().contains(ADMIN)){
            if (!userRepo.findByUserEmail(user.getUserEmail()).isPresent()) {
                user.setUsername(user.getUserEmail());
                user.setNotificationUUID(UUID.randomUUID().toString());
                user.setRoles(Collections.singleton(Roles.STUDENT));
                // user.setActive(true);

                notification.setNotificationRecipient(user.getUserEmail());
                notification.setNotificationSubject("Регистрация на платформе цифровизации ИГМУ");
                notification.setUnsubscribeUUID(user.getNotificationUUID());
                notification.setNotificationBody(
                        "Здравствуйте," + user.getLastname() + " " + user.getFirstname() + " " + user.getSecname() + "! \n" +
                                "Вы зарегистрировались в качестве слушателя платформы цифровизации ИГМУ! \n" +
                                "Для входа в систему Вам необходимо авторизоваться со следующими учетными данными:" +
                                "\n Логин: " + user.getUsername() + " " +
                                "\n Пароль: " + user.getPassword() + " " +

                                "\n \n Это письмо было отправлено Вам, так как адрес " + user.getUserEmail() + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                                "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + user.getNotificationUUID());
                notification.setCreateNotificationDateTime(LocalDateTime.now());
                user.setRegistrationDate(LocalDateTime.now());
                notification.setNotificationStatus(0);

                user.setActive(true);
                notificationRepo.save(notification);
                user.setPassword(passwordEncoder.encode(user.getPassword()));

                return userRepo.save(user);
            }
            else return null;
        } else return null;

    }

    @PutMapping("{id}")
    @ApiOperation("мапинг для редактирования обучающегося")
    public User update(@PathVariable("id") User userFromDb,
                       @RequestBody User user,
                       Notification notification,
                       @AuthenticationPrincipal User sessionUser){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if(sessionUser.getRoles().contains(ADMIN)){
            if(user.getPassword()==null) {
                if (user.getUserGroup()==0) user.setUserGroup(null);
                BeanUtils.copyProperties( user, userFromDb,  "id", "password", "userRole", "roles","isDeleted","userStudyGroupInMirIsmu","idInMirIsmu");
            } else{
                if (user.getUserGroup()==0) user.setUserGroup(null);
                BeanUtils.copyProperties( user, userFromDb, "id", "userRole", "roles", "isDeleted","userStudyGroupInMirIsmu","idInMirIsmu");

                notification.setNotificationRecipient(userFromDb.getUserEmail());
                notification.setNotificationSubject("Изменение пароля на платформе для записи видео лекций");
                notification.setNotificationBody("Здравствуйте," +userFromDb.getFirstname()+" "+userFromDb.getLastname()+"! \n" +
                 "Ваш новый пароль:"+userFromDb.getPassword() );
                notification.setCreateNotificationDateTime(LocalDateTime.now());
                notification.setNotificationType(0);
                notification.setNotificationStatus(0);
                notification.setSourceId(userFromDb.getId());
                notificationRepo.save(notification);

                userFromDb.setPassword(passwordEncoder.encode(userFromDb.getPassword()));
            }
            return userRepo.save(userFromDb);
        } else return  null;
    }

    @DeleteMapping("{id}")
    @ApiOperation("мапинг для списания обучающегося в бесправный утиль")
    public User delete(@PathVariable("id") User userForDelet,
                       @RequestBody User user,
                       @AuthenticationPrincipal User sessionUser){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if(sessionUser.getRoles().contains(ADMIN)){
            userForDelet.setDeleted(true);
            userForDelet.setActive(false);
            userForDelet.setDeleteDate(LocalDateTime.now());
            userForDelet.setWhoDeleted(user.getId());
            return userRepo.save(userForDelet);
        } else return null;

    }

}
