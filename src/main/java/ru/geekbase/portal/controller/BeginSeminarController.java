package ru.geekbase.portal.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.dto.EventType;
import ru.geekbase.portal.dto.ObjectType;
import ru.geekbase.portal.repos.SeminarRepo;
import ru.geekbase.portal.repos.ServerRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.service.BBBService;
import ru.geekbase.portal.util.WsSender;
import java.util.Optional;
import java.util.function.BiConsumer;
import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@Controller
@Api(description = "Контроллер для запуска вебинарной комнаты семинара")

public class BeginSeminarController {

    private final SeminarRepo seminarRepo;
    private final ServerRepo serverRepo;
    private final UserRepo userRepo;
    private final BiConsumer<EventType, SeminarForList> wsSender;

    @Autowired
    public BeginSeminarController(SeminarRepo seminarRepo,
                                  ServerRepo serverRepo,
                                  WsSender wsSender,
                                  UserRepo userRepo){
        this.seminarRepo = seminarRepo;
        this.serverRepo = serverRepo;
        this.userRepo = userRepo;
        this.wsSender  = wsSender.getSender(ObjectType.SEMINARFORLIST, LectionView.ForFront.class);

    }
    public static String transliterate(String message){
        char[] abcCyr =   {' ','а','б','в','г','д','е','ё', 'ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х', 'ц','ч', 'ш','щ','ъ','ы','ь','э', 'ю','я','А','Б','В','Г','Д','Е','Ё', 'Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х', 'Ц', 'Ч','Ш', 'Щ','Ъ','Ы','Ь','Э','Ю','Я','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'};
        String[] abcLat = {" ","a","b","v","g","d","e","e","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","h","ts","ch","sh","sch", "","i", "","e","ju","ja","A","B","V","G","D","E","E","Zh","Z","I","Y","K","L","M","N","O","P","R","S","T","U","F","H","Ts","Ch","Sh","Sch", "","I", "","E","Ju","Ja","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"};
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < message.length(); i++) {
            for (int x = 0; x < abcCyr.length; x++ ) {
                if (message.charAt(i) == abcCyr[x]) {
                    builder.append(abcLat[x]);
                }
            }
        }
        return builder.toString();
    }

    @GetMapping("/seminar/begin/{id}")
    @ApiModelProperty(hidden = true)
    @ApiOperation("Метод для cоздания и запуска вебинарной комнаты")
    public String redirect (@PathVariable("id") String id,
                            @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        Optional<Seminar> seminar = seminarRepo.findById(Long.valueOf(id));
        String joinUrl = null;
        if(serverRepo.findByServerDefault(1).isPresent()){
            Srv bbbServer = serverRepo.findByServerDefault(1).get();
            if(user.getRoles().contains(Roles.USER)){
                if(seminar.isPresent()) {

                    Seminar newSeminar = seminar.get();
                    String atendeePassword = "dsuvyyfvc";
                    String moderatorPassword = "dddtdtdt";
                    String fullUserName = user.getFirstname() +"_"+user.getLastname();
                    String fullUserNameTranslit = transliterate(fullUserName);
                    String passwordForJoin;
                    String  serverURL= bbbServer.getServerUrl();
                    String secret = bbbServer.getServerSalt();

                    if(newSeminar.getCreatorId().equals(user.getId())){
                        passwordForJoin = atendeePassword;
                        // passwordForJoin = moderatorPassword;

                    } else {
                        System.out.println("I'm seminar listener");
                        System.out.println("Roles:" + user.getRoles());
                        passwordForJoin = moderatorPassword;
                    }

                    try {

                        //если у лекции существует id встречи
                        if (newSeminar.getMeetingId()!= null) {

                            //если комната активна - отдаем url для входа
                            if (BBBService.GetMeetingInfoUrl(
                                    serverURL,
                                    secret,
                                    newSeminar.getMeetingId(),
                                    moderatorPassword
                            ).equals("success") &
                                    (newSeminar.getMeetingStatus() == 1) &
                                    (newSeminar.getRecordStatus() == 1)) {


                                joinUrl = BBBService.joinSeminarUrl(
                                        serverURL,
                                        secret,
                                        newSeminar.getMeetingId(),
                                        fullUserNameTranslit,
                                        passwordForJoin);


                                joinUrl = "redirect:" + joinUrl;
                                return joinUrl;
                            }
                            //если комната уже закрылась - редиректим на страницу с лекциями
                            if (BBBService.GetMeetingInfoUrl(
                                    serverURL,
                                    secret,
                                    newSeminar.getMeetingId(),
                                    passwordForJoin
                            ).equals("unsuccess")) {

                                newSeminar.setMeetingStatus(3);

                                seminarRepo.saveAndFlush(newSeminar);
                                joinUrl = "redirect:/";
                                return joinUrl;

                            }

                        } else {
                            //создаем новую комнату
                            //вот тут оно иногда обебывается если вебинарный сервер по какой то причине долго не отвечает, нужно будет покрутить
                            //if ((seminar.get().getMeetingStatus() == 0)&(seminar.get().getCreatorId()==user.getId())) {
                            if (seminar.get().getMeetingStatus() == 0) {
                                if ((seminar.get().getCreatorId().equals(user.getId())) || (user.getRoles().contains(Roles.ADMIN))) {
                                    Seminar seminarW = BBBService.createSeminarUrl(
                                            serverURL,
                                            secret,
                                            seminar.get().getSeminarName(),
                                            atendeePassword,
                                            moderatorPassword,
                                            seminar.get(),
                                            "https://portal.ismu.baikal.ru");
                                    joinUrl = "";

                                    if (seminarW.getMeetingStatus() == 1) {
                                        joinUrl = BBBService.joinSeminarUrl(
                                                serverURL,
                                                secret,
                                                newSeminar.getMeetingId(),
                                                fullUserNameTranslit,
                                                passwordForJoin);
                                    }

                                    joinUrl = "redirect:" + joinUrl;
                                    //создаем объект для студентов с обновленным статусом семинара
                                    SeminarForList seminarForList = new SeminarForList();
                                    seminarForList.setId(seminarW.getId());
                                    seminarForList.setSeminarName(seminarW.getSeminarName());
                                    seminarForList.setSeminarCreator(seminarW.getUser().getLastname()+
                                            " "+seminarW.getUser().getFirstname()+
                                            " "+seminarW.getUser().getSecname());
                                    seminarForList.setMeetingStatus(seminarW.getMeetingStatus());
                                    seminarForList.setSeminarBeginDate(seminarW.getSeminarBeginDate());

                                    wsSender.accept(EventType.UPDATE, seminarForList);

                                } else {
                                    if(
                                            (newSeminar.getCreatorId().equals(user.getId())) ||
                                                    (user.getRoles().contains(Roles.ADMIN))) {
                                        joinUrl = "redirect:https://portal.ismu.baikal.ru/seminars";
                                    } else {joinUrl = "redirect:https://portal.ismu.baikal.ru/seminarList";}
                                }
                                return joinUrl;
                            }
                        }
                    } catch (Exception e){
                        e.printStackTrace();
                    }
                }
            }
        }

        return joinUrl;
    }
}
