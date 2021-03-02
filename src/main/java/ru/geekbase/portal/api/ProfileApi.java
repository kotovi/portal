package ru.geekbase.portal.api;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserRepo;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController

public class ProfileApi {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profileApi")
    @JsonView(LectionView.ForFront.class)
    public User getOne(@AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user,authentication,userRepo);
        return user;
    }

    @PutMapping("/profileApi/{id}")
    public User update(@PathVariable("id") User userFromDb,
                       @RequestBody User user,
                       @AuthenticationPrincipal User creator){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        creator = getUserFromAuthority(creator, authentication, userRepo);


        if(creator!=null) {
            System.out.println("User is not null");
            if (user.getId().equals(creator.getId())) {
                if((userFromDb.getId().equals(creator.getId()))){
                System.out.println("SAVING PROFILE");
                if (user.getPassword() == null) {
                    BeanUtils.copyProperties(user, userFromDb,
                            "firstname",
                            "lastname",
                            "secname",
                            "password",
                            "active",
                            "userDepartment",
                            "userGroup",
                            "userRole",
                            "isDeleted",
                            "whoDeleted",
                            "deleteDate",
                            "registrationDate",
                            "lastPasswordResetRequestDate",
                            "notificationUUID",
                            "passwordResetUUID",
                            "idInMirIsmu",
                            "roles");

                } else {
                    BeanUtils.copyProperties(user, userFromDb,
                            "firstname",
                            "lastname",
                            "secname",
                            "active",
                            "userDepartment",
                            "userGroup",
                            "userRole",
                            "isDeleted",
                            "whoDeleted",
                            "deleteDate",
                            "registrationDate",
                            "lastPasswordResetRequestDate",
                            "notificationUUID",
                            "passwordResetUUID",
                            "idInMirIsmu",
                            "roles");
                    userFromDb.setPassword(passwordEncoder.encode(userFromDb.getPassword()));

                }
                userFromDb.setUsername(userFromDb.getUserEmail());
                return userRepo.saveAndFlush(userFromDb);
            } else return null;
            } else return null;
        }else return null;

    }
}
