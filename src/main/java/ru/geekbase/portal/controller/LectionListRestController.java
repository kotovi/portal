package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.*;
import ru.geekbase.portal.repos.LectionRepo;
import ru.geekbase.portal.repos.ServerRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;


@RestController
@RequestMapping("/lectionlist")
@Api(description = "контроллер для модерации лекций")
public class LectionListRestController {
    private final LectionRepo lectionRepo;
    private final UserRepo userRepo;

    @Autowired
    public LectionListRestController(LectionRepo lectionRepo,
                                     UserRepo userRepo) {
        this.lectionRepo = lectionRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для получения всего списка лекций")
    public List<Lection> list(){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(
           (authentication.getAuthorities().contains(Roles.ADMIN))||
           (authentication.getAuthorities().contains(Roles.MODERATOR))
        ){
            return lectionRepo.findAll();
        } else return  null;

    }
    @GetMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для получения списка лекций по id курса")
    public List<Lection> list(@PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(
            (authentication.getAuthorities().contains(Roles.ADMIN))||
            (authentication.getAuthorities().contains(Roles.MODERATOR))
        ){
            return  lectionRepo.findByCourceId(Long.valueOf(id));
        } else return null;
    }

    @PutMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для модерации")
    public Lection update(@PathVariable("id") Lection lectionFromDb,
                          @RequestBody Lection lection,
                          @AuthenticationPrincipal User user){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if (
            (user.getRoles().contains(Roles.ADMIN))||
            (user.getRoles().contains(Roles.MODERATOR))
        ) {
            lectionFromDb.setModeratorId(user.getId());
            lectionFromDb.setModerated(lection.getModerated());
            lectionFromDb.setModeratorComment(lection.getModeratorComment());
            return lectionRepo.save(lectionFromDb);
        } else return null;
    }

    @DeleteMapping("{id}")
    @JsonView(LectionView.ForFront.class)
    public void delete(@PathVariable("id") Lection lection){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (
            (authentication.getAuthorities().contains(Roles.ADMIN))
        ) {
            System.out.println("Пользователь имеет право на удаление лекции");
           /* if(lection.getLectionUrl()!=null) {
                System.out.println("URL не пуст!");
                if(serverRepo.findByServerDefault(1).isPresent()){
                    Srv bbbServer = serverRepo.findByServerDefault(1).get();
                    String[] playUrlParts = (lection.getLectionUrl()).split("=");
                    System.out.println(playUrlParts[1]);

                    if (BBBService.deleteRecordingById(bbbServer.getServerUrl(), bbbServer.getServerSalt(), playUrlParts[1])) {
                        lectionRepo.delete(lection);
                        System.out.println("Lection record deleted!!!");
                    }

                }
            } else {
            */
                System.out.println("Записи на серве нет, просто берем и затираем запись в базе");
                if(lection.getTestId()==null) {
                    lectionRepo.delete(lection);
                }
           // }*/
        }
    }
}
