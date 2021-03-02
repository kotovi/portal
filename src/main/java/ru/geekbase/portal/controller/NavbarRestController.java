package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserRepo;
import java.util.Map;


@RestController
@RequestMapping("/nav")
@Api(description = "контроллер  для панели навигации")

public class NavbarRestController {

    @Autowired
    private UserRepo userRepo;

    @GetMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг с данными для панели навигации")
    public User userList(@AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication.getAuthorities(): " + authentication.getAuthorities().toString());

        if (authentication.getPrincipal() instanceof DefaultOAuth2User) {
            Map<String, Object> userData = (Map<String, Object>) ((DefaultOAuth2User) authentication.getPrincipal()).getAttributes().get("principal");
            System.out.println("USER_DATA:" + authentication.toString());

            Long idInISMU = Long.valueOf(String.valueOf(userData.get("id")));
            System.out.println("idInISMU:" + idInISMU);

            if (userRepo.findByIdInMirIsmu(idInISMU).isPresent()) {
                User userFromIsmu = userRepo.findByIdInMirIsmu(idInISMU).get();
                if (userFromIsmu.getRoles().contains(Roles.STUDENT)) {
                    userFromIsmu.setUserRole(4);
                } else
                if (userFromIsmu.getRoles().contains(Roles.LECTOR)) {
                    userFromIsmu.setUserRole(3);
                } else

                if (userFromIsmu.getRoles().contains(Roles.USER)) {
                    userFromIsmu.setUserRole(3);
                } else
                if (userFromIsmu.getRoles().contains(Roles.MODERATOR)) {
                    userFromIsmu.setUserRole(2);
                } else
                if (userFromIsmu.getRoles().contains(Roles.ADMIN)) {
                    userFromIsmu.setUserRole(1);
                } else {
                    userFromIsmu.setUserRole(0);
                }
                return userFromIsmu;
            } else return null;


        } else {
            if (user != null) {

                if(userRepo.findAllById(user.getId()).isPresent()){
                    User userForNb = userRepo.findAllById(user.getId()).get();
                    if (user.getRoles().contains(Roles.STUDENT)) {
                        userForNb.setUserRole(4);
                    } else
                    if (user.getRoles().contains(Roles.LECTOR)) {
                        userForNb.setUserRole(3);
                    } else
                    if (user.getRoles().contains(Roles.USER)) {
                        userForNb.setUserRole(3);
                    } else
                    if (user.getRoles().contains(Roles.MODERATOR)) {
                        userForNb.setUserRole(2);
                    } else
                    if (user.getRoles().contains(Roles.ADMIN)) {
                        userForNb.setUserRole(1);
                    } else {
                        userForNb.setUserRole(0);
                    }
                    return userForNb;
                } else return null;
            } else return null;
        }
    }

}
