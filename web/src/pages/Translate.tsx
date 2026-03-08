import { useState, useRef } from 'react'
import { Mic, StopCircle, Upload, Dog, Cat, Bird, AlertCircle } from 'lucide-react'

const MOCK_PETS = [
  { id: '1', name: 'Buddy', species: 'dog', icon: Dog },
  { id: '2', name: 'Whiskers', species: 'cat', icon: Cat },
  { id: '3', name: 'Tweety', species: 'bird', icon: Bird },
]

function Translate() {
  const [selectedPet, setSelectedPet] = useState(MOCK_PETS[0])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [translation, setTranslation] = useState<null | {
    text: string
    emotion: string
    confidence: number
    alternatives: string[]
  }>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      setIsRecording(true)
      setRecordingTime(0)
      setTranslation(null)
      
      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
      
      mediaRecorder.start()
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording()
        }
      }, 10000)
    } catch (err) {
      alert('Please allow microphone access to record pet sounds.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setIsRecording(false)
    setIsAnalyzing(true)
    
    // Simulate API call
    setTimeout(() => {
      setTranslation({
        text: "I'm hungry! Can we go for a walk? 🐕",
        emotion: 'Excited / Hungry',
        confidence: 92,
        alternatives: [
          'I need attention!',
          'Someone is at the door!',
        ]
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Translate Pet Sounds</h2>
        <p className="text-slate-600">Record your pet and understand what they're saying</p>
      </div>

      {/* Pet Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-3">Select Pet</label>
        <div className="flex gap-3 flex-wrap">
          {MOCK_PETS.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                selectedPet.id === pet.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <pet.icon className="w-5 h-5" />
              <span className="font-medium">{pet.name}</span>
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400">
            + Add Pet
          </button>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
        {!isRecording && !isAnalyzing && !translation && (
          <>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mic className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Record</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Click the button below and hold your device near your pet. 
              We'll analyze the sound and translate it for you.
            </p>
            <button
              onClick={startRecording}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
            <p className="text-sm text-slate-400 mt-4">Or drag and drop an audio file</p>
          </>
        )}

        {isRecording && (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 recording-pulse">
              <div className="wave-animation justify-center">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Recording...</h3>
            <p className="text-3xl font-bold text-slate-900 mb-6">{formatTime(recordingTime)}</p>
            <button
              onClick={stopRecording}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              <StopCircle className="w-5 h-5" />
              Stop Recording
            </button>
            <p className="text-sm text-slate-400 mt-4">Auto-stops at 10 seconds</p>
          </>
        )}

        {isAnalyzing && (
          <>
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing...</h3>
            <p className="text-slate-600">Our AI is processing the audio pattern</p>
          </>
        )}

        {translation && (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Translation Complete</h3>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
              <p className="text-2xl font-semibold text-slate-900 mb-3">"{translation.text}"</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {translation.emotion}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {translation.confidence}% confidence
                </span>
              </div>
            </div>

            {translation.alternatives.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 mb-2">Alternative meanings:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {translation.alternatives.map((alt, i) => (
                    <span key={i} className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setTranslation(null)}
                className="px-6 py-3 border-2 border-slate-200 rounded-xl font-semibold hover:border-slate-300"
              >
                Record Again
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                Save Translation
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-900">Tips for better results:</p>
          <ul className="text-sm text-amber-800 mt-1 space-y-1">
            <li>• Record in a quiet environment</li>
            <li>• Hold device 2-3 feet from your pet</li>
            <li>• The more you use it, the more accurate it becomes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Translate
