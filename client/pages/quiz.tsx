import { useState } from 'react'
import { useRouter } from 'next/router'
import QuizComponent from 'components/QuizComponent'
import Navbar from 'components/Navbar'

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
    <>
    <QuizComponent/>
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Mental Health Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Question 1 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            What hobbies or interests bring you joy?
          </label>
          <textarea
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            rows={3}
            required
          />
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Would you be open to incorporating mindfulness or creative practices into your routine?
          </label>
          <div className="mt-2 flex items-center space-x-6">
            <label className="inline-flex items-center text-gray-700">
              <input
                type="radio"
                name="mindfulness"
                value="Yes"
                onChange={handleChange}
                required
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center text-gray-700">
              <input
                type="radio"
                name="mindfulness"
                value="No"
                onChange={handleChange}
                required
                className="form-radio h-5 w-5 text-green-600"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            How often do you socialize with others?
          </label>
          <select
            name="socialization"
            value={formData.socialization}
            onChange={handleChange}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select an option</option>
            <option value="Rarely">Rarely</option>
            <option value="Occasionally">Occasionally</option>
            <option value="Frequently">Frequently</option>
          </select>
        </div>

        {/* Question 4 */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            How much time per day/week are you willing to invest in mental health practices?
          </label>
          <input
            type="text"
            name="timeInvestment"
            value={formData.timeInvestment}
            onChange={handleChange}
            required
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 30 minutes per day"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-white font-semibold rounded-md 
            ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}

export default Quiz
