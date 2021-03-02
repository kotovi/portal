package ru.geekbase.portal.controller;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.service.MediaTypeUtils;

import javax.servlet.ServletContext;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import static ru.geekbase.portal.service.GetUserFromAuthority.getUserFromAuthority;


@RestController
@Api(description = "контроллер для загрузки и отдачи файлов")
public class FileUploadController {
    //private final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    //@Value("${spring.files.uploadFolder}")
    private final static String UPLOADED__FOLDER="./files/";

    private  List<MultipartFile> files;
    private final ServletContext servletContext;
    private final UserRepo userRepo;

    @Autowired
    public FileUploadController(ServletContext servletContext,
                                UserRepo userRepo){
        this.userRepo=userRepo;
        this.servletContext =servletContext;
    }

    @GetMapping(value = "/downloadFile/{fileName:.+}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @ApiOperation("маппинг для выгрузки файла по его filename")
    public @ResponseBody
    ResponseEntity<InputStreamResource> getFile(@PathVariable String fileName,
                                                @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

            if (
                (user.getRoles().contains(Roles.USER)) ||
                ((user.getRoles().contains(Roles.STUDENT)))
            ) {
                MediaType mediaType = MediaTypeUtils.getMediaTypeForFileName(this.servletContext, fileName);
                try {
                    File file = new File(UPLOADED__FOLDER + fileName);
                    if (file.exists()) {
                        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
                        return ResponseEntity.ok()
                                // Content-Disposition
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                                // Content-Type
                                .contentType(mediaType)
                                // Contet-Length
                                .contentLength(file.length()) //
                                .body(resource);
                    } else {
                        System.out.println("File is not exist!");
                        return null;
                    }
                } catch (Exception e) {
                    System.out.println("I'm get exception!");
                    e.printStackTrace();
                    return null;
                }
            } else {
                System.out.println("User has't right!");
                return null;
            }

    }


    //3.1.1 Single file upload
    @PostMapping("/upload")
    @ApiOperation("маппинг для заливки файла")

    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile uploadfile,
            @AuthenticationPrincipal User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        user = getUserFromAuthority(user, authentication, userRepo);

        if(user.getRoles().contains(Roles.USER)){
            if(uploadfile.isEmpty()) {
                System.out.println("please select a file!");
                return new ResponseEntity("please select a file!", HttpStatus.OK);
            }

            try{
                saveUploadedFiles(Arrays.asList(uploadfile));
            } catch (IOException e) {
                e.printStackTrace();
               // return new ResponseEntity<>(HttpStatus.BAD__REQUEST);
            }
            System.out.println("Successfully uploaded -  uploadfile.getOriginalFilename(): " +uploadfile.getOriginalFilename());
            return new ResponseEntity("Successfully uploaded - " + uploadfile.getOriginalFilename(), new HttpHeaders(), HttpStatus.OK);
        } else{
            System.out.println("User has't right!");
            return null;
        }

    }

    //save file
    private void saveUploadedFiles(List<MultipartFile> files) throws IOException {
        this.files = files;
        for (MultipartFile file : files) {

            if (file.isEmpty()) {
                continue;//next pls
            }
            byte[]bytes = file.getBytes();
            System.out.println("FILE PATCH: " + UPLOADED__FOLDER + file.getOriginalFilename());
            Path path = Paths.get(UPLOADED__FOLDER + file.getOriginalFilename());
            Files.write(path, bytes);
        }
    }
}
