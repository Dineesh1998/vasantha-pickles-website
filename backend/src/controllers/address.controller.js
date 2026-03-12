import User from '../models/User.model.js';

// @desc   Get all saved addresses for logged-in user
// @route  GET /api/addresses
// @access Private
export const getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('addresses');
        res.json({ success: true, addresses: user.addresses });
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

        const user = await User.findById(req.user._id);

        // Check for duplicate address
        const duplicate = user.addresses.find(
            a => a.address === address && a.city === city && a.zipCode === zipCode
        );
        if (duplicate) {
            return res.status(409).json({ success: false, message: 'This address is already saved.' });
        }

        user.addresses.push({ firstName, lastName, address, city, zipCode, phone });
        await user.save();

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
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(
            a => a._id.toString() !== req.params.addressId
        );
        await user.save();
        res.json({ success: true, message: 'Address removed.', addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
