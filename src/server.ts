const express = require("express");
const router = require("./routes");
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://victormdsp:81005496@cluster0.zm0nvyf.mongodb.net/DigitalRepublic");

export const app = express();

app.use(express.json());
app.use('/', router);

app.listen(3000, () => {
    console.log(" Escutando na porta 3000\n")
    console.log(" Olá avaliador da Digital Republic =), este projeto é um pouco diferente do proposto no desafio. \n A diferença é que eu utilizei dois Modelos (Classes) neste projeto, uma da Conta Bancária do usuário e uma para o Usuário , \n asism separando as duas tabelas pensando em larga escala onde poderiamos ter muitas informações e acabar tendo uma classe com muita informação!\n")
    console.log(" Estou deixando casos de teste para cada rota caso queira testar no postman ou insomnia: \n");
    console.log(" Utilizando o método POST nós temos: \n")
    console.log(" Criar usuário: \n {\n    'cpf': '1233355',\n    'name': 'Digital', \n    'midName': 'Republic',\n    'lastName': 'opcional'\n }\n")
    console.log(" Criar uma conta: \n {\n    'cpf': '1233355'\n    'password': '12345678'\n}\n")
    console.log(" ------------------------------------\n")
    console.log(" Utilizando o método GET nós temos: \n")
    console.log(" getUsuario: \n {\n    'cpf': '1233355'\n }\n")
    console.log(" getConta: \n {\n    'cpf': '1233355'\n }\n")
    console.log(" getSaldo: \n {\n    'cpf': '1233355'\n }\n")
    console.log(" ------------------------------------\n")
    console.log(" Utilizando o método PUT nós temos: \n")
    console.log(" Transferencia: \n {\n    'cpfTransferidor': 123335,\n    'cpfTransferido': 1233355,\n    'valor': 20\n    'password': '12345678'\n} \n")
    console.log(" Deposito: \n {\n    'cpf': '12333',\n    'valor': 400\n }\n")
    console.log(" OBS: ----- Caso queira falhar algum teste é só trocar o CPF, ou colocar um valor negativo ou igual a 0 -----\n");
    console.log("       Muito obrigado pela oportunidade e chance !! =) \n");
    console.log("                       Att: Victor Martini");
});