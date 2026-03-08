import { useState } from 'react'
import { Search, Filter, Star, Download, Calendar } from 'lucide-react'

const MOCK_HISTORY = [
  { id: 1, pet: 'Buddy', type: 'pet-to-human', text: "I'm hungry! Can we go for a walk?", timestamp: '2024-03-08 14:30', confidence: 92, favorite: true },
  { id: 2, pet: 'Whiskers', type: 'pet-to-human', text: 'Pet me... but not too much.', timestamp: '2024-03-08 13:15', confidence: 78, favorite: false },
  { id: 3, pet: 'Buddy', type: 'human-to-pet', text: "Let's play!", timestamp: '2024-03-08 12:45', confidence: 85, favorite: false },
  { id: 4, pet: 'Tweety', type: 'pet-to-human', text: 'Pretty bird! Hello!', timestamp: '2024-03-08 11:20', confidence: 88, favorite: true },
  { id: 5, pet: 'Buddy', type: 'pet-to-human', text: 'Someone is at the door!', timestamp: '2024-03-08 10:05', confidence: 95, favorite: false },
]

function History() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredHistory = MOCK_HISTORY.filter(item => {
    const matchesSearch = item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.pet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
                         (filter === 'favorites' && item.favorite) ||
                         (filter === 'pet-to-human' && item.type === 'pet-to-human') ||
                         (filter === 'human-to-pet' && item.type === 'human-to-pet')
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Translation History</h2>
          <p className="text-slate-600">Review and manage past translations</p>
        </div>
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'favorites', 'pet-to-human', 'human-to-pet'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border hover:bg-slate-50'
              }`}
            >
              {f.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No translations found
          </div>
        ) : (
          <div className="divide-y">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.type === 'pet-to-human' 
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.type === 'pet-to-human' ? 'Pet → Human' : 'Human → Pet'}
                      </span>
                      <span className="text-sm text-slate-500">{item.pet}</span>
                      <span className="text-sm text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-lg font-medium text-slate-900">"{item.text}"</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-sm font-medium ${
                        item.confidence >= 90 ? 'text-green-600' : 
                        item.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {item.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <button className={`p-2 rounded-lg transition-colors ${
                    item.favorite ? 'text-yellow-500' : 'text-slate-300 hover:text-yellow-500'
                  }`}>
                    <Star className={`w-5 h-5 ${item.favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{MOCK_HISTORY.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {MOCK_HISTORY.filter(i => i.type === 'pet-to-human').length}
          </p>
          <p className="text-sm text-slate-500">Pet → Human</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {MOCK_HISTORY.filter(i => i.type === 'human-to-pet').length}
          </p>
          <p className="text-sm text-slate-500">Human → Pet</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {MOCK_HISTORY.filter(i => i.favorite).length}
          </p>
          <p className="text-sm text-slate-500">Favorites</p>
        </div>
      </div>
    </div>
  )
}

export default History
