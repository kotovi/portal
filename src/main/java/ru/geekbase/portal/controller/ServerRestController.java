package ru.geekbase.portal.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.Srv;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.ServerRepo;
import ru.geekbase.portal.repos.UserRepo;

import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@RequestMapping("/srv")
@Api(description = "контроллер  для  управления вебинарными серверами ")
public class ServerRestController {
    private final ServerRepo serverRepo;
    private final UserRepo userRepo;

    @Autowired
    public ServerRestController(ServerRepo serverRepo,
                                UserRepo userRepo){
        this.serverRepo = serverRepo;
        this.userRepo = userRepo;
    }

    @GetMapping()
    @ApiOperation("мапинг все доступные сервера")
    public  List<Srv> list(@AuthenticationPrincipal User user
    ){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           user.getRoles().contains(Roles.SERVERADMIN)
        ) {
            return serverRepo.findAll();
        } else return null;
    }

    @GetMapping("{id}")
    @ApiOperation("мапинг отдает сервер по id")
    public Srv server(@AuthenticationPrincipal User user,
                          @PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(
           user.getRoles().contains(Roles.SERVERADMIN)
        ) {
            if(serverRepo.findById(Long.valueOf(id)).isPresent()){
               return  serverRepo.findById(Long.valueOf(id)).get();
            } else return null;
        } else return null;
    }

    @PostMapping
    @ApiOperation("мапинг для добавления сервера")
    public Srv create(@AuthenticationPrincipal User user,
                      @RequestBody Srv server){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.SERVERADMIN)
        ) {
            return serverRepo.save(server);
        } else return null;
    }
    @PutMapping("{id}")
    @ApiOperation("мапинг для редактирования сервера")
    public Srv update(@AuthenticationPrincipal User user,
                         @PathVariable("id") Srv serverFromDB,
                         @RequestBody Srv server){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.SERVERADMIN)
        ) {
        BeanUtils.copyProperties(server, serverFromDB,"id");
        return serverRepo.save(serverFromDB);
        } else return null;
    }

    @DeleteMapping("{id}")
    @ApiOperation("мапинг для удаления сервера")
    public void delete(@AuthenticationPrincipal User user,
                        @PathVariable("id") Srv server){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if (
            user.getRoles().contains(Roles.SERVERADMIN)
        ) {
        serverRepo.delete(server);
        }
    }


}
