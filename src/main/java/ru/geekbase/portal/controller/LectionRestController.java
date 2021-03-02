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
import ru.geekbase.portal.dto.ObjectType;
import ru.geekbase.portal.dto.EventType;
import ru.geekbase.portal.repos.*;
import ru.geekbase.portal.util.WsSender;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.function.BiConsumer;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
//@RequestMapping("/lection")
@Api(description = "контроллер для работы с лекциями")
public class LectionRestController {
    private final LectionRepo lectionRepo;
    private final CourceRepo courceRepo;
    private final UserRepo userRepo;
    private final BiConsumer <EventType, Lection> wsSender;

    @Autowired
    public LectionRestController(LectionRepo lectionRepo,
                                 CourceRepo courceRepo,
                                 UserRepo userRepo,
                                 WsSender wsSender
                                 ) {
        this.lectionRepo =lectionRepo;
        this.courceRepo = courceRepo;
        this.userRepo = userRepo;
        this.wsSender = wsSender.getSender(ObjectType.LECTION, LectionView.MinimalList.class);
    }


    @GetMapping("/lection/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг отдает список лекций для курса с id")
    public List<Lection> list(@PathVariable("id") Long id,
                              @AuthenticationPrincipal User user){
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            user = getUserFromAuthority(user, authentication, userRepo);
            if(courceRepo.findById(id).isPresent()){
                if (
                    (Objects.equals(user.getUserGroup(), courceRepo.findById(id).get().getUserGroup()))||
                    (user.getRoles().contains(Roles.ADMIN))
                ){
                    return lectionRepo.findByCourceIdAndDeleteDateIsNullOrderByLectionPositionAsc(id);
                } else return null;
            } else return null;
    }



    @GetMapping("/lection/byUserGroup/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг отдает список лекций для группы пользователей с id")
    public List<Lection> listByUserGroup(@PathVariable("id") Long id,
                              @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(user.getUserGroup()!=null){
            if(
               (user.getUserGroup().equals(id)) ||
               (user.getRoles().contains(Roles.ADMIN))
            ) {
                return lectionRepo.findAllByUserGroup(id);
            } else return null;
        } else return null;
    }

    @GetMapping("/lection/info/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("маппинг отдает объект с лекцией по ее id, проверить где используется, возможно не нужен")
    public Lection listByUserGroup(@PathVariable("id") String id,
                                   @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            if (lectionRepo.findById(Long.valueOf(id)).isPresent()) {
                return lectionRepo.findById(Long.valueOf(id)).get();
            } else {
                return null;
            }
        } else return null;

    }

    @PostMapping("/lection")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для добавления лекции")
    public Lection create(@AuthenticationPrincipal User user,
                            @RequestBody Lection lection)  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        Long courceCreatorId = null;
        Long courceCreatorUserGroupId = null;

       if(courceRepo.findById(lection.getCourceId()).isPresent()){
          courceCreatorId = courceRepo.findById(lection.getCourceId()).get().getCreatorId();

       }

       if(userRepo.findById(courceCreatorId).isPresent()){
          courceCreatorUserGroupId = userRepo.findById(courceCreatorId).get().getUserGroup();
       }

