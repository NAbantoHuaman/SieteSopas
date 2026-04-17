package com.EFSRT.EFSRT.entity;

public enum EstadoComanda {
    PENDIENTE,
    PREPARANDO,
    LISTO,
    ENTREGADO, // Entregado a mesa O al despachador/repartidor
    EN_CAMINO,
    ENTREGADO_CLIENTE
}
