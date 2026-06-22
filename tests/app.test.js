const request = require("supertest");
const app = require("../src/server");
const { sequelize } = require("../src/models");

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Testes de Integração da API P2", () => {
  let token;

  test("Deve registrar um novo usuário com sucesso (SQL)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        username: "thalles_dev",
        password: "password123",
        role: "admin",
      });
    expect(res.statusCode).toEqual(201);
  });

  test("Deve realizar login e retornar o token JWT", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "thalles_dev", password: "password123" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Deve bloquear a criação de recursos NoSQL sem Token (OWASP)", async () => {
    const res = await request(app).post("/carros").send({ modelo: "Civic" });
    expect(res.statusCode).toEqual(401);
  });

  test("Deve autorizar criação de recurso com token válido", async () => {
    const res = await request(app)
      .post("/carros")
      .set("Authorization", `Bearer ${token}`)
      .send({ modelo: "Civic", marca: "Honda", ano: 2026, preco: 180000 });
    expect(res.statusCode).toEqual(201);
  });
});
