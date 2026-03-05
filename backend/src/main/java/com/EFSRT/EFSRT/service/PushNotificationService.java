package com.EFSRT.EFSRT.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;

@Service
@Slf4j
public class PushNotificationService {

    @Value("${app.vapid.public-key}")
    private String publicKey;

    @Value("${app.vapid.private-key}")
    private String privateKey;

    @Value("${app.vapid.subject}")
    private String subject;

    private PushService pushService;

    @PostConstruct
    private void init() {
        try {
            if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
                Security.addProvider(new BouncyCastleProvider());
            }
            pushService = new PushService(publicKey, privateKey, subject);
        } catch (Exception e) {
            log.error("Error al inicializar PushService", e);
        }
    }

    public void sendNotification(String endpoint, String p256dh, String auth, String payload) {
        try {
            Subscription.Keys keys = new Subscription.Keys(p256dh, auth);
            Subscription subscription = new Subscription(endpoint, keys);

            Notification notification = new Notification(subscription, payload);
            pushService.send(notification);
        } catch (Exception e) {
            log.error("Error al enviar notificación push a {}", endpoint, e);
        }
    }
}
