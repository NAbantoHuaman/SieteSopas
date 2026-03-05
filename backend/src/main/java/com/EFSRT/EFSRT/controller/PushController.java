package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.PushSubscriptionRequest;
import com.EFSRT.EFSRT.entity.PushSubscription;
import com.EFSRT.EFSRT.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/push")
@RequiredArgsConstructor
public class PushController {

    private final PushSubscriptionRepository pushSubscriptionRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscriptionRequest request) {
        Optional<PushSubscription> existing = pushSubscriptionRepository.findByEndpoint(request.getEndpoint());

        PushSubscription sub = existing.orElse(new PushSubscription());
        sub.setEndpoint(request.getEndpoint());
        sub.setP256dh(request.getKeys().getP256dh());
        sub.setAuth(request.getKeys().getAuth());
        sub.setTicketId(request.getTicketId());

        pushSubscriptionRepository.save(sub);

        return ResponseEntity.ok().build();
    }
}
