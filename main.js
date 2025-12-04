console.log("--> O arquivo main.js começou a ser lido.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("--> O DOM (HTML) foi carregado completamente.");

    // ============================================================
    // 1. INTEGRAÇÃO CADASTRO -> ADMIN (Mantida)
    // ============================================================
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const nomeValor = document.getElementById('nome').value;
                const emailValor = document.getElementById('email').value;
                
                const novoUsuario = {
                    id: Date.now(),
                    nome: nomeValor,
                    email: emailValor,
                    data: new Date().toLocaleString('pt-BR')
                };

                const CHAVE_DB = 'elogic_db_usuarios';
                let usuarios = JSON.parse(localStorage.getItem(CHAVE_DB)) || [];
                usuarios.push(novoUsuario);
                localStorage.setItem(CHAVE_DB, JSON.stringify(usuarios));

                alert('Cadastro realizado com sucesso! Você já pode logar.');
                window.location.href = 'login.html';
            } catch (erro) {
                console.error("Erro no cadastro:", erro);
                alert("Erro ao tentar cadastrar. Verifique o console.");
            }
        });
    }

    // ============================================================
    // 2. ACESSIBILIDADE (Lógica Blindada)
    // ============================================================
    
    // Elementos do DOM
    const body = document.body;
    
    // Mapeamento dos botões (ID do HTML -> Função)
    const botoes = {
        'btn-alto-contraste': function() {
            console.log(">> Botão Alto Contraste Clicado");
            body.classList.toggle('alto-contraste');
            // Salva a preferência
            const ativo = body.classList.contains('alto-contraste');
            localStorage.setItem('altoContraste', ativo);
        },
        'btn-espacamento': function() {
            console.log(">> Botão Espaçamento Clicado");
            body.classList.toggle('texto-espacado');
            localStorage.setItem('textoEspacado', body.classList.contains('texto-espacado'));
        },
        'btn-aumentar-fonte': function() {
            console.log(">> Botão Aumentar Fonte Clicado");
            alterarFonte(10);
        },
        'btn-diminuir-fonte': function() {
            console.log(">> Botão Diminuir Fonte Clicado");
            alterarFonte(-10);
        },
        'btn-resetar-acessibilidade': function() {
            console.log(">> Botão Resetar Clicado");
            body.classList.remove('alto-contraste');
            body.classList.remove('texto-espacado');
            document.documentElement.style.fontSize = '100%';
            localStorage.removeItem('altoContraste');
            localStorage.removeItem('textoEspacado');
            localStorage.removeItem('tamanhoFonte');
        }
    };

    // Função auxiliar para mudar a fonte
    function alterarFonte(valor) {
        let tamAtual = parseInt(localStorage.getItem('tamanhoFonte')) || 100;
        let novoTam = tamAtual + valor;

        // Limites de segurança (70% a 150%)
        if (novoTam >= 70 && novoTam <= 150) {
            document.documentElement.style.fontSize = `${novoTam}%`;
            localStorage.setItem('tamanhoFonte', novoTam);
            console.log(`Fonte alterada para ${novoTam}%`);
        }
    }

    // --- INICIALIZAÇÃO ---
    
    // 1. Carregar preferências salvas ao abrir a página
    if (localStorage.getItem('altoContraste') === 'true') body.classList.add('alto-contraste');
    if (localStorage.getItem('textoEspacado') === 'true') body.classList.add('texto-espacado');
    
    let tamSalvo = parseInt(localStorage.getItem('tamanhoFonte'));
    if (tamSalvo) document.documentElement.style.fontSize = `${tamSalvo}%`;


    // 2. Adicionar os eventos de clique aos botões
    console.log("--> Tentando encontrar os botões de acessibilidade...");
    
    let botõesEncontrados = 0;

    for (let id in botoes) {
        const elemento = document.getElementById(id);
        if (elemento) {
            // Removemos onclick antigo e adicionamos listener novo
            elemento.onclick = null; 
            elemento.addEventListener('click', botoes[id]);
            botõesEncontrados++;
        } else {
            console.warn(`AVISO: Botão com ID '${id}' não foi encontrado no HTML desta página.`);
        }
    }

    if (botõesEncontrados === 0) {
        console.log("Nenhum botão de acessibilidade encontrado. Se você está na página de Login/Cadastro, verifique se copiou o HTML da barra para lá.");
    } else {
        console.log(`--> Sucesso! ${botõesEncontrados} botões de acessibilidade foram ativados.`);
    }

});