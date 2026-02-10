import { Check, AlertTriangle } from "lucide-react";
import Button from "../../ui/Button"; 
import TicketTimer from "./TicketTimer";
import "./styles.css";

export default function KDSTicket({ numeroMesa, itens, onConcluirItem }) {
    const dataInicioPedido = itens[0]?.dataHora || new Date();
    const horaPedido = new Date(dataInicioPedido).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="kds-ticket fade-in">
            <div className="ticket-header">
                <div className="ticket-title">
                    <span className="label-mesa">MESA</span>
                    <span className="numero-mesa">{numeroMesa}</span>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                        {horaPedido}
                    </div>
                    <TicketTimer dataCriacao={dataInicioPedido} />
                </div>
            </div>
            <div className="ticket-body">
                {itens.map((item) => (
                    <div key={item.id} className="ticket-item">
                        <div className="item-info">
                            <div className="item-main">
                                <span className="item-qtd">{item.quantidade}x</span>
                                <span className="item-nome">{item.nomeProduto}</span>
                            </div>
                            
                            {item.observacao && (
                                <div className="item-obs">
                                    <AlertTriangle size={14} />
                                    <span>{item.observacao}</span>
                                </div>
                            )}

                            <div className="item-meta">
                                <span className="tag-setor">{item.setor}</span>
                            </div>
                        </div>

                        <Button 
                            variant="success" 
                            size="sm"
                            className="btn-check"
                            onClick={() => onConcluirItem(item.id)}
                            title="Marcar como pronto"
                        >
                            <Check size={20} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}