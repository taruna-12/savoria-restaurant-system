const { MenuItem } = require('../models');

// Get all menu items (Customer & Admin)
const getMenu = async (req, res) => {
  try {
    const { category, is_veg, search } = req.query;
    const whereClause = {};

    if (category) {
      whereClause.category = category;
    }
    if (is_veg !== undefined && is_veg !== '') {
      whereClause.is_veg = is_veg === 'true';
    }

    let items = await MenuItem.findAll({
      where: whereClause,
      order: [['category', 'ASC'], ['item_name', 'ASC']]
    });

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(item =>
        item.item_name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('getMenu error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch menu items.' });
  }
};

// Create Menu Item (Admin)
const createMenuItem = async (req, res) => {
  try {
    const { item_name, category, price, is_available, description, is_veg, dietary_tags, image_url } = req.body;

    if (!item_name || !category || price === undefined) {
      return res.status(400).json({ success: false, message: 'Item name, category, and price are required.' });
    }

    const newItem = await MenuItem.create({
      item_name,
      category,
      price: parseFloat(price),
      is_available: is_available !== undefined ? is_available : true,
      description: description || '',
      is_veg: is_veg !== undefined ? is_veg : true,
      dietary_tags: dietary_tags || '',
      image_url: image_url || ''
    });

    return res.status(201).json({ success: true, message: 'Menu item created successfully!', item: newItem });
  } catch (error) {
    console.error('createMenuItem error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create menu item.' });
  }
};

// Update Menu Item (Admin)
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, category, price, is_available, description, is_veg, dietary_tags, image_url } = req.body;

    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    if (item_name) item.item_name = item_name;
    if (category) item.category = category;
    if (price !== undefined) item.price = parseFloat(price);
    if (is_available !== undefined) item.is_available = is_available;
    if (description !== undefined) item.description = description;
    if (is_veg !== undefined) item.is_veg = is_veg;
    if (dietary_tags !== undefined) item.dietary_tags = dietary_tags;
    if (image_url !== undefined) item.image_url = image_url;

    await item.save();

    return res.json({ success: true, message: 'Menu item updated successfully!', item });
  } catch (error) {
    console.error('updateMenuItem error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update menu item.' });
  }
};

// Delete Menu Item (Admin)
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    await item.destroy();
    return res.json({ success: true, message: 'Menu item deleted successfully!' });
  } catch (error) {
    console.error('deleteMenuItem error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete menu item.' });
  }
};

module.exports = {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};
