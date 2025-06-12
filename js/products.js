// Product Data 
const productsData = {
  categories: [
    {
      id: "pharmacy",
      name: "Pharmacies",
      products: [
        {
          id: "p1",
          name: "HealthCo Pharmacy",
          rating: 4.5,
          image : "https://images.pexels.com/photos/20017412/pexels-photo-20017412/free-photo-of-a-retail-clerk-in-a-store.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          medicines: [
            {
              id: "m1",
              name: "Paracetamol 500mg",
              price: 5.99,
              image: "./images/paracetamol.jpeg",
              description: "Pain and fever reliever. 20 tablets.",
              manufacturer: "HealthCo Pharmaceuticals",
              dosage: "1-2 tablets every 6 hours",
              expiry: "12/2024"
            },
            {
              id: "m2",
              name: "Ibuprofen 200mg",
              price: 7.5,
              image: "data:image/jpeg;base64,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",
              description: "Reduces pain, swelling, and fever.",
              manufacturer: "MedLife Inc.",
              dosage: "1 tablet every 4-6 hours",
              expiry: "06/2025"
            },
            {
              id: "m3",
              name: "Vitamin C 1000mg",
              price: 6.25,
              image: "./images/VitaminC1000mg.jpg",
              description: "Immune booster dietary supplement.",
              manufacturer: "NutriWell Labs",
              dosage: "1 tablet daily",
              expiry: "09/2025"
            },
            {
              id: "m4",
              name: "Cetirizine 10mg",
              price: 4.75,
              image: "./images/Cetirizine 10mg.webp",
              description: "Allergy relief tablet.",
              manufacturer: "AllergyRelief Corp.",
              dosage: "1 tablet daily",
              expiry: "08/2025"
            },
            {
              id: "m5",
              name: "Omeprazole 20mg",
              price: 8.0,
              image: "./images/Omeprazole 20mg.jpeg",
              description: "Reduces stomach acid production.",
              manufacturer: "GastroHeal Pharma",
              dosage: "1 capsule before meal",
              expiry: "05/2026"
            }
          ]
        },
        {
          id: "p2",
          name: "Global Pharma Store",
          rating: 4.7,
          image : "https://images.pexels.com/photos/19943230/pexels-photo-19943230/free-photo-of-a-pharmacy-sign-hanging-from-a-building.jpeg?auto=compress&cs=tinysrgb&w=600",
          medicines: [
            {
              id: "m6",
              name: "Amoxicillin 500mg",
              price: 12.99,
              image: "./images/Amoxicillin 500mg.webp",
              description: "Antibiotic for bacterial infections.",
              manufacturer: "Global Pharma",
              dosage: "1 capsule every 8 hours",
              expiry: "03/2026"
            },
            {
              id: "m7",
              name: "Loperamide 2mg",
              price: 3.5,
              image: "./images/Loperamide 2mg.jpg",
              description: "Used for diarrhea control.",
              manufacturer: "DigestCare Labs",
              dosage: "2 capsules initially, then 1 after each loose stool",
              expiry: "11/2024"
            },
            {
              id: "m8",
              name: "Aspirin 81mg",
              price: 4.25,
              image: "./images/Aspirin 81mg.avif",
              description: "Heart protection low-dose aspirin.",
              manufacturer: "CardioCare Inc.",
              dosage: "1 tablet daily",
              expiry: "02/2025"
            },
            {
              id: "m9",
              name: "Calcium D3 Tablets",
              price: 6.99,
              image: "data:image/jpeg;base64,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",
              description: "Supports bone health and strength.",
              manufacturer: "BoneWell Labs",
              dosage: "1 tablet daily",
              expiry: "10/2025"
            },
            {
              id: "m10",
              name: "Zinc Sulphate",
              price: 3.99,
              image: "data:image/jpeg;base64,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",
              description: "Boosts immunity and wound healing.",
              manufacturer: "Wellcare Health",
              dosage: "1 tablet daily",
              expiry: "12/2025"
            }
          ]
        },
        {
          id: "p3",
          name: "MediQuick",
          image : "https://images.pexels.com/photos/3652750/pexels-photo-3652750.jpeg?auto=compress&cs=tinysrgb&w=600",
          rating: 4.6,
          medicines: [
            {
              id: "m11",
              name: "Azithromycin 250mg",
              price: 9.5,
              image: "https://c7.alamy.com/comp/2H24HYD/azithromycin-250mg-film-coated-tablets-accord-brand-photo-only-no-product-sent-uk-2H24HYD.jpg",
              description: "Antibiotic for throat and lung infections.",
              manufacturer: "QuickMed",
              dosage: "1 tablet daily for 3 days",
              expiry: "07/2025"
            },
            {
              id: "m12",
              name: "Loratadine 10mg",
              price: 4.1,
              image: "https://c7.alamy.com/comp/2HH6JYM/10mg-loratadine-tablets-used-for-the-relief-of-hay-fever-and-other-allergies-2HH6JYM.jpg",
              description: "Non-drowsy allergy relief.",
              manufacturer: "AllerFree",
              dosage: "1 tablet daily",
              expiry: "01/2026"
            },
            {
              id: "m13",
              name: "Folic Acid 5mg",
              price: 2.5,
              image: "https://c7.alamy.com/comp/BGR606/folic-acid-vitamin-bottle-with-tablets-on-white-background-BGR606.jpg",
              description: "Supports red blood cell formation.",
              manufacturer: "NutraLife",
              dosage: "1 tablet daily",
              expiry: "04/2026"
            },
            {
              id: "m14",
              name: "Pantoprazole 40mg",
              price: 6.0,
              image: "https://c8.alamy.com/comp/BY0R4C/pantoprazole-tablets-BY0R4C.jpg",
              description: "Treats acid reflux and ulcers.",
              manufacturer: "AcidAway",
              dosage: "1 tablet before meal",
              expiry: "08/2026"
            },
            {
              id: "m15",
              name: "Iron Supplement Tablets",
              price: 5.2,
              image: "https://c7.alamy.com/comp/B8N0RY/iron-supplement-B8N0RY.jpg",
              description: "For treating iron deficiency anemia.",
              manufacturer: "RedCell Pharma",
              dosage: "1 tablet daily with food",
              expiry: "09/2026"
            }
          ]
        }
      ]
    },
    {
      id: "restaurant",
      name: "Restaurants",
      products: [
        {
          id: "r1",
          name: "Burger Haven",
          rating: 4.4 ,
          foods: [
            {
              id: "f1",
              name: "Grilled Chicken Burger",
              price: 6.99,
              image: "./images/Grilled Chicken Burger.jpg", // Original filename
              description: "Juicy grilled chicken breast with fresh lettuce, tomato, and special sauce on a toasted brioche bun.",
              calories: "550 kcal",
              preparation: "10-15 minutes"
            },
            {
              id: "cf1",
              name: "Cheese Fries",
              price: 4.5,
              image: "./images/Cheese Fries.webp", // Original filename
              description: "Crispy fries topped with melted cheese.",
              calories: "450 kcal",
              preparation: "5 minutes"
            },
            {
              id: "cf2",
              name: "Onion Rings",
              price: 3.99,
              image: "./images/Onion Rings.jpeg", // Original filename
              description: "Crispy, golden-brown onion rings.",
              calories: "380 kcal",
              preparation: "7 minutes"
            },
            {
              id: "cf3",
              name: "Coleslaw",
              price: 2.99,
              image: "./images/Coleslaw.jpg", // Original filename
              description: "Creamy, tangy coleslaw with fresh cabbage.",
              calories: "150 kcal",
              preparation: "5 minutes"
            },
            {
              id: "cf4",
              name: "French Fries",
              price: 2.5,
              image: "./images/French Fries.jpg",
              description: "Classic golden French fries.",
              calories: "350 kcal",
              preparation: "5 minutes"
            }
          ]
        },
        {
          id: "r2",
          name: "China Town",
          rating: 5 ,
          foods: [
            {
              id: "ct1",
              name: "Kung Pao Chicken",
              price: 11.99,
              image: "./images/KUNGPAO.jpg",
              description: "Spicy stir-fried chicken with peanuts, vegetables, and chili peppers.",
              calories: "620 kcal",
              preparation: "15-20 minutes"
            },
            {
              id: "ct2",
              name: "Beef with Broccoli",
              price: 12.99,
              image: "./images/Beef with Broccoli.jpg",
              description: "Tender beef slices stir-fried with fresh broccoli in garlic sauce.",
              calories: "580 kcal",
              preparation: "15 minutes"
            },
            {
              id: "ct3",
              name: "Vegetable Spring Rolls",
              price: 5.99,
              image: "./images/Vegetable Spring Rolls.jpg",
              description: "Crispy rolls filled with fresh vegetables, served with sweet chili sauce.",
              calories: "320 kcal",
              preparation: "10 minutes"
            },
            {
              id: "ct4",
              name: "Pork Dumplings",
              price: 7.50,
              image: "./images/Pork Dumplings.webp",
              description: "Steamed dumplings filled with seasoned pork and vegetables.",
              calories: "450 kcal",
              preparation: "12 minutes"
            },
            {
              id: "ct5",
              name: "Egg Fried Rice",
              price: 8.99,
              image: "./images/Egg Fried Rice.jpg",
              description: "Classic fried rice with scrambled egg, green onions, and soy sauce.",
              calories: "520 kcal",
              preparation: "10 minutes"
            }
          ]
        },
        {
          id: "r3",
          name: "Bella Italia",
          rating: 5 ,
          foods: [
            {
              id: "it1",
              name: "Margherita Pizza",
              price: 12.99,
              image: "./images/Margherita Pizza.jpg",
              description: "Classic Neapolitan pizza with tomato sauce, fresh mozzarella, and basil.",
              calories: "850 kcal",
              preparation: "15-20 minutes"
            },
            {
              id: "it2",
              name: "Spaghetti Carbonara",
              price: 14.50,
              image: "./images/Spaghetti Carbonara.jpg",
              description: "Traditional Roman pasta with eggs, cheese, pancetta, and black pepper.",
              calories: "780 kcal",
              preparation: "15 minutes"
            },
            {
              id: "it3",
              name: "Chicken Parmesan",
              price: 16.99,
              image: "./images/Chicken Parmesan.jpg",
              description: "Breaded chicken breast topped with marinara sauce and melted mozzarella.",
              calories: "920 kcal",
              preparation: "20 minutes"
            },
            {
              id: "it4",
              name: "Tiramisu",
              price: 7.99,
              image: "./images/TIRAMISU.webp",
              description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
              calories: "450 kcal",
              preparation: "10 minutes"
            },
            {
              id: "it5",
              name: "Minestrone Soup",
              price: 6.50,
              image: "./images/Minestrone Soup.jpg",
              description: "Hearty vegetable soup with beans, pasta, and fresh herbs.",
              calories: "320 kcal",
              preparation: "12 minutes"
            }
          ]
        }
      ]
    }
  ]
};

// ✅ Clear old data (only in development)
try {
  // Remove this line in production if you don't want products reset every time
  localStorage.removeItem('products');

  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(productsData));
    console.log("✅ Product data initialized.");
  } else {
    console.log("ℹ️ Product data already exists in localStorage.");
  }
} catch (error) {
  console.error('❌ Failed to initialize products:', error);
}