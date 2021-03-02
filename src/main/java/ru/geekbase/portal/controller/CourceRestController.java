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
import ru.geekbase.portal.dto.EventType;
import ru.geekbase.portal.dto.ObjectType;
import ru.geekbase.portal.repos.CourceRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.util.WsSender;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.function.BiConsumer;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/cource")
@Api(description = "контроллер для формирования курсов")
public class CourceRestController {

    private final CourceRepo courceRepo;
    private final UserRepo userRepo;
    private final BiConsumer<EventType, Cource> wsSender;

    @Autowired
    public CourceRestController(CourceRepo courceRepo,
                                UserRepo userRepo,
                                WsSender wsSender){
        this.courceRepo = courceRepo;
        this.userRepo = userRepo;
        this.wsSender = wsSender.getSender(ObjectType.COURCE, LectionView.ForFront.class);
    }

    @GetMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("Данный маппинг отдает весь список курсов, если пользователь имеет роль администратора," +
            "в противном случае отдается перечень курсов, принадлежащих группе, в которую входит пользователь")
            public List<Cource> list(
            @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(user.getRoles().contains(Roles.ADMIN)){
           return  courceRepo.findAllByIsDeleted(false);
        } else {
           return courceRepo.findAllByUserGroupAndDeleteDateIsNull(user.getUserGroup());
        }
    }

    @GetMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("Данный маппинг отдает курс с определенным id")
    public Optional<Cource> list(@PathVariable("id") String id,
                              @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(user.getRoles().contains(Roles.USER)) {
            return courceRepo.findAllById(Long.valueOf(id));
        } else return Optional.empty();
    }

    @PostMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("Маппинг для добавления курса, курс будет создан только при условии привязки пользователя к группепе")
    public Cource create(
            @AuthenticationPrincipal User user,
            @RequestBody Cource cource) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER)) ||
           (user.getRoles().contains(Roles.LECTOR))
        ) {
            if(user.getUserGroup()!=null){
                cource.setUserGroup(user.getUserGroup());
                cource.setCreatorId(user.getId());
                cource.setDeleted(false);
                cource.setUser(user);
                Cource updatedCource = courceRepo.save(cource);
                wsSender.accept(EventType.UPDATE, updatedCource);
                return updatedCource;
            } else return null;
        } else return null;
    }

    @PutMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("Маппинг для редактирования курса," +
            " курс редактируется создателем, администратором или членом группы")
    public Cource update(
            @AuthenticationPrincipal User user,
            @PathVariable("id") Cource courceFromDb,
            @RequestBody Cource cource){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

            if(
               (user.getRoles().contains(Roles.ADMIN)) ||
               (courceFromDb.getCreatorId().equals(user.getId()) ||
               (courceFromDb.getUserGroup().equals(user.getUserGroup()))
               )
            ) {
                if(user.getRoles().contains(Roles.ADMIN)){
                    BeanUtils.copyProperties(cource,
                            courceFromDb,
                            "id",
                            "creatorId",
                            "isDeleted",
                            "enCourceName",
                            "enCourceDescription",
                            "user");
                } else {
                    BeanUtils.copyProperties(cource,
                            courceFromDb,
                            "id",
                            "creatorId",
                            "userGroup",
                            "isDeleted",
                            "enCourceName",
                            "enCourceDescription",
                            "user");
                }
                Cource updatedCource = courceRepo.saveAndFlush(courceFromDb);
                wsSender.accept(EventType.UPDATE, updatedCource);
                return updatedCource;
            } else return null;

    }

    @DeleteMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("Маппинг для удаления курса," +
            " по определенным соображением курс не удаляем, а помечаем удаленным, " +
            "права у автора или администратора")
    public void delete(@PathVariable("id") Cource cource,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getRoles().contains(Roles.ADMIN)) ||
            (cource.getCreatorId().equals(user.getId()))
        ){
           cource.setDeleted(true);
           cource.setDeleteDate(LocalDateTime.now());
           cource.setWhoDeleted(user.getId());
           Cource updatedCource = courceRepo.save(cource);
           wsSender.accept(EventType.UPDATE, updatedCource);
        }
    }

}
