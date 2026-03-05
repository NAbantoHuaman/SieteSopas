package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.entity.EstadoComanda;
import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.entity.Mesa;
import com.EFSRT.EFSRT.repository.ComandaRepository;
import com.EFSRT.EFSRT.repository.MesaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CajaService {

        private final MesaRepository mesaRepository;
        private final ComandaRepository comandaRepository;
        private final SimpMessagingTemplate messagingTemplate;
        // Asumiendo que MesaService puede tener lógica cruzada, inyectamos repositorios
        // directamente.

        @Transactional(readOnly = true)
        public List<Map<String, Object>> listarMesasOcupadas() {
                List<Map<String, Object>> result = mesaRepository.findAll().stream()
                                .filter(m -> m.getEstado() == EstadoMesa.OCUPADA)
                                .map(m -> {
                                        BigDecimal total = m.getComandas().stream()
                                                        .filter(c -> !c.getPagado())
                                                        .filter(c -> c.getEstado() != EstadoComanda.ENTREGADO) // o
                                                                                                               // contar
                                                                                                               // todas
                                                        .map(c -> c.getTotal() != null ? c.getTotal() : BigDecimal.ZERO)
                                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        long comandasCount = m.getComandas().stream().filter(c -> !c.getPagado())
                                                        .count();

                                        return Map.<String, Object>of(
                                                        "mesaId", m.getId(),
                                                        "mesaNumero", m.getNumero(),
                                                        "capacidad", m.getCapacidad(),
                                                        "totalAcumulado", total,
                                                        "comandasCount", comandasCount,
                                                        "isWalkIn", false);
                                })
                                .collect(Collectors.toList());

                // Agregar comandas de clientes/invitados que ya han sido pagadas (historial del
                // día) para que figuren en caja
                List<com.EFSRT.EFSRT.entity.Comanda> walkIns = comandaRepository.findAllByPagadoTrueAndMesaIsNull();
                for (com.EFSRT.EFSRT.entity.Comanda walkIn : walkIns) {
                        Map<String, Object> walkInMap = new java.util.HashMap<>();
                        walkInMap.put("mesaId", "WALKIN_" + walkIn.getId());
                        walkInMap.put("mesaNumero", "INVITADO");
                        walkInMap.put("capacidad", 1);
                        walkInMap.put("totalAcumulado",
                                        walkIn.getTotal() != null ? walkIn.getTotal() : BigDecimal.ZERO);
                        walkInMap.put("comandasCount", 1);
                        walkInMap.put("isWalkIn", true);
                        walkInMap.put("estadoComanda", walkIn.getEstado().name());
                        result.add(walkInMap);
                }

                return result;
        }

        @Transactional
        public Map<String, Object> procesarPago(Long mesaId) {
                Mesa mesa = mesaRepository.findById(mesaId)
                                .orElseThrow(() -> new IllegalArgumentException("Mesa no encontrada"));

                if (mesa.getEstado() != EstadoMesa.OCUPADA) {
                        throw new IllegalStateException("Solo se puede cobrar a mesas OCUPADAS");
                }

                // Simulación: aquí se guardaría en una tabla Factura/Pago
                BigDecimal totalCobrado = mesa.getComandas().stream()
                                .filter(c -> !c.getPagado())
                                .map(c -> c.getTotal() != null ? c.getTotal() : BigDecimal.ZERO)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Marcar comandas como pagadas
                mesa.getComandas().forEach(c -> {
                        if (!c.getPagado())
                                c.setPagado(true);
                });

                log.info("💰 Cobro exitoso de Mesa {} por S/ {}", mesa.getNumero(), totalCobrado);

                // Limpiar la mesa para siguiente uso
                mesa.setEstado(EstadoMesa.LIMPIEZA);
                mesa.setMeseroAsignado(null);
                mesa.setTiempoOcupada(0);

                mesaRepository.save(mesa);

                // Notificar al Salón (Dashboard de anfitrión) que ahora está EN LIMPIEZA
                // Emitimos a WebSocket de tables
                messagingTemplate.convertAndSend("/topic/tables", mesaRepository.findAll());

                return Map.of(
                                "mensaje", "Pago procesado existosamente",
                                "total", totalCobrado,
                                "mesa", mesa.getNumero());
        }
}
