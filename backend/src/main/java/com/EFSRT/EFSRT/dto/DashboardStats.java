package com.EFSRT.EFSRT.dto;

public record DashboardStats(
        long mesasLibres,
        long mesasOcupadas,
        long mesasLimpieza,
        long totalMesas,
        long personasEnCola,
        long comandasActivas,
        double porcentajeOcupacion) {
}
