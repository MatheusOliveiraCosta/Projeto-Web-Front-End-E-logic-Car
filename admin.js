document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos
    const formAdmin = document.getElementById('form-admin');
    const inputNome = document.getElementById('admin-nome');
    const inputEmail = document.getElementById('admin-email');
    const listaUsuarios = document.getElementById('lista-usuarios');
    const btnExcluirTudo = document.getElementById('btn-excluir-tudo');
    const campoPesquisa = document.getElementById('campo-pesquisa');
    const btnLimpar = document.getElementById('btn-limpar');

    // IMPORTANTE: Mesma chave usada no main.js
    const CHAVE_DB = 'elogic_db_usuarios';

    // --- FUNÇÕES ---

    function lerDados() {
        return JSON.parse(localStorage.getItem(CHAVE_DB)) || [];
    }

    function salvarDados(dados) {
        localStorage.setItem(CHAVE_DB, JSON.stringify(dados));
    }

    function renderizarLista(filtro = '') {
        const usuarios = lerDados();
        listaUsuarios.innerHTML = '';

        const usuariosFiltrados = usuarios.filter(user => 
            user.nome.toLowerCase().includes(filtro.toLowerCase()) || 
            user.email.toLowerCase().includes(filtro.toLowerCase())
        );

        if (usuariosFiltrados.length === 0) {
            listaUsuarios.innerHTML = '<p style="text-align:center; color:#777;">Nenhum usuário encontrado.</p>';
            return;
        }

        usuariosFiltrados.forEach(user => {
            const li = document.createElement('li');
            li.className = 'item-lista';
            li.innerHTML = `
                <div class="info-item">
                    <strong>${user.nome}</strong>
                    <span>${user.email}</span>
                    <small>Em: ${user.data}</small>
                </div>
                <button class="botao-excluir-item" onclick="deletarUsuario(${user.id})">Excluir</button>
            `;
            listaUsuarios.appendChild(li);
        });
    }

    // Função Global para o botão onclick do HTML chamar
    window.deletarUsuario = function(id) {
        if(confirm("Excluir este usuário?")) {
            let usuarios = lerDados();
            usuarios = usuarios.filter(u => u.id !== id);
            salvarDados(usuarios);
            renderizarLista(campoPesquisa.value);
        }
    };

    // --- EVENTOS ---

    // Cadastrar pelo Admin
    formAdmin.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoUsuario = {
            id: Date.now(),
            nome: inputNome.value,
            email: inputEmail.value,
            data: new Date().toLocaleString('pt-BR')
        };
        const usuarios = lerDados();
        usuarios.push(novoUsuario);
        salvarDados(usuarios);
        alert('Usuário cadastrado!');
        formAdmin.reset();
        renderizarLista();
    });

    // Limpar
    btnLimpar.addEventListener('click', () => formAdmin.reset());

    // Excluir Tudo
    btnExcluirTudo.addEventListener('click', () => {
        if(confirm("ATENÇÃO: Apagar TODOS os usuários?")) {
            localStorage.removeItem(CHAVE_DB);
            renderizarLista();
        }
    });

    // Pesquisar
    campoPesquisa.addEventListener('input', (e) => {
        renderizarLista(e.target.value);
    });

    // Iniciar
    renderizarLista();
});