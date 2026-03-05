package com.EFSRT.EFSRT.scheduler;

import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.entity.PushSubscription;
import com.EFSRT.EFSRT.entity.TicketCola;
import com.EFSRT.EFSRT.repository.PushSubscriptionRepository;
import com.EFSRT.EFSRT.repository.TicketColaRepository;
import com.EFSRT.EFSRT.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueNotificationScheduler {

    private final TicketColaRepository ticketColaRepository;
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final PushNotificationService pushNotificationService;

    @Scheduled(fixedRate = 60000) // cada minuto
    @Transactional
    public void verificarYNotificarTickets() {
        List<TicketCola> activos = ticketColaRepository.findAllByEstadoInOrderByCreatedAtAsc(
                List.of(EstadoTicket.ESPERANDO, EstadoTicket.LLAMANDO, EstadoTicket.ASIGNADO));

        LocalDateTime now = LocalDateTime.now();

        for (TicketCola ticket : activos) {
            Optional<PushSubscription> subOpt = pushSubscriptionRepository.findByTicketId(ticket.getId());
            if (subOpt.isEmpty())
                continue;

            PushSubscription sub = subOpt.get();

            if (ticket.getEstado() == EstadoTicket.ESPERANDO || ticket.getEstado() == EstadoTicket.LLAMANDO) {
                // Notificar 5 min
                long minutosTranscurridos = ChronoUnit.MINUTES.between(ticket.getCreatedAt(), now);
                long tiempoRestante = ticket.getTiempoEsperaEstimado() - minutosTranscurridos;

                if (tiempoRestante <= 5 && !ticket.isNotified5Min()) {
                    enviarPush(sub, "¡Ya casi!",
                            "Tu mesa estará lista en menos de 5 minutos. Por favor, acércate a la entrada.");
                    ticket.setNotified5Min(true);
                    ticketColaRepository.save(ticket);
                }
            } else if (ticket.getEstado() == EstadoTicket.ASIGNADO) {
                // Notificar Asignacion
                if (!ticket.isNotifiedAsignado()) {
                    enviarPush(sub, "¡Mesa Asignada!", "¡Ya es tu turno! Tu mesa está lista.");
                    ticket.setNotifiedAsignado(true);
                    ticketColaRepository.save(ticket);

                    // Borramos la suscripcion para no volver a enviar tras terminar
                    pushSubscriptionRepository.delete(sub);
                }
            }
        }
    }

    private void enviarPush(PushSubscription sub, String title, String body) {
        String payload = "{\"title\": \"" + title + "\", \"body\": \"" + body + "\"}";
        pushNotificationService.sendNotification(sub.getEndpoint(), sub.getP256dh(), sub.getAuth(), payload);
    }
}
