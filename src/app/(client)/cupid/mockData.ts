import { User } from '../../../types/types'

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Yssa',
    age: 25,
    bio: 'Love hiking and photography',
    jobTitle: 'Data Analyst',
    location: 'San Antonio, Texas',
    flag: '🇺🇸',
    verified: true,
    mbti: 'ESTP',
    zodiac: 'Aries',
    photos: [
      '/placeholder.png?height=400&width=300&text=Yssa1',
      '/placeholder.png?height=400&width=300&text=Yssa2',
      '/placeholder.png?height=400&width=300&text=Yssa3',
    ],
    questions: [
      { question: 'Favorite movie?', answer: 'The Lord of the Rings trilogy' },
      { question: 'Dream vacation?', answer: 'Backpacking through Europe' },
    ],
  },
  {
    id: 2,
    name: 'Emma',
    age: 28,
    bio: 'Coffee addict & book lover',
    jobTitle: 'UX Designer',
    location: 'Austin, Texas',
    flag: '🇺🇸',
    verified: true,
    mbti: 'INFJ',
    zodiac: 'Leo',
    photos: [
      '/placeholder.png?height=400&width=300&text=Emma1',
      '/placeholder.png?height=400&width=300&text=Emma2',
      '/placeholder.png?height=400&width=300&text=Emma3',
    ],
    questions: [
      { question: 'Favorite book?', answer: 'Pride and Prejudice' },
      { question: 'Ideal weekend?', answer: 'Cozy cafe, good book, and rain outside' },
    ],
  },
  {
    id: 3,
    name: 'Sophie',
    age: 26,
    bio: 'Adventure seeker',
    jobTitle: 'Travel Blogger',
    location: 'Denver, Colorado',
    flag: '🇺🇸',
    mbti: 'ENFP',
    zodiac: 'Sagittarius',
    verified: false,
    photos: [
      '/placeholder.png?height=400&width=300&text=Sophie1',
      '/placeholder.png?height=400&width=300&text=Sophie2',
      '/placeholder.png?height=400&width=300&text=Sophie3',
    ],
    questions: [
      { question: 'Next travel destination?', answer: 'Bali, Indonesia' },
      { question: 'Favorite outdoor activity?', answer: 'Rock climbing' },
    ],
  },
]

export const currentUser: User = {
  id: 0,
  name: 'John',
  age: 30,
  bio: 'Looking for my boo 👻',
  jobTitle: 'Software Engineer',
  location: 'New York, NY',
  flag: '🇺🇸',
  verified: true,
  mbti: 'INTJ',
  zodiac: 'Capricorn',
  photos: [
    '/placeholder.png?height=400&width=300&text=John1',
    '/placeholder.png?height=400&width=300&text=John2',
    '/placeholder.png?height=400&width=300&text=John3',
  ],
  questions: [
    { question: 'Favorite programming language?', answer: 'TypeScript' },
    { question: 'Dream tech project?', answer: 'Building an AI-powered smart home system' },
  ],
}

