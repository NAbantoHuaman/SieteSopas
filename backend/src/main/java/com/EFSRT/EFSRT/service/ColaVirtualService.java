package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.dto.JoinQueueRequest;
import com.EFSRT.EFSRT.dto.MesaDto;
import com.EFSRT.EFSRT.dto.TicketColaDto;
import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.entity.TicketCola;
import com.EFSRT.EFSRT.exception.BusinessRuleException;
import com.EFSRT.EFSRT.exception.ResourceNotFoundException;
import com.EFSRT.EFSRT.repository.TicketColaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.context.annotation.Lazy;
import java.util.Map;

/**
 * Servicio de cola virtual.
 * Gestiona tickets, calcula tiempos de espera y publica eventos en tiempo real.
 */
@Service
@Slf4j
public class ColaVirtualService {

    private final TicketColaRepository ticketColaRepository;
    private final MesaService mesaService;
    private final SimpMessagingTemplate messagingTemplate;
    private final CajaService cajaService;

    public ColaVirtualService(TicketColaRepository ticketColaRepository, MesaService mesaService,
                              SimpMessagingTemplate messagingTemplate, @Lazy CajaService cajaService) {
        this.ticketColaRepository = ticketColaRepository;
        this.mesaService = mesaService;
        this.messagingTemplate = messagingTemplate;
        this.cajaService = cajaService;
    }

    @Transactional
    public TicketColaDto unirseACola(JoinQueueRequest request) {
        long personasEsperando = ticketColaRepository.countByEstado(EstadoTicket.ESPERANDO);

        int tiempoEstimado;
        if (personasEsperando < 5) {
            // Los primeros 5 clientes: 3 minutos por cada cliente en la cola
            tiempoEstimado = (int) ((personasEsperando + 1) * 3);
        } else {
            // Del cliente 6 en adelante: 15 minutos base + 2 minutos adicionales por
            // cliente extra
            tiempoEstimado = 15 + (int) ((personasEsperando - 4) * 2);
        }

        TicketCola ticket = TicketCola.builder()
                .nombreCliente(request.nombreCliente())
                .tamanoGrupo(request.tamanoGrupo())
                .tiempoEsperaEstimado(tiempoEstimado)
                .estado(EstadoTicket.ESPERANDO)
                .build();

        ticket = ticketColaRepository.save(ticket);
        publicarCambioCola();

        log.info("Cliente '{}' se unió a la cola. Grupo: {}, Espera estimada: {}min",
                request.nombreCliente(), request.tamanoGrupo(), tiempoEstimado);
        return toDto(ticket);
    }

    public List<TicketColaDto> listarColaActiva() {
        return ticketColaRepository
                .findAllByEstadoInOrderByCreatedAtAsc(
                        List.of(EstadoTicket.ESPERANDO, EstadoTicket.LLAMANDO))
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TicketColaDto obtenerTicket(Long id) {
        TicketCola ticket = ticketColaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado: " + id));
        return toDto(ticket);
    }

    @Transactional
    public TicketColaDto asignarMesa(Long ticketId, Long mesaId) {
        TicketCola ticket = ticketColaRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado: " + ticketId));

        if (ticket.getEstado() == EstadoTicket.ASIGNADO) {
            throw new BusinessRuleException("Este ticket ya fue asignado a una mesa");
        }

        // Usar el servicio de mesas para cambiar el estado (con WebSocket)
        MesaDto mesa = mesaService.cambiarEstado(mesaId,
                com.EFSRT.EFSRT.entity.EstadoMesa.OCUPADA);

        // Cargar la entidad Mesa y asociarla al ticket
        com.EFSRT.EFSRT.entity.Mesa mesaEntity = mesaService.obtenerMesaPorId(mesaId);
        ticket.setMesaAsignada(mesaEntity);
        ticket.setEstado(EstadoTicket.ASIGNADO);
        ticket.setAssignedAt(LocalDateTime.now());
        ticketColaRepository.save(ticket);

        publicarCambioCola();
        log.info("Ticket {} asignado a mesa #{}", ticketId, mesaEntity.getNumero());
        return toDto(ticket);
    }

    @Transactional
    public Map<String, Object> cancelarTicket(Long ticketId) {
        TicketCola ticket = ticketColaRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado: " + ticketId));

        Map<String, Object> receipt = null;
        if (ticket.getMesaAsignada() != null && ticket.getEstado() == EstadoTicket.ASIGNADO) {
            log.info("Cliente finalizó visita del Ticket {}. Mesa {} pasa a LIMPIEZA y genera pago.", ticketId, ticket.getMesaAsignada().getNumero());
            // CajaService se encarga de cambiar el estado a LIMPIEZA, autogenerar el consumo y facturar.
            receipt = cajaService.procesarPago(ticket.getMesaAsignada().getId());
        }

        ticket.setEstado(EstadoTicket.CANCELADO);
        ticketColaRepository.save(ticket);

        publicarCambioCola();
        log.info("Ticket {} cancelado", ticketId);
        return receipt != null ? receipt : Map.of("mensaje", "Ticket cancelado correctamente sin consumo.");
    }

    private void publicarCambioCola() {
        List<TicketColaDto> cola = listarColaActiva();
        messagingTemplate.convertAndSend("/topic/queue", cola);
    }

    private TicketColaDto toDto(TicketCola t) {
        return new TicketColaDto(
                t.getId(), t.getNombreCliente(), t.getTamanoGrupo(),
                t.getTiempoEsperaEstimado(), t.getEstado(),
                t.getMesaAsignada() != null ? t.getMesaAsignada().getId() : null,
                t.getMesaAsignada() != null ? t.getMesaAsignada().getNumero() : null,
                t.getCreatedAt(),
                t.getReceiptJson());
    }
}
