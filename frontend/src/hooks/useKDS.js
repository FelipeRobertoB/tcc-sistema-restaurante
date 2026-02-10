import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useKDS() {
    const [pedidos, setPedidos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get("/cozinha/setores")
            .then(res => setSetores(res.data))
            .catch(err => console.error("Erro ao carregar setores:", err));
    }, []);
    const fetchPedidos = useCallback(async () => {
        try {
            const res = await api.get("/cozinha");
            setPedidos(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        }
    }, []);

    useEffect(() => {
        fetchPedidos(); 
        const interval = setInterval(fetchPedidos, 3000);
        return () => clearInterval(interval);
    }, [fetchPedidos]);

    const marcarComoPronto = async (idItem) => {
        const backup = [...pedidos];
        setPedidos(prev => prev.filter(item => item.id !== idItem));

        try {
            await api.post(`/cozinha/${idItem}/avancar`);
        } catch (error) {
            console.error("Erro ao concluir item:", error);
            alert("Erro ao concluir item. Verifique a conexão.");
            setPedidos(backup); 
        }
    };

    return {
        pedidos,
        setores,
        loading,
        marcarComoPronto,
        atualizarAgora: fetchPedidos
    };
}