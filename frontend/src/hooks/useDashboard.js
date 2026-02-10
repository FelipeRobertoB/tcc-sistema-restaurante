import { useState, useCallback, useEffect } from "react";
import api from "../services/api";

export function useDashboard() {
    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega e ordena mesas
    const carregarMesas = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/mesas");
            const ordenadas = res.data.sort((a, b) => a.numero - b.numero);
            setMesas(ordenadas);
        } catch (error) {
            console.error("Erro ao carregar mesas", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarMesas();
    }, [carregarMesas]);

    const acessarMesaPorNumero = async (numero) => {
        if (!numero) return null;

        const num = parseInt(numero);
        const mesaEncontrada = mesas.find(m => m.numero === num);

        if (!mesaEncontrada) {
            alert(`Mesa ${num} não existe!`);
            return null;
        }
        if (mesaEncontrada.status === 'LIVRE' || mesaEncontrada.status === 'FECHADA') {
            try {
                await api.post(`/mesas/${mesaEncontrada.id}/abrir`);
                await carregarMesas();
                return { ...mesaEncontrada, status: 'ABERTA' };
            } catch (error) {
                alert("Erro ao abrir mesa: " + error.response?.data?.message);
                return null;
            }
        }
        return mesaEncontrada;
    };

    return {
        mesas,
        loading,
        carregarMesas,
        acessarMesaPorNumero
    };
}