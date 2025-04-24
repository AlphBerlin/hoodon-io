export const mockUser = {
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
}

export interface Interest {
  label: string
  category: string
}

export const interestCategories = [
  'Popular',
  'Creativity',
  'Film & Literature',
  'Music',
  'Activities',
  'Games',
  'Food & Drink',
  'Pets',
  'Causes',
  'Sports',
  'MBTI',
  'Enneagram',
  'Astrology'
] as const

export const mockInterests: Interest[] = [
  {label:'love',category:'Popular'},
  {label:'Anime',category:'Popular'},
  {label:'Cartoon',category:'Popular'},
  {label:'Cats',category:'Popular'},
  {label:'Dogs',category:'Popular'},
  {label:'Demigods',category:'Popular'},
  // Previous interests remain the same...
]

export const mockLifestyleOptions = [
  {
    title: "Exercise",
    icon: "dumbbell",
    options: ["ACTIVE", "SOMETIMES", "ALMOST NEVER"]
  },
  {
    title: "Education Level",
    icon: "graduation-cap",
    options: ["High School", "Bachelor's", "Master's", "PhD"]
  },
  {
    title: "Drinking",
    icon: "wine",
    options: ["Never", "Socially", "Regularly"]
  },
  {
    title: "Smoking",
    icon: "cigarette",
    options: ["Never", "Sometimes", "Regularly"]
  },
  {
    title: "Kids",
    icon: "baby",
    options: ["Don't have", "Have", "Want someday"]
  },
  {
    title: "Religion",
    icon: "cross",
    options: ["Not Religious", "Religious", "Spiritual"]
  }
]

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  onSale?: boolean;
  likes: number;
  purchases: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'STEM Building Blocks Set',
    price: 29.99,
    rating: 5.0,
    image: '/placeholder.svg?height=200&width=200',
    likes: 1234,
    purchases: 856,
  },
  {
    id: '2',
    name: 'Coding Robot Toy',
    price: 49.99,
    rating: 5.0,
    image: '/placeholder.svg?height=200&width=200',
    likes: 2341,
    purchases: 1203,
  },
  {
    id: '3',
    name: 'Solar System Model Kit',
    price: 22.99,
    originalPrice: 36.00,
    rating: 5.0,
    image: '/placeholder.svg?height=200&width=200',
    onSale: true,
    likes: 3412,
    purchases: 2104,
  },
  {
    id: '4',
    name: 'Phonics Flashcards Set',
    price: 12.99,
    rating: 5.0,
    image: '/placeholder.svg?height=200&width=200',
    likes: 892,
    purchases: 567,
  },
]

export interface Asset {
  id: string;
  name: string;
  type: 'owned' | 'available';
  price?: number;
}

export const myAssets: Asset[] = [
  {
    id: '1',
    name: 'STEM Building Blocks Set',
    type: 'owned',
  },
  {
    id: '3',
    name: 'Solar System Model Kit',
    type: 'owned',
  },
]

export interface Avatar {
  id: string;
  name: string;
  spritesheet: string;
  hood_url: string;
  config?: any;
}

export const avatars: Avatar[] = [
  {
    id: 'avatar-1',
    name: 'Man',
    spritesheet: '/asset/hoods/spritesheets/man.png',
    hood_url: '/asset/hoods/man.glb'
  },{
    id: 'avatar-2',
    name: 'Panda',
    spritesheet: '/asset/hoods/spritesheets/panda.png',
    hood_url: '/asset/hoods/panda.glb'
  },
  {
    id: 'avatar-3',
    name: 'Blackpanther',
    spritesheet: '/asset/hoods/spritesheets/blackpanther.png',
    hood_url: '/asset/hoods/blackpanther.glb'
  },
]


