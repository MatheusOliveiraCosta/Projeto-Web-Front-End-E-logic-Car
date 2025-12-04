document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Sistema E-Logic Car Carregado.");

    // ============================================================
    // 1. INTEGRAÇÃO CADASTRO -> ADMIN
    // ============================================================
    const formCadastro = document.getElementById('form-cadastro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
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

            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        });
    }

    // ============================================================
    // 2. LÓGICA DE ACESSIBILIDADE
    // ============================================================

    // Elementos
    const btnToggle = document.getElementById('btn-acessibilidade-toggle');
    const menuAcessibilidade = document.getElementById('menu-acessibilidade');
    const body = document.body;

    // Botões de Ação
    const btnAltoContraste = document.getElementById('btn-alto-contraste');
    const btnAumentar = document.getElementById('btn-aumentar-fonte');
    const btnDiminuir = document.getElementById('btn-diminuir-fonte');
    const btnEspacamento = document.getElementById('btn-espacamento');
    const btnResetar = document.getElementById('btn-resetar-acessibilidade');

    // Verifica se a barra existe na página
    if (btnToggle && menuAcessibilidade) {

        // A. ABRIR / FECHAR MENU
        btnToggle.addEventListener('click', () => {
            menuAcessibilidade.classList.toggle('oculto');
        });

        // B. CARREGAR PREFERÊNCIAS SALVAS
        if (localStorage.getItem('altoContraste') === 'true') body.classList.add('alto-contraste');
        if (localStorage.getItem('textoEspacado') === 'true') body.classList.add('texto-espacado');
        
        let tamFonte = parseInt(localStorage.getItem('tamanhoFonte')) || 100;
        document.documentElement.style.fontSize = `${tamFonte}%`;

        // C. FUNÇÕES DOS BOTÕES (AQUI ESTÁ O QUE FALTAVA)

        // 1. Alto Contraste
        if(btnAltoContraste) {
            btnAltoContraste.addEventListener('click', () => {
                body.classList.toggle('alto-contraste');
                localStorage.setItem('altoContraste', body.classList.contains('alto-contraste'));
            });
        }

        // 2. Espaçamento
        if(btnEspacamento) {
            btnEspacamento.addEventListener('click', () => {
                body.classList.toggle('texto-espacado');
                localStorage.setItem('textoEspacado', body.classList.contains('texto-espacado'));
            });
        }

        // 3. Aumentar Fonte
        if(btnAumentar) {
            btnAumentar.addEventListener('click', () => {
                if (tamFonte < 150) {
                    tamFonte += 10;
                    document.documentElement.style.fontSize = `${tamFonte}%`;
                    localStorage.setItem('tamanhoFonte', tamFonte);
                }
            });
        }

        // 4. Diminuir Fonte
        if(btnDiminuir) {
            btnDiminuir.addEventListener('click', () => {
                if (tamFonte > 70) {
                    tamFonte -= 10;
                    document.documentElement.style.fontSize = `${tamFonte}%`;
                    localStorage.setItem('tamanhoFonte', tamFonte);
                }
            });
        }

        // 5. Resetar Padrão
        if(btnResetar) {
            btnResetar.addEventListener('click', () => {
                body.classList.remove('alto-contraste');
                body.classList.remove('texto-espacado');
                tamFonte = 100;
                document.documentElement.style.fontSize = '100%';
                
                localStorage.removeItem('altoContraste');
                localStorage.removeItem('textoEspacado');
                localStorage.removeItem('tamanhoFonte');
            });
        }
    }
});