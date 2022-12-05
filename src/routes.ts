import { Router } from "express";
import { modelConta } from './mongoDBModels/ContaSchema';
import { modelUser } from '../src/mongoDBModels/UserSchema';
const bycrypt = require("bcryptjs");

const router = Router();

//Rota para buscar um Usuário
router.get('/getUsuario', async (request, response) => {
    const data = request.body;
    const usuario = await getUsuario(data.cpf);    if (!usuario) {
        response.status(404).send("Usuário não encontrado");
    }
    else {
        response.status(200).send(usuario);
    };
});

//Rota para criar um Usuário
router.post('/criarUsuario', async (request, response) => {
    const data = request.body;
    const usuarioDb = await getUsuario(data.cpf);

    if (usuarioDb) {
        response.status(404).send("Usuário já cadastrado");
    }

    else {
        const usuario = new modelUser();
        const usuarioCriado = await usuario.createUsuario(data.cpf, data.name, data.midName, data.lastName);
        response.status(200).send(usuarioCriado);
    }
})

//Rota para buscar uma Conta
router.get('/getConta', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    if (!conta) response.status(404).send("Conta não encontrada");
    else {
        response.status(200).send(conta);
    }
})

//Rota para buscar o saldo de uma Conta
router.get('/getSaldo', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    if (!conta) response.status(404).send("Conta não encontrada");
    else {
        response.status(200).send(`O saldo desta conta é de R$${conta.saldo}`);
    }
})

//Rota para criar uma Conta
router.post('/criarConta', async (request, response) => {
    const data = request.body;

    const usuarioDB = await getUsuario(data.cpf);
    const contaDb = await getConta(data.cpf);

    if (!usuarioDB) response.status(404).send("Usuário não encontrado");
    else if (!data.password) response.status(400).send("É necessário inserir uma senha");
    else if (contaDb) response.status(400).send("Conta já criada");

    else {
        const conta = new modelConta();
        const respostaConta = await conta.abrirConta(usuarioDB, data.password);
        response.status(respostaConta.status).send(respostaConta.message)
    }
});

//Rota para realizar uma transferência
router.put('/transferencia', async (request, response) => {
    const data = request.body;

    const contaTransferidor = await getConta(data.cpfTransferidor);
    const contaTransferida = await getConta(data.cpfTransferido);
        
    if (!data.valor || data.valor <= 0) response.status(400).send("Valor de transferência incorreto.");
    else if (!contaTransferidor) response.status(400).send("Conta do transferidor não encontrada.");
    else if (!contaTransferida) response.status(400).send("Conta a ser transferida não encontrada.");
    else if (!data.password) response.status(400).send("É necessário inserir uma senha");
    else if (!bycrypt.compareSync(data.password, contaTransferidor.password)) response.status(400).send("Senha da conta incorreta."); //Verifica se a senha da conta está correta
    else {
        const contaModelo = new modelConta();

        const respostaTransferencia = await contaModelo.transferir(contaTransferidor, contaTransferida, data.valor);
        response.status(respostaTransferencia.status).send(respostaTransferencia.message);
    }
})

//Rota para realizar um depósito
router.put('/depositar', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);
    if (!data.valor || data.valor <= 0) response.status(400).send("Valor de deposito incorreto.");
    else if (!conta) response.status(404).send("Conta não encontrada");

    else {
        const contaModelo = new modelConta();
        const respostaDeposito = await contaModelo.depositar(conta, data.valor);
        response.status(respostaDeposito.status).send(respostaDeposito.message);
    }
})

/*
    Funções auxiliares
*/

//Buscar por uma conta e retorna caso já exista uma conta criada;
const getConta = async (cpf: number) => {
    const conta = await modelConta.find({ cpf: cpf })
    if (conta.length == 0) {
        return false;
    }
    return conta[0];
}

//Buscar por um usuário e retorna caso já exista um usuário criado;
const getUsuario = async (cpf: number) => {
    const usuario = await modelUser.find({ cpf: cpf });
    if (usuario.length == 0) {
        return false;
    }
    return usuario[0];
}

module.exports = router;