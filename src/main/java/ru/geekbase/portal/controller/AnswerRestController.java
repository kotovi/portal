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
import ru.geekbase.portal.repos.AnswerRepo;
import ru.geekbase.portal.repos.QuestionRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/answer")
@Api(description = "Контроллер для управления вопросами для тестирования")
public class AnswerRestController {
    private final AnswerRepo answerRepo;
    private final QuestionRepo questionRepo;
    private final UserRepo userRepo;

    @Autowired
    public AnswerRestController(AnswerRepo answerRepo,
                                QuestionRepo questionRepo,
                                UserRepo userRepo) {

        this.answerRepo = answerRepo;
        this.questionRepo = questionRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("{id}")
    @JsonView(QuestionView.ForLector.class)
    @ApiOperation("Метод возвращает список ответов на вопрос с id")
    public List<Answer> list(@PathVariable("id") String id,
                             @AuthenticationPrincipal User user){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(Roles.USER)){
            if(answerRepo.findAllByQuestionId(Long.valueOf(id)).isPresent()){
                return answerRepo.findAllByQuestionId(Long.valueOf(id)).get();
            } else return null;
        } else return null;

    }

    @PostMapping
    @JsonView(QuestionView.ForLector.class)
    @ApiOperation("Метод для добавления ответа")
    public Answer create(@RequestBody Answer answer,
                         @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(authentication.getAuthorities().contains(Roles.USER)){
            if(questionRepo.findById(answer.getQuestionId()).isPresent()){
                Long userIdFromQuestion = questionRepo.findById(answer.getQuestionId()).get().getCreatorId();
                Long userId = user.getId();
                if(userId.equals(userIdFromQuestion)) {
                    answer.setCreatorId(user.getId());
                    answer.setTestId(questionRepo.findById(answer.getQuestionId()).get().getTestId());
                    return answerRepo.save(answer);
                } else return  null;
            } else return  null;
        }else return  null;
    }

    @PutMapping("{id}")
    @ApiOperation("Метод для редактирования ответа")
    @JsonView(QuestionView.ForLector.class)
    public Answer update(
            @PathVariable("id") Answer answerFromDb,
            @RequestBody Answer answer,
            @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(authentication.getAuthorities().contains(Roles.USER)){
            if (answerFromDb.getCreatorId().equals(user.getId())) {
                BeanUtils.copyProperties(answer,
                        answerFromDb,
                        "id",
                        "creatorId",
                        "testId");
                return answerRepo.save(answerFromDb);
            } else return null;
        } else return null;
    }

    @DeleteMapping("{id}")
    @JsonView(QuestionView.ForLector.class)
    @ApiOperation("Метод для Удаления ответа")
    public void delete(@PathVariable("id") Answer answer,
                       @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(authentication.getAuthorities().contains(Roles.USER)){
            if (answer.getCreatorId().equals(user.getId())) {
                answerRepo.delete(answer);
            }
        }
    }
}
