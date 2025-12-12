import { Product, Review, User, Order, Address, PaymentMethod } from './types';

// In a real app, these would come from your Spring Boot Backend via Flyway migrations
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Minimalist Chrono Watch",
    price: 129.99,
    category: "Accessories",
    description: "A sleek timepiece with a genuine leather strap and sapphire crystal glass. Perfect for the modern professional.",
    image: "https://picsum.photos/seed/watch/600/600",
    rating: 4.8,
    colors: ["Black", "Silver", "Brown"],
    stock: 5,
    images: [
      "https://picsum.photos/seed/watch-detail1/600/600",
      "https://picsum.photos/seed/watch-detail2/600/600",
      "https://picsum.photos/seed/watch-side/600/600"
    ]
  },
  {
    id: 2,
    name: "Urban Noise-Cancelling Headphones",
    price: 249.50,
    category: "Electronics",
    description: "Immerse yourself in high-fidelity audio with active noise cancellation. 30-hour battery life.",
    image: "https://picsum.photos/seed/headphones/600/600",
    rating: 4.9,
    colors: ["Black", "White"],
    stock: 12,
    images: [
      "https://picsum.photos/seed/hp-side/600/600",
      "https://picsum.photos/seed/hp-case/600/600"
    ]
  },
  {
    id: 3,
    name: "Merino Wool Crewneck",
    price: 85.00,
    category: "Apparel",
    description: "Ethically sourced merino wool. Breathable, warm, and incredibly soft against the skin.",
    image: "https://picsum.photos/seed/sweater/600/600",
    rating: 4.5,
    colors: ["Gray", "Navy", "Beige"],
    stock: 45,
    images: [
        "https://picsum.photos/seed/sweater-texture/600/600"
    ]
  },
  {
    id: 4,
    name: "Lumina Smart Lamp",
    price: 59.99,
    category: "Home",
    description: "Voice-activated ambient lighting with 16 million colors. Syncs with your music.",
    image: "https://picsum.photos/seed/lamp/600/600",
    rating: 4.2,
    colors: ["White", "Black"],
    stock: 0
  },
  {
    id: 5,
    name: "Canvas Weekender Bag",
    price: 110.00,
    category: "Travel",
    description: "Durable canvas construction with leather accents. Fits everything you need for a 3-day trip.",
    image: "https://picsum.photos/seed/bag/600/600",
    rating: 4.7,
    colors: ["Green", "Brown", "Black"],
    stock: 8,
    images: [
      "https://picsum.photos/seed/bag-open/600/600",
      "https://picsum.photos/seed/bag-back/600/600"
    ]
  },
  {
    id: 6,
    name: "Mechanical Keyboard 60%",
    price: 145.00,
    category: "Electronics",
    description: "Tactile brown switches with custom PBT keycaps. The ultimate typing experience for developers.",
    image: "https://picsum.photos/seed/keyboard/600/600",
    rating: 4.9,
    colors: ["White", "Black", "Gray"],
    stock: 25,
    images: [
      "https://picsum.photos/seed/kb-zoom/600/600",
      "https://picsum.photos/seed/kb-side/600/600"
    ]
  },
  {
    id: 7,
    name: "Ceramic Pour-Over Set",
    price: 45.00,
    category: "Home",
    description: "Handcrafted ceramic dripper and carafe. Elevate your morning coffee ritual.",
    image: "https://picsum.photos/seed/coffee/600/600",
    rating: 4.6,
    colors: ["White", "Black"],
    stock: 15
  },
  {
    id: 8,
    name: "Polarized Aviators",
    price: 135.00,
    category: "Accessories",
    description: "Classic design with modern lens technology. 100% UV protection and glare reduction.",
    image: "https://picsum.photos/seed/glasses/600/600",
    rating: 4.4,
    colors: ["Gold", "Silver", "Black"],
    stock: 30
  }
];

export const CATEGORIES = ["All", "Electronics", "Apparel", "Home", "Accessories", "Travel"];

export const CATEGORY_VISUALS = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400' },
  { name: 'Apparel', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
  { name: 'Travel', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400' }
];

export const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Green', hex: '#006400' },
  { name: 'Beige', hex: '#F5F5DC' }
];

export const MOCK_REVIEWS: Review[] = [
  // Watch Reviews
  {
    id: 1,
    productId: 1,
    user: "Alex Morgan",
    rating: 5,
    date: "2 days ago",
    content: "Absolutely love this watch! The quality is outstanding and it arrived much faster than I expected. Will definitely be buying more from Lumina.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
  },
  {
    id: 2,
    productId: 1,
    user: "James Chen",
    rating: 4,
    date: "1 week ago",
    content: "Looks even better in person. The leather strap is a bit stiff at first but breaks in nicely.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    id: 3,
    productId: 1,
    user: "Sarah Jenkins",
    rating: 5,
    date: "2 weeks ago",
    content: "Perfect gift for my husband. He wears it every day.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },

  // Headphones Reviews
  {
    id: 4,
    productId: 2,
    user: "Mike Ross",
    rating: 5,
    date: "3 days ago",
    content: "The noise cancellation is top notch. I use them for coding and they really help me focus.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
  },
  {
    id: 5,
    productId: 2,
    user: "Rachel Green",
    rating: 3,
    date: "1 month ago",
    content: "Great sound, but a bit heavy on the head after a few hours.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel"
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Demo User",
    email: "user@lumina.com",
    role: "customer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@lumina.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-7721-XJ",
    date: "Oct 24, 2023",
    total: 334.99,
    status: "Delivered",
    items: [
      { ...MOCK_PRODUCTS[1], quantity: 1 },
      { ...MOCK_PRODUCTS[2], quantity: 1 }
    ]
  },
  {
    id: "ORD-9921-MC",
    date: "Nov 02, 2023",
    total: 59.99,
    status: "Shipped",
    items: [
      { ...MOCK_PRODUCTS[3], quantity: 1 }
    ]
  },
  {
    id: "ORD-1120-PL",
    date: "Nov 15, 2023",
    total: 129.99,
    status: "Processing",
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 1 }
    ]
  }
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    type: 'Home',
    street: '123 Fashion Ave, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true
  },
  {
    id: 'addr-2',
    type: 'Work',
    street: '456 Tech Blvd, Suite 200',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94016',
    country: 'USA',
    isDefault: false
  }
];

export const MOCK_PAYMENTS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
    cardHolder: 'Demo User',
    isDefault: true
  },
  {
    id: 'pm-2',
    type: 'MasterCard',
    last4: '8888',
    expiry: '09/24',
    cardHolder: 'Demo User',
    isDefault: false
  }
];