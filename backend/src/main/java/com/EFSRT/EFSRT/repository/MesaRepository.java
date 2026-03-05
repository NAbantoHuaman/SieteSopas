package com.EFSRT.EFSRT.repository;

import com.EFSRT.EFSRT.entity.EstadoMesa;
import com.EFSRT.EFSRT.entity.Mesa;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {

    List<Mesa> findAllByOrderByNumeroAsc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM Mesa m WHERE m.estado = :estado AND m.capacidad >= :capacidad " +
            "ORDER BY m.capacidad ASC")
    List<Mesa> findMesasDisponiblesConLock(
            @Param("estado") EstadoMesa estado,
            @Param("capacidad") Integer capacidad);

    List<Mesa> findByEstado(EstadoMesa estado);

    Optional<Mesa> findByNumero(Integer numero);

    long countByEstado(EstadoMesa estado);
}
