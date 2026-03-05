package com.EFSRT.EFSRT.repository;

import com.EFSRT.EFSRT.entity.Comanda;
import com.EFSRT.EFSRT.entity.EstadoComanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Long> {

    List<Comanda> findAllByEstadoInAndPagadoFalse(List<EstadoComanda> estados);

    List<Comanda> findAllByEstadoIn(List<EstadoComanda> estados);

    List<Comanda> findAllByEstadoAndPagadoFalse(EstadoComanda estado);

    List<Comanda> findAllByMesaIdOrderByCreatedAtDesc(Long mesaId);

    long countByEstadoIn(List<EstadoComanda> estados);

    List<Comanda> findAllByPagadoTrue();

    List<Comanda> findAllByPagadoTrueAndMesaIsNull();
}
