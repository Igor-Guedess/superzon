// Espera o conteúdo da página carregar
document.addEventListener("DOMContentLoaded", function() {

    // --- CARREGA O FOOTER ---
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            // Insere o HTML do footer dentro da div placeholder
            document.getElementById("footer-placeholder").innerHTML = data;
        });

});

function calcularEconomia() {
    // 1. Capturar os valores dos inputs
    const quantidadeInput = document.getElementById('galoesPorSemana');
    const custoInput = document.getElementById('custoPorGalao');
    const resultadoSpan = document.querySelector('.result');

    // Pega os valores e converte de texto para número
    // Usamos parseFloat para aceitar números com casas decimais (ex: 15.50)
    const quantidade = parseFloat(quantidadeInput.value);
    const custo = parseFloat(custoInput.value);

    // 2. Validar os dados
    // A função isNaN verifica se o valor "Não é um Número" (Is Not a Number)
    if (isNaN(quantidade) || isNaN(custo) || quantidade <= 0 || custo <= 0) {
        resultadoSpan.innerHTML = "Por favor, insira valores válidos e positivos nos dois campos.";
        return; // Para a execução da função aqui se os dados forem inválidos
    }

    // 3. Executar o cálculo
    const gastoSemanal = quantidade * custo;
    const gastoAnual = gastoSemanal * 52;

    // 4. Formatar o resultado como moeda brasileira (BRL)
    const resultadoFormatado = gastoAnual.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // 5. Exibir o resultado na tela
    resultadoSpan.innerHTML = `Seu gasto anual com galões é de <strong>${resultadoFormatado}</strong>`;
}