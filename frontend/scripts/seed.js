const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: '.env.local' });

const products = [
  {
    id: uuidv4(),
    name: "Maillot Corail Sun",
    description: "Maillot une pièce élégant aux teintes corail. Coupe flatteuse et tissu haute qualité résistant au chlore.",
    price: 89.00,
    images: [
      "https://images.unsplash.com/photo-1619516962669-49187abe3893?w=800",
      "https://images.unsplash.com/photo-1619516962669-49187abe3893?w=800&h=1000&fit=crop"
    ],
    category: "one-piece",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Corail", "Bleu océan", "Sable"],
    stock: {
      "XS-Corail": 10,
      "S-Corail": 15,
      "M-Corail": 20,
      "L-Corail": 15,
      "XL-Corail": 10
    },
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Bikini Plage Doré",
    description: "Bikini deux pièces aux tons sable et turquoise. Bandeau amovible et bretelles ajustables.",
    price: 75.00,
    images: [
      "https://images.unsplash.com/photo-1619516954192-9559f9b1e1d2?w=800"
    ],
    category: "bikini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Doré", "Turquoise"],
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
    name: "Maillot Ocean Wave",
    description: "Maillot une pièce avec découpes élégantes aux couleurs de l'océan.",
    price: 95.00,
    images: ["https://images.unsplash.com/photo-1619516993759-78bb24b71321?w=800"],
    category: "one-piece",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Bleu turquoise", "Blanc perle"],
    stock: { "M-Bleu turquoise": 18 },
    featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Bikini Sunset Beach",
    description: "Ensemble bikini triangle aux teintes chaudes du coucher de soleil.",
    price: 68.00,
    images: ["https://images.pexels.com/photos/14019729/pexels-photo-14019729.jpeg?w=800"],
    category: "bikini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Corail rosé", "Pêche"],
    stock: { "M-Corail rosé": 20 },
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Tankini Azure",
    description: "Tankini deux pièces avec haut long et bas taille haute, inspiré des lagons.",
    price: 82.00,
    images: ["https://images.pexels.com/photos/14019537/pexels-photo-14019537.jpeg?w=800"],
    category: "tankini",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Bleu lagon", "Corail"],
    stock: { "M-Bleu lagon": 18 },
    featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Paréo Vagues d'Été",
    description: "Paréo léger en voile aux motifs ondulés évoquant les vagues.",
    price: 45.00,
    images: ["https://images.unsplash.com/photo-1619516893851-f3fa70cec43f?w=800"],
    category: "cover-up",
    sizes: ["Unique"],
    colors: ["Turquoise", "Sable", "Corail"],
    stock: { "Unique-Turquoise": 25 },
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
