export const formatCurrency = (value) => {
    if (value === null || value === undefined) return "R$ 0,00";
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numberValue);
};

export const formatStatus = (status) => {
    const mapa = {
        'LIVRE': 'Livre',
        'ABERTA': 'Em Aberto',
        'PENDENTE_PAGAMENTO': 'Pagamento',
        'FECHADA': 'Fechada',
        'OCUPADAS': 'Ocupada'
    };
    return mapa[status] || status;
};

export const formatPaymentMethod = (method) => {
    if (!method) return '-';
    
    const mapa = {
        'DINHEIRO': 'Dinheiro',
        'PIX': 'Pix',
        'CARTAO_CREDITO': 'Crédito',
        'CARTAO_DEBITO': 'Débito'
    };
    
    return mapa[method] || method.replace(/_/g, ' ');
};