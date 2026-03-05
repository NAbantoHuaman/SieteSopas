package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.ProductoDto;
import com.EFSRT.EFSRT.dto.CreateProductoRequest;
import com.EFSRT.EFSRT.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    // Permitir a usuarios comunes ver los productos disponibles
    @GetMapping
    public ResponseEntity<List<ProductoDto>> listarDisponibles() {
        return ResponseEntity.ok(productoService.listarDisponibles());
    }

    // Endpoints para Administradores
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductoDto>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDto> crearProducto(@Valid @RequestBody CreateProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crearProducto(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDto> actualizarProducto(@PathVariable Long id,
            @Valid @RequestBody CreateProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizarProducto(id, request));
    }

    @PatchMapping("/{id}/disponibilidad")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDto> cambiarDisponibilidad(@PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean disponible = body.getOrDefault("disponible", true);
        return ResponseEntity.ok(productoService.cambiarDisponibilidad(id, disponible));
    }

    @PostMapping("/reducir-stock")
    public ResponseEntity<Void> reducirStock(@RequestBody Map<Long, Integer> deducciones) {
        productoService.reducirStockMasivo(deducciones);
        return ResponseEntity.noContent().build();
    }
}
