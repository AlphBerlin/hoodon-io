import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@/types/types'

interface ConnectionRequestProps {
  user: User
  onAccept: () => void
  onReject: () => void
}

export const ConnectionRequest: React.FC<ConnectionRequestProps> = ({ user, onAccept, onReject }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-4 max-w-sm w-full"
      >
        <p className="text-center text-gray-800 mb-4">
          <span className="font-bold">{user.name}</span> wanted to connect
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

