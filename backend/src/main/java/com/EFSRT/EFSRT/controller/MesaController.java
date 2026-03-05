package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.MesaDto;
import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.service.MesaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/mesas")
@RequiredArgsConstructor
public class MesaController {

    private final MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaDto>> listarTodas() {
        return ResponseEntity.ok(mesaService.listarTodas());
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<MesaDto> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        EstadoMesa nuevoEstado = EstadoMesa.valueOf(body.get("estado").toUpperCase());
        return ResponseEntity.ok(mesaService.cambiarEstado(id, nuevoEstado));
    }

    @PostMapping("/asignar-optima")
    public ResponseEntity<MesaDto> asignarMesaOptima(@RequestBody Map<String, Integer> body) {
        int tamanoGrupo = body.get("tamanoGrupo");
        return ResponseEntity.ok(mesaService.asignarMesaOptima(tamanoGrupo));
    }

    @PostMapping
    public ResponseEntity<MesaDto> crearMesa(@RequestBody Map<String, Integer> body) {
        Integer numero = body.get("numero");
        Integer capacidad = body.get("capacidad");
        if (numero == null || capacidad == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mesaService.crearMesa(numero, capacidad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MesaDto> actualizarMesa(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer numero = body.get("numero");
        Integer capacidad = body.get("capacidad");
        if (numero == null || capacidad == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mesaService.actualizarMesa(id, numero, capacidad));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMesa(@PathVariable Long id) {
        mesaService.eliminarMesa(id);
        return ResponseEntity.noContent().build();
    }
}
