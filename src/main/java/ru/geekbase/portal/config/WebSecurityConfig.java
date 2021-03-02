package ru.geekbase.portal.config;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.session.jdbc.config.annotation.web.http.EnableJdbcHttpSession;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;
import ru.geekbase.portal.repos.UserGroupRepo;
import ru.geekbase.portal.repos.UserRepo;
import ru.geekbase.portal.service.UserService;
import java.time.LocalDateTime;
import java.util.*;

import static ru.geekbase.portal.domain.Roles.STUDENT;


@Configuration
@EnableWebSecurity

//https://stackoverflow.com/questions/55609083/how-to-set-user-authorities-from-user-claims-return-by-an-oauth-server-in-spring
@EnableJdbcHttpSession
@Order(SecurityProperties.BASIC_AUTH_ORDER)
public class WebSecurityConfig  extends WebSecurityConfigurerAdapter {

    private final UserService userService;
    private final UserRepo userRepo;
    private final UserGroupRepo userGroupRepo;

    @Autowired
    private  PasswordEncoder passwordEncoder;

    @Autowired
    WebSecurityConfig(UserService userService,
                      UserRepo userRepo,
                      UserGroupRepo userGroupRepo
                      ){

        this.userRepo = userRepo;
        this.userGroupRepo = userGroupRepo;
        this.userService = userService;

    }

   // @Autowired
   // private XSSFilter xssFilter;


        @Bean
        public PasswordEncoder getPasswordEncoder() {
            return new BCryptPasswordEncoder(8);
        }

