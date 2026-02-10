import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function MesasWidget({ mesas, onCriar, onDeletar }) {
    const [numero, setNumero] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!numero) return;
        onCriar(numero);
        setNumero(""); 
    };

    return (
        <div className="panel-dark admin-widget">
            <h4 className="panel-title">Configuração de Mesas</h4>
            <p className="panel-subtitle">Adicione as mesas disponíveis no salão.</p>

            <form onSubmit={handleSubmit} className="row-form">
                <div style={{ flex: 1 }}>
                    <Input 
                        type="number" 
                        placeholder="Nº da Mesa" 
                        value={numero} 
                        onChange={e => setNumero(e.target.value)} 
                        min="1"
                    />
                </div>
                <Button type="submit" variant="success">Adicionar Mesa</Button>
            </form>

            <div className="mesas-grid">
                {mesas.map(mesa => {
                    const isLivre = mesa.status === 'LIVRE';
                    
                    return (
                        <div key={mesa.id} className="mesa-card">
                            <span className="mesa-numero">{mesa.numero}</span>
                            
                            <span className={`mesa-status ${isLivre ? 'text-livre' : 'text-ocupada'}`}>
                                {isLivre ? 'Livre' : 'Ocupada'}
                            </span>

                            {isLivre && (
                                <button 
                                    className="btn-delete-mesa"
                                    onClick={() => onDeletar(mesa.id)}
                                    title="Remover Mesa"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}

                {mesas.length === 0 && (
                    <p className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                        Nenhuma mesa cadastrada.
                    </p>
                )}
            </div>
        </div>
    );
}