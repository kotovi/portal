package ru.geekbase.portal.service;

import  org.apache.commons.codec.digest.DigestUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import ru.geekbase.portal.domain.Lection;
import ru.geekbase.portal.domain.Seminar;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.io.UnsupportedEncodingException;


public class BBBService {

    public  static String createMeetingURL(String srvUrl,
                                           String salt,
                                           String meetingName,
                                           String password,
                                           String logoutURL) {
        try {
            meetingName = URLEncoder.encode(meetingName, "UTF-8");
            logoutURL = URLEncoder.encode(logoutURL, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        UUID uuid = UUID.randomUUID();
        String meetingId = uuid.toString();

        String ApiCallWithSalt = ("createname=").concat(meetingName).
                concat("&meetingID=").concat(meetingId).
                concat("&moderatorPW=").concat(password).
                concat("&attendeePW=").concat(password).
                concat("&logoutURL=").concat(logoutURL).
                concat("&record=true&allowStartStopRecording=true").concat(salt);

        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));
        return srvUrl.concat("/bigbluebutton/api/create?name=").concat(meetingName)
                .concat("&meetingID=").concat(meetingId)
                .concat("&moderatorPW=").concat(password)
                .concat("&attendeePW=").concat(password)
                .concat("&logoutURL=").concat(logoutURL)
                .concat("&record=true&allowStartStopRecording=true")
                .concat("&checksum=").concat(ApiCallSha1);

    }

    public  static String createSeminarURL(String srvUrl,
                                           String salt,
                                           String meetingName,
                                           String atendeePassword,
                                           String moderatorPassword,
                                           String logoutURL) {
        try {
            meetingName = URLEncoder.encode(meetingName, "UTF-8");
            logoutURL = URLEncoder.encode(logoutURL, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        UUID uuid = UUID.randomUUID();
        String meetingId = uuid.toString();

        String ApiCallWithSalt = ("createname=").concat(meetingName)
                                .concat("&meetingID=").concat(meetingId)
                                .concat("&moderatorPW=").concat(moderatorPassword)
                                .concat("&attendeePW=").concat(atendeePassword)
                                .concat("&logoutURL=").concat(logoutURL)
                                .concat("&record=true&allowStartStopRecording=true")
                                .concat(salt);

        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));
        return  srvUrl
                            .concat("/bigbluebutton/api/create?name=").concat(meetingName)
                            .concat("&meetingID=").concat(meetingId)
                            .concat("&moderatorPW=").concat(moderatorPassword)
                            .concat("&attendeePW=").concat(atendeePassword)
                            .concat("&logoutURL=").concat(logoutURL)
                            .concat("&record=true&allowStartStopRecording=true")
                            .concat("&checksum=").concat(ApiCallSha1);
    }



