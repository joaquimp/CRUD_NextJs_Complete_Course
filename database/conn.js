import mongoose from 'mongoose';

const connectMongo = async () => {
    try {
        console.log("Conectando: ", process.env.MONGO_URI || 'mongodb+srv://joaquim:1458691010@cluster0.nyase.mongodb.net/?retryWrites=true&w=majority');
        const { connection } = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://joaquim:1458691010@cluster0.nyase.mongodb.net/?retryWrites=true&w=majority')

        if (connection.readyState == 1) {
            console.log("Database Connected")
        }

    } catch (errors) {
        return Promise.reject(errors)
    }
}

export default connectMongo;