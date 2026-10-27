
"use strict";

// ========================================
// 1. SELECIONANDO OS ELEMENTOS DO HTML
// ========================================

const formulario = document.getElementById("formCadastro");

const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoCurso = document.getElementById("curso");

const listaAlunos = document.getElementById("listaAlunos");
const mensagemGeral = document.getElementById("mensagemGeral");

const mensagemNome = document.getElementById("erroNome");
const mensagemEmail = document.getElementById("erroEmail");
const mensagemCurso = document.getElementById("erroCurso");


// ========================================
// 2. FUNÇÃO PARA MOSTRAR A VALIDAÇÃO
// ========================================

function mostrarResultado(campo, mensagem, elementoMensagem) {
    const valido = mensagem === "";

    campo.classList.toggle("campo-valido", valido);
    campo.classList.toggle("campo-invalido", !valido);

    elementoMensagem.textContent = mensagem;
    elementoMensagem.className = valido
        ? "mensagem sucesso"
        : "mensagem erro";

    return valido;
}


// ========================================
// 3. REGRAS DE VALIDAÇÃO
// ========================================

function validarNome() {
    const nome = campoNome.value.trim();

    if (nome.length < 3) {
        return mostrarResultado(
            campoNome,
            "Digite um nome com pelo menos 3 caracteres.",
            mensagemNome
        );
    }

    // Exige pelo menos duas partes do nome.
    const partesDoNome = nome.split(/\s+/);

    if (partesDoNome.length < 2) {
        return mostrarResultado(
            campoNome,
            "Digite o nome e o sobrenome.",
            mensagemNome
        );
    }

    return mostrarResultado(campoNome, "", mensagemNome);
}


function validarEmail() {
    const email = campoEmail.value.trim();

    // Verificação básica de formato de e-mail.
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
        return mostrarResultado(
            campoEmail,
            "Digite um e-mail válido.",
            mensagemEmail
        );
    }

    return mostrarResultado(campoEmail, "", mensagemEmail);
}


function validarCurso() {
    const curso = campoCurso.value;

    if (curso === "") {
        return mostrarResultado(
            campoCurso,
            "Selecione um curso.",
            mensagemCurso
        );
    }

    return mostrarResultado(campoCurso, "", mensagemCurso);
}


// ========================================
// 4. EVENTO FOCUS
// Destaca o campo quando ele recebe foco.
// ========================================

const campos = [campoNome, campoEmail, campoCurso];

campos.forEach(function (campo) {
    campo.addEventListener("focus", function () {
        campo.style.outline = "2px solid #2878d0";

        console.log("Campo recebeu foco:", campo.name);
    });

    campo.addEventListener("blur", function () {
        campo.style.outline = "none";
    });
});


// ========================================
// 5. EVENTO BLUR
// Valida quando o usuário sai do campo.
// ========================================

campoNome.addEventListener("blur", validarNome);

campoEmail.addEventListener("blur", validarEmail);

campoCurso.addEventListener("blur", validarCurso);


// ========================================
// 6. EVENTO INPUT
// Limpa o erro antigo quando o usuário
// começa a corrigir o campo.
// ========================================

campoNome.addEventListener("input", function () {
    campoNome.classList.remove("campo-valido", "campo-invalido");
    mensagemNome.textContent = "";
    mensagemNome.className = "mensagem";
});

campoEmail.addEventListener("input", function () {
    campoEmail.classList.remove("campo-valido", "campo-invalido");
    mensagemEmail.textContent = "";
    mensagemEmail.className = "mensagem";
});

campoCurso.addEventListener("change", function () {
    campoCurso.classList.remove("campo-valido", "campo-invalido");
    mensagemCurso.textContent = "";
    mensagemCurso.className = "mensagem";
});


// ========================================
// 7. EVENTO SUBMIT E PREVENTDEFAULT()
// Valida tudo antes de cadastrar.
// ========================================

formulario.addEventListener("submit", function (evento) {
    // Impede o recarregamento padrão da página.
    evento.preventDefault();

    console.log("Tentativa de envio do formulário.");

    // Executa todas as validações.
    const nomeValido = validarNome();
    const emailValido = validarEmail();
    const cursoValido = validarCurso();

    // Se algum campo for inválido, interrompe o cadastro.
    if (!nomeValido || !emailValido || !cursoValido) {
        mensagemGeral.textContent =
            "Corrija os campos destacados antes de cadastrar.";

        mensagemGeral.style.color = "#d93025";

        console.warn("Cadastro bloqueado: existem dados inválidos.");

        return;
    }

    // Guarda os dados aprovados.
    const aluno = {
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        curso: campoCurso.value
    };

    // Cria um novo item da lista.
    const item = document.createElement("li");

    // Usa textContent para inserir texto com segurança.
    item.textContent =
        "Nome: " + aluno.nome +
        " | E-mail: " + aluno.email +
        " | Curso: " + aluno.curso;

    // Adiciona o aluno ao DOM.
    listaAlunos.appendChild(item);

    mensagemGeral.textContent =
        "Aluno cadastrado com sucesso!";

    mensagemGeral.style.color = "#188447";

    console.log("Cadastro aprovado:", aluno);

    // Limpa o formulário depois do cadastro.
    formulario.reset();

    // Remove as marcações visuais dos campos.
    campos.forEach(function (campo) {
        campo.classList.remove("campo-valido", "campo-invalido");
        campo.style.outline = "none";
    });

    // Limpa as mensagens individuais.
    [mensagemNome, mensagemEmail, mensagemCurso].forEach(
        function (elemento) {
            elemento.textContent = "";
            elemento.className = "mensagem";
        }
    );
});


// ========================================
// 8. MUTATIONOBSERVER
// Observa a entrada de novos alunos na lista.
// ========================================

const observador = new MutationObserver(function (alteracoes) {
    alteracoes.forEach(function (alteracao) {
        alteracao.addedNodes.forEach(function (noAdicionado) {
            // Verifica se o novo nó é um elemento HTML.
            if (noAdicionado.nodeType === 1) {
                console.log(
                    "MutationObserver: novo aluno adicionado à lista.",
                    noAdicionado.textContent
                );
            }
        });
    });
});

// Configura o observador para acompanhar novos elementos.
observador.observe(listaAlunos, {
    childList: true
});

console.log("Sistema de cadastro iniciado.");
console.log("MutationObserver está monitorando a lista.");
