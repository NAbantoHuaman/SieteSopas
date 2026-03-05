package com.EFSRT.EFSRT.dto;

import lombok.Data;

@Data
public class PushSubscriptionRequest {
    private String endpoint;
    private Keys keys;
    private Long ticketId;

    @Data
    public static class Keys {
        private String p256dh;
        private String auth;
    }
}
