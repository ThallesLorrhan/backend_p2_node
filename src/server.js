const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// Certifique-se de que seu arquivo ./models exporta corretamente a conexão do banco relacional E os modelos NoSQL
const { sequelize, User, Carro, Moto, MarcaRoupa } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== CONFIGURAÇÃO DO SWAGGER ====================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Acadêmica P2",
      version: "1.0.0",
      description:
        "Sistema com persistência SQL/NoSQL (Acesso Livre para Testes)",
    },
    paths: {
      "/carros": {
        post: {
          tags: ["Carros"],
          summary: "Cria um novo carro",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    modelo: { type: "string" },
                    marca: { type: "string" },
                    ano: { type: "number" },
                    preco: { type: "number" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Criado" } },
        },
        get: {
          tags: ["Carros"],
          summary: "Lista todos os carros",
          responses: { 200: { description: "Sucesso" } },
        },
      },
      "/carros/{id}": {
        delete: {
          tags: ["Carros"],
          summary: "Deleta um carro pelo ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID do carro no MongoDB",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Deletado com sucesso" },
            404: { description: "Não encontrado" },
            500: { description: "Erro interno do servidor" },
          },
        },
      },
      "/motos": {
        post: {
          tags: ["Motos"],
          summary: "Cria uma nova moto",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    modelo: { type: "string" },
                    marca: { type: "string" },
                    cilindradas: { type: "number" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Criado" } },
        },
        get: {
          tags: ["Motos"],
          summary: "Lista todas as motos",
          responses: { 200: { description: "Sucesso" } },
        },
      },
      "/motos/{id}": {
        delete: {
          tags: ["Motos"],
          summary: "Deleta uma moto pelo ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID da moto no MongoDB",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Deletado com sucesso" },
            404: { description: "Não encontrada" },
            500: { description: "Erro interno do servidor" },
          },
        },
      },
      "/marcas-roupa": {
        post: {
          tags: ["Marcas de Roupa"],
          summary: "Cria uma nova marca de roupa",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    paisOrigem: { type: "string" },
                    segmento: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Criado" } },
        },
        get: {
          tags: ["Marcas de Roupa"],
          summary: "Lista todas as marcas de roupa",
          responses: { 200: { description: "Sucesso" } },
        },
      },
      "/marcas-roupa/{id}": {
        delete: {
          tags: ["Marcas de Roupa"],
          summary: "Deleta uma marca de roupa pelo ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID da marca de roupa no MongoDB",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Deletado com sucesso" },
            404: { description: "Não encontrada" },
            500: { description: "Erro interno do servidor" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==================== ROTAS: CARROS (MongoDB) ====================
app.post("/carros", async (req, res) => {
  try {
    const novoCarro = await Carro.create(req.body);
    res.status(201).json(novoCarro);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/carros", async (req, res) => {
  try {
    const carros = await Carro.find();
    res.json(carros);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/carros/:id", async (req, res) => {
  try {
    const resultado = await Carro.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Carro não encontrado" });
    }
    res.status(200).json({ message: "Carro deletado com sucesso!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== ROTAS: MOTOS (MongoDB) ====================
app.post("/motos", async (req, res) => {
  try {
    const novaMoto = await Moto.create(req.body);
    res.status(201).json(novaMoto);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/motos", async (req, res) => {
  try {
    const motos = await Moto.find();
    res.json(motos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/motos/:id", async (req, res) => {
  try {
    const resultado = await Moto.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Moto não encontrada" });
    }
    res.status(200).json({ message: "Moto deletada com sucesso!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== ROTAS: MARCAS DE ROUPA (MongoDB) ====================
app.post("/marcas-roupa", async (req, res) => {
  try {
    const novaMarca = await MarcaRoupa.create(req.body);
    res.status(201).json(novaMarca);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/marcas-roupa", async (req, res) => {
  try {
    const marcas = await MarcaRoupa.find();
    res.json(marcas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/marcas-roupa/:id", async (req, res) => {
  try {
    const resultado = await MarcaRoupa.findByIdAndDelete(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Marca de roupa não encontrada" });
    }
    res.status(200).json({ message: "Marca deletada com sucesso!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ==================== INICIALIZAÇÃO DO SERVIDOR ====================
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => console.log(`Servidor ativo na porta ${PORT}`));
    }
  })
  .catch((err) => {
    console.error(
      "Erro ao sincronizar com o banco relacional (Sequelize):",
      err.message,
    );
  });

module.exports = app;
