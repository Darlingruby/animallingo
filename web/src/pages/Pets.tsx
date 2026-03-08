import { useState } from 'react'
import { Plus, Dog, Cat, Bird, MoreHorizontal, Trash2, Edit } from 'lucide-react'

const INITIAL_PETS = [
  { id: '1', name: 'Buddy', species: 'dog', breed: 'Golden Retriever', age: 3, translations: 45 },
  { id: '2', name: 'Whiskers', species: 'cat', breed: 'Tabby', age: 2, translations: 28 },
  { id: '3', name: 'Tweety', species: 'bird', breed: 'Parakeet', age: 1, translations: 12 },
]

const SPECIES_ICONS: Record<string, React.ElementType> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
}

function Pets() {
  const [pets, setPets] = useState(INITIAL_PETS)
  const [showAddModal, setShowAddModal] = useState(false)

  const deletePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Pets</h2>
          <p className="text-slate-600">Manage your pets and their translation history</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Pet
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => {
          const Icon = SPECIES_ICONS[pet.species] || Dog
          return (
            <div key={pet.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => deletePet(pet.id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
              <p className="text-slate-500 text-sm">{pet.breed} • {pet.age} years old</p>
              
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-slate-500">Translations</span>
                <span className="font-semibold text-slate-900">{pet.translations}</span>
              </div>
            </div>
          )
        })}
        
        {/* Add Pet Card */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors min-h-[200px]"
        >
          <Plus className="w-12 h-12 mb-2" />
          <span className="font-medium">Add New Pet</span>
        </button>
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Pet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="Pet name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Species</label>
                <select className="w-full px-4 py-2 border rounded-xl">
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Breed</label>
                <input type="text" className="w-full px-4 py-2 border rounded-xl" placeholder="Breed (optional)" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-xl font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
              >
                Add Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pets
