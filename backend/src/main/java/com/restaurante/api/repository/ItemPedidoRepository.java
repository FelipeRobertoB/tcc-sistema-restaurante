package com.restaurante.api.repository;

import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.entity.Mesa;
import com.restaurante.api.enums.StatusItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {

    List<ItemPedido> findByMesaIdAndPagoFalse(Long mesaId);

    List<ItemPedido> findByMesaAndPagoFalse(Mesa mesa);

    List<ItemPedido> findByStatusInOrderByDataHoraAsc(Collection<StatusItem> status);
}