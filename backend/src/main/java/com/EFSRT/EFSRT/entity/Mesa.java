package com.EFSRT.EFSRT.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mesas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Column(nullable = false)
    private Integer capacidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoMesa estado = EstadoMesa.LIBRE;

    @Column(length = 100)
    private String meseroAsignado;

    @Builder.Default
    private Integer tiempoOcupada = 0;

    @OneToMany(mappedBy = "mesa", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Comanda> comandas = new ArrayList<>();

    @OneToMany(mappedBy = "mesaAsignada", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TicketCola> tickets = new ArrayList<>();
}
