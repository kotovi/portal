package ru.geekbase.portal.controller;


import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.NotificationRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static ru.geekbase.portal.domain.Roles.*;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;


@RestController
@Api(description = "контроллер  для  управления пользователями в системе")
public class UserRestController {

    private final UserRepo userRepo;
    private final NotificationRepo notificationRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    UserRestController(UserRepo userRepo,
                       NotificationRepo notificationRepo,
                       PasswordEncoder passwordEncoder){
        this.userRepo =userRepo;
        this.notificationRepo = notificationRepo;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/userForSelectList")
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг, отдающий всех доступных пользователей в системе")
    public List<User> listForSelect(@AuthenticationPrincipal User sessionUser){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if (sessionUser.getRoles().contains(USER)) {
            return userRepo.findAll();
        }
        else return null;
    }

    @GetMapping("/userlist")
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг, отдающий всех доступных пользователей в системе с ролью обучающегося")
    public List<User> list(@AuthenticationPrincipal User sessionUser){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if (sessionUser.getRoles().contains(ADMIN)) {
            return userRepo.findAllByRolesIsNotContaining(STUDENT);
        }
        else return null;
    }




    @GetMapping("/userlist/{id}")
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг отдает пользователя по id")
    public User getOne(@PathVariable("id") User user,
                       @AuthenticationPrincipal User sessionUser){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        sessionUser = getUserFromAuthority(sessionUser, authentication, userRepo);

        if (sessionUser.getRoles().contains(ADMIN)){
            return user;
        }
        else return null;

    }

    @JsonView(LectionView.ForLectionList.class)
    @PostMapping("/userlist")
    @ApiOperation("мапинг для создания пользователя")
    public User create(@RequestBody  User user,
                       Notification notification,
                       @AuthenticationPrincipal User creator){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        creator = getUserFromAuthority(creator, authentication, userRepo);

        if(creator.getRoles().contains(ADMIN)) {

            String clearPassword = user.getPassword();
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setActive(user.isActive());
            user.setRoles(Collections.singleton(USER));
            user.setDeleted(false);
            user.setNotificationUUID(UUID.randomUUID().toString());
            user.setPasswordResetUUID(UUID.randomUUID().toString());
            user.setRegistrationDate(LocalDateTime.now());
            user.setNotificationAgree(true);

            notification.setNotificationRecipient(user.getUserEmail());
            notification.setNotificationSubject("Регистрация на платформе для записи видео лекций ИГМУ");
            notification.setNotificationBody("Здравствуйте," + user.getFirstname() + " " + user.getSecname() + " " + user.getLastname() + "! \n" +
                    "Вы зарегистрированы на https://portal.ismu.baikal.ru , для входа в систему используйте следующие учетные данные:" +
                    "\n Логин:" + user.getUsername() + " " +
                    "\n пароль:" + clearPassword +
                    "\n \n Это письмо было отправлено Вам, так как адрес " + user.getUserEmail() + " был указан при регистрации на https://portal.ismu.baikal.ru" + " " +
                    "\n \n Для отказа от получения уведомлений перейдите по ССЫЛКЕ: https://portal.ismu.baikal.ru/unsubscribe/" + user.getNotificationUUID());

            notification.setUnsubscribeUUID(user.getNotificationUUID());
            notification.setCreateNotificationDateTime(LocalDateTime.now());
            notification.setNotificationType(0);
            notification.setNotificationStatus(0);
            notification.setSourceId(user.getId());
            notificationRepo.save(notification);
            return userRepo.save(user);
        } else return null;

    }

    @PutMapping("/userlist/{id}")
    @ApiOperation("мапинг для редактирования пользователя")
    public User update(@PathVariable("id") User userFromDb,
                       @RequestBody User user,
                       Notification notification,
                       @AuthenticationPrincipal User creator){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        creator = getUserFromAuthority(creator, authentication, userRepo);

    if(creator.getRoles().contains(ADMIN)) {
        //подумать что тут происходит
        if (user.getPassword() == null) {
            if (user.getUserGroup() == 0) user.setUserGroup(null);

            BeanUtils.copyProperties(user,
                    userFromDb,
                    "id",
                    "password",
                    "userRole",
                    "isDeleted",
                    "notificationUUID",
                    "passwordResetUUID");
        } else {
            if (user.getUserGroup() == 0) user.setUserGroup(null);
            BeanUtils.copyProperties(user,
                    userFromDb,
                    "id",
                    "userRole",
                    "isDeleted",
                    "notificationUUID",
                    "passwordResetUUID");


            notification.setNotificationRecipient(userFromDb.getUserEmail());
            notification.setNotificationSubject("Изменение пароля на платформе для записи видео лекций");
            notification.setNotificationBody("Здравствуйте," + userFromDb.getFirstname() + " " + userFromDb.getLastname() + "! \n" +
                    "Ваш новый пароль:" + user.getPassword());
            notification.setCreateNotificationDateTime(LocalDateTime.now());
            notification.setNotificationType(0);
            notification.setNotificationStatus(0);
            notification.setSourceId(userFromDb.getId());
            notificationRepo.save(notification);

            userFromDb.setPassword(passwordEncoder.encode(userFromDb.getPassword()));
        }
        return userRepo.save(userFromDb);
    } else return null;
    }
    @ApiOperation("мапинг для удаления, деактивируем пользователя")
    @DeleteMapping("/userlist/{id}")
    public User delete(@PathVariable("id") User userForDelet,
                       @RequestBody User user,
                       @AuthenticationPrincipal User creator ){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        creator = getUserFromAuthority(creator, authentication, userRepo);

        if (creator.getRoles().contains(ADMIN)){
            userForDelet.setDeleted(true);
            userForDelet.setActive(false);
            userForDelet.setDeleteDate(LocalDateTime.now());
            userForDelet.setWhoDeleted(user.getId());
            return userRepo.save(userForDelet);
        } else return null;
    }

    }

