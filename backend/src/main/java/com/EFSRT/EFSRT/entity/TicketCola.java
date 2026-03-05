package com.EFSRT.EFSRT.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets_cola")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketCola {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombreCliente;

    @Column(nullable = false)
    private Integer tamanoGrupo;

    @Builder.Default
    private Integer tiempoEsperaEstimado = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoTicket estado = EstadoTicket.ESPERANDO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mesa_asignada_id")
    private Mesa mesaAsignada;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "notified_5min")
    @Builder.Default
    private Boolean notified5Min = false;

    @Column(name = "notified_asignado")
    @Builder.Default
    private Boolean notifiedAsignado = false;

    public boolean isNotified5Min() {
        return Boolean.TRUE.equals(this.notified5Min);
    }

    public boolean isNotifiedAsignado() {
        return Boolean.TRUE.equals(this.notifiedAsignado);
    }
}
