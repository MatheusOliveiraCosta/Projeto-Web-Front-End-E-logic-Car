document.addEventListener('DOMContentLoaded', () => {
       //diecionar daddos do cadastro principal para o admin.js     
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

            const CHAVE_DB_ADMIN = 'elogic_db_usuarios'; // Mesma chave usada no admin.js
            let usuarios = JSON.parse(localStorage.getItem(CHAVE_DB_ADMIN)) || [];

            usuarios.push(novoUsuario);
            localStorage.setItem(CHAVE_DB_ADMIN, JSON.stringify(usuarios));

            alert('Conta criada com sucesso! Seus dados foram registrados no sistema.');
            window.location.href = 'login.html';
        });
    }

    //Possíveis modificações futuras podem ser feitas aqui
});