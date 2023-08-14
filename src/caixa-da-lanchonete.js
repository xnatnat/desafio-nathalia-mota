import { cardapio } from './cardapio.js';
import { formasDePagamento } from './formas-de-pagamento.js';

class CaixaDaLanchonete {

    constructor() {
        this.cardapio = cardapio;
        this.formasDePagamento = formasDePagamento;
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        const fatorPagamento = this.formasDePagamento[metodoDePagamento];
        
        if (!fatorPagamento) return "Forma de pagamento inválida!";
        if (itens.length === 0) return "Não há itens no carrinho de compra!";

        const valorTotalOuErro = this.calcularValorTotal(itens);
        
        if (typeof valorTotalOuErro === 'string') return valorTotalOuErro;

        const valorFinal = this.aplicarDescontoOuTaxa(valorTotalOuErro, fatorPagamento);

        return this.formatarValor(valorFinal);
    }

    calcularValorTotal(itens) {
        const itensPedidos = new Set();
        let valorTotal = 0;

        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(',');
            const item = this.cardapio[codigo];

            if (!item) return "Item inválido!";
            if (quantidade <= 0) return "Quantidade inválida!";

            itensPedidos.add(codigo);
            if (item.tipo === "extra" && !itensPedidos.has(item.itemPrincipal)) {
                return "Item extra não pode ser pedido sem o principal";
            }
            valorTotal += item.valor * parseInt(quantidade);
        }
        return valorTotal; 
    }

    aplicarDescontoOuTaxa(valor, fatorPagamento) {
        return valor * fatorPagamento;
    }

    formatarValor(valor) {
        const valorArredondado = parseFloat(valor.toFixed(2));
        return valorArredondado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}

export { CaixaDaLanchonete };
