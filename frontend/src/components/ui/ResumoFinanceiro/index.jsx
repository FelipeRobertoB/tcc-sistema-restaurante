import { Card } from "../Card"; 
import clsx from "clsx";
import "./styles.css";

/**
 * Componente para exibir totais financeiros
 * @param {number} subtotal - Valor dos produtos
 * @param {number} taxaServico - Valor da taxa (opcional)
 * @param {number} total - Valor final
 * @param {string} className - Classes extras
 */
export default function ResumoFinanceiro({ 
  subtotal = 0, 
  taxaServico = 0, 
  total = 0, 
  className 
}) {
  
  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Card className={clsx("resumo-financeiro", className)}>
      <div className="rf-row">
        <span>Subtotal</span>
        <span>{formatMoney(subtotal)}</span>
      </div>
      {taxaServico > 0 && (
        <div className="rf-row">
          <span>Taxa de Serviço (10%)</span>
          <span>{formatMoney(taxaServico)}</span>
        </div>
      )}
      <div className="rf-row total">
        <span>TOTAL</span>
        <span className="valor">{formatMoney(total)}</span>
      </div>

    </Card>
  );
}