import { Product, DeliveryZone, TimeSlot } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Red Velvet Dream',
    description: 'Kue red velvet lembut dengan cream cheese frosting yang creamy dan taburan red velvet crumbs.',
    basePrice: 250000,
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80',
    category: 'Birthday Cake',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 75000 },
          { id: 'large', name: '24 cm (18-20 porsi)', priceAdd: 150000 },
        ],
      },
      {
        id: 'layer',
        name: 'Layer',
        options: [
          { id: '1layer', name: '1 Layer', priceAdd: 0 },
          { id: '2layer', name: '2 Layer', priceAdd: 100000 },
          { id: '3layer', name: '3 Layer', priceAdd: 200000 },
        ],
      },
      {
        id: 'topping',
        name: 'Topping',
        options: [
          { id: 'classic', name: 'Cream Cheese Classic', priceAdd: 0 },
          { id: 'berries', name: 'Fresh Berries', priceAdd: 50000 },
          { id: 'chocolate', name: 'Chocolate Drip', priceAdd: 35000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
      { id: 'photo', name: 'Foto Referensi', type: 'image', priceAdd: 25000, required: false },
    ],
  },
  {
    id: '2',
    name: 'Chocolate Ganache Supreme',
    description: 'Triple chocolate cake dengan dark chocolate ganache dan hiasan cokelat premium.',
    basePrice: 275000,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    category: 'Birthday Cake',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 85000 },
          { id: 'large', name: '24 cm (18-20 porsi)', priceAdd: 170000 },
        ],
      },
      {
        id: 'chocolate',
        name: 'Jenis Cokelat',
        options: [
          { id: 'dark', name: 'Dark Chocolate 70%', priceAdd: 0 },
          { id: 'milk', name: 'Milk Chocolate', priceAdd: 0 },
          { id: 'white', name: 'White Chocolate', priceAdd: 20000 },
        ],
      },
      {
        id: 'topping',
        name: 'Topping',
        options: [
          { id: 'ganache', name: 'Ganache Drip', priceAdd: 0 },
          { id: 'gold', name: 'Gold Flakes', priceAdd: 75000 },
          { id: 'oreo', name: 'Oreo Crumble', priceAdd: 30000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
      { id: 'photo', name: 'Foto Referensi', type: 'image', priceAdd: 25000, required: false },
    ],
  },
  {
    id: '3',
    name: 'Strawberry Blossom',
    description: 'Sponge cake lembut dengan fresh strawberry dan whipped cream yang ringan.',
    basePrice: 225000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
    category: 'Fruit Cake',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 70000 },
          { id: 'large', name: '24 cm (18-20 porsi)', priceAdd: 140000 },
        ],
      },
      {
        id: 'fruit',
        name: 'Pilihan Buah',
        options: [
          { id: 'strawberry', name: 'Strawberry', priceAdd: 0 },
          { id: 'mixed', name: 'Mixed Berries', priceAdd: 45000 },
          { id: 'mango', name: 'Mango & Passion Fruit', priceAdd: 35000 },
        ],
      },
      {
        id: 'cream',
        name: 'Jenis Cream',
        options: [
          { id: 'whipped', name: 'Whipped Cream', priceAdd: 0 },
          { id: 'cheese', name: 'Cream Cheese', priceAdd: 30000 },
          { id: 'mascarpone', name: 'Mascarpone', priceAdd: 45000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
    ],
  },
  {
    id: '4',
    name: 'Tiramisu Classic',
    description: 'Kue tiramisu autentik dengan espresso, mascarpone, dan taburan cocoa powder.',
    basePrice: 285000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
    category: 'Premium',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 90000 },
        ],
      },
      {
        id: 'coffee',
        name: 'Intensitas Kopi',
        options: [
          { id: 'regular', name: 'Regular', priceAdd: 0 },
          { id: 'strong', name: 'Extra Strong', priceAdd: 15000 },
          { id: 'decaf', name: 'Decaf', priceAdd: 20000 },
        ],
      },
      {
        id: 'topping',
        name: 'Topping',
        options: [
          { id: 'cocoa', name: 'Cocoa Powder', priceAdd: 0 },
          { id: 'chocolate', name: 'Chocolate Shavings', priceAdd: 25000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
    ],
  },
  {
    id: '5',
    name: 'Rainbow Unicorn',
    description: 'Kue warna-warni dengan buttercream lembut, perfect untuk pesta anak-anak.',
    basePrice: 300000,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600&q=80',
    category: 'Kids',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 100000 },
          { id: 'large', name: '24 cm (18-20 porsi)', priceAdd: 200000 },
        ],
      },
      {
        id: 'theme',
        name: 'Tema',
        options: [
          { id: 'unicorn', name: 'Unicorn', priceAdd: 0 },
          { id: 'princess', name: 'Princess', priceAdd: 50000 },
          { id: 'superhero', name: 'Superhero', priceAdd: 50000 },
        ],
      },
      {
        id: 'topping',
        name: 'Hiasan',
        options: [
          { id: 'fondant', name: 'Fondant Decorations', priceAdd: 0 },
          { id: 'edible', name: 'Edible Photo', priceAdd: 75000 },
          { id: 'toppers', name: 'Premium Toppers', priceAdd: 100000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
      { id: 'photo', name: 'Foto Referensi', type: 'image', priceAdd: 25000, required: false },
    ],
  },
  {
    id: '6',
    name: 'Cheesecake New York',
    description: 'Creamy New York style cheesecake dengan graham cracker base.',
    basePrice: 265000,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&q=80',
    category: 'Premium',
    isAvailable: true,
    variations: [
      {
        id: 'size',
        name: 'Ukuran',
        options: [
          { id: 'small', name: '16 cm (8-10 porsi)', priceAdd: 0 },
          { id: 'medium', name: '20 cm (12-15 porsi)', priceAdd: 80000 },
        ],
      },
      {
        id: 'flavor',
        name: 'Rasa',
        options: [
          { id: 'original', name: 'Original', priceAdd: 0 },
          { id: 'blueberry', name: 'Blueberry', priceAdd: 40000 },
          { id: 'matcha', name: 'Matcha', priceAdd: 35000 },
        ],
      },
      {
        id: 'topping',
        name: 'Topping',
        options: [
          { id: 'plain', name: 'Plain', priceAdd: 0 },
          { id: 'berries', name: 'Mixed Berries', priceAdd: 50000 },
          { id: 'caramel', name: 'Salted Caramel', priceAdd: 35000 },
        ],
      },
    ],
    customOptions: [
      { id: 'greeting', name: 'Teks Ucapan', type: 'text', priceAdd: 0, required: false },
    ],
  },
];

