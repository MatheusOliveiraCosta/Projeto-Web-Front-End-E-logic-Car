document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema E-Logic Car Completo Iniciado.");

    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }

    //Lógica carrinho de compras
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const botoesAdicionar = document.querySelectorAll('.btn-adicionar-carrinho');
    
    function atualizarContador() {
        const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        if (contadorCarrinho) {
            contadorCarrinho.textContent = carrinho.length;
        }
    }
    atualizarContador(); 

    
    botoesAdicionar.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            
            const card = e.target.closest('.card-oferta');
            
            
            const nome = card.querySelector('.nome-carro').textContent;
            const precoString = card.querySelector('.preco-valor').dataset.preco; 
            const preco = parseFloat(precoString);
            
            let imagemUrl = '';
            const imgDiv = card.querySelector('.card-imagem-container');
            if(imgDiv) {
                const style = window.getComputedStyle(imgDiv);
                imagemUrl = style.backgroundImage.slice(5, -2); 
            }

            const novoItem = {
                id: Date.now(), 
                nome: nome,
                preco: preco,
                imagem: imagemUrl
            };

            const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
            carrinho.push(novoItem);
            localStorage.setItem('elogic_carrinho', JSON.stringify(carrinho));

            atualizarContador();
            alert(`${nome} foi adicionado ao seu carrinho!`);
        });
    });

    const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
    const precoTotalCarrinho = document.getElementById('preco-total-carrinho');
    const btnFinalizar = document.getElementById('btn-finalizar-compra');

    if (listaItensCarrinho) {
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        listaItensCarrinho.innerHTML = ''; 
        let total = 0;

        if (carrinho.length === 0) {
            listaItensCarrinho.innerHTML = '<p class="msg-vazio">Seu carrinho está vazio.</p>';
            if(btnFinalizar) btnFinalizar.style.display = 'none';
            if(precoTotalCarrinho) precoTotalCarrinho.textContent = "R$ 0,00";
        } else {
            if(btnFinalizar) btnFinalizar.style.display = 'inline-block';
            
            carrinho.forEach(item => {
                total += item.preco;
                
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

    window.removerDoCarrinho = function(id) {
        let carrinho = JSON.parse(localStorage.getItem('elogic_carrinho')) || [];
        carrinho = carrinho.filter(item => item.id !== id);
        localStorage.setItem('elogic_carrinho', JSON.stringify(carrinho));
        
        renderizarCarrinho();
        atualizarContador();
    };

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

    
    //Test-Drive
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

    //Cadastro -> admin
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

    
    //Login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailLogin = document.getElementById('email-login').value;
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

    
    //Acessibilidade
    const body = document.body;

    if (localStorage.getItem('altoContraste') === 'true') body.classList.add('alto-contraste');
    if (localStorage.getItem('textoEspacado') === 'true') body.classList.add('texto-espacado');
    let tamFonte = parseInt(localStorage.getItem('tamanhoFonte')) || 100;
    document.documentElement.style.fontSize = `${tamFonte}%`;

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

    for (const [id, func] of Object.entries(acoesAcessibilidade)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('click', func);
        }
    }

    //Busca Geral
    const formBuscaHome = document.getElementById('form-busca-home');
    if (formBuscaHome) {
        formBuscaHome.addEventListener('submit', (e) => {
            e.preventDefault();
            const termo = document.getElementById('campo-busca-home').value;
            window.location.href = `modelos.html?busca=${encodeURIComponent(termo)}`;
        });
    }

    if (document.body.classList.contains('pagina-modelos')) {
        const params = new URLSearchParams(window.location.search);
        const categoriaFiltro = params.get('categoria');
        const buscaFiltro = params.get('busca');
        
        const tituloResultados = document.getElementById('titulo-resultados');
        const todosOsCards = document.querySelectorAll('.card-oferta');
        const semResultados = document.getElementById('sem-resultados');
        let encontrouAlgum = false;

        if (categoriaFiltro) {
            tituloResultados.textContent = `Categoria: ${categoriaFiltro.charAt(0).toUpperCase() + categoriaFiltro.slice(1)}`;
            
            todosOsCards.forEach(card => {
                if (card.dataset.categoria === categoriaFiltro) {
                    card.style.display = 'flex';
                    encontrouAlgum = true;
                } else {
                    card.style.display = 'none';
                }
            });
        } 

        else if (buscaFiltro) {
            tituloResultados.textContent = `Resultados para: "${buscaFiltro}"`;
            const termo = buscaFiltro.toLowerCase();

            todosOsCards.forEach(card => {
                const nomeCarro = card.dataset.nome.toLowerCase();
                if (nomeCarro.includes(termo)) {
                    card.style.display = 'flex';
                    encontrouAlgum = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            const campoBuscaInterno = document.getElementById('campo-busca-modelos');
            if(campoBuscaInterno) campoBuscaInterno.value = buscaFiltro;
        }

        if (!encontrouAlgum && (categoriaFiltro || buscaFiltro)) {
            if(semResultados) semResultados.style.display = 'block';
            if(semResultados) semResultados.classList.remove('oculto');
        }

        const formBuscaModelos = document.getElementById('form-busca-modelos');
        if (formBuscaModelos) {
            formBuscaModelos.addEventListener('submit', (e) => {
                e.preventDefault();
                const termo = document.getElementById('campo-busca-modelos').value;
                window.location.href = `modelos.html?busca=${encodeURIComponent(termo)}`;
            });
        }
    }
});