'use server'

export async function updateBasicInfo(data: { 
  name: string;
  gender: string;
  dateOfBirth: string;
  school: string;
  jobTitle: string;
}) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

export async function updateLifestyle(data: {
  exercise?: string;
  educationLevel?: string;
  drinking?: string;
  smoking?: string;
  kids?: string;
  religion?: string;
}) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

