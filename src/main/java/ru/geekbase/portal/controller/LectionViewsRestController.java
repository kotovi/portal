package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.LectionViews;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.LectionViewsRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.time.LocalDateTime;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/lectionviews")
@Api(description = "контроллер  для регистрации просмотров лекции(включая приблизительную продолжительность)")
public class LectionViewsRestController {
    private final LectionViewsRepo lectionViewsRepo;
    private final UserRepo userRepo;

    @Autowired
    LectionViewsRestController(LectionViewsRepo lectionViewsRepo,
                               UserRepo userRepo){
        this.userRepo = userRepo;
        this.lectionViewsRepo = lectionViewsRepo;
    }

    @PostMapping
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("маппинг для сохранения статистики")
    public LectionViews create(@AuthenticationPrincipal User user,
                               @RequestBody LectionViews lectionViews)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           (user.getRoles().contains(Roles.STUDENT)) ||
           (user.getRoles().contains(Roles.USER))
        ){
            lectionViews.setStudentId(user.getId());
            lectionViews.setAddTime(LocalDateTime.now());
            lectionViewsRepo.save(lectionViews);
            System.out.println("View successfully complete for user id: " + user.getId());
            return lectionViews;
        }else return  null;

    }

}
