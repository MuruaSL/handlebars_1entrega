import mongoose from "mongoose"
export default class MongoSingleton{

    static #instance

    constructor(){
        mongoose.connect("mongodb+srv://leonardomurua:Dd40521547-4618@clusterleonardo.hg2jvxi.mongodb.net/",{
            dbName:"ecommerse"})
        .then(()=>{
            console.log("Db connected")
        })
        .catch(e => console.log(e))
    }

    static getInstance(){

        if (this.#instance) {
            console.log("already connected")
            return this.#instance
        }
            
        this.#instance = new MongoSingleton()
        return this.#instance
    }
}

MongoSingleton.getInstance()


