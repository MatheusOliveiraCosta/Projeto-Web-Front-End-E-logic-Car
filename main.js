document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema E-Logic Car Completo Iniciado.");

    // --- FUNÇÃO UTILITÁRIA PARA FORMATAR PREÇO ---
    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    // ============================================================
    // 1. LÓGICA DO CARRINHO DE COMPRAS (RESTAURADA)
    // ============================================================
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar-carrinho');
    
    // Atualiza o número no ícone do carrinho
    function atualizarContador() {
        const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        if (contadorCarrinho) {
            contadorCarrinho.textContent = carrinho.length;
        }
    }
    atualizarContador(); // Executa ao abrir qualquer página

    // A. Adicionar Item (Funciona na Home)
    botoesAdicionar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita comportamento padrão (se houver)
            
            // Encontra o card do carro onde o botão foi clicado
            const card = e.target.closest('.card-oferta');
            
            // Captura os dados desse card
            const nome = card.querySelector('.nome-carro').textContent;
            const precoString = card.querySelector('.preco-valor').dataset.preco; // Lê o data-preco
            const preco = parseFloat(precoString);
            
            // Tenta pegar a imagem (seja tag <img> ou background-image)
            let imagemUrl = '';
            const imgDiv = card.querySelector('.card-imagem-container');
            if(imgDiv) {
                // Pega a URL do background do CSS e limpa o texto 'url("...")'
                const style = window.getComputedStyle(imgDiv);
                imagemUrl = style.backgroundImage.slice(5, -2); 
            }

            // Cria o objeto do produto
            const novoItem = {
                id: Date.now(), // ID único baseado na hora exata
                nome: nome,
                preco: preco,
                imagem: imagemUrl
            };

            // Salva no LocalStorage
            const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
            carrinho.push(novoItem);
            localStorage.setItem('elogic_carrinho', JSON.stringify(carrinho));

            // Atualiza a tela
            atualizarContador();
            alert(`${nome} foi adicionado ao seu carrinho!`);
        });
    });

    // B. Renderizar Itens (Apenas na página carrinho.html)
    const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
    const precoTotalCarrinho = document.getElementById('preco-total-carrinho');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');

    // Se a lista existir (estamos na página do carrinho), carrega os itens
    if (listaItensCarrinho) {
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        listaItensCarrinho.innerHTML = ''; // Limpa a lista visual
        let total = 0;

        if (carrinho.length === 0) {
            listaItensCarrinho.innerHTML = '<p class="msg-vazio">Seu carrinho está vazio.</p>';
            if(btnFinalizar) btnFinalizar.style.display = 'none';
            if(precoTotalCarrinho) precoTotalCarrinho.textContent = "R$ 0,00";
        } else {
            if(btnFinalizar) btnFinalizar.style.display = 'inline-block';
            
            carrinho.forEach(item => {
                total += item.preco;
                
                // Cria o HTML de cada item
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-carrinho';
                itemDiv.innerHTML = `
                    <div class="info-carrinho" style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 100px; height: 70px; background-image: url('${item.imagem}'); background-size: cover; background-position: center; border-radius: 5px; border: 1px solid #eee;"></div>
                        <div>
                            <h3>${item.nome}</h3>
                            <p style="color: #1E88E5; font-weight: bold;">${formatarMoeda(item.preco)}</p>
                        </div>
                    </div>
                    <button class="btn-remover-carrinho" onclick="removerDoCarrinho(${item.id})">Remover</button>
                `;
                listaItensCarrinho.appendChild(itemDiv);
            });
        }

        if (precoTotalCarrinho) {
            precoTotalCarrinho.textContent = formatarMoeda(total);
        }
    }

    // Função Global para remover item (necessária para o onclick do HTML funcionar)
    window.removerDoCarrinho = function(id) {
        let carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        // Filtra mantendo apenas os itens que NÃO têm o ID clicado
        carrinho = carrinho.filter(item => item.id !== id);
        localStorage.setItem('elogic_carrinho', JSON.stringify(carrinho));
        
        renderizarCarrinho();
        atualizarContador();
    };

    // C. Finalizar Compra
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', () => {
            if(confirm("Deseja finalizar a compra? (Simulação)")) {
                alert("Compra realizada com sucesso! Obrigado pela preferência.");
                localStorage.removeItem('elogic_carrinho'); // Limpa o carrinho
                renderizarCarrinho();
                atualizarContador();
            }
        });
    }

    // ============================================================
    // 2. LÓGICA DE AGENDAMENTO (Test-Drive)
    // ============================================================
    const formAgendamento = document.getElementById('form-agendamento');
    if (formAgendamento) {
        const params = new URLSearchParams(window.location.search);
        const carro = params.get('carro');
        
        if (carro) {
            const campoModelo = document.getElementById('modelo-carro');
            const titulo = document.getElementById('titulo-agendamento');
            if(campoModelo) campoModelo.value = carro;
            if(titulo) titulo.textContent = `Agendar: ${carro}`;
        }

        formAgendamento.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const data = document.getElementById('data-agendamento').value;
            const modelo = document.getElementById('modelo-carro').value;
            
            alert(`Parabéns, ${nome}! Pré-agendamento para ${modelo} no dia ${data} realizado.`);
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // 3. INTEGRAÇÃO CADASTRO -> ADMIN
    // ============================================================
    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeValor = document.getElementById('nome').value;
            const emailValor = document.getElementById('email').value;
            const senhaValor = document.getElementById('senha').value;

            const novoUsuario = {
                id: Date.now(),
                nome: nomeValor,
                email: emailValor,
                senha: senhaValor,
                data: new Date().toLocaleString('pt-BR')
            };

            const CHAVE_DB = 'elogic_db_usuarios';
            let usuarios = JSON.parse(localStorage.getItem(CHAVE_DB)) || [];
            usuarios.push(novoUsuario);
            localStorage.setItem(CHAVE_DB, JSON.stringify(usuarios));

            alert('Cadastro realizado com sucesso! Você já pode fazer login.');
            window.location.href = 'login.html';
        });
    }

    // ============================================================
    // 4. LÓGICA DE LOGIN
    // ============================================================
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailLogin = document.getElementById('email-login').value;
            // Para login simples, verificamos apenas o email na lista de cadastrados
            const CHAVE_DB = 'elogic_db_usuarios';
            const usuarios = JSON.parse(localStorage.getItem(CHAVE_DB)) || [];
            
            const usuarioEncontrado = usuarios.find(user => user.email === emailLogin);

            if (usuarioEncontrado) {
                alert(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
                window.location.href = 'index.html';
            } else {
                alert('E-mail não encontrado. Verifique ou cadastre-se.');
            }
        });
    }

    // ============================================================
    // 5. ACESSIBILIDADE (Mantida)
    // ============================================================
    const body = document.body;

    // Carregar Preferências
    if (localStorage.getItem('altoContraste') === 'true') body.classList.add('alto-contraste');
    if (localStorage.getItem('textoEspacado') === 'true') body.classList.add('texto-espacado');
    let tamFonte = parseInt(localStorage.getItem('tamanhoFonte')) || 100;
    document.documentElement.style.fontSize = `${tamFonte}%`;

    // Mapeamento de Botões
    const acoesAcessibilidade = {
        'btn-alto-contraste': () => {
            body.classList.toggle('alto-contraste');
            localStorage.setItem('altoContraste', body.classList.contains('alto-contraste'));
        },
        'btn-espacamento': () => {
            body.classList.toggle('texto-espacado');
            localStorage.setItem('textoEspacado', body.classList.contains('texto-espacado'));
        },
        'btn-aumentar-fonte': () => {
            if (tamFonte < 150) {
                tamFonte += 10;
                document.documentElement.style.fontSize = `${tamFonte}%`;
                localStorage.setItem('tamanhoFonte', tamFonte);
            }
        },
        'btn-diminuir-fonte': () => {
            if (tamFonte > 70) {
                tamFonte -= 10;
                document.documentElement.style.fontSize = `${tamFonte}%`;
                localStorage.setItem('tamanhoFonte', tamFonte);
            }
        },
        'btn-resetar-acessibilidade': () => {
            body.classList.remove('alto-contraste');
            body.classList.remove('texto-espacado');
            tamFonte = 100;
            document.documentElement.style.fontSize = '100%';
            localStorage.removeItem('altoContraste');
            localStorage.removeItem('textoEspacado');
            localStorage.removeItem('tamanhoFonte');
        }
    };

    // Adicionar Eventos de Clique
    for (const [id, func] of Object.entries(acoesAcessibilidade)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('click', func);
        }
    }
});