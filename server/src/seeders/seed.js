const bcrypt = require('bcryptjs');
const { sequelize, User, Table, MenuItem, Reservation, Order, OrderItem } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('✅ Database models synchronized cleanly.');

    // 1. Create Default Users (Salt = 10)
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const customerPasswordHash = await bcrypt.hash('customer123', 10);

    const admin = await User.create({
      name: 'Executive Chef Admin',
      email: 'admin@savoria.com',
      phone: '+1 (555) 019-2834',
      password_hash: adminPasswordHash,
      role: 'Admin',
      dietary_preferences: 'Chef Specialty'
    });

    const customer = await User.create({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      phone: '+1 (555) 987-6543',
      password_hash: customerPasswordHash,
      role: 'Customer',
      dietary_preferences: 'Gluten-Free, Vegetarian Options'
    });

    console.log('✅ Users seeded successfully (Admin: admin@savoria.com / admin123, Customer: alex@example.com / customer123)');

    // 2. Create Restaurant Tables
    const tablesData = [
      { table_number: '101', capacity: 2, location_zone: 'Indoor', is_active: true },
      { table_number: '102', capacity: 2, location_zone: 'Indoor', is_active: true },
      { table_number: '103', capacity: 4, location_zone: 'Indoor', is_active: true },
      { table_number: '104', capacity: 4, location_zone: 'Indoor', is_active: true },
      { table_number: '105', capacity: 6, location_zone: 'Indoor', is_active: true },
      { table_number: '201', capacity: 2, location_zone: 'Patio', is_active: true },
      { table_number: '202', capacity: 4, location_zone: 'Patio', is_active: true },
      { table_number: '203', capacity: 4, location_zone: 'Patio', is_active: true },
      { table_number: '301', capacity: 2, location_zone: 'Balcony', is_active: true },
      { table_number: '302', capacity: 4, location_zone: 'Balcony', is_active: true },
      { table_number: '401', capacity: 8, location_zone: 'Private Lounge', is_active: true },
      { table_number: '402', capacity: 10, location_zone: 'Private Lounge', is_active: false } // Under maintenance demo
    ];

    const tables = await Table.bulkCreate(tablesData);
    console.log(`✅ ${tables.length} tables seeded across Indoor, Patio, Balcony, and Private Lounge zones.`);

    // 3. Create Menu Items
    const menuData = [
      // Starters
      {
        item_name: 'Truffle Mushroom Bruschetta',
        category: 'Starters',
        price: 14.50,
        is_available: true,
        description: 'Artisanal sourdough topped with sautéed wild mushrooms, white truffle oil, and aged parmesan.',
        is_veg: true,
        dietary_tags: 'Vegetarian, Chef Special',
        image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Charred Octopus Tentacle',
        category: 'Starters',
        price: 18.00,
        is_available: true,
        description: 'Spanish octopus, smoked paprika potato purée, caper berries, and citrus olive reduction.',
        is_veg: false,
        dietary_tags: 'Seafood, Gluten-Free',
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Crispy Artisan Burrata',
        category: 'Starters',
        price: 16.00,
        is_available: true,
        description: 'Pugliese burrata cheese served with heirloom tomato carpaccio, fresh basil emulsion, and balsamic drizzle.',
        is_veg: true,
        dietary_tags: 'Vegetarian',
        image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19657?auto=format&fit=crop&w=600&q=80'
      },

      // Mains
      {
        item_name: 'Filet Mignon Rossini',
        category: 'Mains',
        price: 38.50,
        is_available: true,
        description: '8oz prime Angus beef tenderloin, seared foie gras, truffle reduction, and duck fat pomme purée.',
        is_veg: false,
        dietary_tags: 'Signature Dish',
        image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Wild Saffron & Porcini Risotton',
        category: 'Mains',
        price: 26.00,
        is_available: true,
        description: 'Acquerello carnaroli rice infused with Iranian saffron, roasted porcini, and 24-month Parmigiano Reggiano.',
        is_veg: true,
        dietary_tags: 'Vegetarian, Gluten-Free',
        image_url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Pan-Seared Chilean Sea Bass',
        category: 'Mains',
        price: 36.00,
        is_available: true,
        description: 'Sustainably caught Chilean sea bass in a lemongrass lemon-butter emulsion with wilted baby spinach.',
        is_veg: false,
        dietary_tags: 'Gluten-Free, Seafood',
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Handcrafted Truffle Tagliatelle',
        category: 'Mains',
        price: 28.00,
        is_available: true,
        description: 'Fresh egg pasta tossed in cultured butter, shaved black winter truffles, and cracked black pepper.',
        is_veg: true,
        dietary_tags: 'Vegetarian',
        image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281286?auto=format&fit=crop&w=600&q=80'
      },

      // Desserts
      {
        item_name: 'Deconstructed Tiramisu Sphere',
        category: 'Desserts',
        price: 13.00,
        is_available: true,
        description: 'Valrhona dark chocolate shell, espresso-soaked savoiardi, mascarpone cream, and gold leaf dust.',
        is_veg: true,
        dietary_tags: 'Vegetarian, Chef Special',
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Madagascar Vanilla Bean Panna Cotta',
        category: 'Desserts',
        price: 11.50,
        is_available: true,
        description: 'Silky vanilla panna cotta topped with wild berry coulis and candied mint leaves.',
        is_veg: true,
        dietary_tags: 'Gluten-Free',
        image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
      },

      // Beverages
      {
        item_name: 'Smoked Bourbon Old Fashioned',
        category: 'Beverages',
        price: 16.00,
        is_available: true,
        description: 'Single barrel Kentucky bourbon, Angostura bitters, orange peel mist, infused with applewood smoke.',
        is_veg: true,
        dietary_tags: 'Alcoholic Cocktail',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80'
      },
      {
        item_name: 'Artisan Passionfruit Sparkler',
        category: 'Beverages',
        price: 9.00,
        is_available: true,
        description: 'Fresh passionfruit pulp, lime juice, mint syrup, topped with sparkling mineral water.',
        is_veg: true,
        dietary_tags: 'Mocktail, Vegan',
        image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80'
      }
    ];

    const menuItems = await MenuItem.bulkCreate(menuData);
    console.log(`✅ ${menuItems.length} menu items seeded.`);

    // 4. Create Sample Demo Reservations & Orders for initial view
    const today = new Date().toISOString().split('T')[0];

    const demoRes = await Reservation.create({
      reservation_token: 'RES-892104',
      user_id: customer.user_id,
      table_id: tables[2].table_id, // Table 103 (Indoor, cap 4)
      res_date: today,
      time_slot: '19:00',
      guest_count: 3,
      status: 'CONFIRMED',
      special_requests: 'Anniversary celebration. Quiet table preferred.'
    });

    const demoOrder = await Order.create({
      order_number: 'ORD-554109',
      user_id: customer.user_id,
      reservation_id: demoRes.reservation_id,
      subtotal: 68.50,
      tax_amount: 3.43,
      total_amount: 71.93,
      order_status: 'PREPARING',
      notes: 'Please serve starters first.'
    });

    await OrderItem.create({
      order_id: demoOrder.order_id,
      item_id: menuItems[0].item_id, // Bruschetta
      quantity: 1,
      unit_price: 14.50,
      customizations: 'Extra parmesan'
    });

    await OrderItem.create({
      order_id: demoOrder.order_id,
      item_id: menuItems[3].item_id, // Filet Mignon
      quantity: 1,
      unit_price: 38.50,
      customizations: 'Medium rare'
    });

    await OrderItem.create({
      order_id: demoOrder.order_id,
      item_id: menuItems[9].item_id, // Cocktail
      quantity: 1,
      unit_price: 16.00,
      customizations: ''
    });

    console.log('✅ Demo reservations and kitchen orders seeded.');
    console.log('🎉 Seed database completed successfully!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = seedDatabase;
