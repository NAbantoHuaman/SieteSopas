package com.EFSRT.EFSRT.service;

import com.EFSRT.EFSRT.entity.EstadoComanda;
import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.entity.Mesa;
import com.EFSRT.EFSRT.entity.Producto;
import com.EFSRT.EFSRT.entity.Comanda;
import com.EFSRT.EFSRT.entity.TicketCola;
import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.repository.ComandaRepository;
import com.EFSRT.EFSRT.repository.MesaRepository;
import com.EFSRT.EFSRT.repository.ProductoRepository;
import com.EFSRT.EFSRT.repository.TicketColaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CajaService {

        private final MesaRepository mesaRepository;
        private final ComandaRepository comandaRepository;
        private final ProductoRepository productoRepository;
        private final TicketColaRepository ticketColaRepository;
        private final SimpMessagingTemplate messagingTemplate;
        private final ObjectMapper objectMapper;
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

                // Agregar comandas que ya han sido pagadas (historial) para que figuren en caja
                List<com.EFSRT.EFSRT.entity.Comanda> facturadas = comandaRepository.findAllByPagadoTrue();
                for (com.EFSRT.EFSRT.entity.Comanda facturada : facturadas) {
                        Map<String, Object> histMap = new java.util.HashMap<>();
                        histMap.put("mesaId", "HIST_" + facturada.getId());
                        histMap.put("mesaNumero", facturada.getMesa() != null ? facturada.getMesa().getNumero() : "WALKIN");
                        histMap.put("capacidad", facturada.getMesa() != null ? facturada.getMesa().getCapacidad() : 1);
                        histMap.put("totalAcumulado",
                                        facturada.getTotal() != null ? facturada.getTotal() : BigDecimal.ZERO);
                        histMap.put("comandasCount", 1);
                        histMap.put("isWalkIn", true); // Reusamos isWalkIn = true para deshabilitar el botón de pagar
                        histMap.put("estadoComanda", facturada.getEstado().name());
                        histMap.put("items", facturada.getItems()); // Extra info for frontend
                        result.add(histMap);
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

                // --- INICIO AUTOGENERACION SIMULADA PARA DEMO ---
                boolean hadPendingComandas = mesa.getComandas().stream().anyMatch(c -> !c.getPagado());
                List<Map<String, Object>> detalleItemsStr = new java.util.ArrayList<>();
                if (!hadPendingComandas) {
                    List<Producto> productosDisponibles = productoRepository.findAll();
                    java.util.Random rnd = new java.util.Random();
                    int cap = mesa.getCapacidad() != null ? mesa.getCapacidad() : 2;
                    int numPersonas = Math.max(1, cap - rnd.nextInt(2)); // Un poco de variación
                    BigDecimal autoTotal = BigDecimal.ZERO;
                    StringBuilder itemsBuilder = new StringBuilder();

                    for (int i = 0; i < numPersonas; i++) {
                        // Plato principal
                        List<Producto> principales = productosDisponibles.stream()
                            .filter(p -> p.getStock() > 0 && !("Para Picar".equals(p.getCategoria())))
                            .toList();
                        
                        if (!principales.isEmpty()) {
                            Producto p = principales.get(rnd.nextInt(principales.size()));
                            p.setStock(p.getStock() - 1);
                            productoRepository.save(p);
                            autoTotal = autoTotal.add(p.getPrecio());
                            itemsBuilder.append("1x ").append(p.getNombre()).append(", ");
                            detalleItemsStr.add(Map.of("nombre", p.getNombre(), "cantidad", 1, "precio", p.getPrecio(), "subtotal", p.getPrecio()));
                        }
                    }
                    
                    // Un piqueo para la mesa
                    List<Producto> piqueos = productosDisponibles.stream()
                        .filter(p -> p.getStock() > 0 && "Para Picar".equals(p.getCategoria()))
                        .toList();
                    if (!piqueos.isEmpty() && rnd.nextBoolean()) {
                        Producto p = piqueos.get(rnd.nextInt(piqueos.size()));
                        p.setStock(p.getStock() - 1);
                        productoRepository.save(p);
                        autoTotal = autoTotal.add(p.getPrecio());
                        itemsBuilder.append("1x ").append(p.getNombre()).append(", ");
                        detalleItemsStr.add(Map.of("nombre", p.getNombre(), "cantidad", 1, "precio", p.getPrecio(), "subtotal", p.getPrecio()));
                    }

                    if (itemsBuilder.length() > 0) {
                        itemsBuilder.setLength(itemsBuilder.length() - 2);
                        Comanda autoComanda = Comanda.builder()
                            .mesa(mesa)
                            .items(itemsBuilder.toString())
                            .total(autoTotal)
                            .estado(EstadoComanda.ENTREGADO) // No va a cocina, se pagó directo
                            .pagado(false)
                            .build();
                        
                        comandaRepository.save(autoComanda);
                        mesa.getComandas().add(autoComanda);
                        log.info("🌟 Auto-generado consumo simulado para Mesa {}: S/ {}", mesa.getNumero(), autoTotal);
                        
                        // Notificar a inventario
                        messagingTemplate.convertAndSend("/topic/inventory", productoRepository.findAll());
                    }
                }
                // --- FIN AUTOGENERACION ---

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
                
                // Crear el Map del recibo primero para poder serializarlo
                Map<String, Object> recibo = Map.of(
                                "mensaje", "Pago procesado existosamente",
                                "total", totalCobrado,
                                "mesa", mesa.getNumero(),
                                "detalleItems", detalleItemsStr);

                // Actualizar Ticket si existia alguno ASIGNADO a esta mesa
                Optional<TicketCola> activeTicketOpt = ticketColaRepository.findByMesaAsignadaIdAndEstado(mesa.getId(), EstadoTicket.ASIGNADO);
                if (activeTicketOpt.isPresent()) {
                    TicketCola activeTicket = activeTicketOpt.get();
                    activeTicket.setEstado(EstadoTicket.FINALIZADO);
                    try {
                        activeTicket.setReceiptJson(objectMapper.writeValueAsString(recibo));
                        ticketColaRepository.save(activeTicket);
                        // Emitir notif a todos para que Frontend Client actualice MyTicket
                        // Idealmente via otro tema, o el mismo queue
                        messagingTemplate.convertAndSend("/topic/queue", ticketColaRepository.findAllByEstadoInOrderByCreatedAtAsc(
                            List.of(EstadoTicket.ESPERANDO, EstadoTicket.LLAMANDO, EstadoTicket.ASIGNADO)));
                        log.info("Ticket {} FINALIZADO por la caja automaticamente y enviada factura electrónica.", activeTicket.getId());
                    } catch (Exception e) {
                        log.error("No se pudo serializar la factura para el TicketCola", e);
                    }
                }

                mesaRepository.save(mesa);

                // Notificar al Salón (Dashboard de anfitrión) que ahora está EN LIMPIEZA
                // Emitimos a WebSocket de tables mapeando a DTO para evitar recursión infinita
                List<com.EFSRT.EFSRT.dto.MesaDto> mesasDto = mesaRepository.findAllByOrderByNumeroAsc().stream()
                    .map(m -> new com.EFSRT.EFSRT.dto.MesaDto(m.getId(), m.getNumero(), m.getCapacidad(),
                        m.getEstado(), m.getMeseroAsignado(), m.getTiempoOcupada()))
                    .toList();
                messagingTemplate.convertAndSend("/topic/tables", mesasDto);

                return recibo;
        }
}
