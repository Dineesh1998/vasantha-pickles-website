import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'user.db',
  logging: false, // Set to true to see SQL queries
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ SQLite Database Connected`);
        
        // Sync models
        await sequelize.sync();
        console.log(`✅ Database synced`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1);
    }
};
