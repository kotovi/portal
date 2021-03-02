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
import ru.geekbase.portal.repos.CourceForStudentsRepo;
import ru.geekbase.portal.repos.UserGroupRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.util.WsSender;
import java.time.LocalDateTime;
import java.util.List;
import java.util.function.BiConsumer;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@JsonView(LectionView.MinimalList.class)
@RequestMapping("/courcestudents")
@Api(description = "Контроллер для прикрепления контингента к курсам")
public class CourceForStudentsRestController {

    private final CourceForStudentsRepo courceForStudentsRepo;
    private final UserGroupRepo userGroupRepo;
    private final BiConsumer<EventType, CourceForStudents> wsSender;
    private final UserRepo userRepo;

@Autowired
public  CourceForStudentsRestController(CourceForStudentsRepo courceForStudentsRepo,
                                        WsSender wsSender,
                                        UserGroupRepo userGroupRepo,
                                        UserRepo userRepo){
    this.courceForStudentsRepo=courceForStudentsRepo;
    this.userGroupRepo = userGroupRepo;
    this.wsSender=wsSender.getSender(ObjectType.COURCEFORSTUDENTS, LectionView.MinimalList.class);
    this.userRepo = userRepo;
    }


    @GetMapping
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("Данный маппинг отдает весь список курсов с назначенным доступом, скорее всего он избыточен")
    public List<CourceForStudents> list(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(
           (authentication.getAuthorities().contains(Roles.ADMIN)) ||
           (authentication.getAuthorities().contains(Roles.LECTOR)) ||
           (authentication.getAuthorities().contains(Roles.USER)))
        {
            return  courceForStudentsRepo.findAll();
        } else return  null;
    }

    @GetMapping("{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("Метд возвращает перечень доступа для курса с id")
    public List<CourceForStudents> list(@PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(
           (authentication.getAuthorities().contains(Roles.ADMIN)) ||
           (authentication.getAuthorities().contains(Roles.LECTOR)) ||
           (authentication.getAuthorities().contains(Roles.USER)))
        {
            return  courceForStudentsRepo.findAllByCourceId(Long.valueOf(id));
        } else return  null;
    }

    @PostMapping
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("Метод для добавления доступа слушателей к курсу")
    public CourceForStudents create(@RequestBody CourceForStudents courceForStudents,
                            @AuthenticationPrincipal User user) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(
           (authentication.getAuthorities().contains(Roles.ADMIN)) ||
           (authentication.getAuthorities().contains(Roles.LECTOR)) ||
           (authentication.getAuthorities().contains(Roles.USER))
        ){

            user = getUserFromAuthority(user, authentication, userRepo);
            courceForStudents.setCreatorId(user.getId());
            courceForStudents.setCreateDate(LocalDateTime.now());

            if (userGroupRepo.findById(courceForStudents.getUserGroupId()).isPresent()){
                courceForStudents.setUserGroup(userGroupRepo.findById(courceForStudents.getUserGroupId()).get());
            }
            courceForStudents.setUser(user);
            courceForStudentsRepo.saveAndFlush(courceForStudents);
            wsSender.accept(EventType.CREATE,courceForStudents);
            return courceForStudents;
        } else return null;
    }

        @PutMapping("{id}")
        @JsonView(LectionView.MinimalList.class)
        @ApiOperation("Метод для правки доступа слушателей к курсу")
        public CourceForStudents update(@PathVariable("id") CourceForStudents courceForStudentsFromDb,
                @RequestBody CourceForStudents courceForStudents) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(
              (authentication.getAuthorities().contains(Roles.ADMIN)) ||
              (authentication.getAuthorities().contains(Roles.LECTOR)) ||
              (authentication.getAuthorities().contains(Roles.USER)))
            {
                BeanUtils.copyProperties(courceForStudents,
                        courceForStudentsFromDb,
                        "id",
                        "creatorId",
                        "createDate");

                wsSender.accept(EventType.UPDATE,courceForStudentsFromDb);
                return courceForStudentsRepo.save(courceForStudentsFromDb);
            } else return null;
        }

        @DeleteMapping("{id}")
        @JsonView(LectionView.MinimalList.class)
        @ApiOperation("Метод удаления доступа слушателей к курсу")
        public void delete(@PathVariable("id") CourceForStudents courceForStudents){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(
               (authentication.getAuthorities().contains(Roles.ADMIN)) ||
               (authentication.getAuthorities().contains(Roles.LECTOR)) ||
               (authentication.getAuthorities().contains(Roles.USER))
            ){
                wsSender.accept(EventType.REMOVE,courceForStudents);
                courceForStudentsRepo.delete(courceForStudents);
            }
        }
}
