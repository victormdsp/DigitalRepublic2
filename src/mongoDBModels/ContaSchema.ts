import { Schema, model } from 'mongoose';
import { v4 } from 'uuid';
import { IConta } from '../interfaces/IConta';
const bycrypt = require("bcryptjs");

const Conta = new Schema<IConta>({
    // Id totalmente opcional , o mongoDb já cria um Id mas eu criei um para exemplificar caso seja outro banco que não haja criação automática.
    id: {
        type: String,
        required: true,
    },
    saldo: {
        type: Number,
        default: 0,
    },
    cpf: {
        type: Number,
        required: true,
        minLength: 4,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    }
},
    {
        methods: {

            //Cria uma nova conta Bancário com base em um usuário cadastrado no banco;
            async abrirConta(usuario, password: string): Promise<any> {
                return new Promise(async (resolve, reject) => {

                    //Gera uma senha Hash;
                    const salt = await bycrypt.genSalt(10);
                    const passwordHash = await bycrypt.hash(password, salt);

                    const conta = {
                        id: v4(),
                        saldo: 0,
                        cpf: usuario.cpf,
                        password: passwordHash,
                    }

                    modelConta.create(conta)
                        .then(() => {
                            const resposta = {
                                message: conta,
                                status: 200,
                            }
                            resolve(resposta);
                        })
                        .catch(err => {
                            const resposta = {
                                message: err.message,
                                status: 400,
                            }
                            resolve(resposta);
                        });
                })
            },

            //Deposita um valor em uma conta bancária;
            async depositar(conta, valor: number): Promise<any> {
                return new Promise((resolve, reject) => {
                    if (valor > 2000) {
                        resolve({ message: `Depositos maiores que R$2000 não são aceitos`, status: 200 });
                    }

                    conta.saldo += valor;
                    modelConta.findOneAndUpdate({ id: conta.id }, { saldo: conta.saldo })
                        .then(() => {
                            const resposta = {
                                message: `Depósito de R$${valor} efetuado.`,
                                status: 200,
                            }
                            resolve(resposta);
                        })
                        .catch(err => {
                            const resposta = {
                                message: err.message,
                                status: 400,
                            }
                            resolve(resposta);
                        });

                })
            },

            //Transfere um valor de uma conta bancária para outra;
            async transferir(contaTransferidor, contaTransferida, valor: number): Promise<any> {

                if (valor > contaTransferidor.saldo || contaTransferidor.saldo == 0) {
                    return { message: "Saldo Insuficiente", status: 400 }
                }

                contaTransferidor.saldo -= valor;
                await modelConta.findOneAndUpdate({ id: contaTransferidor.id }, { saldo: contaTransferidor.saldo });
                await contaTransferida.transferenciaRecebida(contaTransferida, valor);
                return { message: `Transferência realizada, o saldo restante foi de R$${contaTransferidor.saldo}`, status: 200 };
            },

            //Essa função serve para notificar ao outro usuário que ele recebeu uma transferência (Basicamente como um Observer caso ocorra uma transferência ele notificar o usuário);
            async transferenciaRecebida(conta, valor: number): Promise<string> {
                conta.saldo += valor;
                await modelConta.findOneAndUpdate({ cpf: conta.cpf }, { saldo: conta.saldo });
                return `Transferência de R$${valor} recebida`;
            },
        }
    }
)

export const modelConta = model('Conta', Conta); 