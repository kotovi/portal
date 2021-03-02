package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.*;
import ru.geekbase.portal.service.BBBService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@Api(description = "контроллер  для  управления семинарами")
public class SeminarRestController {

    private final SeminarRepo seminarRepo;
    private final ServerRepo serverRepo;
    private final UserRepo userRepo;
    private final SeminarListenerRepo seminarListenerRepo;
    private final SeminarForStudentsRepo seminarForStudentsRepo;

    @Autowired
    public SeminarRestController(SeminarRepo seminarRepo,
                                 ServerRepo serverRepo,
                                 UserRepo userRepo,
                                 SeminarListenerRepo seminarListenerRepo,
                                 SeminarForStudentsRepo seminarForStudentsRepo
                                 ){
        this.seminarRepo = seminarRepo;
        this.serverRepo = serverRepo;
        this.userRepo = userRepo;
        this.seminarForStudentsRepo = seminarForStudentsRepo;
        this.seminarListenerRepo = seminarListenerRepo;
    }

    @GetMapping("/seminar")
    @JsonView(LectionView.MinimalList.class)
    public List<Seminar> seminarList(@AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           user.getRoles().contains(Roles.USER)
        ){
            return  seminarRepo.findAllByCreatorIdOrderByIdDesc(user.getId());
        }
        else return null;
    }
    @GetMapping("/seminar/all")
    @JsonView(LectionView.MinimalList.class)
    public List<Seminar> allSeminarList(@AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           user.getRoles().contains(Roles.ADMIN)
        ){
            return  seminarRepo.findAll();
         }
        else return null;
    }

    @GetMapping("/seminar/{id}")
    @JsonView(LectionView.MinimalList.class)
    public Seminar seminar(@AuthenticationPrincipal User user,
                                 @PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

      if (seminarRepo.findById(Long.valueOf(id)).isPresent()){
      return seminarRepo.findById(Long.valueOf(id)).get();
      }
       // return null;
     //   if (user.getRoles().contains(Roles.USER)){
      //      return  seminarRepo.findAllByCreatorIdAndAndMeetingStatusIsLessThan(Long.valueOf(id), 3);
      //  }
        else return  null;
    }

    @PostMapping("/seminar")
    @JsonView(LectionView.MinimalList.class)
    public Seminar createSeminar(
            @AuthenticationPrincipal User user,
            @RequestBody Seminar seminar){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.USER)
        ){
            seminar.setCreatorId(user.getId());
            seminar.setSeminarCreateDate(LocalDateTime.now());
            seminar.setMeetingStatus(0);
            seminar.setUser(user);
            return  seminarRepo.saveAndFlush(seminar);
        }
        else return null;
    }

//тут какая то ебань?
    @PutMapping("/seminar/{id}")
    @JsonView(LectionView.MinimalList.class)
    public Seminar updateSeminar(
            @AuthenticationPrincipal User user,
            @RequestBody Seminar seminar,
            @PathVariable("id") Seminar seminarFromDb){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
           (user.getRoles().contains(Roles.USER))&
           (seminarFromDb.getCreatorId().equals(user.getId()))
        ){
            BeanUtils.copyProperties(seminar,seminarFromDb,
                    "id",
                    "meetingStatus",
                    "meetingRecordUrl",
                    "seminarCreateDate",
                    "creatorId",
                    "user"
                    );
            return  seminarRepo.saveAndFlush(seminarFromDb);
        }
        else return null;
    }

    @DeleteMapping("/seminar/{id}")
    @JsonView(LectionView.MinimalList.class)

    public void delete(@PathVariable("id") Seminar seminar,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getId().equals(seminar.getCreatorId())) ||
            (user.getRoles().contains(Roles.ADMIN))
        ) {
            seminarRepo.delete(seminar);
        }
    }




}

