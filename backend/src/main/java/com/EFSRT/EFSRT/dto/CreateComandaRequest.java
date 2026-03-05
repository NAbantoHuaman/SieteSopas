package com.EFSRT.EFSRT.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateComandaRequest(
        Long mesaId,

        @NotBlank(message = "Los items son obligatorios") String items,

        java.math.BigDecimal total) {
}
