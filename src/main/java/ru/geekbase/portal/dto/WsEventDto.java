package ru.geekbase.portal.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Data;
import ru.geekbase.portal.domain.LectionView;


    @Data
    @AllArgsConstructor
    @JsonView(LectionView.ForFront.class)
    public class WsEventDto {
        private ObjectType objectType;
        private EventType eventType;
        @JsonRawValue
        private String body;
    }

    
