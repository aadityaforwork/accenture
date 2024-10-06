import RoadmapComponent from 'components/RoadmapComponent'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface RoadmapStep {
  step: string
  topic: string
  related_content: string
}

const Roadmap: React.FC = () => {
  const router = useRouter()
  const { roadmap_id } = router.query
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([])
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (roadmap_id) {
      const fetchRoadmap = async () => {
        try {
          const response = await fetch(`/api/get-roadmap?roadmap_id=${roadmap_id}`)
          const data = await response.json()

          if (response.ok) {
            setRoadmap(data.steps[0] || [])
          } else {
            console.error('Failed to fetch roadmap:', data)
          }
        } catch (error) {
          console.error('Error fetching roadmap:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchRoadmap()
    }
  }, [roadmap_id])

  const handleStepCompletion = (index: number) => {
    setCompletedSteps((prev) => [...prev, index])
    // Trigger affirmation animation or message
    const messageElement = document.createElement('div')
    messageElement.innerText = 'Great Job! Keep Going!'
    messageElement.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg shadow-lg'
    document.body.appendChild(messageElement)
    
    setTimeout(() => {
      document.body.removeChild(messageElement)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading your roadmap...</p>
      </div>
    )
  }

  if (!roadmap.length) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">No roadmap found.</h1>
        <p>Please try submitting the quiz again.</p>
      </div>
    )
  }

  return (
    <>
      <RoadmapComponent />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">Your Personalized 10-Step Roadmap</h1>
        <ol className="space-y-6 list-decimal list-inside">
          {roadmap.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 border ${completedSteps.includes(index) ? 'border-green-600 bg-green-100' : 'border-blue-600'} rounded-lg flex items-start space-x-4`}
            >
              <input
                type="checkbox"
                className="mt-2 h-6 w-6 text-green-600 cursor-pointer"
                onChange={() => handleStepCompletion(index)}
                checked={completedSteps.includes(index)}
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{`Step ${step.step}: ${step.topic}`}</h2>
                <p className="mt-2 text-gray-700">{step.related_content}</p>
              </div>
              {completedSteps.includes(index) && (
                <CheckCircleIcon className="h-8 w-8 text-green-600 ml-auto" />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </>
  )
}

export default Roadmap