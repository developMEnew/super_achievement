import { Home, Eye, Settings, Calendar, X, LinkIcon,} from 'lucide-react'
import { Button } from './ui/button'


type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ isOpen, onClose, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', value: 'home' },
    { icon: Eye, label: 'View', value: 'view' },
    { icon: Settings, label: 'Manage', value: 'manage' },
    { icon: Calendar, label: 'Calendar', value: 'calendar' },
  ]

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold text-blue-600">Menu</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            className={`w-full justify-start mb-2 ${activeTab === item.value ? 'bg-blue-100 text-blue-600' : ''}`}
            onClick={() => {
              setActiveTab(item.value)
              onClose()
            }}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Developer Info</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">John Doe</p>
            <p className="text-xs text-gray-500">v1.0.0</p>
          </div>
          <a
            href="https://github.com/johndoe/achievetrack"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <LinkIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

