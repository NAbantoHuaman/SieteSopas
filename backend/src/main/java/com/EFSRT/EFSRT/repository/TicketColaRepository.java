package com.EFSRT.EFSRT.repository;

import com.EFSRT.EFSRT.entity.EstadoTicket;
import com.EFSRT.EFSRT.entity.TicketCola;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketColaRepository extends JpaRepository<TicketCola, Long> {

    List<TicketCola> findAllByEstadoOrderByCreatedAtAsc(EstadoTicket estado);

    List<TicketCola> findAllByEstadoInOrderByCreatedAtAsc(List<EstadoTicket> estados);

    long countByEstado(EstadoTicket estado);
}
