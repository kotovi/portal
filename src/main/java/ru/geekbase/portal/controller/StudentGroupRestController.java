package ru.geekbase.portal.controller;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.domain.UserGroup;
import ru.geekbase.portal.repos.UserGroupRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.time.LocalDateTime;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/studentgroup")
@Api(description = "контроллер  для  управления группами слушателей")
public class StudentGroupRestController {
    private  final UserGroupRepo userGroupRepo;
    private  final UserRepo userRepo;

    @Autowired
    StudentGroupRestController(UserGroupRepo userGroupRepo,
                               UserRepo userRepo){
        this.userGroupRepo =userGroupRepo;
        this.userRepo = userRepo;
    }


    @GetMapping
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг для получения списка групп слушателей")
    public List<UserGroup> list(@AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))  ||
           (user.getRoles().contains(Roles.LECTOR))
        ) {
            if(userGroupRepo.findAllByGroupType(2).isPresent()){
                return userGroupRepo.findAllByGroupType(2).get();
            } else return  null;
        } else return  null;
    }

    @PostMapping
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг для добавления группы слушателей, проверить на сколько он нужен")
    public UserGroup create (@RequestBody UserGroup userGroup,
                             @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getRoles().contains(Roles.ADMIN)) ||
            (user.getRoles().contains(Roles.USER))  ||
            (user.getRoles().contains(Roles.LECTOR))
        ) {
            userGroup.setCreatorId(user.getId());
            userGroup.setGroupType(2);
            userGroup.setCreationDateTime(LocalDateTime.now());
            userGroupRepo.save(userGroup);
            return userGroup;
        } else return null;
    }

    @PutMapping("{id}")
    @JsonView(LectionView.ForLectionList.class)
    @ApiOperation("мапинг для редактирования группы слушателей")
    public UserGroup update(@PathVariable("id") UserGroup userGroupFromDb,
                            @RequestBody UserGroup userGroup,
                            @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
           user.getRoles().contains(Roles.ADMIN)
        ){
            BeanUtils.copyProperties(userGroup,
                    userGroupFromDb,
                    "id",
                    "creatorId",
                    "creationDateTime",
                    "groupType",
                    "userGroupIsActive",
                    "userGroupDeactivationTime");
            return  userGroupRepo.save(userGroupFromDb);
        } else return null;
    }
    @DeleteMapping("{id}")
    @ApiOperation("мапинг для удаления группы слушателей, метим но не удаляем")
    public void delete(@PathVariable("id") UserGroup userGroup,
                       @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.ADMIN)
        ){
            userGroup.setUserGroupDeactivationTime(LocalDateTime.now());
            userGroup.setUserGroupIsActive(false);
        }
    }
}
