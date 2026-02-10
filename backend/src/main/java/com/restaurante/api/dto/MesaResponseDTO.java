package com.restaurante.api.dto;

import com.restaurante.api.enums.StatusMesa;

public record MesaResponseDTO(
        Integer numero,
        StatusMesa status
) {}