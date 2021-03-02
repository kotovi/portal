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
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserRepo;

import java.util.Optional;


@Controller
    @JsonView(LectionView.ForFront.class)
    @RequestMapping("/unsubscribe")
    @Api(description = "контроллер  для отказа от получения уведомлений")
    public class UnsubscribeController {

        private final UserRepo userRepo;

        @Autowired
        UnsubscribeController(UserRepo userRepo){
         this.userRepo=userRepo;
        }

        String redirectUrl;
        @GetMapping("{id}")
        @ApiOperation("мапинг для отмены подписки на оповещение")
        public String Unsubscribe(@PathVariable("id") String id){
            Optional<User> user = userRepo.findByNotificationUUID(id);

            if(user.isPresent()){
                user.get().setNotificationAgree(false);
                userRepo.save(user.get());
                redirectUrl = "redirect:/success_unsubscrube";
            } else {
                redirectUrl = "redirect:/unsuccess_unsubscrube";
            }
            return redirectUrl;

        }
    }

