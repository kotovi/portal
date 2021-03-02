package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.LectionViewsRepo;
import ru.geekbase.portal.repos.StudentTestAttemptRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@Api(description = "контроллер для анализа статистики просмотров и тестирования лекции")
public class LectionStatisticRestCointroller {
    private final LectionViewsRepo lectionViewsRepo;
    private final StudentTestAttemptRepo studentTestAttemptRepo;
    private final UserRepo userRepo;

@Autowired
public LectionStatisticRestCointroller(LectionViewsRepo lectionViewsRepo,
                                       StudentTestAttemptRepo studentTestAttemptRepo,
                                       UserRepo userRepo)  {
    this.lectionViewsRepo = lectionViewsRepo;
    this.studentTestAttemptRepo = studentTestAttemptRepo;
    this.userRepo=userRepo;
}
    @GetMapping("/lectionStatistics/studentTestAttempts/{lectionId}")
    @ApiOperation("маппинг отдает статистику попыток прохождения тестирования пользователями")
    @JsonView({LectionView.MinimalList.class})
    public List<StudentTestAttempt> lectionTestAttemptList(@PathVariable("lectionId") Long lectionId,
                                                           @AuthenticationPrincipal User user){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    user = getUserFromAuthority(user, authentication, userRepo);

    if(
       (user.getRoles().contains(Roles.LECTOR)) ||
       (user.getRoles().contains(Roles.ADMIN)) ||
       (user.getRoles().contains(Roles.USER))
    ) {
        return studentTestAttemptRepo.findByLectionIdOrderByStudentId(lectionId);
    } else return null;
    }

    @GetMapping("/lectionStatistics/lectionViews/{lectionId}")
    @JsonView({LectionView.MinimalList.class})
    @ApiOperation("маппинг отдает статистику просмотров лекций слушателями")
    public List<LectionViews> lectionViews(@PathVariable("lectionId") Long lectionId,
                                           @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.USER))
        ){
            return lectionViewsRepo.findByLectionIdOrderByAddTime(lectionId);
        } else return null;

    }
}
