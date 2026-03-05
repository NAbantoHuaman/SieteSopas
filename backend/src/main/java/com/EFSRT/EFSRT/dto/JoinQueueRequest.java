package com.EFSRT.EFSRT.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record JoinQueueRequest(
        @NotBlank(message = "El nombre del cliente es obligatorio") String nombreCliente,

        @Min(value = 1, message = "El grupo debe tener al menos 1 persona") Integer tamanoGrupo) {
}
