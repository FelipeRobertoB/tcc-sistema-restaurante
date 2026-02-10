package com.restaurante.api.dto;

import java.util.List;

public record PedidoLoteDTO(
        List<ItemLoteDTO> itens
) {}