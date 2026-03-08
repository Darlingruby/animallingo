import { NavLink } from 'react-router-dom'
import { Home, Mic, MessageCircle, PawPrint, History, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/translate', icon: Mic, label: 'Translate' },
    { path: '/speak', icon: MessageCircle, label: 'Speak' },
    { path: '/pets', icon: PawPrint, label: 'Pets' },
    { path: '/history', icon: History, label: 'History' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">AnimalLingo</h1>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <nav className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg lg:shadow-none
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:block mt-16 lg:mt-0 h-screen lg:h-auto
        `}>
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="text-sm text-slate-500">
              <p>Translation Accuracy</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }} />
                </div>
                <span className="font-medium text-slate-700">72%</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
