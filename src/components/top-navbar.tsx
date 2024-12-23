import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-4">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-blue-600">AchieveTrack</h1>
        </div>
        <div>
          {/* Placeholder for user menu / profile */}
        </div>
      </div>
    </div>
  )
}