export const deliveryZones: DeliveryZone[] = [
  { id: 'zona-a', name: 'Zona A', minDistance: 0, maxDistance: 3, price: 15000, minOrder: 0 },
  { id: 'zona-b', name: 'Zona B', minDistance: 3, maxDistance: 6, price: 25000, minOrder: 200000 },
  { id: 'zona-c', name: 'Zona C', minDistance: 6, maxDistance: 10, price: 40000, minOrder: 350000 },
];

export const maxDeliveryDistance = 10; // km

export const timeSlots: TimeSlot[] = [
  { id: '1', time: '09:00 - 10:00', available: true },
  { id: '2', time: '10:00 - 11:00', available: true },
  { id: '3', time: '11:00 - 12:00', available: true },
  { id: '4', time: '13:00 - 14:00', available: true },
  { id: '5', time: '14:00 - 15:00', available: true },
  { id: '6', time: '15:00 - 16:00', available: true },
  { id: '7', time: '16:00 - 17:00', available: true },
];

export const cutOffHours = 12; // 12 jam sebelum pengiriman

export const storeLocation = {
  latitude: -6.2088,
  longitude: 106.8456,
  address: 'Jl. Sudirman No. 123, Jakarta Pusat',
};

export const bankAccounts = [
  { bank: 'BCA', accountNumber: '1234567890', accountName: 'Toko Kue Manis' },
  { bank: 'Mandiri', accountNumber: '0987654321', accountName: 'Toko Kue Manis' },
  { bank: 'BNI', accountNumber: '1122334455', accountName: 'Toko Kue Manis' },
];

export const categories = ['Semua', 'Birthday Cake', 'Fruit Cake', 'Premium', 'Kids'];
