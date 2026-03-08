import { Link } from 'react-router-dom'
import { Mic, MessageCircle, PawPrint, Sparkles } from 'lucide-react'

function Home() {
  const features = [
    {
      icon: Mic,
      title: 'Translate Pet Sounds',
      desc: 'Record barks, meows, or chirps and understand what your pet is saying.',
      color: 'bg-blue-100 text-blue-600',
      link: '/translate'
    },
    {
      icon: MessageCircle,
      title: 'Speak to Your Pet',
      desc: 'Convert your words into sounds your pet understands.',
      color: 'bg-green-100 text-green-600',
      link: '/speak'
    },
    {
      icon: PawPrint,
      title: 'Manage Pets',
      desc: 'Add profiles for all your pets and track their communication patterns.',
      color: 'bg-purple-100 text-purple-600',
      link: '/pets'
    },
  ]

  const stats = [
    { label: 'Translations Today', value: '12' },
    { label: 'Active Pets', value: '3' },
    { label: 'Accuracy Rate', value: '72%' },
  ]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="text-blue-100 text-sm font-medium">Welcome back!</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Ready to understand your pet?</h2>
        <p className="text-blue-100 mb-6 max-w-xl">
          AnimalLingo uses AI to decode animal sounds and help you communicate back. 
          Start with a translation or teach the AI your pet's unique voice.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/translate"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Translating
          </Link>
          <Link
            to="/pets"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-400 transition-colors"
          >
            <PawPrint className="w-5 h-5" />
            Manage Pets
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.title}
            to={feature.link}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Translations</h3>
        <div className="space-y-3">
          {[
            { pet: 'Buddy (Dog)', text: "I'm hungry! Feed me please!", time: '2 min ago', confidence: 92 },
            { pet: 'Whiskers (Cat)', text: 'Pet me... but not too much.', time: '15 min ago', confidence: 78 },
            { pet: 'Tweety (Bird)', text: 'Pretty bird! Hello!', time: '1 hour ago', confidence: 85 },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-900">"{item.text}"</p>
                <p className="text-sm text-slate-500">{item.pet} • {item.time}</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  {item.confidence}% match
                </span>
              </div>
            </div>
          ))}
        </div>
        <Link to="/history" className="block text-center text-blue-600 font-medium mt-4 hover:underline">
          View all translations →
        </Link>
      </div>
    </div>
  )
}

export default Home
