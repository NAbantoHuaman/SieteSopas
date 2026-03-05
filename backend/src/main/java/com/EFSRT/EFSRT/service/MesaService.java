package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.dto.MesaDto;
import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.entity.Mesa;
import com.EFSRT.EFSRT.exception.BusinessRuleException;
import com.EFSRT.EFSRT.exception.ResourceNotFoundException;
import com.EFSRT.EFSRT.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de gestión de mesas con algoritmo de aforo inteligente.
 * Publica eventos WebSocket en /topic/tables cuando cambia el estado.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MesaService {

    private final MesaRepository mesaRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<MesaDto> listarTodas() {
        return mesaRepository.findAllByOrderByNumeroAsc().stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Algoritmo de aforo: busca la mesa LIBRE con capacidad más cercana al tamaño
     * del grupo.
     * Ejemplo: grupo de 4 → prefiere mesa de 4 antes que mesa de 6.
     * Usa bloqueo pesimista para evitar race conditions.
     */
    @Transactional
    public MesaDto asignarMesaOptima(int tamanoGrupo) {
        List<Mesa> disponibles = mesaRepository.findMesasDisponiblesConLock(
                EstadoMesa.LIBRE, tamanoGrupo);

        if (disponibles.isEmpty()) {
            throw new BusinessRuleException(
                    "No hay mesas disponibles para un grupo de " + tamanoGrupo + " personas");
        }

        // La primera es la de menor capacidad >= tamanoGrupo (ya ordenada ASC)
        Mesa mesa = disponibles.getFirst();
        mesa.setEstado(EstadoMesa.OCUPADA);
        mesa.setTiempoOcupada(0);
        mesaRepository.save(mesa);

        publicarCambioMesas();
        log.info("Mesa {} asignada para grupo de {} personas", mesa.getNumero(), tamanoGrupo);
        return toDto(mesa);
    }

    @Transactional
    public MesaDto cambiarEstado(Long mesaId, EstadoMesa nuevoEstado) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada: " + mesaId));

        // Validar transiciones válidas
        validarTransicion(mesa.getEstado(), nuevoEstado);

        mesa.setEstado(nuevoEstado);
        if (nuevoEstado == EstadoMesa.LIBRE) {
            mesa.setMeseroAsignado(null);
            mesa.setTiempoOcupada(0);
        }
        mesaRepository.save(mesa);

        publicarCambioMesas();
        log.info("Mesa {} cambió a estado {}", mesa.getNumero(), nuevoEstado);
        return toDto(mesa);
    }

    private void validarTransicion(EstadoMesa actual, EstadoMesa nuevo) {
        boolean valido = switch (actual) {
            case LIBRE -> nuevo == EstadoMesa.OCUPADA;
            case OCUPADA -> nuevo == EstadoMesa.LIMPIEZA;
            case LIMPIEZA -> nuevo == EstadoMesa.LIBRE;
        };
        if (!valido) {
            throw new BusinessRuleException(
                    "Transición inválida: " + actual + " → " + nuevo);
        }
    }

    /**
     * Publica el estado actualizado de TODAS las mesas al tópico WebSocket.
     */
    private void publicarCambioMesas() {
        List<MesaDto> todas = listarTodas();
        messagingTemplate.convertAndSend("/topic/tables", todas);
    }

    @Transactional
    public MesaDto crearMesa(Integer numero, Integer capacidad) {
        if (mesaRepository.findByNumero(numero).isPresent()) {
            throw new BusinessRuleException("Ya existe una mesa con el número " + numero);
        }
        Mesa mesa = Mesa.builder()
                .numero(numero)
                .capacidad(capacidad)
                .estado(EstadoMesa.LIBRE)
                .tiempoOcupada(0)
                .build();
        mesaRepository.save(mesa);
        publicarCambioMesas();
        log.info("Mesa {} creada con capacidad {}", numero, capacidad);
        return toDto(mesa);
    }

    @Transactional
    public MesaDto actualizarMesa(Long id, Integer numero, Integer capacidad) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada: " + id));

        if (!mesa.getNumero().equals(numero) && mesaRepository.findByNumero(numero).isPresent()) {
            throw new BusinessRuleException("Ya existe una mesa con el número " + numero);
        }

        mesa.setNumero(numero);
        mesa.setCapacidad(capacidad);
        mesaRepository.save(mesa);
        publicarCambioMesas();
        log.info("Mesa {} (ID: {}) actualizada", numero, id);
        return toDto(mesa);
    }

    @Transactional
    public void eliminarMesa(Long id) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada: " + id));

        if (mesa.getEstado() != EstadoMesa.LIBRE) {
            throw new BusinessRuleException("No se puede eliminar una mesa que no está LIBRE");
        }
        mesaRepository.delete(mesa);
        publicarCambioMesas();
        log.info("Mesa ID {} eliminada", id);
    }

    private MesaDto toDto(Mesa m) {
        return new MesaDto(m.getId(), m.getNumero(), m.getCapacidad(),
                m.getEstado(), m.getMeseroAsignado(), m.getTiempoOcupada());
    }
}
