import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function TicketTimer({ dataCriacao }) {
    const [tempoDecorrido, setTempoDecorrido] = useState("");
    const [alerta, setAlerta] = useState("normal"); 

    useEffect(() => {
        const calcularTempo = () => {
            const agora = new Date();
            const inicio = new Date(dataCriacao);
            const diffMs = agora - inicio;
            const minutos = Math.floor(diffMs / 60000);
            if (minutos >= 20) setAlerta("atrasado"); 
            else if (minutos >= 10) setAlerta("atencao");
            else setAlerta("normal");                     
            if (minutos >= 60) {
                const horas = Math.floor(minutos / 60);
                const minRestantes = minutos % 60;
                setTempoDecorrido(`${horas}h ${minRestantes}m`);
            } else {
                setTempoDecorrido(`${minutos} min`);
            }
        };

        calcularTempo();
        const interval = setInterval(calcularTempo, 30000); 

        return () => clearInterval(interval);
    }, [dataCriacao]);

    const cores = {
        normal: { color: "var(--text-secondary)", bg: "transparent" },
        atencao: { color: "var(--warning)", bg: "var(--warning-bg)" },
        atrasado: { color: "var(--danger)", bg: "var(--danger-bg)", fontWeight: "var(--font-bold)" }
    };

    const estiloAtual = cores[alerta];

    return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            gap: "6px",
            padding: "4px 8px",
            borderRadius: "6px",
            backgroundColor: estiloAtual.bg,
            color: estiloAtual.color,
            transition: "all 0.3s"
        }}>
            <Clock size={16} />
            <span style={{ fontSize: "0.9rem", fontWeight: estiloAtual.fontWeight || "normal" }}>
                {tempoDecorrido}
            </span>
        </div>
    );
}   