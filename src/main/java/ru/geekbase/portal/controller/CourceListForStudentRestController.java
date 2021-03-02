package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.geekbase.portal.domain.CourceForStudents;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.CourceForStudentsRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/courceListForStudent")
@JsonView(LectionView.MinimalList.class)
@Api(description = "Контроллер для отдачи слушателю перечня доступных курсов")
public class CourceListForStudentRestController {
    private final CourceForStudentsRepo courceForStudentsRepo;
    private final UserRepo userRepo;


@Autowired
CourceListForStudentRestController(CourceForStudentsRepo courceForStudentsRepo,
                                   UserRepo userRepo)
{
    this.courceForStudentsRepo = courceForStudentsRepo;
    this.userRepo = userRepo;
}

@GetMapping
@ApiOperation("Данный маппинг  список курсов, доступный для пользователя")
@JsonView(LectionView.MinimalList.class)
    public List<CourceForStudents>  list(@AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        Long userGroupId = user.getUserGroup();
        List<CourceForStudents> unfilteredList = courceForStudentsRepo.findAllByUserGroupId(userGroupId);
        List<CourceForStudents> filteredList = new ArrayList<>();
    for (CourceForStudents courceForStudents : unfilteredList) {
        if (
            (courceForStudents.getAccessBeginDate().isBefore(LocalDateTime.now())) &
             (courceForStudents.getAccessEndDate().isAfter(LocalDateTime.now()))
        ) {
            filteredList.add(courceForStudents);
        }
    }
    return filteredList;
    }
}