import mongoose from "mongoose"
import config from "./config/config.js"

export default class MongoSingleton {
  static #instance

  constructor() {
    mongoose.connect(config.mongoUrl, {
      dbName: config.mongoDBName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        console.log("Db connected")
      })
      .catch(e => console.log(e))
  }

  static getInstance() {
    if (this.#instance) {
      console.log("already connected")
      return this.#instance
    }

    this.#instance = new MongoSingleton()
    return this.#instance
  }

  // Método para conectar explícitamente a la base de datos
  static connect() {
    return mongoose.connect(config.mongoUrl, {
      dbName: config.mongoDBName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}
