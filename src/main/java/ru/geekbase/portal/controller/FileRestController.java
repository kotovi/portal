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
import ru.geekbase.portal.repos.FileRepo;
import ru.geekbase.portal.repos.UserRepo;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;

@RestController
@Api(description = "контроллер для работы с файлами-данные")
public class FileRestController {
    private final FileRepo fileRepo;
    private final UserRepo userRepo;

    @Autowired
    public FileRestController(FileRepo fileRepo,
                              UserRepo userRepo){
        this.fileRepo=fileRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/file")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг отдает полный список файлов в системе, излишний, только для администратора")
    public List<File> files(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.ADMIN)){
            return  fileRepo.findAll();
        } else {
          return null;
        }
    }
  //возможно не хватает прав
    @GetMapping("/file/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг отдает  список файлов для лекции с id")
    public List<File> filesForLection(
            @PathVariable("id") String id){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication.getAuthorities().contains(Roles.USER)){
            if(fileRepo.findAllByLectionId(Long.valueOf(id)).isPresent()){
                return  fileRepo.findAllByLectionId(Long.valueOf(id)).get();
            } else return null;
        } else return null;
    }

    @PostMapping("/file")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для добавления файла")
    public File create(
            @AuthenticationPrincipal User user,
            @RequestBody File file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(user.getRoles().contains(Roles.USER)){
            if(user.getUserGroup()!=null) {
                file.setCreateDateTime(LocalDateTime.now());
                file.setCreatorId(user.getId());
                return fileRepo.saveAndFlush(file);
            }else return null;
        } else  return null;
    }

    @PutMapping("/file{/id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для редактирования файла")
    public File update(
            @AuthenticationPrincipal User user,
            @PathVariable("id") File fileFromDb,
            @RequestBody File file){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
            if (
                (file.getCreatorId().equals(user.getId())) ||
                (user.getRoles().contains(Roles.ADMIN))
            ){
                BeanUtils.copyProperties(file,
                        fileFromDb,
                        "id",
                        "creatorId",
                        "createDateTime",
                        "randomFileName",
                        "lectionId");
                return fileRepo.saveAndFlush(fileFromDb);
            }else return null;
    }

    @DeleteMapping("/file/{id}")
    @JsonView(LectionView.ForFront.class)
    @ApiOperation("маппинг для удаления файла")
    @Transactional
    public void delete(@PathVariable("id") File file,
                       @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);
        if(
            (file.getCreatorId().equals(user.getId())) ||
            (user.getRoles().contains(Roles.ADMIN))
        ){
          Long id = file.getId();
          fileRepo.deleteFileById(id);
        }
    }
}
