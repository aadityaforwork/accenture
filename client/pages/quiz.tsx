import { useState } from 'react'
import { useRouter } from 'next/router'
import QuizComponent from 'components/QuizComponent'

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
    <div className="min-h-screen flex flex-col">
      <QuizComponent />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="bg-green-600 py-6">
            <h1 className="text-4xl font-bold text-center text-white">Mental Health Quiz</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Question 1 */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-2">
                What hobbies or interests bring you joy?
              </label>
              <textarea
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                rows={4}
                required
              />
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-2">
                Would you be open to incorporating mindfulness or creative practices into your routine?
              </label>
              <div className="mt-2 flex items-center space-x-8">
                {['Yes', 'No'].map((option) => (
                  <label key={option} className="inline-flex items-center text-lg text-gray-700">
                    <input
                      type="radio"
                      name="mindfulness"
                      value={option}
                      onChange={handleChange}
                      required
                      className="form-radio h-6 w-6 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-3">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 3 */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-2">
                How often do you socialize with others?
              </label>
              <select
                name="socialization"
                value={formData.socialization}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
              >
                <option value="">Select an option</option>
                {['Rarely', 'Occasionally', 'Frequently'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Question 4 */}
            <div>
              <label className="block text-xl font-semibold text-gray-800 mb-2">
                How much time per day/week are you willing to invest in mental health practices?
              </label>
              <input
                type="text"
                name="timeInvestment"
                value={formData.timeInvestment}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                placeholder="e.g., 30 minutes per day"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 text-xl text-white font-bold rounded-lg transition duration-200 
                ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'} disabled:opacity-50`}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Quiz