import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

products = [
    {
        "id": str(uuid.uuid4()),
        "name": "Maillot Tropical Eden",
        "description": "Maillot une pièce élégant avec imprimé feuilles tropicales. Coupe flatteuse et tissu haute qualité résistant au chlore.",
        "price": 89.00,
        "images": [
            "https://images.unsplash.com/photo-1623114857732-02a86271e09f?w=800",
            "https://images.unsplash.com/photo-1623114857732-02a86271e09f?w=800&h=1000&fit=crop"
        ],
        "category": "one-piece",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Vert jungle", "Noir", "Beige"],
        "stock": {
            "XS-Vert jungle": 10,
            "S-Vert jungle": 15,
            "M-Vert jungle": 20,
            "L-Vert jungle": 15,
            "XL-Vert jungle": 10,
            "XS-Noir": 10,
            "S-Noir": 15,
            "M-Noir": 20,
            "L-Noir": 15,
            "XL-Noir": 10
        },
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bikini Feuillage Doré",
        "description": "Bikini deux pièces avec motif feuilles dorées sur fond crème. Bandeau amovible et bretelles ajustables.",
        "price": 75.00,
        "images": [
            "https://images.unsplash.com/photo-1559582930-8a89933bae60?w=800",
            "https://images.unsplash.com/photo-1559582930-8a89933bae60?w=800&h=1000&fit=crop"
        ],
        "category": "bikini",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Doré", "Vert forêt"],
        "stock": {
            "XS-Doré": 8,
            "S-Doré": 12,
            "M-Doré": 15,
            "L-Doré": 12,
            "XL-Doré": 8
        },
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Maillot Jungle Mystique",
        "description": "Maillot une pièce avec découpes élégantes et imprimé jungle sophistiqué. Effet sculptant et soutien optimal.",
        "price": 95.00,
        "images": [
            "https://images.unsplash.com/photo-1564051903-de6041e5ae75?w=800",
            "https://images.unsplash.com/photo-1564051903-de6041e5ae75?w=800&h=1000&fit=crop"
        ],
        "category": "one-piece",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Vert émeraude", "Noir tropical"],
        "stock": {
            "XS-Vert émeraude": 10,
            "S-Vert émeraude": 15,
            "M-Vert émeraude": 18,
            "L-Vert émeraude": 15,
            "XL-Vert émeraude": 10
        },
        "featured": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bikini Palmes d'Or",
        "description": "Ensemble bikini triangle avec imprimé palmes dorées. Tissu doux et confortable, séchage rapide.",
        "price": 68.00,
        "images": [
            "https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800",
            "https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800&h=1000&fit=crop"
        ],
        "category": "bikini",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Sable doré", "Vert olive"],
        "stock": {
            "XS-Sable doré": 12,
            "S-Sable doré": 18,
            "M-Sable doré": 20,
            "L-Sable doré": 15,
            "XL-Sable doré": 10
        },
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Tankini Tropique Chic",
        "description": "Tankini deux pièces avec haut long flatteuse et bas taille haute. Parfait pour un confort optimal.",
        "price": 82.00,
        "images": [
            "https://images.unsplash.com/photo-1566895291281-e72c3c6ce394?w=800",
            "https://images.unsplash.com/photo-1566895291281-e72c3c6ce394?w=800&h=1000&fit=crop"
        ],
        "category": "tankini",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Vert jungle", "Terracotta"],
        "stock": {
            "XS-Vert jungle": 10,
            "S-Vert jungle": 15,
            "M-Vert jungle": 18,
            "L-Vert jungle": 15,
            "XL-Vert jungle": 12
        },
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Paréo Feuillage Élégant",
        "description": "Paréo léger en voile imprimé feuilles tropicales. Peut se porter de multiples façons, parfait pour la plage.",
        "price": 45.00,
        "images": [
            "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800",
            "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop"
        ],
        "category": "cover-up",
        "sizes": ["Unique"],
        "colors": ["Vert jungle", "Sable doré", "Terracotta"],
        "stock": {
            "Unique-Vert jungle": 25,
            "Unique-Sable doré": 20,
            "Unique-Terracotta": 15
        },
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Maillot Cascade Verte",
        "description": "Maillot une pièce avec dégradé vert forêt. Décolleté plongeant et dos nageur pour un look sportif chic.",
        "price": 92.00,
        "images": [
            "https://images.unsplash.com/photo-1551799804-c6f26e2e9f7c?w=800",
            "https://images.unsplash.com/photo-1551799804-c6f26e2e9f7c?w=800&h=1000&fit=crop"
        ],
        "category": "one-piece",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Vert cascade", "Bleu lagon"],
        "stock": {
            "XS-Vert cascade": 10,
            "S-Vert cascade": 15,
            "M-Vert cascade": 20,
            "L-Vert cascade": 15,
            "XL-Vert cascade": 10
        },
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bikini Nature Sauvage",
        "description": "Bikini imprimé léopard vert et or. Bretelles croisées dans le dos et culotte taille haute.",
        "price": 78.00,
        "images": [
            "https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=800",
            "https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=800&h=1000&fit=crop"
        ],
        "category": "bikini",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Léopard vert", "Python doré"],
        "stock": {
            "XS-Léopard vert": 8,
            "S-Léopard vert": 12,
            "M-Léopard vert": 15,
            "L-Léopard vert": 12,
            "XL-Léopard vert": 8
        },
        "featured": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
]

async def seed_products():
    # Clear existing products
    await db.products.delete_many({})
    print("Cleared existing products")
    
    # Insert new products
    result = await db.products.insert_many(products)
    print(f"Inserted {len(result.inserted_ids)} products")
    
    # Show inserted products
    for product in products:
        print(f"- {product['name']}: {product['price']}€")
    
    client.close()

if __name__ == "__main__":
    print("Seeding products...")
    asyncio.run(seed_products())
    print("Done!")
