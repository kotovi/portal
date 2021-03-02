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
import ru.geekbase.portal.repos.QuestionRepo;
import ru.geekbase.portal.repos.TestRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/question")
@Api(description = "контроллер  для управления вопросами тестирования")
public class QuestionRestController {
    private final QuestionRepo questionRepo;
    private final UserRepo userRepo;
    private final TestRepo testRepo;

    @Autowired
    public QuestionRestController(QuestionRepo questionRepo,
                                  UserRepo userRepo,
                                  TestRepo testRepo) {
        this.questionRepo = questionRepo;
        this.userRepo = userRepo;
        this.testRepo = testRepo;
    }


    @GetMapping("{id}")
    @JsonView(QuestionView.FullMessage.class)
    @ApiOperation("маппинг отдает список вопросов для заданного id тестирования")
    public List<Question> list(@PathVariable("id") String id,
                               @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
            return questionRepo.findAllByTestId(Long.valueOf(id));
        } else return null;

    }

    @GetMapping("/info/{id}")
    @JsonView(QuestionView.FullMessage.class)
    @ApiOperation("маппинг отдает вопрос по его id")
    public Question questionInfo(@PathVariable("id") String id,
                               @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
           if(questionRepo.findById(Long.valueOf(id)).isPresent()){
              return questionRepo.findById(Long.valueOf(id)).get();
           }else return null;
        } else return null;

    }

    @PostMapping
    @JsonView(QuestionView.FullMessage.class)
    @ApiOperation("маппинг для добавления вопроса")
    public  Question create(@RequestBody Question testQuestion,
                            @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ){
            if (testRepo.findById(testQuestion.getTestId()).isPresent()){
              if(testRepo.findById(testQuestion.getTestId()).get().getCreatorId().equals(user.getId())){
                    testQuestion.setCreatorId(user.getId());
                    return questionRepo.saveAndFlush(testQuestion);
              }  else  return null;
            } else  return null;
        } else  return null;
    }

    @PutMapping("{id}")
    @JsonView(QuestionView.FullMessage.class)
    @ApiOperation("маппинг для редактирования вопроса")
    public Question update(@PathVariable("id") Question questionFromDb,
                           @RequestBody Question testQuestion,
                           @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           (user.getRoles().contains(Roles.LECTOR)) ||
           (user.getRoles().contains(Roles.ADMIN)) ||
           (user.getRoles().contains(Roles.USER))
        ) {
           BeanUtils.copyProperties(testQuestion,
                        questionFromDb,
                        "id",
                        "creatorId");
           return questionRepo.save(questionFromDb);
        }else return  null;

    }

    @DeleteMapping("{id}")
    @JsonView(QuestionView.FullMessage.class)
    @ApiOperation("маппинг для удаления вопроса")
    public void delete(@PathVariable("id") Question testQuestion,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            (testQuestion.getTest().getCreatorId().equals(user.getId())) ||
            (user.getRoles().contains(Roles.ADMIN))
        ) {
            questionRepo.delete(testQuestion);
        }
    }

}
