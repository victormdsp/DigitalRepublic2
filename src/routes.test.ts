import { app } from "./server";
const request = require('supertest');

import { describe, expect, test } from "@jest/globals";

//Testes que devem voltar com status 200

// ------Gets------

describe("Testando rota getUsuario", () => {
    test("getUsuario", async () => {
        await request(app)
            .get("/getUsuario")
            .send({ cpf: 1233355 })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200);
            })
    })
});

describe("Testando rota getConta", () => {
    test("getConta", async () => {
        await request(app)
            .get("/getConta")
            .send({ cpf: 1233355 })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200);
            })
    })
});

describe("Testando rota getSaldo", () => {
    test("getSaldo", async () => {
        await request(app)
            .get("/getSaldo")
            .send({ cpf: 1233355 })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200)
            })
    })
})

// ------Posts------
describe("Testando rota criarUsuario", () => {
    test("criarUsuario", async () => {
        await request(app)
            .post("/criarUsuario")
            .send({
                cpf: Math.floor(Math.random() * 100),
                name: "Teste",
                midName: "Martini",
                lastName: "asd"
            })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200)
            })
    })
})

describe("Testando rota criarConta", () => {
    test("criarConta", async () => {
        await request(app)
            .post("/criarConta")
            .send({
                cpf: "cpf de um usuário", // Necessário ser um cpf de um usuário existente
                password: '12345678',
            })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200)
            })
    })
})

// ------Puts------
describe("Testando rota transferencia", () => {
    test("transferencia", async () => {
        await request(app)
            .put("/transferencia")
            .send({
                cpfTransferidor: 123335,
                cpfTransferido: 1233355,
                valor: 20,
                password: '12345678'
            })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200)
            })
    })
})

describe("Testando rota depositar", () => {
    test("depositar", async () => {
        await request(app)
            .put("/depositar")
            .send({
                cpf: 1233355,
                valor: 400
            })
            .then((response: { statusCode: any; }) => {
                expect(response.statusCode).toBe(200)
            })
    })
})