       if(
          (user.getUserGroup()!=null)&
          (courceCreatorUserGroupId!=null)&
          (user.getRoles().contains(Roles.USER))
        ){
           if(
              (user.getUserGroup().equals(courceCreatorUserGroupId)) ||
              (user.getRoles().contains(Roles.ADMIN))
           ){
               lection.setUserGroup(user.getUserGroup());
               lection.setAuthorId(user.getId());
               lection.setMailForReport(user.getUserEmail());
               lection.setRecordStatus(0);
               lection.setMeetingStatus(0);
               lection.setLectionCreateDateTime(LocalDateTime.now());
               lection.setDeleted(false);
               lection.setUser(user);

               Lection updatedLection = lectionRepo.save(lection);
               wsSender.accept(EventType.CREATE, updatedLection);

               return  updatedLection;
           }else return null;
       } else return null;
    }


    @PostMapping("/lection/copy/")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для копирования лекции")
    public Lection copyLection(@AuthenticationPrincipal User user,
                                @RequestBody Lection lection)  {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        Long courceCreatorId = null;
        Long courceCreatorUserGroupId = null;

        if(courceRepo.findById(lection.getCourceId()).isPresent()){
            courceCreatorId = courceRepo.findById(lection.getCourceId()).get().getCreatorId();
        }
        if(userRepo.findById(courceCreatorId).isPresent()){
            courceCreatorUserGroupId = userRepo.findById(courceCreatorId).get().getUserGroup();
        }
        if(
           (user.getUserGroup()!=null)&
           (courceCreatorUserGroupId!=null)&
           (user.getRoles().contains(Roles.USER))
        ){
            if(
               (user.getUserGroup().equals(courceCreatorUserGroupId)) ||
               (user.getRoles().contains(Roles.ADMIN))
            ){
                if(userRepo.findAllById(lection.getAuthorId()).isPresent()){
                    User lectionAuthor = userRepo.findAllById(lection.getAuthorId()).get();

                    lection.setUserGroup(lectionAuthor.getUserGroup());
                    lection.setAuthorId(lectionAuthor.getId());
                    lection.setMailForReport(lectionAuthor.getUserEmail());
                    lection.setRecordStatus(2);
                    lection.setMeetingStatus(0);
                    lection.setLectionRewrite(0);
                    lection.setLectionCreateDateTime(LocalDateTime.now());
                    lection.setDeleted(false);
                    lection.setUser(lectionAuthor);

                    Lection updatedLection = lectionRepo.save(lection);
                    wsSender.accept(EventType.CREATE, updatedLection);
                    return  updatedLection;
                } else return null;
            } else return null;
        } else  return null;
    }

    @PutMapping("/lection/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для редактирования лекции")
    public Lection update(@PathVariable("id") Lection lectionFromDb,
                          @RequestBody Lection lection,
                          @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getId().equals(lectionFromDb.getAuthorId())) ||
           (user.getRoles().contains(Roles.ADMIN))
        ) {
            BeanUtils.copyProperties(lection,
                        lectionFromDb,
                        "id",
                        "meetingID",
                        "meetingStatus",
                        "recordStatus",
                        "authorId",
                        "lectionCreateUrl",
                        "lectionUrl",
                        "lectionUrlForRecord",
                        "joinUrl",
                        "mailForReport",
                        "userGroup",
                        "user" ,
                        "moderatorId",
                        "isModerated",
                        "moderatorComment",
                        "enLectionName",
                        "enLectionDescription");

            if (lection.getLectionRewrite().equals(1)) {
                lectionFromDb.setMeetingID(null);
                lectionFromDb.setLectionCreateDateTime(LocalDateTime.now());
                lectionFromDb.setRecordStatus(0);
                lectionFromDb.setMeetingStatus(0);
                lectionFromDb.setLectionRewrite(0);
            }
            Lection updatedLection = lectionRepo.saveAndFlush(lectionFromDb);
            wsSender.accept(EventType.UPDATE, updatedLection);
            return updatedLection;
        } else return null;
    }

    @DeleteMapping("/lection/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для удаления лекции(тут метим как удаленную, далше решение модератора)")
    public void delete(@PathVariable("id") Lection lection,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getId().equals(lection.getAuthorId()))||
           (user.getRoles().contains(Roles.ADMIN))
        ){
          lection.setDeleted(true);
          lection.setDeleteDate(LocalDateTime.now());
          lection.setWhoDeleted(user.getId());
          Lection updatedLection = lectionRepo.save(lection);

          wsSender.accept(EventType.UPDATE, updatedLection);
          }
    }

}