    //генерируем URL для создания комнаты
    public  static Lection createMeeting(String srvUrl,
                                         String salt,
                                         String meetingName,
                                         String password,
                                         Lection lection,
                                         String logoutURL) {
        String createUrl = createMeetingURL(srvUrl,
                                            salt,
                                            meetingName,
                                            password,
                                            logoutURL);
        lection.setLectionCreateUrl(createUrl);
        try {
            Document doc = Jsoup.connect(createUrl).timeout(5000).get();
            Elements elementsByBBB = doc.getAllElements();
            boolean isSuccess = false;

            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    /* Ниже идет не очень красивый кусок кода
                     * потом нужно подумать как его переработать*/
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            isSuccess = true;
                        }
                    }
                    if (isSuccess) {
                        if (elementByBBB.tagName().equals("meetingID")) {
                            lection.setMeetingID(elementByBBB.text());
                        }
                        if (elementByBBB.tagName().equals("internalMeetingID: " + elementByBBB.text()
                        )) {
                            lection.setInternalMeetingID(elementByBBB.text());
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return  lection;
    }


    //генерируем URL для создания комнаты
    public  static Seminar createSeminarUrl(String srvUrl,
                                         String salt,
                                         String meetingName,
                                         String atendeePassword,
                                         String moderatorPassword,
                                         Seminar seminar,
                                         String logoutURL) {

        String createUrl = createSeminarURL(srvUrl,
                                            salt,
                                            meetingName,
                                            moderatorPassword,
                                            atendeePassword,
                                            logoutURL);

        seminar.setSeminarCreateUrl(createUrl);

        try {
            Document doc = Jsoup.connect(createUrl).timeout(10000).get();
            Elements elementsByBBB = doc.getAllElements();
            boolean isSuccess = false;
            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    /* Ниже идет не очень красивый кусок кода
                     * потом нужно подумать как его переработать*/
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            isSuccess = true;
                        }
                    }
                    if (isSuccess) {
                        if (elementByBBB.tagName().equals("meetingID")) {
                            seminar.setMeetingId(elementByBBB.text());
                        }
                    }
                }
            }
            seminar.setRecordStatus(1);
            seminar.setMeetingStatus(1);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return seminar;
    }



    //генерируем URL для входа в комнату
    public  static String joinSeminarUrl(String srvUrl,
                                         String salt,
                                         String meetingID,
                                         String fullName,
                                         String password) {

        String ApiCallWithSalt = ("joinmeetingID=").concat(meetingID).
                                concat("&password=").concat(password).
                                concat("&fullName=").concat(fullName).
                                concat(salt);

        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));

        return srvUrl.concat("/bigbluebutton/api/join?meetingID=").concat(meetingID).
                concat("&password=").concat(password).
                concat("&fullName=").concat(fullName).
                concat("&checksum=").concat(ApiCallSha1);

    }

    //генерируем URL для входа в комнату
    public  static String joinUrl(String srvUrl,
                                  String salt,
                                  String meetingID,
                                  String fullName,
                                  String password) {
        String ApiCallWithSalt = ("joinmeetingID=").concat(meetingID)
                                .concat("&password=").concat(password)
                                .concat("&fullName=").concat(fullName)
                                .concat(salt);

        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));

        return srvUrl.concat("/bigbluebutton/api/join?meetingID=").concat(meetingID)
                                .concat("&password=").concat(password)
                                .concat("&fullName=").concat(fullName)
                                .concat("&checksum=").concat(ApiCallSha1);
    }


    //генерируем URL для  получения информации о комнате
    public  static String GetMeetingInfoUrl(String srvUrl,
                                            String salt,
                                            String meetingID,
                                            String password) {
        String ApiCallWithSalt = ("getMeetingInfomeetingID=").concat(meetingID)
                                .concat("&password=").concat(password)
                                .concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));

        String GetMeetingInfoUrl = srvUrl.concat("/bigbluebutton/api/getMeetingInfo?meetingID=").concat(meetingID)
                                        .concat("&password=").concat(password)
                                        .concat("&checksum=").concat(ApiCallSha1);
        String isSuccess = "none";

        try {
            Document doc = Jsoup.connect(GetMeetingInfoUrl).timeout(6000).get();
            Elements elementsByBBB = doc.getAllElements();
            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            isSuccess = "success";
                        } else {
                            isSuccess ="unsuccess";
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    //генерируем URL для  получения информации о всех имеющихся записях в системе
    public  static String GetAllRecordingsUrl(String srvUrl,
                                              String salt) {
        String ApiCallWithSalt = ("getRecordings").concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));
        return srvUrl.concat("/bigbluebutton/api/getRecordings").concat("?checksum=").concat(ApiCallSha1);


    }
    //генерируем URL для  получения информации о записи конференции по ID
    public  static String GetRecordingsByIdUrl(String srvUrl,
                                               String salt,
                                               String meetingID) {
        String ApiCallWithSalt = ("getRecordingsmeetingID=").concat(meetingID).concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));
        return srvUrl.concat("/bigbluebutton/api/getRecordings?meetingID=").concat(meetingID).concat("&checksum=").concat(ApiCallSha1);


    }


    //Получаем URL записи по ID комнаты
    public static String getRecordingUrlById(String srvUrl,
                                             String salt,
                                             String meetingID){
        String ApiCallWithSalt = ("getRecordingsmeetingID=").concat(meetingID).concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));

        String GetRecordingsByIdUrl = srvUrl.concat("/bigbluebutton/api/getRecordings?meetingID=").concat(meetingID)
                .concat("&checksum=").concat(ApiCallSha1);
        String playbackUrl = "none";

        try {
            Document doc = Jsoup.connect(GetRecordingsByIdUrl).timeout(3000).get();
            Elements elementsByBBB = doc.getAllElements();
            boolean isSuccess = false;
            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            isSuccess = true;
                        }
                    }
                    if (isSuccess) {
                        if (elementByBBB.tagName().equals("recordID")) {
                            playbackUrl = srvUrl.concat("/playback/presentation/2.0/playback.html?meetingId=").concat(elementByBBB.text());
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return playbackUrl;
    }
    //принудительно закончить встречу
    public static Boolean endMeetingById(String srvUrl,
                                         String salt,
                                         String meetingID,
                                         String password){
        String ApiCallWithSalt = ("endmeetingID=").concat(meetingID)
                                .concat("&password=").concat(password)
                                .concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));

        String GetRecordingsByIdUrl = srvUrl.concat("/bigbluebutton/api/end?meetingID=").concat(meetingID)
                                        .concat("&password=").concat(password)
                                        .concat("&checksum=").concat(ApiCallSha1);
        boolean recordingDeleted = false;
        try {
            Document doc = Jsoup.connect(GetRecordingsByIdUrl).timeout(5000).get();
            Elements elementsByBBB = doc.getAllElements();
            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            recordingDeleted =true;
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return recordingDeleted;
    }

    //принудительно закончить встречу
    public static Boolean deleteRecordingById(String srvUrl,
                                              String salt,
                                              String recordID){

        String ApiCallWithSalt = ("deleteRecordingsrecordID=").concat(recordID).concat(salt);
        String ApiCallSha1 = DigestUtils.sha1Hex(ApiCallWithSalt.getBytes(StandardCharsets.UTF_8));
        String GetRecordingsByIdUrl = srvUrl.concat("/bigbluebutton/api/deleteRecordings?recordID=").concat(recordID)
                                            .concat("&checksum=").concat(ApiCallSha1);
        boolean recordingDeleted = false;
        try {
            Document doc = Jsoup.connect(GetRecordingsByIdUrl).timeout(5000).get();
            Elements elementsByBBB = doc.getAllElements();
            //System.out.println("Recording Id for delete: " + recordID);
           // System.out.println("Server responce: " + doc);
            if (elementsByBBB!=null) {
                for (Element elementByBBB : elementsByBBB ){
                    if (elementByBBB.tagName().equals("returncode")){
                        if (elementByBBB.text().equals("SUCCESS")) {
                            //System.out.println("Record delete SUCCESS");
                            recordingDeleted =true;
                        }
                    }
                    if (elementByBBB.tagName().equals("message")){
                        if (elementByBBB.text().equals("We could not find recordings")) {
                            //System.out.println("We could not find recordings");
                            recordingDeleted =true;
                        }
                    }

                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return recordingDeleted;

    }

}