        private GrantedAuthoritiesMapper userAuthoritiesMapper() {

            return (authorities) -> {
                Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

                for (GrantedAuthority authority : authorities) {
                    if (OidcUserAuthority.class.isInstance(authority)) {
                        OidcUserAuthority oidcUserAuthority = (OidcUserAuthority) authority;
                        OidcIdToken idToken = oidcUserAuthority.getIdToken();
                        OidcUserInfo userInfo = oidcUserAuthority.getUserInfo();


                    } else if (OAuth2UserAuthority.class.isInstance(authority)) {


                        OAuth2UserAuthority oauth2UserAuthority = (OAuth2UserAuthority) authority;

                        Map<String, Object> userAttributes = oauth2UserAuthority.getAttributes();

                        Map<String, Object> userData = (Map<String, Object>) userAttributes.get("principal");
                        Integer idInMirIsmu = (Integer) userData.get("id");

                        Optional<User> user = userRepo.findByIdInMirIsmu(Long.valueOf(idInMirIsmu));

                        User newUser = new User();
                        newUser.setFirstname(userData.get("firstName").toString());
                        newUser.setLastname(userData.get("secondName").toString());
                        newUser.setSecname(userData.get("middleName").toString());
                        newUser.setActive(true);
                        newUser.setNotificationAgree(true);
                        newUser.setIdInMirIsmu(Long.valueOf(userData.get("id").toString()));
                        newUser.setRegistrationDate(LocalDateTime.now());
                        newUser.setPasswordResetUUID(UUID.randomUUID().toString());
                        newUser.setNotificationUUID(UUID.randomUUID().toString());
                        newUser.setPersonalDataAgree(true);


                        boolean isStudent = false;
                        try {
                            if (userData.get("studentData") != null) {
                                List<Object> studentDataInfo = (List<Object>) userData.get("studentData");
                                for (Object o : studentDataInfo) {
                                    Map<String, Object> stDiO = (Map<String, Object>) o;
                                    int studyCource;
                                    int facId;
                                    if (Integer.parseInt(stDiO.get("studyStatus").toString()) == 1) {
                                        studyCource = Integer.parseInt(stDiO.get("studyCourse").toString());
                                        Map<String, Object> facInfo = (Map<String, Object>) stDiO.get("facInfo");
                                        facId = Integer.parseInt(facInfo.get("id").toString());

                                        newUser.setRoles(Collections.singleton(Roles.STUDENT));
                                        newUser.setUserStudyGroupInMirIsmu(stDiO.get("studyGroup").toString());

                                        if (facId > 11) {
                                            if (userGroupRepo.findByNidInIsmu((long) facId).isPresent()) {
                                                newUser.setUserGroup((userGroupRepo.findByNidInIsmu((long) facId).get().getId()));
                                                isStudent = true;
                                            }
                                        } else {
                                            if (facId == 1) {
                                                if (studyCource == 1) {
                                                    newUser.setUserGroup(5095L);
                                                } else if (studyCource == 2) {
                                                    newUser.setUserGroup(5096L);
                                                } else if (studyCource == 3) {
                                                    newUser.setUserGroup(5097L);
                                                } else if (studyCource == 4) {
                                                    newUser.setUserGroup(5098L);
                                                } else if (studyCource == 5) {
                                                    newUser.setUserGroup(5099L);
                                                } else if (studyCource == 6) {
                                                    newUser.setUserGroup(5100L);
                                                }
                                            } else if (facId == 2) {
                                                if (studyCource == 1) {
                                                    newUser.setUserGroup(5101L);
                                                } else if (studyCource == 2) {
                                                    newUser.setUserGroup(5102L);
                                                } else if (studyCource == 3) {
                                                    newUser.setUserGroup(5103L);
                                                } else if (studyCource == 4) {
                                                    newUser.setUserGroup(5104L);
                                                } else if (studyCource == 5) {
                                                    newUser.setUserGroup(5105L);
                                                } else if (studyCource == 6) {
                                                    newUser.setUserGroup(5106L);
                                                }
                                            } else if (facId == 4) {
                                                if (studyCource == 1) {
                                                    newUser.setUserGroup(5107L);
                                                } else if (studyCource == 2) {
                                                    newUser.setUserGroup(5108L);
                                                } else if (studyCource == 3) {
                                                    newUser.setUserGroup(5109L);
                                                } else if (studyCource == 4) {
                                                    newUser.setUserGroup(5110L);
                                                } else if (studyCource == 5) {
                                                    newUser.setUserGroup(5111L);
                                                } else if (studyCource == 6) {
                                                    newUser.setUserGroup(5112L);
                                                }
                                            } else if (facId == 3) {
                                                if (studyCource == 1) {
                                                    newUser.setUserGroup(5113L);
                                                } else if (studyCource == 2) {
                                                    newUser.setUserGroup(5114L);
                                                } else if (studyCource == 3) {
                                                    newUser.setUserGroup(5115L);
                                                } else if (studyCource == 4) {
                                                    newUser.setUserGroup(5116L);
                                                } else if (studyCource == 5) {
                                                    newUser.setUserGroup(5117L);
                                                } else if (studyCource == 6) {
                                                    newUser.setUserGroup(5118L);
                                                }
                                            } else if (facId == 5) {
                                                if (studyCource == 1) {
                                                    newUser.setUserGroup(5119L);
                                                } else if (studyCource == 2) {
                                                    newUser.setUserGroup(5120L);
                                                } else if (studyCource == 3) {
                                                    newUser.setUserGroup(5121L);
                                                } else if (studyCource == 4) {
                                                    newUser.setUserGroup(5122L);
                                                } else if (studyCource == 5) {
                                                    newUser.setUserGroup(5123L);
                                                }
                                            } else
                                                // с сестрами все плохо
                                                if (facId == 6) {
                                                    newUser.setUserGroup(5533L);
                                                } else if (facId == 7) {
                                                    if (studyCource == 1) {
                                                        newUser.setUserGroup(5124L);
                                                    } else if (studyCource == 2) {
                                                        newUser.setUserGroup(5125L);
                                                    } else if (studyCource == 3) {
                                                        newUser.setUserGroup(5126L);
                                                    } else if (studyCource == 4) {
                                                        newUser.setUserGroup(5127L);
                                                    } else if (studyCource == 5) {
                                                        newUser.setUserGroup(5128L);
                                                    } else if (studyCource == 6) {
                                                        newUser.setUserGroup(5129L);
                                                    }
                                                } else if (facId == 8) {
                                                    newUser.setUserGroup(5531L);
                                                } else if (facId == 9) {
                                                    newUser.setUserGroup(5532L);
                                                } else if (facId == 185) {
                                                    if (studyCource == 1) {
                                                        newUser.setUserGroup(5377L);
                                                    } else if (studyCource == 2) {
                                                        newUser.setUserGroup(5378L);
                                                    }
                                                }
                                        }
                                        isStudent = true;
                                    } else {
                                        isStudent = false;
                                    }
                                }
                            }

                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        if (user.isPresent()) {
                            mappedAuthorities.addAll(user.get().getAuthorities());
                            System.out.println("mappedAuthorities: " + mappedAuthorities.toString());
                            User updatedUser = user.get();
                            if (isStudent) {
                                BeanUtils.copyProperties(newUser,
                                        updatedUser,
                                        "id",
                                        "password",
                                        "phoneNumber",
                                        "notificationAgree",
                                        "username",
                                        "userEmail",
                                        "userRole",
                                        "roles",
                                        "deleteDate",
                                        "whoDeleted",
                                        "isDeleted",
                                        "active",
                                        "userAgreement",
                                        "personalDataAgree",
                                        "lastPasswordResetRequestDate",
                                        "userAgreement",
                                        "registrationDate",
                                        "notificationUUID",
                                        "passwordResetUUID");
                                updatedUser.setRoles(Collections.singleton(STUDENT));

                            } else {
                                BeanUtils.copyProperties(newUser,
                                        updatedUser,
                                        "id",
                                        "password",
                                        "phoneNumber",
                                        "userGroup",
                                        "notificationAgree",
                                        "username",
                                        "userEmail",
                                        "userRole",
                                        "roles",
                                        "deleteDate",
                                        "whoDeleted",
                                        "isDeleted",
                                        "active",
                                        "userAgreement",
                                        "personalDataAgree",
                                        "lastPasswordResetRequestDate",
                                        "userAgreement",
                                        "registrationDate",
                                        "notificationUUID",
                                        "passwordResetUUID");
                            }

                            userRepo.save(updatedUser);
                        } else {
                           // System.out.println("User is not present");
                            userRepo.save(newUser);
                            //Вот тут нужно подумать на тему перенаправления нового пользователя на месадж что с ним делать
                        }

                    }
                }

                return mappedAuthorities;
            };
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.formLogin()
                    .loginPage("/login")
                    .permitAll();

            http.oauth2Login(oauth2 -> oauth2.loginPage("/oauth_login")
                    .userInfoEndpoint(userInfo -> userInfo
                            .userAuthoritiesMapper(this.userAuthoritiesMapper())
                    ))

            ;

            http.csrf().disable();

            // http.addFilterAfter(
            //        new XSSFilter(), BasicAuthenticationFilter.class);

            http.authorizeRequests()
                    .antMatchers("/",
                            "/checkUser",
                            "/checkUser/**",
                            "/login",
                            "/login/**",
                            "/oauth_login",
                            "/js/public/**",
                            "/css/**"
                            , "/registration",
                            "/nav",
                            "/success_unsubscrube",
                            "/unsuccess_unsubscrube",
                            "/politic",
                            "/unsuccess_reset_password",
                            "/success_reset_password",
                            "/unsuccess_req_password",
                            "/success_req_password",
                            "/unsubscribe",
                            "/unsubscribe/**",
                            "/resetpassword",
                            "/resetpassword/**",
                            "/reqpassword",
                            "/reqpassword/**",
                            "/students/**",
                            "/students",
                            "/registration",
                            "/passwordrequest",
                            "/usergroup",
                            "/useragreement",
                            "/studentgroup",
                            "/help").permitAll()
                    .antMatchers("/js/authentificated/**",

                            "/courcemaker",
                            "/cource",
                            "/lectionmaker",
                            "/lection",
                            "/answermaker",
                            "/answer",
                            "/questionmaker",
                            "/question",
                            "/testmaker",
                            "/test",
                            "/logout",
                            "/record",
                            "/accesstocource",
                            "/studentlist",
                            "/seminars",
                            "/seminar",
                            "/seminar/**",
                            "/accessToSeminar",
                            "/seminarsForStudents").hasAnyAuthority("USER", "ADMIN", "LECTOR")
                    .antMatchers("/js/admin/**",
                            "/usermaker",
                            "/srvconf",
                            "/userlist",
                            "/srv",
                            "/group",
                            "/courcelist",
                            "/activeMeetings",
                            "/swagger-ui",
                            "/actuator").hasAnyAuthority("ADMIN")
                    .antMatchers("/llist",
                            "/lectionlist",
                            "/activeMeetingsList").hasAnyAuthority("ADMIN", "MODERATOR")

                    .antMatchers("/gs-guide-websocket",
                            "/lectionStatistics/**",
                            "/lectionStatistic",
                            "/seminarListener",
                            "/accessUserToSeminar",
                            "/testAttemptAnalysis",
                            "/testAttemptAnalysis/**",
                            "/testByDepartment",
                            "/testByDepartment/**",
                            "/userForSelectList").hasAnyAuthority("USER", "ADMIN", "LECTOR")
                    .antMatchers("/lectionviews",
                            "/profile",
                            "/testforuser",
                            "/testforuser/**",
                            "/saveanswer",
                            "/saveanswer/**",
                            "/testattempt",
                            "/courceListForStudent",
                            "/lectionListForStudent",
                            "/lectionsListForStudent",
                            "/watchlist",
                            "/js/student/**",
                            "/upload",
                            "/file",
                            "/downloadFile",
                            "/filesForLection",
                            "/seminar/**",
                            "/seminar/begin/{id}",
                            "/seminarsForStudent",
                            "/seminarList").hasAnyAuthority("USER", "ADMIN", "LECTOR", "STUDENT")
                    .anyRequest().authenticated()


                    // .and()
                    // .rememberMe()
                    .and()
                    .logout()
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .permitAll();
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            auth.userDetailsService(userService)
                    .passwordEncoder(passwordEncoder);

        }

}
