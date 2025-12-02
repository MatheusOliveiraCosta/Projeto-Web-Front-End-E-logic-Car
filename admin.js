document.addEventListener('DOMContentLoaded', () => {
    
    const formAdmin = document.getElementById('form-admin');
    const nomeInput = document.getElementById('admin-nome');
    const emailInput = document.getElementById('admin-email');
    const btnLimpar = document.getElementById('btn-limpar');
    const listaUsuarios = document.getElementById('lista-usuarios');
    const btnExcluirTudo = document.getElementById('btn-excluir-tudo');
    const campoPesquisa = document.getElementById('campo-pesquisa');
    const mensagemVazia = document.getElementById('mensagem-vazia');

    const CHAVE_DB = 'elogic_db_usuarios';

    //Ler dados do LocalStorage
    function lerDados() {
        const dados = localStorage.getItem(CHAVE_DB);
        return dados ? JSON.parse(dados) : [];
    }

    //Salvar dados
    function salvarDados(dados) {
        localStorage.setItem(CHAVE_DB, JSON.stringify(dados));
    }

    //Gerar data
    function getDataAtual() {
        const agora = new Date();
        return agora.toLocaleString('pt-BR'); // Formato: dd/mm/aaaa hh:mm:ss
    }

    //RENDERIZAÇÃO

    function renderizarLista(filtro = '') {
        const usuarios = lerDados();
        listaUsuarios.innerHTML = ''; 

        
        const usuariosFiltrados = usuarios.filter(usuario => {
            const termo = filtro.toLowerCase();
            return usuario.nome.toLowerCase().includes(termo) || 
                   usuario.email.toLowerCase().includes(termo);
        });

        // mensagem se a lista estiver vazia
        if (usuariosFiltrados.length === 0) {
            mensagemVazia.style.display = 'block';
        } else {
            mensagemVazia.style.display = 'none';
        }

        usuariosFiltrados.forEach(usuario => {
            const li = document.createElement('li');
            li.className = 'item-lista';
            
            li.innerHTML = `
                <div class="info-item">
                    <strong>${usuario.nome}</strong>
                    <span>${usuario.email}</span>
                    <small>Cadastrado em: ${usuario.data}</small>
                </div>
                <button class="botao-excluir-item" onclick="excluirItem(${usuario.id})">Excluir</button>
            `;
            
            listaUsuarios.appendChild(li);
        });
    }

    //cadastrar localmente
    formAdmin.addEventListener('submit', (e) => {
        e.preventDefault(); 

        const novoUsuario = {
            id: Date.now(),
            nome: nomeInput.value,
            email: emailInput.value,
            data: getDataAtual()
        };

        const usuarios = lerDados();
        usuarios.push(novoUsuario);
        salvarDados(usuarios);

        alert('Usuário cadastrado com sucesso!');
        formAdmin.reset(); 
        renderizarLista(); 
    });

    //limpar campos
    btnLimpar.addEventListener('click', () => {
        formAdmin.reset();
    });

    //excluir item unico
    window.excluirItem = function(id) {
        if(confirm('Deseja realmente excluir este usuário?')) {
            let usuarios = lerDados();
            usuarios = usuarios.filter(usuario => usuario.id !== id);
            
            salvarDados(usuarios);
            renderizarLista(campoPesquisa.value);
        }
    };

    //excluir todos os itens
    btnExcluirTudo.addEventListener('click', () => {
        if(confirm('ATENÇÃO: Isso apagará TODOS os usuários cadastrados. Continuar?')) {
            localStorage.removeItem(CHAVE_DB);
            renderizarLista();
        }
    });

    //pesquisar itens
    campoPesquisa.addEventListener('input', (e) => {
        const termo = e.target.value;
        renderizarLista(termo);
    });

    renderizarLista();
});