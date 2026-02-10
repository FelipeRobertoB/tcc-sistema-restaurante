import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Trash2 } from "lucide-react";

export default function CategoriasWidget({ categorias, setores, onCriar, onDeletar }) {
    const [form, setForm] = useState({ nome: "", setorId: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCriar(form);
        setForm({ nome: "", setorId: "" });
    };

    return (
        <div className="panel-dark admin-widget">
            <h4 className="panel-title">Categorias do Cardápio</h4>
            <p className="panel-subtitle">Agrupam os produtos e definem onde serão impressos.</p>

            <form onSubmit={handleSubmit} className="row-form">
                <div style={{flex: 2}}>
                    <Input 
                        placeholder="Nome (Ex: Bebidas)" 
                        value={form.nome}
                        onChange={e => setForm({...form, nome: e.target.value})}
                    />
                </div>
                <div style={{flex: 1.5}}>
                    <Select 
                        value={form.setorId}
                        onChange={e => setForm({...form, setorId: e.target.value})}
                        placeholder="Vincular Setor..."
                        options={setores.map(s => ({ value: s.id, label: s.nome }))}
                    />
                </div>
                <Button type="submit" variant="success">Salvar</Button>
            </form>

            <div className="admin-list-grid">
                {categorias.map(c => (
                    <div key={c.id} className="admin-list-item">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span style={{fontWeight:'bold'}}>{c.nome}</span>
                            <span className="badge-setor">{c.nomeSetor || 'Sem setor'}</span>
                        </div>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => onDeletar(c.id)}
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