import { useState } from 'react'
import { useRouter } from 'next/router'

const Quiz: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hobbies: '',
    mindfulness: '',
    socialization: '',
    timeInvestment: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
    
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
       
        router.push({
          pathname: '/roadmap',
          query: { roadmap_id: data.roadmap_id },
        })
      } else {
        alert('Failed to generate roadmap. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mental Health Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question 1 */}
        <div>
          <label className="block text-lg font-medium">
            What hobbies or interests bring you joy?
          </label>
          <textarea
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            required
          />
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-lg font-medium">
            Would you be open to incorporating mindfulness or creative practices into your routine?
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="mindfulness"
                value="Yes"
                onChange={handleChange}
                required
                className="form-radio h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="mindfulness"
                value="No"
                onChange={handleChange}
                required
                className="form-radio h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-lg font-medium">
            How often do you socialize with others?
          </label>
          <select
            name="socialization"
            value={formData.socialization}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an option</option>
            <option value="Rarely">Rarely</option>
            <option value="Occasionally">Occasionally</option>
            <option value="Frequently">Frequently</option>
          </select>
        </div>

        {/* Question 4 */}
        <div>
          <label className="block text-lg font-medium">
            How much time per day/week are you willing to invest in mental health practices?
          </label>
          <input
            type="text"
            name="timeInvestment"
            value={formData.timeInvestment}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., 30 minutes per day"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Quiz
