package com.EFSRT.EFSRT.dto;

import java.math.BigDecimal;

public record ProductoDto(
                Long id,
                String nombre,
                String descripcion,
                String categoria,
                BigDecimal precio,
                Integer stock,
                String imagenUrl,
                Boolean disponible) {
}
