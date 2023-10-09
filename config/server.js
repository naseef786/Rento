const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database Atlas');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

module.exports = connect;
