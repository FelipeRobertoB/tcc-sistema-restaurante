import Button from "../ui/Button";
import { Package, Edit, Trash2, Ban } from "lucide-react";
const formatMoney = (val) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ListaProdutos({ produtos, onEditar, onDeletar }) {
    
    if (!produtos || produtos.length === 0) {
        return (
            <div className="text-center text-muted" style={{ padding: '40px', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <Package size={48} strokeWidth={1} />
                <p>Nenhum produto encontrado.</p>
            </div>
        );
    }

    return (
        <div className="lista-scroll">
            {produtos.map(p => {
                const inativo = p.status === 'INATIVO';

                return (
                    <div 
                        key={p.id} 
                        className="admin-list-item"
                        style={{
                            marginBottom: '8px',
                            opacity: inativo ? 0.7 : 1,
                            borderLeft: inativo ? '4px solid var(--border-color)' : '4px solid var(--primary)',
                            padding: '12px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ color: inativo ? 'var(--text-muted)' : 'var(--primary)' }}>
                                {inativo ? <Ban size={20} /> : <Package size={20} />}
                            </div>
                            
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        backgroundColor: 'var(--bg-input)', 
                                        color: 'var(--text-secondary)',
                                        padding: '2px 6px', 
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {p.codigo || 'AUTO'}
                                    </span>
                                    
                                    <strong style={{ 
                                        fontSize: '0.95rem', 
                                        color: inativo ? 'var(--text-muted)' : 'var(--text-primary)',
                                        textDecoration: inativo ? 'line-through' : 'none'
                                    }}>
                                        {p.nome}
                                    </strong>
                                </div>
                                
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {p.categoria?.nome || 'Sem Categoria'}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ 
                                fontWeight: '600', 
                                color: inativo ? 'var(--text-muted)' : 'var(--success)' 
                            }}>
                                {formatMoney(p.preco)}
                            </span>
                            
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => onEditar(p)}
                                    title="Editar"
                                    style={{ padding: '6px', color: 'var(--text-secondary)' }}
                                >
                                    <Edit size={16} />
                                </Button>

                                <Button 
                                    variant="ghost" 
                                    onClick={() => onDeletar(p.id)}
                                    title="Excluir"
                                    style={{ padding: '6px', color: 'var(--danger)' }}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}