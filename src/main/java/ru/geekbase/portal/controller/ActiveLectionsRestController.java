package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.LectionRepo;
import ru.geekbase.portal.repos.ServerRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.service.BBBService;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/activeMeetings")
@Api(description = "Контроллер для получения активных комнат")
@JsonView(LectionView.ForFront.class)
public class ActiveLectionsRestController {
    private final LectionRepo lectionRepo;
    private final ServerRepo serverRepo;
    private final UserRepo userRepo;

    @Autowired
    public ActiveLectionsRestController (LectionRepo lectionRepo,
                                         ServerRepo serverRepo,
                                         UserRepo userRepo){
        this.lectionRepo = lectionRepo;
        this.serverRepo = serverRepo;
        this.userRepo = userRepo;
    }
/*
* Отдаем список активных комнат. Список берем по статусу из бд. Но есть нюанс.
* Опрашиваем имеющиеся в бд комнаты, к серверу на прямую не обращаемся. Он отдает данный список довольно меденно.
* На будующее возможно стоит переписать.
* */
   @GetMapping()
   @ApiOperation("Метод отдает список активных в текущий момент комнат(по стостоянию в БД), состояние комнат на сервере" +
           " черкается по расписанию")
   @ApiModelProperty(hidden = true)
   @JsonView(LectionView.MinimalList.class)
    public List<Lection> list(){
       Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
       if(authentication.getAuthorities().contains(Roles.ADMIN)){
           if(lectionRepo.findAllByMeetingStatus(1).isPresent()){
               return lectionRepo.findAllByMeetingStatus(1).get();
           } else return null;
       } else return null;
   }
   /*
   * Отдаем ссылку для вступления в комнату, либо отдаем сообщение если комната подохла
   * */
    @GetMapping("{id}")
    @JsonView(LectionView.MinimalList.class)
    @ApiModelProperty(hidden = true)
    @ApiOperation("метод либо редиректит в вебинарную комнату(в том случае если она активна) либо" +
            " редиректит пользователя с кписку активных комнат")
    public RedirectView urlForListener(@PathVariable("id") String id,
                                       @AuthenticationPrincipal User user){
        String joinUrl = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
           user = getUserFromAuthority(user, authentication, userRepo);

            if (lectionRepo.findById(Long.valueOf(id)).isPresent()){
                 Lection lection = lectionRepo.findById(Long.valueOf(id)).get();
                 if(serverRepo.findByServerDefault(1).isPresent()){
                     Srv bbbServer = serverRepo.findByServerDefault(1).get();

                     try {
                         //если у лекции существует id встречи
                         if (lection.getMeetingID()!= null) {
                             //если комната активна - отдаем url для входа
                             if (BBBService.GetMeetingInfoUrl(bbbServer.getServerUrl(),
                                     bbbServer.getServerSalt(),
                                     lection.getMeetingID(),
                                     "dsfsdf").equals("success") &
                                     (lection.getMeetingStatus() == 1) &
                                     (lection.getRecordStatus() == 1)) {

                                 joinUrl = BBBService.joinUrl(bbbServer.getServerUrl(),
                                         bbbServer.getServerSalt(),
                                         lection.getMeetingID(),
                                         user.getUsername(),
                                         "dsfsdf");
                                 //joinUrl = "redirect:" + joinUrl;
                                 return new RedirectView(joinUrl);
                             }
                             //если комната уже закрылась - редиректим на страницу с лекциями
                             if (BBBService.GetMeetingInfoUrl(bbbServer.getServerUrl(),
                                     bbbServer.getServerSalt(),
                                     lection.getMeetingID(),
                                     "dsfsdf").equals("unsuccess")) {
                                 joinUrl = "/activeMeetingsList/";
                             }
                         }
                     } catch (Exception e){
                         e.printStackTrace();
                     }
                 }
            }
        }
        //подумать куда редиректить если ни чего не вышло
        return new RedirectView(joinUrl);
    }
}
