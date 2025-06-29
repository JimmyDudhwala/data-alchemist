import { Badge } from "@/components/ui/badge"
import { Database, Users, ClipboardList, UserCheck, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

interface NavbarProps {
  stats: {
    clients: number
    tasks: number
    workers: number
    errors: number
  }
}

export default function Navbar({ stats }: NavbarProps) {
  return (
    <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Database className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold text-white">DataHub</span>
          </Link >

          <div className="flex items-center space-x-6">
          <Button className="bg-transparent border-white border-2"><Link href="/rules">generate rules</Link></Button>
          <Button className="bg-transparent border-white border-2"><Link href="/priority">set priority</Link></Button>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Clients:</span>
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                {stats.clients}
              </Badge>
            </div>

            <div className="flex items-center space-x-1">
              <ClipboardList className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm">Tasks:</span>
              <Badge variant="outline" className="border-green-400 text-green-400">
                {stats.tasks}
              </Badge>
            </div>

            <div className="flex items-center space-x-1">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Workers:</span>
              <Badge variant="outline" className="border-purple-400 text-purple-400">
                {stats.workers}
              </Badge>
            </div>

            {stats.errors > 0 && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-gray-300 text-sm">Errors:</span>
                <Badge variant="destructive">{stats.errors}</Badge>
              </div>
            )}

          
       
          </div>
        </div>
      </div>
    </nav>
  )
}
