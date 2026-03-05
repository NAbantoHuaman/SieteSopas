package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.JoinQueueRequest;
import com.EFSRT.EFSRT.dto.TicketColaDto;
import com.EFSRT.EFSRT.service.ColaVirtualService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/queue")
@RequiredArgsConstructor
public class ColaController {

    private final ColaVirtualService colaVirtualService;

    @GetMapping
    public ResponseEntity<List<TicketColaDto>> listarCola() {
        return ResponseEntity.ok(colaVirtualService.listarColaActiva());
    }

    @PostMapping("/join")
    public ResponseEntity<TicketColaDto> unirseACola(@Valid @RequestBody JoinQueueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(colaVirtualService.unirseACola(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketColaDto> obtenerTicket(@PathVariable Long id) {
        return ResponseEntity.ok(colaVirtualService.obtenerTicket(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarTicket(@PathVariable Long id) {
        colaVirtualService.cancelarTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/asignar")
    public ResponseEntity<TicketColaDto> asignarMesa(
            @PathVariable Long id,
            @RequestBody Map<String, Long> body) {
        Long mesaId = body.get("mesaId");
        return ResponseEntity.ok(colaVirtualService.asignarMesa(id, mesaId));
    }
}
