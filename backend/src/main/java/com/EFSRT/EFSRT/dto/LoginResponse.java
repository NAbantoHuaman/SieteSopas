package com.EFSRT.EFSRT.dto;

public record LoginResponse(
        String token,
        UsuarioDto usuario) {
}
