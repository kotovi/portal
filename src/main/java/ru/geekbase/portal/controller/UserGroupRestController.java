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
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.UserGroupRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.time.LocalDateTime;
import java.util.List;


import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/usergroup")
@Api(description = "контроллер  для  управления группами пользователей")
public class UserGroupRestController {

    private final UserGroupRepo userGroupRepo;
    private final UserRepo userRepo;


    @Autowired
    public UserGroupRestController(UserGroupRepo userGroupRepo,
                                   UserRepo userRepo){
        this.userGroupRepo = userGroupRepo;
        this.userRepo = userRepo;
    }

    @JsonView(LectionView.ForLectionList.class)
    @GetMapping
    @ApiOperation("мапинг, отдающий все доступные группы пользователей в системе")
    public List<UserGroup> list(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            return userGroupRepo.findAll();
        } else return  null;
    }

    @JsonView(LectionView.ForLectionList.class)
    @GetMapping("{id}")
    @ApiOperation("мапинг, отдающий группу с определенным  id")
    public UserGroup userGroup(@PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            if(userGroupRepo.findById(Long.valueOf(id)).isPresent()){
                return userGroupRepo.findById(Long.valueOf(id)).get();
            }else return  null;
         } else return  null;
    }

    @JsonView(LectionView.ForLectionList.class)
    @PostMapping
    @ApiOperation("мапинг для добавления группы пользователей")
    public UserGroup create(@RequestBody UserGroup userGroup,
                            @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user,authentication,userRepo);
        if(user.getRoles().contains(Roles.ADMIN)){
            userGroup.setCreatorId(user.getId());
            userGroup.setCreationDateTime(LocalDateTime.now());
            userGroup.setUserGroupIsActive(true);
            userGroupRepo.save(userGroup);
            return userGroup;
        } else return  null;


    }
    @JsonView(LectionView.ForLectionList.class)
    @PutMapping("{id}")
    @ApiOperation("мапинг для редактирования группы")
    public UserGroup update(@PathVariable("id") UserGroup userGroupFromDb,
                            @RequestBody UserGroup userGroup){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            BeanUtils.copyProperties(userGroup,
                                    userGroupFromDb,
                                    "id",
                                    "creatorId",
                                    "creationDateTime",
                                    "userGroupIsActive",
                                    "userGroupDeactivationTime");
            return userGroupRepo.save(userGroupFromDb);
        } else return null;
    }
    @JsonView(LectionView.ForLectionList.class)
    @DeleteMapping("{id}")
    @ApiOperation("мапинг для деактивации группы")
    public void delete(@PathVariable("id") UserGroup userGroup){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            userGroup.setUserGroupIsActive(false);
            userGroup.setUserGroupDeactivationTime(LocalDateTime.now());
        }
    }
}