package com.EFSRT.EFSRT.dto;

import com.EFSRT.EFSRT.entity.Rol;

public record UsuarioDto(
        Long id,
        String nombre,
        String email,
        Rol rol,
        boolean activo) {
}
