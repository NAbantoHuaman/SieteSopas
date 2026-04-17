package com.EFSRT.EFSRT.repository;

import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.entity.TicketCola;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketColaRepository extends JpaRepository<TicketCola, Long> {

    Optional<TicketCola> findByMesaAsignadaIdAndEstado(Long mesaId, EstadoTicket estado);

    List<TicketCola> findAllByEstadoOrderByCreatedAtAsc(EstadoTicket estado);

    List<TicketCola> findAllByEstadoInOrderByCreatedAtAsc(List<EstadoTicket> estados);

    @Query("SELECT t FROM TicketCola t LEFT JOIN FETCH t.mesaAsignada WHERE t.estado IN :estados ORDER BY t.createdAt ASC")
    List<TicketCola> findAllByEstadoInWithMesaOrderByCreatedAtAsc(@Param("estados") List<EstadoTicket> estados);

    long countByEstado(EstadoTicket estado);
}
