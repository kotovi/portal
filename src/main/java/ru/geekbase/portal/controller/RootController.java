package ru.geekbase.portal.controller;
import io.swagger.annotations.Api;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@Api(description = "контроллер  для раздачи шаблонов")
public class RootController {

    @GetMapping("/")
    public String greeting(){
        return  "/greeting";
    }
    @GetMapping("/help")

    public String help(){
        return  "/help";
    }

    @GetMapping("/profile")
    public String profile(){
        return  "/profile";
    }

    @GetMapping("/user")
    public String user() {
        return "/user";
    }

    @GetMapping("/courcemaker")
    public String courcemaker() {

        return "/courcemaker";
    }
    @GetMapping("/group")
    public String group() {

        return "/group";
    }
    @GetMapping("/politic")
    public String politic() {
        return "/politic";
    }

    @GetMapping("/srvconf")
    public String srvconf() {

        return "/srvconf";
    }
    @GetMapping("/usermaker")
    public String usermaker() {

        return "/usermaker";
    }
    @GetMapping("/success_unsubscrube")
    public String success_unsubscrube() {
        return "/success_unsubscrube";
    }

    @GetMapping("/unsuccess_unsubscrube")
    public String unsuccess_unsubscrube() {
        return "/unsuccess_unsubscrube";
    }

    @GetMapping("/llist")
    public String llist() {
        return "/llist";
    }

    @GetMapping("/lectionmaker")
    public String lectionmaker(Model model,
                               @RequestParam(defaultValue = "0") String courceId,
                               @RequestParam(defaultValue = "0") String courceName,
                               @RequestParam(defaultValue = "0") String lectionCount,
                               @RequestParam(defaultValue = "0") String testEnable ) {

        System.out.println("Lectionmaker parametrs im model: " + courceId+"_"+courceName+"_"+lectionCount+"_"+testEnable);

        model.addAttribute("courceId", courceId);
        model.addAttribute("courceName",courceName);
        model.addAttribute("lectionCount",lectionCount);
        model.addAttribute("testEnable",testEnable);
        return "/lectionmaker";
    }

    @GetMapping("/testmaker")
    public String testmaker() {
        return "/testmaker";
    }

    @GetMapping("/filesForLection")
    public String filesForLection(Model model,
                            @RequestParam(defaultValue = "0") String lectionId) {
        model.addAttribute("lectionId", lectionId);
        return "/filesForLection";
    }

    @GetMapping("/questionmaker")
    public String questionmaker(Model model,
                                @RequestParam(defaultValue = "null") String testId) {
        model.addAttribute("testId", testId);
        return "/questionmaker";
    }

    @GetMapping("/answermaker")
    public String answermaker(Model model,
                              @RequestParam(defaultValue = "null") String questionId,
                              @RequestParam(defaultValue = "null") String answersCount,
                              @RequestParam(defaultValue = "null") String questionBody,
                              @RequestParam(defaultValue = "null") String testId) {
        model.addAttribute("questionId", questionId);
        model.addAttribute("answersCount", answersCount);
        model.addAttribute("questionBody", questionBody);
        model.addAttribute("testId",testId);
        return "/answermaker";
    }
    @GetMapping("/success_reset_password")
    public String success_reset_password() {
        return "/success_reset_password";
    }

    @GetMapping("/unsuccess_reset_password")
    public String unsuccess_reset_password() {
        return "/unsuccess_reset_password";
    }
    @GetMapping("/success_req_password")
    public String success_req_password() {
        return "/success_req_password";
    }

    @GetMapping("/unsuccess_req_password")
    public String unsuccess_req_password() {
        return "/unsuccess_req_password";
    }

    @GetMapping("/passwordrequest")
    public String passwordrequest() {
        return "/passwordrequest";
    }

    @GetMapping("/registration")
    public String registration(Model model,
                               @RequestParam(defaultValue = "null") String tokenFromIsmu) {
        model.addAttribute("tokenFromIsmu", tokenFromIsmu);
        return "/registration";
    }


    @GetMapping("/studentlist")
    public String studentlist() {
        return "/studentlist";
    }

    @GetMapping("/testattempt")
    public String testattempt(Model model,
                              @RequestParam(defaultValue = "null") String lectionId,
                              @RequestParam(defaultValue = "null") String courceId,
                              @RequestParam(defaultValue = "null") String testType) {
        model.addAttribute("lectionId", lectionId);
        model.addAttribute("courceId", courceId);
        model.addAttribute("testType", testType);

        return "/testattempt";
    }

    @GetMapping("/useragreement")
    public String useragreement() {
        return "/useragreement";
    }

    @GetMapping("/accesstocource")
        public String answermaker(Model model,
                @RequestParam(defaultValue = "0") String id ){
            model.addAttribute("id", id);

            return "/accesstocource";
    }

    @GetMapping("/accessToSeminar")
    public String accessToSeminar(Model model,
                              @RequestParam(defaultValue = "0") String id ){
        model.addAttribute("id",id);

        return "/accessToSeminar";
    }

    @GetMapping("/accessUserToSeminar")
    public String accessUserToSeminar(Model model,
                                  @RequestParam(defaultValue = "0") String id ){
        model.addAttribute("id", id);

        return "/accessUserToSeminar";
    }

    @GetMapping("/lectionWatchList")
    public String lectionWatchList(Model model,
                                   @RequestParam(defaultValue = "null") String courceId ){

        model.addAttribute("courceId", courceId);
        return "/lectionWatchList";

    }

    @GetMapping("/courceWatchList")
    public String courceWatchList() {
        return "/courceWatchList";
    }

    @GetMapping("/seminars")
    public String seminars() {
        return "/seminars";
    }

    @GetMapping("/activeMeetingsList")
    public String activeMeetingsList() {
        return "/activeMeetingsList";
    }

    @GetMapping("/seminarList")
    public String seminarList() {
        return "/seminarList";
    }

    @GetMapping("/lectionStatistic")
    public String lectionStatistic(Model model,
                                   @RequestParam(defaultValue = "null") String lectionId){
        model.addAttribute("lectionId", lectionId);
        return "/lectionStatistic";
    }

    @GetMapping("/testAttemptAnalysis")
    public String testAttemptAnalysis(Model model,
                                   @RequestParam(defaultValue = "null") String attemptId){
        model.addAttribute("attemptId", attemptId);
        return "/testAttemptAnalysis";
    }
}
