import { useState, useCallback, useEffect } from "react";
import api from "../services/api";

export function useComanda(mesa, onClose, onUpdateDashboard) {
    const [itens, setItens] = useState([]); 
    const [carrinho, setCarrinho] = useState([]); 
    const [listaProdutos, setListaProdutos] = useState([]);
    const [loading, setLoading] = useState(false);

    const carregarProdutos = useCallback(async () => {
        try {
            const res = await api.get("/produtos");
            const produtosAtivos = res.data.filter(p => p.status !== 'INATIVO');
            setListaProdutos(produtosAtivos);
        } catch (e) { console.error("Erro produtos", e); }
    }, []);

    const carregarItens = useCallback(async () => {
        if (!mesa?.id) return;
        try {
            const res = await api.get(`/comanda/mesa/${mesa.id}`);
            setItens(res.data);
        } catch (e) { console.error("Erro itens", e); }
    }, [mesa?.id]); 

    useEffect(() => {
        carregarProdutos();
        if (mesa.status === 'ABERTA' || mesa.status === 'FECHADA') {
            carregarItens();
        } else {
            setItens([]);
            setCarrinho([]); 
        }
    }, [mesa.id, mesa.status, carregarItens, carregarProdutos]);
    
    const adicionarAoCarrinho = (produto, quantidade, observacao = "") => {
        const novoItem = {
            uniqueId: Date.now(),
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: parseInt(quantidade),
            observacao
        };
        setCarrinho(prev => [...prev, novoItem]);
    };

    const removerDoCarrinho = (uniqueId) => {
        setCarrinho(prev => prev.filter(item => item.uniqueId !== uniqueId));
    };

    const enviarPedido = async () => {
        if (carrinho.length === 0) return;
        setLoading(true);

        const payload = {
            itens: carrinho.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                observacao: item.observacao
            }))
        };

        try {
            await api.post(`/mesas/${mesa.id}/pedidos/lote`, payload);
            setCarrinho([]); 
            if (onUpdateDashboard) onUpdateDashboard();
            if (onClose) onClose();          
        } catch (error) {
            console.error("Erro Backend:", error);
            alert("Erro ao enviar pedido: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const abrirMesa = async () => {
        try {
            await api.post(`/mesas/${mesa.id}/abrir`);
            if (onUpdateDashboard) onUpdateDashboard(); 
        } catch (e) {
            alert("Erro ao abrir mesa: " + (e.response?.data?.message || e.message));
        }
    };

    const pedirConta = async (confirmar = true) => {
        try {
            await api.post(`/pagamento/conta/${mesa.id}`);
            if (confirmar && onUpdateDashboard) onUpdateDashboard();
        } catch (e) { console.error("Erro conta", e); }
    };

    const transferirMesa = async () => {
        const destino = prompt("Mover TUDO para qual mesa?");
        if (!destino) return;
        try {
            const res = await api.get("/mesas");
            const alvo = res.data.find(m => m.numero === parseInt(destino));
            if (!alvo) return alert("Mesa destino inválida");
            
            await api.post("/mesas/transferir-mesa", { 
                idMesaOrigem: mesa.id, 
                idMesaDestino: alvo.id 
            });
            alert("Mesa transferida!");
            if (onUpdateDashboard) onUpdateDashboard();
            if (onClose) onClose();
        } catch (e) { alert("Erro: " + e.response?.data?.message); }
    };

    const cancelarMesa = async () => {
        if (!confirm("Isso cancelará todos os pedidos não pagos. Continuar?")) return;
        try {
            await api.delete(`/mesas/${mesa.id}/cancelar`);
            if (onUpdateDashboard) onUpdateDashboard();
            if (onClose) onClose();
        } catch (e) { alert("Erro ao cancelar mesa"); }
    };

    const reabrir = async () => {
        try { 
            await api.post(`/mesas/${mesa.id}/reabrir`); 
            if (onUpdateDashboard) onUpdateDashboard(); 
            carregarItens(); 
        } catch (e) { alert("Erro ao reabrir"); }
    };


    const removerItemLancado = async (idItem) => {
        if (!confirm("Cancelar item?")) return;
        try { 
            await api.delete(`/comanda/item/${idItem}`); 
            carregarItens(); 
            if (onUpdateDashboard) onUpdateDashboard();
        } catch (e) { alert("Erro ao cancelar item"); }
    };

    const transferirItem = async (idItem) => {
        const destino = prompt("Número da mesa destino:");
        if (!destino) return;
        try {
            const res = await api.get("/mesas");
            const alvo = res.data.find(m => m.numero === parseInt(destino));
            if (!alvo) return alert("Mesa não existe!");
            
            await api.post("/comanda/transferir-item", { 
                idItem: idItem,           
                idMesaDestino: alvo.id    
            });
            alert("Item transferido!");
            carregarItens(); 
            if (onUpdateDashboard) onUpdateDashboard(); 
        } catch (e) { 
            alert("Erro: " + (e.response?.data?.message || e.message)); 
        }
    };

    return {
        itens, carrinho, listaProdutos, loading,
        adicionarAoCarrinho, removerDoCarrinho, enviarPedido,
        abrirMesa,
        pedirConta, transferirMesa, cancelarMesa, reabrir,
        removerItemLancado, transferirItem
    };
}