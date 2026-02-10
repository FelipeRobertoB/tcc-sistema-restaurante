import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Save, X, PlusCircle, Edit2, Archive } from "lucide-react";

export default function FormProduto({ produtoEditando, categorias, onSalvar, onCancelar }) {
    const [form, setForm] = useState({ 
        id: null, codigo: "", nome: "", preco: "", catId: "", status: "ATIVO" 
    });

    useEffect(() => {
        if (produtoEditando) {
            setForm({
                id: produtoEditando.id,
                codigo: produtoEditando.codigo || "",
                nome: produtoEditando.nome,
                preco: produtoEditando.preco,
                catId: produtoEditando.categoria?.id || "",
                status: produtoEditando.status || "ATIVO" 
            });
        } else {
            limpar();
        }
    }, [produtoEditando]);

    const limpar = () => setForm({ id: null, codigo: "", nome: "", preco: "", catId: "", status: "ATIVO" });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSalvar({
            id: form.id,
            codigo: form.codigo || null,
            nome: form.nome,
            preco: form.preco,
            categoria: { id: form.catId },
            status: form.status
        });
        if(!form.id) limpar();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {form.id ? (
                        <>
                            <Edit2 size={20} className="text-warning" />
                            <span>Editando Produto</span>
                        </>
                    ) : (
                        <>
                            <PlusCircle size={20} className="text-success" />
                            <span>Novo Produto</span>
                        </>
                    )}
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <Select 
                        label="Categoria *"
                        value={form.catId}
                        onChange={e => setForm({...form, catId: e.target.value})}
                        required
                        placeholder="Selecione..."
                        options={categorias.map(c => ({ value: c.id, label: c.nome }))}
                    />

                    <Input 
                        label="Nome do Produto *" 
                        placeholder="Ex: X-Salada"
                        value={form.nome} 
                        onChange={e => setForm({...form, nome: e.target.value})} 
                        required 
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Input 
                            label="Código" 
                            placeholder="Auto" 
                            value={form.codigo} 
                            onChange={e => setForm({...form, codigo: e.target.value})} 
                        />
                        <Input 
                            label="Preço *" 
                            type="number" 
                            placeholder="0.00"
                            value={form.preco} 
                            onChange={e => setForm({...form, preco: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                        background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--border-color)',
                        opacity: form.status === "ATIVO" ? 1 : 0.7
                    }}>
                        <input 
                            type="checkbox" 
                            id="checkAtivo"
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--success)' }}
                            checked={form.status === "ATIVO"}
                            onChange={(e) => setForm({ ...form, status: e.target.checked ? "ATIVO" : "INATIVO" })}
                        />
                        <label htmlFor="checkAtivo" style={{ cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {form.status === "ATIVO" ? "Produto Ativo (Visível)" : "Produto Inativo (Oculto)"}
                            {form.status !== "ATIVO" && <Archive size={14} className="text-muted" />}
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <Button type="submit" variant="success" style={{ flex: 1 }} icon={Save}>
                            {form.id ? 'Salvar' : 'Cadastrar'}
                        </Button>
                        
                        {form.id && (
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => { limpar(); onCancelar(); }}
                                icon={X}
                            >
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}