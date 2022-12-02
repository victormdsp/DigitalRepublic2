import { Schema, model } from 'mongoose';
import { IUsuario } from '../interfaces/IUsuario';

const Usuario = new Schema<IUsuario>({
    name: {
        type: String,
        required: true
    },

    midName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: false
    },

    cpf: {
        type: Number,
        required: true,
        minLength: 4,
    },

    // Id totalmente opcional , o mongoDb já cria um Id mas eu criei um para exemplificar caso seja outro banco que não haja criação automática.
    id: {
        type: String,
        required: false
    }
},
    {
        methods: {

            //Função que cria um novo usuário;
            async createUsuario(cpf: number, name: string, midName: string, lastName?: string): Promise<any> {
                return new Promise((resolve, reject) => {
                    const usuario = {
                        cpf: cpf,
                        name: name,
                        midName: midName,
                        lastName: lastName
                    }
                    
                    modelUser.create(usuario)
                        .then(() => {
                            const resposta = {
                                message: usuario,
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
            }
        }
    })

export const modelUser = model('Usuario', Usuario);