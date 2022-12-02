
/*  
    Interface para Dependecy Injection , caso queira criar outro tipo de usuário terá fácil substituição;
    Esta interface está sendo utilizada no Schema do usuário;
*/
export interface IUsuario {
    id: string;
    cpf: number;
    name: string;
    midName: string;
    lastName: string
    createUsuario(cpf: number, name: string, midName: string, lastName?: string) :Promise<any>;
}