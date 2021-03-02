package ru.geekbase.portal.controller;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.geekbase.portal.domain.Cource;
import ru.geekbase.portal.domain.LectionView;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.repos.CourceRepo;
import ru.geekbase.portal.repos.UserRepo;
import java.util.List;

@RestController
@RequestMapping("/courcelist")
@JsonView(LectionView.FullMessage.class)
public class CourceListRestController {
    private final CourceRepo courceRepo;
    private final UserRepo userRepo;

    @Autowired
    CourceListRestController(CourceRepo courceRepo,
                             UserRepo userRepo){
        this.courceRepo = courceRepo;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<Cource> list(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            return courceRepo.findAll();
        } else return null;
    }

    @PutMapping("{id}")
    public Cource update(@PathVariable("id")Cource courceFromDb,
                         @RequestBody Cource cource){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            BeanUtils.copyProperties(cource, courceFromDb, "id", "creatorId");
            return courceRepo.save(courceFromDb);
        }else return null;

    }
    /*
    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Cource cource) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            courceRepo.delete(cource);
        }
    }
   */
}
