import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Trash2 } from "lucide-react"

export default function SetoresWidget({ setores, onCriar, onDeletar }) {
    const [nome, setNome] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onCriar(nome);
        setNome("");
    };

    return (
        <div className="panel-dark admin-widget">
            <h4 className="panel-title">Setores de Produção</h4>
            <p className="panel-subtitle">Áreas onde os pedidos são impressos (Cozinha, Bar...).</p>
            
            <form onSubmit={handleSubmit} className="row-form">
                <div style={{flex: 1}}>
                    <Input 
                        placeholder="Nome do Setor..." 
                        value={nome} 
                        onChange={e => setNome(e.target.value)} 
                    />
                </div>
                <Button type="submit" variant="success">Adicionar</Button>
            </form>

            <div className="admin-list-grid">
                {setores.map(s => (
                    <div key={s.id} className="admin-list-item">
                        <strong>{s.nome}</strong>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => onDeletar(s.id)}
                                    title="Excluir"
                                    style={{ padding: '6px', color: 'var(--danger)' }}
                                >
                                    <Trash2 size={16} />
                                </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}