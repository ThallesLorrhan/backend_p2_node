const { Sequelize, DataTypes } = require("sequelize");
const mongoose = require("mongoose");

const isTest = process.env.NODE_ENV === "test";
const sequelize = isTest
  ? new Sequelize("sqlite::memory:", { logging: false })
  : new Sequelize(process.env.DATABASE_URL, { logging: false });

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "user" },
});

if (!isTest) {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/db_p2_nosql")
    .catch((err) => console.error("Erro ao conectar no MongoDB:", err));
}

const Carro = mongoose.model(
  "Carro",
  new mongoose.Schema({
    modelo: String,
    marca: String,
    ano: Number,
    preco: Number,
  }),
);

const Moto = mongoose.model(
  "Moto",
  new mongoose.Schema({
    modelo: String,
    marca: String,
    cilindradas: Number,
  }),
);

const MarcaRoupa = mongoose.model(
  "MarcaRoupa",
  new mongoose.Schema({
    nome: String,
    paisOrigem: String,
    segmento: String,
  }),
);

module.exports = { sequelize, User, Carro, Moto, MarcaRoupa };
