import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    basePrice: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
    variants: { type: DataTypes.JSON, defaultValue: [] }
});

export default Product;
