import User from '../models/User.model.js';
import { v4 as uuidv4 } from 'uuid';

// @desc   Get all saved addresses for logged-in user
// @route  GET /api/addresses
// @access Private
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: ['addresses'] });
        res.json({ success: true, addresses: user.addresses || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Add a new address
// @route  POST /api/addresses
// @access Private
export const addAddress = async (req, res) => {
    try {
        const { firstName, lastName, address, city, zipCode, phone } = req.body;

        const user = await User.findByPk(req.user.id);
        const addresses = user.addresses || [];

        // Check for duplicate address
        const duplicate = addresses.find(
            a => a.address === address && a.city === city && a.zipCode === zipCode
        );
        if (duplicate) {
            return res.status(409).json({ success: false, message: 'This address is already saved.' });
        }

        const newAddress = { id: uuidv4(), firstName, lastName, address, city, zipCode, phone, createdAt: new Date() };
        
        addresses.push(newAddress);
        await user.update({ addresses });

        res.status(201).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Delete a saved address
// @route  DELETE /api/addresses/:addressId
// @access Private
export const deleteAddress = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const addresses = (user.addresses || []).filter(
            a => a.id !== req.params.addressId && a._id !== req.params.addressId
        );
        
        await user.update({ addresses });
        
        res.json({ success: true, message: 'Address removed.', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
