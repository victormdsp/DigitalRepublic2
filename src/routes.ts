import { Router } from "express";
import { modelConta } from './mongoDBModels/ContaSchema';
import { modelUser } from '../src/mongoDBModels/UserSchema';
const bycrypt = require("bcryptjs");

const router = Router();

//Rota para buscar um Usuário
router.get('/getUsuario', async (request, response) => {
    const data = request.body;
    const usuario = await getUsuario(data.cpf);
    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;
    if (!usuario) {
        resposta = createResponse("Usuário não encontrado", 404);
    }
    else {
        resposta = createResponse(usuario, 200);
    };

    response.send(resposta.message).status(resposta.status);
});

//Rota para criar um Usuário
router.post('/criarUsuario', async (request, response) => {
    const data = request.body;
    const usuarioDb = await getUsuario(data.cpf);

    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;

    if (usuarioDb) {
        resposta = createResponse("Usuário já cadastrado", 404);
    }

    else {
        const usuario = new modelUser();
        const usuarioCriado = await usuario.createUsuario(data.cpf, data.name, data.midName, data.lastName);
        resposta = createResponse(usuarioCriado, 200);
    }

    response.send(resposta.message).status(resposta.status);
})

//Rota para buscar uma Conta
router.get('/getConta', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;

    if (!conta) resposta = createResponse("Conta não encontrada", 404);
    else {
        resposta = createResponse(conta, 200);
    }

    response.send(resposta.message).status(resposta.status);
})

//Rota para buscar o saldo de uma Conta
router.get('/getSaldo', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;

    if (!conta) resposta = createResponse("Conta não encontrada", 404);
    else {
        resposta = createResponse(`O saldo desta conta é de R$${conta.saldo}`, 200);
    }

    response.send(resposta.message).status(resposta.status);
})

//Rota para criar uma Conta
router.post('/criarConta', async (request, response) => {
    const data = request.body;

    const usuarioDB = await getUsuario(data.cpf);
    const contaDb = await getConta(data.cpf);

    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;

    if (!usuarioDB) resposta = createResponse("Usuário não encontrado", 404);
    else if (contaDb) resposta = createResponse("Conta já criada", 400);

    else {
        const conta = new modelConta();
        const respostaConta = await conta.abrirConta(usuarioDB, data.password);
        resposta = createResponse(respostaConta.message, respostaConta.status)
    }

    response.send(resposta.message).status(resposta.status);
});

//Rota para realizar uma transferência
router.put('/transferencia', async (request, response) => {
    const data = request.body;

    const contaTransferidor = await getConta(data.cpfTransferidor);
    const contaTransferida = await getConta(data.cpfTransferido);
    
    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;
    
    if (!data.valor || data.valor <= 0) resposta = createResponse("Valor de transferência incorreto.", 400);
    else if (!contaTransferidor) resposta = createResponse("Conta do transferidor não encontrada.", 400);
    else if (!contaTransferida) resposta = createResponse("Conta a ser transferida não encontrada.", 400);
    else if(!bycrypt.compareSync(data.password, contaTransferidor.password)) resposta = createResponse("Senha da conta incorreta.", 400); //Verifica se a senha da conta está correta
    else {
        const contaModelo = new modelConta();

        const respostaTransferencia = await contaModelo.transferir(contaTransferidor, contaTransferida, data.valor);
        resposta = createResponse(respostaTransferencia.message, respostaTransferencia.status);
    }

    response.send(resposta.message).status(resposta.status);
})

//Rota para realizar um depósito
router.put('/depositar', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);
    let resposta: { message: any, status: number }; //Variável para armazenar a resposta da query;

    if (!data.valor || data.valor <= 0) resposta = createResponse("Valor de deposito incorreto.", 400);
    else if (!conta) resposta = createResponse("Conta não encontrada", 404);

    else {
        const contaModelo = new modelConta();
        const respostaDeposito = await contaModelo.depositar(conta, data.valor);
        resposta = createResponse(respostaDeposito.message, respostaDeposito.status);
    }

    response.send(resposta.message).status(resposta.status);
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

//Função para não ter que ficar reescrevendo "response.send('text').status('status')";
const createResponse = (text: any, status: number) => {
    const resposta = {
        message: text,
        status: status,
    }
    return resposta;
}

module.exports = router;