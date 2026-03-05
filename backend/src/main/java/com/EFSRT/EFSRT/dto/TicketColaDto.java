package com.EFSRT.EFSRT.dto;

import com.EFSRT.EFSRT.entity.EstadoTicket;
import java.time.LocalDateTime;

public record TicketColaDto(
        Long id,
        String nombreCliente,
        Integer tamanoGrupo,
        Integer tiempoEsperaEstimado,
        EstadoTicket estado,
        Long mesaAsignadaId,
        LocalDateTime createdAt) {
}
