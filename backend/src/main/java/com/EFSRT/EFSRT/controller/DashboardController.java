package com.EFSRT.EFSRT.controller;

import com.EFSRT.EFSRT.dto.DashboardStats;
import com.EFSRT.EFSRT.entity.Comanda;
import com.EFSRT.EFSRT.entity.EstadoComanda;
import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.repository.ComandaRepository;
import com.EFSRT.EFSRT.repository.MesaRepository;
import com.EFSRT.EFSRT.repository.TicketColaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

        private final MesaRepository mesaRepository;
        private final TicketColaRepository ticketColaRepository;
        private final ComandaRepository comandaRepository;

        @GetMapping
        public ResponseEntity<DashboardStats> getStats() {
                long mesasLibres = mesaRepository.countByEstado(EstadoMesa.LIBRE);
                long mesasOcupadas = mesaRepository.countByEstado(EstadoMesa.OCUPADA);
                long mesasLimpieza = mesaRepository.countByEstado(EstadoMesa.LIMPIEZA);
                long totalMesas = mesaRepository.count();
                long personasEnCola = ticketColaRepository.countByEstado(EstadoTicket.ESPERANDO);
                long comandasActivas = comandaRepository.countByEstadoIn(
                                List.of(EstadoComanda.PENDIENTE, EstadoComanda.PREPARANDO));

                double porcentajeOcupacion = totalMesas > 0
                                ? (double) mesasOcupadas / totalMesas * 100
                                : 0;

                return ResponseEntity.ok(new DashboardStats(
                                mesasLibres, mesasOcupadas, mesasLimpieza, totalMesas,
                                personasEnCola, comandasActivas, porcentajeOcupacion));
        }

        @GetMapping("/bi")
        public ResponseEntity<java.util.Map<String, Object>> getBiStats() {
                List<Comanda> pagadas = comandaRepository.findAllByPagadoTrue();

                java.math.BigDecimal totalIngresos = pagadas.stream()
                                .map(c -> c.getTotal() != null ? c.getTotal() : java.math.BigDecimal.ZERO)
                                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

                java.util.Map<String, Integer> productCounts = new java.util.HashMap<>();
                for (Comanda c : pagadas) {
                        String[] itemsArr = c.getItems().split(",");
                        for (String itemStr : itemsArr) {
                                try {
                                        String cleanItem = itemStr.trim();
                                        if (cleanItem.isEmpty())
                                                continue;
                                        String[] parts = cleanItem.split("x ", 2);
                                        if (parts.length == 2) {
                                                int qty = Integer.parseInt(parts[0].trim());
                                                String name = parts[1].trim();
                                                productCounts.put(name, productCounts.getOrDefault(name, 0) + qty);
                                        }
                                } catch (Exception e) {
                                        // ignorar
                                }
                        }
                }

                List<java.util.Map<String, Object>> topProductos = productCounts.entrySet().stream()
                                .sorted(java.util.Map.Entry.<String, Integer>comparingByValue().reversed())
                                .limit(5)
                                .map(e -> java.util.Map.<String, Object>of("nombre", e.getKey(), "cantidad",
                                                e.getValue()))
                                .toList();

                return ResponseEntity.ok(java.util.Map.of(
                                "ingresosTotales", totalIngresos,
                                "totalOrdenes", pagadas.size(),
                                "topProductos", topProductos));
        }
}
