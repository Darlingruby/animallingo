import { useState } from 'react'
import { Play, Volume2, MessageSquare, Bone, Heart, Shield } from 'lucide-react'

const QUICK_MESSAGES = [
  { icon: MessageSquare, text: 'Come here', category: 'Call' },
  { icon: Bone, text: 'Food time', category: 'Food' },
  { icon: Heart, text: 'Good job', category: 'Praise' },
  { icon: Shield, text: 'Stop', category: 'Command' },
  { icon: Play, text: 'Let\'s play', category: 'Play' },
  { icon: Volume2, text: 'Calm down', category: 'Calm' },
]

function HumanToPet() {
  const [customMessage, setCustomMessage] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredMessages = selectedCategory === 'All' 
    ? QUICK_MESSAGES 
    : QUICK_MESSAGES.filter(m => m.category === selectedCategory)

  const playSound = (text: string) => {
    setIsPlaying(true)
    // Simulate playing sound
    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Speak to Your Pet</h2>
        <p className="text-slate-600">Choose a message or type your own to translate to pet sounds</p>
      </div>

      {/* Selected Pet */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
          🐕
        </div>
        <div>
          <p className="font-semibold text-slate-900">Buddy (Dog)</p>
          <p className="text-sm text-slate-500">Speaking to: Golden Retriever</p>
        </div>
        <button className="ml-auto text-blue-600 font-medium hover:underline">
          Change
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Call', 'Food', 'Praise', 'Command', 'Play', 'Calm'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quick Messages */}
      <div className="grid grid-cols-2 gap-3">
        {filteredMessages.map((msg) => (
          <button
            key={msg.text}
            onClick={() => playSound(msg.text)}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <msg.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-slate-400">{msg.category}</span>
            </div>
            <p className="font-semibold text-slate-900">{msg.text}</p>
          </button>
        ))}
      </div>

      {/* Custom Message */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Custom Message</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => customMessage && playSound(customMessage)}
            disabled={!customMessage || isPlaying}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Playing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
        </div>
      </div>

      {/* Playback Settings */}
      <div className="bg-slate-100 rounded-2xl p-4">
        <h3 className="font-semibold text-slate-900 mb-3">Playback Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Volume</span>
            <input type="range" min="0" max="100" defaultValue="80" className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Frequency</span>
            <select className="px-3 py-1 rounded-lg border border-slate-300">
              <option>Normal</option>
              <option>High (for dogs)</option>
              <option>Low (for cats)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HumanToPet
