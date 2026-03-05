package com.EFSRT.EFSRT.dto;

import com.EFSRT.EFSRT.entity.EstadoComanda;
import java.time.LocalDateTime;

public record ComandaDto(
                Long id,
                String items,
                EstadoComanda estado,
                Integer tiempoMinutos,
                Long mesaId,
                Integer mesaNumero,
                Long meseroId,
                java.math.BigDecimal total,
                LocalDateTime createdAt) {
}
