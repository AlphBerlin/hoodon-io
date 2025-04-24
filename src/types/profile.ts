export interface Profile {
  name: string
  gender: string
  dateOfBirth: string
  school: string
  jobTitle: string
  location: string
  interests: string[]
  lifestyle: {
    exercise?: string
    educationLevel?: string
    drinking?: string
    smoking?: string
    kids?: string
    religion?: string
  }
  photos: string[]
}

