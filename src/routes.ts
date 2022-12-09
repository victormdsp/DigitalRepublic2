import { Router } from "express";
import { modelConta } from './mongoDBModels/ContaSchema';
import { modelUser } from '../src/mongoDBModels/UserSchema';
const bycrypt = require("bcryptjs");

const router = Router();

//Rota para buscar um Usuário
router.get('/getUsuario', async (request, response) => {
    const data = request.body;
    const usuario = await getUsuario(data.cpf); if (!usuario) {
        response.status(404).send({ message: "Usuário não encontrado" });
    }
    else {
        response.status(200).send(usuario);
    };
});

//Rota para buscar uma Conta
router.get('/getConta', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    if (!conta) response.status(404).send({ message: "Conta não encontrada" });
    else {
        response.status(200).send(conta);
    }
})

//Rota para buscar o saldo de uma Conta
router.get('/getSaldo', async (request, response) => {
    const data = request.body;
    const conta = await getConta(data.cpf);

    if (!conta) response.status(404).send({ message: "Conta não encontrada" });
    else {
        response.status(200).send(conta.saldo);
    }
})

//Rota para criar uma Conta
router.post('/criarConta', async (request, response) => {
    const data = request.body;

    const usuarioDB = await getUsuario(data.cpf);
    const contaDb = await getConta(data.cpf);

    if (usuarioDB) {
        response.status(404).send({ message: "Usuário já cadastrado" });
    }

    const usuario = new modelUser();
    const newUser = await usuario.createUsuario(data.cpf, data.name, data.midName, data.lastName);

    if (contaDb) response.status(400).send({ message: "Conta já criada" });

    else {
        const conta = new modelConta();
        const respostaConta = await conta.abrirConta(newUser, data.password);
        console.log(respostaConta.message);
        response.status(respostaConta.status).send(respostaConta.message)
    }
});

//Rota para realizar uma transferência
router.put('/transferencia', async (request, response) => {
    const data = request.body;

    const contaTransferidor = await getConta(data.cpfTransferidor);
    const contaTransferida = await getConta(data.cpfTransferido);

    if (!contaTransferidor) response.status(400).send({ message: "Conta do transferidor não encontrada." });
    else if (!contaTransferida) response.status(400).send({ message: "Conta a ser transferida não encontrada." });
    else if (!bycrypt.compareSync(data.password, contaTransferidor.password)) response.status(400).send({ message: "Senha da conta incorreta." }); //Verifica se a senha da conta está correta
    else {
        const contaModelo = new modelConta();

        const respostaTransferencia = await contaModelo.transferir(contaTransferidor, contaTransferida, data.valor);
        response.status(respostaTransferencia.status).send({ saldo: respostaTransferencia.message });
    }
})

//Rota para realizar um depósito
router.put('/depositar', async (request, response) => {
    const data = request.body;

    const conta = await getConta(data.cpf);
    if (!conta) response.status(404).send({ message: "Conta não encontrada" });

    else {
        const contaModelo = new modelConta();
        const respostaDeposito = await contaModelo.depositar(conta, data.valor);
        response.status(respostaDeposito.status).send(respostaDeposito.message);
    }
})

//Rota para se logar em uma Conta;
router.post('/login', async (req, res, next) => {
    const data = req.body;
    const contaDb = await modelConta.find({ cpf: data.cpf })

    if (!contaDb[0]) return res.status(404).send({ message: "Não foi possível encontrar o usuário" });
    else if (!bycrypt.compareSync(data.password, contaDb[0].password)) res.status(400).send({ message: "Senha da conta incorreta." });
    else {
        res.status(200).send(contaDb[0]);
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