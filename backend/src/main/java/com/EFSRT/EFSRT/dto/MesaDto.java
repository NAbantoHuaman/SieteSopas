package com.EFSRT.EFSRT.dto;

import com.EFSRT.EFSRT.entity.EstadoMesa;

public record MesaDto(
        Long id,
        Integer numero,
        Integer capacidad,
        EstadoMesa estado,
        String meseroAsignado,
        Integer tiempoOcupada) {
}
