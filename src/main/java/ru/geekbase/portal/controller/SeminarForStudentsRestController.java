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
import ru.geekbase.portal.repos.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@Api(description = "контроллер  для  управления доступом к семинарам для групп пользователей")
public class SeminarForStudentsRestController {

    private final SeminarRepo seminarRepo;
    private final SeminarForStudentsRepo seminarForStudentsRepo;
    private final UserGroupRepo userGroupRepo;
    private final SeminarListenerRepo seminarListenerRepo;
    private final UserRepo userRepo;

    @Autowired
    public SeminarForStudentsRestController(SeminarRepo seminarRepo,
                                            SeminarForStudentsRepo seminarForStudentsRepo,
                                            UserGroupRepo userGroupRepo,
                                            SeminarListenerRepo seminarListenerRepo,
                                            UserRepo userRepo){
        this.seminarRepo = seminarRepo;
        this.seminarForStudentsRepo = seminarForStudentsRepo;
        this.userGroupRepo=userGroupRepo;
        this.seminarListenerRepo = seminarListenerRepo;
        this.userRepo = userRepo;

    }
    @GetMapping("/seminarsForStudents")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг отдает всю кучу, уточнить на сколько он нужен")
    public List<SeminarForStudents> seminarForStudentsList(){
        return seminarForStudentsRepo.findAll();
    }

    @GetMapping("/seminarsForStudents/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг отдает список с группами доступа для id семинара")
    public List<SeminarForStudents> seminarForStudentsList(@AuthenticationPrincipal User user,
                                                           @PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(Roles.USER)){
            if(seminarForStudentsRepo.findAllBySeminarId(Long.valueOf(id)).isPresent()){
                return seminarForStudentsRepo.findAllBySeminarId(Long.valueOf(id)).get();
            } else return null;
        } else return null;
    }

    //подумать как слить повторяющийся id
    @GetMapping("/seminarsForStudent")
    @ApiOperation("мапинг отдает слушателю полный список доступных для него вебинаров")
    @JsonView(LectionView.MinimalList.class)
    public List<SeminarForList> seminarForStudentList(@AuthenticationPrincipal  User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        List <SeminarForList> seminarList = new ArrayList<>();

       // List<SeminarForStudents> seminarForStudentsList = seminarForStudentsRepo.findAllByUserGroupIdOrderBySeminarIdDesc(user.getUserGroup());
        List<SeminarForStudents> seminarForStudentsList = seminarForStudentsRepo.findAllByUserGroupIdAndCreateDateAfterOrderBySeminarIdDesc(user.getUserGroup(),LocalDateTime.of(2020,9,1,0,0,0));

        System.out.println("seminarForStudentsList : "+ seminarForStudentsList.size());
        for (SeminarForStudents seminarForStudents : seminarForStudentsList) {

            SeminarForList seminarForList = new SeminarForList();
            seminarForList.setId(seminarForStudents.getSeminarId());
            seminarForList.setSeminarName(seminarForStudents.getSeminar().getSeminarName());
            seminarForList.setSeminarCreator(seminarForStudents.getSeminar().getUser().getLastname() +
                    " " + seminarForStudents.getSeminar().getUser().getFirstname() +
                    " " + seminarForStudents.getSeminar().getUser().getSecname());
            seminarForList.setMeetingStatus(seminarForStudents.getSeminar().getMeetingStatus());
            seminarForList.setSeminarBeginDate(seminarForStudents.getSeminar().getSeminarBeginDate());
            if (seminarForStudents.getSeminar().getMeetingRecordUrl() != null) {
                seminarForList.setRecordUrl(seminarForStudents.getSeminar().getMeetingRecordUrl());
            }

            seminarList.add(seminarForList);
        }

        List<SeminarListener> seminarListForListener = seminarListenerRepo.findAllByListenerIdOrderBySeminarIdDesc(user.getId());

        for (SeminarListener seminarListener : seminarListForListener) {
            //переделать этот кусок какакода
            boolean checker = true;

            for (SeminarForStudents seminarForStudents : seminarForStudentsList) {
                if (seminarForStudents.getSeminarId().equals(seminarListener.getSeminarId())) {
                    checker = false;
                }
            }

            if (checker) {
                SeminarForList seminarForList = new SeminarForList();
                seminarForList.setId(seminarListener.getSeminarId());
                seminarForList.setSeminarName(seminarListener.getSeminar().getSeminarName());
                seminarForList.setSeminarCreator(seminarListener.getSeminar().getUser().getLastname() +
                        " " + seminarListener.getSeminar().getUser().getFirstname() +
                        " " + seminarListener.getSeminar().getUser().getSecname());
                seminarForList.setMeetingStatus(seminarListener.getSeminar().getMeetingStatus());
                seminarForList.setSeminarBeginDate(seminarListener.getSeminar().getSeminarBeginDate());
                if (seminarListener.getSeminar().getMeetingRecordUrl() != null) {
                    seminarForList.setRecordUrl(seminarListener.getSeminar().getMeetingRecordUrl());
                }
                seminarList.add(seminarForList);
            }
        }
        return seminarList;
    }
    ///seminarsForStudent

    @PostMapping("/seminarsForStudents")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг для добавления группы слушателей к вебинару")
    public SeminarForStudents createSeminarForStudents(
            @AuthenticationPrincipal User user,
            @RequestBody SeminarForStudents seminarForStudents){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (seminarRepo.findById(seminarForStudents.getSeminarId()).isPresent()) &
           (userGroupRepo.findById(seminarForStudents.getUserGroupId()).isPresent())
        ){
            if (
                (user.getRoles().contains(Roles.USER))&
                (seminarRepo.findById(seminarForStudents.getSeminarId()).get().getCreatorId().equals(user.getId()))
            ) {
                seminarForStudents.setUserGroup(userGroupRepo.findById(seminarForStudents.getUserGroupId()).get());
                seminarForStudents.setSeminar(seminarRepo.findById(seminarForStudents.getSeminarId()).get());
                seminarForStudents.setCreatorId(user.getId());
                seminarForStudents.setUser(user);
                seminarForStudents.setCreateDate(LocalDateTime.now());
                return seminarForStudentsRepo.save(seminarForStudents);
            } else return null;
        } else return null;
    }

    @PutMapping("/seminarsForStudents/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг для редактирования группы слушателей к вебинару")
    public SeminarForStudents updateSeminar(
            @AuthenticationPrincipal User user,
            @RequestBody SeminarForStudents SeminarForStudents,
            @PathVariable("id") SeminarForStudents SeminarForStudentsFromDb){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getRoles().contains(Roles.USER))&
            (SeminarForStudentsFromDb.getCreatorId().equals(user.getId()))
        ){
            BeanUtils.copyProperties(SeminarForStudents,SeminarForStudentsFromDb,
                    "id",
                    "meetingStatus",
                    "meetingRecordUrl",
                    "seminarCreateDate",
                    "creatorId",
                    "user"
            );
            return  seminarForStudentsRepo.saveAndFlush(SeminarForStudentsFromDb);
        }
        else return null;
    }

    @DeleteMapping("/seminarsForStudents/{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiOperation("мапинг для удаления группы слушателей вебинара")

    public void delete(@PathVariable("id") SeminarForStudents seminarForStudents,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (user.getId().equals(seminarForStudents.getCreatorId())) ||
            (user.getRoles().contains(Roles.ADMIN))
        ) {
            seminarForStudentsRepo.delete(seminarForStudents);
        }
    }
}
