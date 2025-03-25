import mongoose from 'mongoose';

let isconnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery',true);

    if(!process.env.MONGODB_URI) return console.log('MONGODB_URI is not defined');

    if(isconnected) return console.log(' => using existing database connection');

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        isconnected = true;

        console.log('MongoDB Connected');
    }catch(error){
        console.log(error)
    }

}

