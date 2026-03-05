package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.dto.LoginRequest;
import com.EFSRT.EFSRT.dto.LoginResponse;
import com.EFSRT.EFSRT.dto.RegisterRequest;
import com.EFSRT.EFSRT.dto.UsuarioDto;
import com.EFSRT.EFSRT.entity.Rol;
import com.EFSRT.EFSRT.entity.Usuario;
import com.EFSRT.EFSRT.exception.BusinessRuleException;
import com.EFSRT.EFSRT.exception.ResourceNotFoundException;
import com.EFSRT.EFSRT.repository.UsuarioRepository;
import com.EFSRT.EFSRT.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Ya existe un usuario con el email: " + request.email());
        }

        Rol rol = switch (request.rol()) {
            case null -> Rol.CLIENTE;
            case String s when s.isBlank() -> Rol.CLIENTE;
            case String s -> Rol.valueOf(s.toUpperCase());
        };

        Usuario usuario = Usuario.builder()
                .nombre(request.nombre())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .rol(rol)
                .build();

        usuario = usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());
        return new LoginResponse(token, toDto(usuario));
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.password(), usuario.getPassword())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol().name());
        return new LoginResponse(token, toDto(usuario));
    }

    private UsuarioDto toDto(Usuario u) {
        return new UsuarioDto(u.getId(), u.getNombre(), u.getEmail(), u.getRol(), u.isActivo());
    }
}
