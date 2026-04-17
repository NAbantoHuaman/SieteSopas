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

    @Scheduled(fixedRate = 2000) // cada 2 segundos (Modo Demo)
    @Transactional
    public void verificarYNotificarTickets() {
        List<TicketCola> activos = ticketColaRepository.findAllByEstadoInWithMesaOrderByCreatedAtAsc(
                List.of(EstadoTicket.ESPERANDO, EstadoTicket.LLAMANDO, EstadoTicket.ASIGNADO));

        if (!activos.isEmpty()) {
            log.info("[DEMO-SCHEDULER] Tickets activos encontrados: {}", activos.size());
        }

        LocalDateTime now = LocalDateTime.now();

        for (TicketCola ticket : activos) {
            Optional<PushSubscription> subOpt = pushSubscriptionRepository.findByTicketId(ticket.getId());

            if (subOpt.isEmpty()) {
                log.warn("[DEMO-SCHEDULER] Ticket #{} ('{}') NO tiene suscripción push registrada.", 
                         ticket.getId(), ticket.getNombreCliente());
                continue;
            }

            PushSubscription sub = subOpt.get();

            if (ticket.getEstado() == EstadoTicket.ESPERANDO || ticket.getEstado() == EstadoTicket.LLAMANDO) {
                long segundosTranscurridos = ChronoUnit.SECONDS.between(ticket.getCreatedAt(), now);
                log.info("[DEMO-SCHEDULER] Ticket #{} - Segundos transcurridos: {}s, Notificado: {}", 
                         ticket.getId(), segundosTranscurridos, ticket.isNotified5Min());

                if (segundosTranscurridos >= 30 && !ticket.isNotified5Min()) {
                    log.info("[DEMO-SCHEDULER] >>> ENVIANDO PUSH a Ticket #{} <<<", ticket.getId());
                    enviarPush(sub, "¡Ya casi!",
                            "Tu mesa está lista. Por favor, acércate a la entrada de Siete Sopas.");
                    ticket.setNotified5Min(true);
                    ticketColaRepository.save(ticket);
                    log.info("[DEMO-SCHEDULER] >>> PUSH ENVIADO EXITOSAMENTE <<<");
                }
            } else if (ticket.getEstado() == EstadoTicket.ASIGNADO) {
                if (!ticket.isNotifiedAsignado()) {
                    String mesaInfo = ticket.getMesaAsignada() != null 
                        ? "Mesa #" + ticket.getMesaAsignada().getNumero() 
                        : "Tu mesa";
                    log.info("[DEMO-SCHEDULER] >>> ENVIANDO PUSH DE ASIGNACIÓN a Ticket #{} - {} <<<", ticket.getId(), mesaInfo);
                    enviarPush(sub, "🍽️ ¡" + mesaInfo + " Lista!", 
                            "Acércate al anfitrión de Siete Sopas. ¡Disfruta tu visita!");
                    ticket.setNotifiedAsignado(true);
                    ticketColaRepository.save(ticket);
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
