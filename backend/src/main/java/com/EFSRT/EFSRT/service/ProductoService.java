package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.dto.ProductoDto;
import com.EFSRT.EFSRT.dto.CreateProductoRequest;
import com.EFSRT.EFSRT.entity.Producto;
import com.EFSRT.EFSRT.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;

    public List<ProductoDto> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ProductoDto> listarDisponibles() {
        return productoRepository.findByDisponibleTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductoDto crearProducto(CreateProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.nombre())
                .descripcion(request.descripcion())
                .categoria(request.categoria())
                .precio(request.precio())
                .stock(request.stock())
                .imagenUrl(request.imagenUrl())
                .disponible(request.disponible() != null ? request.disponible() : true)
                .build();
        return toDto(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDto actualizarProducto(Long id, CreateProductoRequest request) {
        Producto producto = productoRepository.findById(id).orElseThrow();
        producto.setNombre(request.nombre());
        producto.setDescripcion(request.descripcion());
        producto.setCategoria(request.categoria());
        producto.setPrecio(request.precio());
        producto.setStock(request.stock());
        producto.setImagenUrl(request.imagenUrl());
        if (request.disponible() != null) {
            producto.setDisponible(request.disponible());
        }
        return toDto(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDto cambiarDisponibilidad(Long id, boolean disponible) {
        Producto producto = productoRepository.findById(id).orElseThrow();
        producto.setDisponible(disponible);
        return toDto(productoRepository.save(producto));
    }

    @Transactional
    public void reducirStockMasivo(Map<Long, Integer> deducciones) {
        for (Map.Entry<Long, Integer> entry : deducciones.entrySet()) {
            Producto producto = productoRepository.findById(entry.getKey()).orElseThrow();
            int nuevoStock = producto.getStock() - entry.getValue();
            if (nuevoStock < 0) {
                throw new IllegalStateException("Stock insuficiente para: " + producto.getNombre());
            }
            producto.setStock(nuevoStock);
            productoRepository.save(producto);
        }
    }

    private ProductoDto toDto(Producto p) {
        return new ProductoDto(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getCategoria(),
                p.getPrecio(),
                p.getStock(),
                p.getImagenUrl(),
                p.getDisponible());
    }
}
