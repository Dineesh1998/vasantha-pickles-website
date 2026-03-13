import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.model.js';

const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
    items: { type: DataTypes.JSON, allowNull: false },
    shippingDetails: { type: DataTypes.JSON, allowNull: false },
    paymentMethod: { type: DataTypes.ENUM('card', 'upi', 'cod', 'razorpay'), allowNull: false },
    paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
    razorpayOrderId: { type: DataTypes.STRING },
    razorpayPaymentId: { type: DataTypes.STRING },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    shipping: { type: DataTypes.FLOAT, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Processing' }
});

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Order;
