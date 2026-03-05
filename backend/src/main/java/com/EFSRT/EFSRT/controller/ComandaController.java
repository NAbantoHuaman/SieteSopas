package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.ComandaDto;
import com.EFSRT.EFSRT.dto.CreateComandaRequest;
import com.EFSRT.EFSRT.service.ComandaService;
import com.EFSRT.EFSRT.service.ComandaService.ComandaEvent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/kitchen/comandas")
@RequiredArgsConstructor
public class ComandaController {

    private final ComandaService comandaService;

    @GetMapping
    public ResponseEntity<List<ComandaDto>> listarActivas() {
        return ResponseEntity.ok(comandaService.listarActivas());
    }

    @PostMapping
    public ResponseEntity<ComandaDto> crearComanda(@Valid @RequestBody CreateComandaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(comandaService.crearComanda(request));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<ComandaDto> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String accion = body.get("accion").toUpperCase();

        ComandaEvent evento = switch (accion) {
            case "INICIAR_PREPARACION" -> new ComandaEvent.IniciarPreparacion(id);
            case "MARCAR_LISTO" -> new ComandaEvent.MarcarListo(id);
            case "ENTREGAR" -> new ComandaEvent.Entregar(id);
            default -> throw new IllegalArgumentException("Acción inválida: " + accion);
        };

        return ResponseEntity.ok(comandaService.procesarEvento(evento));
    }
}
