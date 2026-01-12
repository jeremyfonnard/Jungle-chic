const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const products = [
  {
    id: uuidv4(),
    name: "Maillot Tropical Eden",
    description: "Maillot une pièce élégant avec imprimé feuilles tropicales. Coupe flatteuse et tissu haute qualité résistant au chlore.",
    price: 89.00,
    images: [
      "https://images.unsplash.com/photo-1623114857732-02a86271e09f?w=800",
      "https://images.unsplash.com/photo-1623114857732-02a86271e09f?w=800&h=1000&fit=crop"
    ],
    category: "one-piece",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vert jungle", "Noir", "Beige"],
    stock: {
      "XS-Vert jungle": 10,
      "S-Vert jungle": 15,
      "M-Vert jungle": 20,
      "L-Vert jungle": 15,
      "XL-Vert jungle": 10
    },
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Bikini Feuillage Doré",
    description: "Bikini deux pièces avec motif feuilles dorées sur fond crème. Bandeau amovible et bretelles ajustables.",
    price: 75.00,
    images: [
      "https://images.unsplash.com/photo-1559582930-8a89933bae60?w=800"
    ],
    category: "bikini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Doré", "Vert forêt"],
    stock: {
      "XS-Doré": 8,
      "S-Doré": 12,
      "M-Doré": 15
    },
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Maillot Jungle Mystique",
    description: "Maillot une pièce avec découpes élégantes et imprimé jungle sophistiqué.",
    price: 95.00,
    images: ["https://images.unsplash.com/photo-1564051903-de6041e5ae75?w=800"],
    category: "one-piece",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vert émeraude", "Noir tropical"],
    stock: { "M-Vert émeraude": 18 },
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Bikini Palmes d'Or",
    description: "Ensemble bikini triangle avec imprimé palmes dorées.",
    price: 68.00,
    images: ["https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800"],
    category: "bikini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Sable doré", "Vert olive"],
    stock: { "M-Sable doré": 20 },
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Tankini Tropique Chic",
    description: "Tankini deux pièces avec haut long et bas taille haute.",
    price: 82.00,
    images: ["https://images.unsplash.com/photo-1566895291281-e72c3c6ce394?w=800"],
    category: "tankini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Vert jungle", "Terracotta"],
    stock: { "M-Vert jungle": 18 },
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Paréo Feuillage Élégant",
    description: "Paréo léger en voile imprimé feuilles tropicales.",
    price: 45.00,
    images: ["https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800"],
    category: "cover-up",
    sizes: ["Unique"],
    colors: ["Vert jungle", "Sable doré", "Terracotta"],
    stock: { "Unique-Vert jungle": 25 },
    featured: false,
    created_at: new Date().toISOString()
  }
];

async function seed() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.DB_NAME);

  console.log('Clearing existing products...');
  await db.collection('products').deleteMany({});

  console.log('Inserting products...');
  await db.collection('products').insertMany(products);

  console.log(`✓ Inserted ${products.length} products`);
  
  await client.close();
}

seed().catch(console.error);
