package ru.geekbase.portal.util;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.Translation;
import com.google.cloud.translate.v3.TranslationServiceClient;
import org.springframework.stereotype.Component;
import java.io.IOException;


@Component
public class GoogleTranslate {

    public static String translate(String textForTranslate) throws IOException {
        System.out.println("Begin translate ");
        // TODO(developer): Replace these variables before running the sample.
        String projectId = "model-union";
        // Supported Languages: https://cloud.google.com/translate/docs/languages
        String targetLanguage = "en";

        return translateText(projectId, targetLanguage, textForTranslate);
    }

    // Translating Text
    public static String translateText(String projectId, String targetLanguage, String text)
            throws IOException {
        String translated="";


        try (TranslationServiceClient client = TranslationServiceClient.create()) {

            LocationName parent = LocationName.of(projectId, "global");

            TranslateTextRequest request =
                    TranslateTextRequest.newBuilder()
                            .setParent(parent.toString())
                            .setMimeType("text/plain")
                            .setTargetLanguageCode(targetLanguage)
                            .addContents(text)
                            .build();

            TranslateTextResponse response = client.translateText(request);
            for (Translation translation : response.getTranslationsList()) {

                translated=translation.getTranslatedText();
                System.out.printf("Translated text: %s\n", translated);
            }
        }
        return translated;
    }

}
