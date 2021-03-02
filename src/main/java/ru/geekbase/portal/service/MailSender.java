package ru.geekbase.portal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class MailSender {
    @Autowired
    private JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String username;


    public void send(String emailTo, String subject, String message, String unsubscribeUrl) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            mimeMessage.setContent(message.replaceAll("\n", "<br\\>\n").trim(), "text/html; charset=UTF-8");

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");

            helper.setFrom(username);
            helper.setTo(emailTo);
            helper.setSubject(subject);
            mimeMessage.setText(message);
            if (null != unsubscribeUrl) {
                mimeMessage.addHeader("List-Unsubscribe", String.format("<%s>", unsubscribeUrl));
            }
            mailSender.send(mimeMessage);
        } catch (Exception ex) {
            // System.out.println("Failed to send email (subject: " + subject + ").", ex);

        }
    }
}
