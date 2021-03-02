package ru.geekbase.portal.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.geekbase.portal.repos.UserRepo;


@RestController
@RequestMapping("/checkUser")
@Api(description = "Контроллер для проверки, зарегестрирован ли пользователь с указанным email")

public class CheckUserExistRestController {
    private final  UserRepo userRepo;

    @Autowired
    public CheckUserExistRestController(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    @GetMapping("{email}")
    @ApiOperation("Метод ждя проверки ящика")
    public  String userExist(@PathVariable("email") String userEmail){
        if (userRepo.findByUserEmail(userEmail).isPresent()) {
            return "{\"userExist\":1}";
        }
        else return  "{\"userExist\":0}";
    }

}
