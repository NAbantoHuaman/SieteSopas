package com.EFSRT.EFSRT.repository;

import com.EFSRT.EFSRT.entity.PushSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByTicketId(Long ticketId);

    Optional<PushSubscription> findByEndpoint(String endpoint);

    void deleteByTicketId(Long ticketId);
}
