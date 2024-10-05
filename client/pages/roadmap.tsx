import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (roadmap_id) {
      const fetchRoadmap = async () => {
        try {
          const response = await fetch(`/api/get-roadmap?roadmap_id=${roadmap_id}`)
          const data = await response.json()

          if (response.ok) {
            // Fix: Assuming steps is an array of arrays, we need to access the first array
            setRoadmap(data.steps[0] || []) // Access the first array in steps
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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Personalized 10-Step Roadmap</h1>
      <ol className="space-y-4 list-decimal list-inside">
        {roadmap.map((step, index) => (
          <li key={index} className="p-4 border border-gray-300 rounded-md">
            <h2 className="text-xl font-semibold">{`Step ${step.step}: ${step.topic}`}</h2>
            <p className="mt-2">{step.related_content}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Roadmap
