package ru.geekbase.portal.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.geekbase.portal.domain.Lection;
import ru.geekbase.portal.domain.Srv;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.LectionRepo;
import ru.geekbase.portal.repos.ServerRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.service.BBBService;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;


@Controller
@RequestMapping("/record")
@Api(description = "контроллер  для создания и запуска вебинарной комнаты")
public class RecordController {
    private final LectionRepo lectionRepo;
    private final ServerRepo serverRepo;
    private final UserRepo userRepo;

    @Autowired
    public RecordController(LectionRepo lectionRepo,
                            ServerRepo serverRepo,
                            UserRepo userRepo){
        this.lectionRepo = lectionRepo;
        this.serverRepo = serverRepo;
        this.userRepo = userRepo;

    }

   // перепроверить существует ли уыедомление - только потом толкать его

    @GetMapping("{id}")
    @ApiOperation("маппинг создает и редиректит в вебинарную комнату, если ее еще нет; либо редиректит в комнату - если " +
            "кто то вылетел и она еще жива; либо редиректит на корень если все  плохо ")
    public String redirect (@PathVariable("id") String id,
                            @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        String joinUrl;
        String MODERATOR_PASS = "dsfsdf";
        if(
           (lectionRepo.findByAuthorIdAndId(user.getId(), Long.valueOf(id)).isPresent()) &
           (serverRepo.findByServerDefault(1).isPresent())
        ){
            Lection lection = lectionRepo.findByAuthorIdAndId(user.getId(), Long.valueOf(id)).get();
            Srv bbbServer = serverRepo.findByServerDefault(1).get();

            try {
                //если у лекции существует id встречи
                if (lection.getMeetingID()!= null) {
                    //если комната активна - отдаем url для входа
                    if (BBBService.GetMeetingInfoUrl(bbbServer.getServerUrl(),
                            bbbServer.getServerSalt(), lection.getMeetingID(), MODERATOR_PASS).equals("success") &
                            (lection.getMeetingStatus() == 1) & (lection.getRecordStatus() == 1)) {
                        joinUrl = BBBService.joinUrl(bbbServer.getServerUrl(),
                                                    bbbServer.getServerSalt(),
                                                    lection.getMeetingID(),
                                                    user.getUsername(),
                                                    MODERATOR_PASS);
                        joinUrl = "redirect:" + joinUrl;
                        return joinUrl;
                    }
                    //если комната уже закрылась - редиректим на страницу с лекциями
                    if (BBBService.GetMeetingInfoUrl(bbbServer.getServerUrl(),
                                                    bbbServer.getServerSalt(),
                                                    lection.getMeetingID(),
                                                    MODERATOR_PASS).equals("unsuccess")) {

                        lection.setMeetingStatus(0);
                        lectionRepo.save(lection);
                        joinUrl = "redirect:/lectionmaker?courceId=".concat(lection.getCourceId().toString());
                        return joinUrl;

                    }

                } else {
                    //вот тут оно иногда обебывается если вебинарный сервер по какой то причине долго не отвечает, нужно будет покрутить
                    if (lection.getRecordStatus() == 0) {

                        Lection lectionWithMeeting = BBBService.createMeeting(bbbServer.getServerUrl(),
                                                                              bbbServer.getServerSalt(),
                                                                              lection.getLectionName(),
                                                                              MODERATOR_PASS,
                                                                              lection,
                                                                    bbbServer.getServerPanelUrl() + "/lectionmaker?courceId=".concat(lection.getCourceId().toString()));


                        joinUrl = BBBService.joinUrl(bbbServer.getServerUrl(),
                                                     bbbServer.getServerSalt(),
                                                     lectionWithMeeting.getMeetingID(),
                                                     user.getUsername(),
                                                     MODERATOR_PASS);

                        System.out.println("JOIN URL: "+  joinUrl);

                        lectionWithMeeting.setMeetingStatus(1);
                        lectionWithMeeting.setRecordStatus(1);

                        lectionRepo.save(lectionWithMeeting);
                        joinUrl = "redirect:" + joinUrl;
                        return joinUrl;
                    }
                }

            } catch (Exception e){
                e.printStackTrace();
                //подумать куда послать
                joinUrl = "redirect:/";
                return joinUrl;
            }

        }
        //подумать куда послать
        joinUrl = "redirect:/";
        return joinUrl;
    }
}

