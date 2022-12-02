import { IUsuario } from "./IUsuario";

/*
    Interface para Dependecy Injection , caso queira criar outro tipo de conta terá fácil substituição;
    Esta interface está sendo utilizada no Schema da Conta;
*/
export interface IConta {
    id: string;
    saldo: number;
    cpf: number;
    password: string;
    abrirConta( usuario, password: number );
    depositar( conta, valor: number): Promise<any>;
    transferir( contaTransferidor, contaTransferida, valor: number): Promise<any>;
    transferenciaRecebida( conta, valor: number): Promise<any>;
}