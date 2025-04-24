import { useState } from 'react'
import { motion } from 'framer-motion'
import { User } from '@/types/types'
import { PhotoCarousel } from './PhotoCarousel'
import { X } from 'lucide-react'

interface ProfileEditorProps {
  user: User
  onClose: () => void
  onSave: (updatedUser: User) => void
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>(user)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQuestions = [...editedUser.questions]
    updatedQuestions[index][field] = value
    setEditedUser((prev) => ({ ...prev, questions: updatedQuestions }))
  }

  const handleSave = () => {
    onSave(editedUser)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <PhotoCarousel photos={editedUser.photos} />
        <div className="space-y-4 mt-4">
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Name"
          />
          <input
            type="number"
            name="age"
            value={editedUser.age}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Age"
          />
          <textarea
            name="bio"
            value={editedUser.bio}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Bio"
            rows={3}
          />
          <input
            type="text"
            name="jobTitle"
            value={editedUser.jobTitle}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Job Title"
          />
          <input
            type="text"
            name="location"
            value={editedUser.location}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Location"
          />
          {editedUser.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Question"
              />
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  )
}

