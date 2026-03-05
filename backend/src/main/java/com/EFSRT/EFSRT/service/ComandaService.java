package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.dto.ComandaDto;
import com.EFSRT.EFSRT.dto.CreateComandaRequest;
import com.EFSRT.EFSRT.entity.Comanda;
import com.EFSRT.EFSRT.entity.EstadoComanda;
import com.EFSRT.EFSRT.entity.Mesa;
import com.EFSRT.EFSRT.exception.BusinessRuleException;
import com.EFSRT.EFSRT.exception.ResourceNotFoundException;
import com.EFSRT.EFSRT.repository.ComandaRepository;
import com.EFSRT.EFSRT.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Máquina de estados de cocina usando sealed classes y pattern matching (Java
 * 21).
 * Transiciones: PENDIENTE → PREPARANDO → LISTO → ENTREGADO
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ComandaService {

    private final ComandaRepository comandaRepository;
    private final MesaRepository mesaRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // --- Sealed interface para eventos de comanda (Java 21) ---
    public sealed interface ComandaEvent permits
            ComandaEvent.IniciarPreparacion,
            ComandaEvent.MarcarListo,
            ComandaEvent.Entregar {

        record IniciarPreparacion(Long comandaId) implements ComandaEvent {
        }

        record MarcarListo(Long comandaId) implements ComandaEvent {
        }

        record Entregar(Long comandaId) implements ComandaEvent {
        }
    }

    @Transactional
    public ComandaDto crearComanda(CreateComandaRequest request) {
        Comanda comanda = Comanda.builder()
                .items(request.items())
                .estado(EstadoComanda.PENDIENTE)
                .total(request.total() != null ? request.total() : java.math.BigDecimal.ZERO)
                .pagado(request.mesaId() == null) // Walk-ins son auto-pagados en este prototipo
                .build();

        if (request.mesaId() != null) {
            Mesa mesa = mesaRepository.findById(request.mesaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada: " + request.mesaId()));
            comanda.setMesa(mesa);
        }

        comanda = comandaRepository.save(comanda);
        publicarCambioCocina();

        log.info("Nueva comanda creada: {}", request.items());
        return toDto(comanda);
    }

    /**
     * Procesa un evento de comanda usando pattern matching (Java 21).
     */
    @Transactional
    public ComandaDto procesarEvento(ComandaEvent evento) {
        return switch (evento) {
            case ComandaEvent.IniciarPreparacion e ->
                transicionar(e.comandaId(), EstadoComanda.PENDIENTE, EstadoComanda.PREPARANDO);
            case ComandaEvent.MarcarListo e ->
                transicionar(e.comandaId(), EstadoComanda.PREPARANDO, EstadoComanda.LISTO);
            case ComandaEvent.Entregar e -> transicionar(e.comandaId(), EstadoComanda.LISTO, EstadoComanda.ENTREGADO);
        };
    }

    private ComandaDto transicionar(Long comandaId, EstadoComanda estadoEsperado, EstadoComanda nuevoEstado) {
        Comanda comanda = comandaRepository.findById(comandaId)
                .orElseThrow(() -> new ResourceNotFoundException("Comanda no encontrada: " + comandaId));

        if (comanda.getEstado() != estadoEsperado) {
            throw new BusinessRuleException(
                    "Transición inválida: la comanda está en " + comanda.getEstado()
                            + ", se esperaba " + estadoEsperado);
        }

        comanda.setEstado(nuevoEstado);
        comanda.setUpdatedAt(LocalDateTime.now());
        comandaRepository.save(comanda);

        publicarCambioCocina();
        log.info("Comanda {} transicionó a {}", comandaId, nuevoEstado);
        return toDto(comanda);
    }

    public List<ComandaDto> listarActivas() {
        return comandaRepository
                .findAllByEstadoIn(List.of(
                        EstadoComanda.PENDIENTE,
                        EstadoComanda.PREPARANDO,
                        EstadoComanda.LISTO))
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<ComandaDto> listarPorEstado(EstadoComanda estado) {
        return comandaRepository.findAllByEstadoAndPagadoFalse(estado).stream()
                .map(this::toDto)
                .toList();
    }

    private void publicarCambioCocina() {
        List<ComandaDto> activas = listarActivas();
        messagingTemplate.convertAndSend("/topic/kitchen", activas);
    }

    private ComandaDto toDto(Comanda c) {
        return new ComandaDto(
                c.getId(), c.getItems(), c.getEstado(), c.getTiempoMinutos(),
                c.getMesa() != null ? c.getMesa().getId() : null,
                c.getMesa() != null ? c.getMesa().getNumero() : -1,
                c.getMesero() != null ? c.getMesero().getId() : null,
                c.getTotal(),
                c.getCreatedAt());
    }
}
