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

//import javax.jws.soap.SOAPBinding;
import java.util.ArrayList;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/test")
@Api(description = "контроллер  для управления тестированиями")
public class TestRestController {
    private final LectionTestingRepo lectionTestingRepo;
    private final UserRepo userRepo;
    private final TestRepo testRepo;

    @Autowired
    public TestRestController(LectionTestingRepo lectionTestingRepo,
                              UserRepo userRepo,
                              TestRepo testRepo) {
        this.lectionTestingRepo = lectionTestingRepo;
        this.userRepo = userRepo;
        this.testRepo = testRepo;
    }

    @GetMapping("/testById/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг для получения тестирования по его id")
    public Test testById(@AuthenticationPrincipal User user,
                         @PathVariable("id") String id){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
          (user.getRoles().contains(Roles.LECTOR)) ||
          (user.getRoles().contains(Roles.ADMIN)) ||
          (user.getRoles().contains(Roles.USER))
        ) {
            if(testRepo.findById(Long.valueOf(id)).isPresent()){
                if(testRepo.findById(Long.valueOf(id)).get().getUserGroupId().equals(user.getUserGroup())){
                    return  testRepo.findById(Long.valueOf(id)).get();
                } else return null;
            } else return null;
        } else return null;
    }

    @GetMapping("/completed/{id}")
    @ApiOperation("мапинг отдает список подготовленных тестирований(то есть где заполнены все вопросы и ответы, " +
            "в соответствии с типом, заданным id")
    @JsonView(LectionView.ForFront.class)
    public List<Test> complitedTestList(@AuthenticationPrincipal User user,
                                        @PathVariable("id") String id){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {

           List<Test> completedTestList = new ArrayList<>();
           boolean testFail;

           if(testRepo.findAllByTestTypeAndUserGroupId(Integer.valueOf(id), user.getUserGroup()).isPresent()){
               List<Test> garbageTestList = testRepo.findAllByTestTypeAndUserGroupId(Integer.valueOf(id), user.getUserGroup()).get();

               for (Test test : garbageTestList) {
                   testFail = false;
                   if ((test.getQuestionsCount()).equals((test.getQuestions().size()))) {
                       for (int j = 0; j < test.getQuestions().size(); j++) {
                           if ((test.getQuestions().get(j).getAnswersCount()).equals(test.getQuestions().get(j).getAnswers().size())) {
                           } else testFail = true;
                       }
                   } else testFail = true;
                   if (!testFail) {
                       completedTestList.add(test);
                   }
               }
               return completedTestList;
           }else return null;
        } else return null;
    }

    @GetMapping("/completed/intermediate/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг отдает список подготовленных промежуточных тестирований(то есть где заполнены все вопросы и ответы, " +
            "в соответствии с группой пользователей, заданной id")
    public List<Test> complitedIntermediateTestList(@AuthenticationPrincipal User user,
                                        @PathVariable("id") String id){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            List<Test> completedTestList = new ArrayList<>();
            boolean testFail;

            if(testRepo.findAllByTestTypeAndUserGroupId(2, Long.valueOf(id)).isPresent()){
                List<Test> garbageTestList = testRepo.findAllByTestTypeAndUserGroupId(2, Long.valueOf(id)).get();

                for (Test test : garbageTestList) {
                    testFail = false;
                    if ((test.getQuestionsCount()).equals((test.getQuestions().size()))) {
                        for (int j = 0; j < test.getQuestions().size(); j++) {
                            if ((test.getQuestions().get(j).getAnswersCount()).equals(test.getQuestions().get(j).getAnswers().size())) {
                            } else testFail = true;
                        }
                    } else testFail = true;
                    if (!testFail) {
                        completedTestList.add(test);
                    }
                }
                return completedTestList;
            }else return null;
        } else return null;
    }


    @GetMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг отдает список всех тестирований для группы пользователей, к которой принадлежит текущий позозователь")
    public List<Test> testListByUserGroup(@AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            if(testRepo.findAllByUserGroupId(user.getUserGroup()).isPresent()){
                return testRepo.findAllByUserGroupId(user.getUserGroup()).get();
            }
            else return null;
        } else return null;
    }

    @PostMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг для добавления тестирования")
    public Test createTest(
            @RequestBody Test test,
            @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
           test.setUserGroupId(user.getUserGroup());
           test.setCreatorId(user.getId());

           return  testRepo.save(test);
            } else return null;
        }

    @PutMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг для редактирования тестирования")
    public Test update(
            @PathVariable("id") Test testFromDb,
            @RequestBody Test test,
            @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            if (testFromDb.getCreatorId().equals(user.getId())) {
                BeanUtils.copyProperties(test,
                        testFromDb,
                        "id",
                        "creatorId",
                        "lectionId",
                        "userGroupId",
                        "defaultTest",
                        "courceId");
                return lectionTestingRepo.save(testFromDb);
            } else return null;
        } else return  null;
    }

    @GetMapping("/test/{id}")
    @ApiOperation("мапинг отдает тестирование по првязанному id лекции, возможно в текущий момент не нужен")
    @JsonView(LectionView.ForFront.class)
    public List<Test> list(@PathVariable("id") String id,
                           @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            return lectionTestingRepo.findByLectionId(Long.valueOf(id));

        } else return null;
    }

    @GetMapping("/test/finalTestForCource/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг отдает финальное тестирование для курса с заданным id")
    public List<Test> finalTestForCourceList(@PathVariable("id") String id,
                           @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            return lectionTestingRepo.findByCourceIdAndCreatorIdAndTestType(Long.valueOf(id), user.getId(), 3);
        } else return null;
    }

    @GetMapping("/entranceTestForCource/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("мапинг отдает вступительное тестирование для курса с заданным id")
    public List<Test> entranceTestForCourceList(@PathVariable("id") String id,
                                        @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
          (user.getRoles().contains(Roles.LECTOR)) ||
          (user.getRoles().contains(Roles.ADMIN)) ||
          (user.getRoles().contains(Roles.USER))
        ) {
            return lectionTestingRepo.findByCourceIdAndCreatorIdAndTestType(Long.valueOf(id), user.getId(), 1);
        }else return null;
    }

    @JsonView(LectionView.ForFront.class)
    @DeleteMapping("{id}")
    @ApiOperation("мапинг для удаления тестирования, нужно подумать над переработкой, в текущем исполнении опасен")

    public void delete(@PathVariable("id") Test lectionTesting,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            if (lectionTesting.getCreatorId().equals(user.getId())) {
                lectionTestingRepo.delete(lectionTesting);
            }
        }
    }

}
