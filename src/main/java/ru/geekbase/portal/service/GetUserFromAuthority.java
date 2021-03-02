package ru.geekbase.portal.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserRepo;

import java.util.Map;

public class GetUserFromAuthority {

    public static User getUserFromAuthority(@AuthenticationPrincipal User user, Authentication authentication, UserRepo userRepo) {
        if(authentication.getPrincipal() instanceof DefaultOAuth2User){
            Map<String, Object> userData = (Map<String, Object>) ((DefaultOAuth2User) authentication.getPrincipal()).getAttributes().get("principal");
            Long idInISMU = Long.valueOf(String.valueOf(userData.get("id")));
            if (userRepo.findByIdInMirIsmu(idInISMU).isPresent()) {
                user = userRepo.findByIdInMirIsmu(idInISMU).get();
            }
        }
        return user;
    }
}
