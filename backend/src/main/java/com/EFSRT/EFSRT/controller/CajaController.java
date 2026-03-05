package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.service.CajaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/billing")
@RequiredArgsConstructor
public class CajaController {

    private final CajaService cajaService;

    @GetMapping("/mesas")
    @PreAuthorize("hasAnyRole('CAJERO', 'ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> obtenerMesasParaCobro() {
        return ResponseEntity.ok(cajaService.listarMesasOcupadas());
    }

    @PostMapping("/mesas/{mesaId}/pagar")
    @PreAuthorize("hasAnyRole('CAJERO', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> procesarPago(@PathVariable Long mesaId) {
        return ResponseEntity.ok(cajaService.procesarPago(mesaId));
    }
}
