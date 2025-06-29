"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Target, Users, BarChart3 } from 'lucide-react'
import { type PrioritySettings, usePriorityStore } from "@/store/usePriorityStore"

export default function PriorityWeightsForm() {
  const { priorities, setPriority } = usePriorityStore()

  const fields: { 
    key: keyof PrioritySettings
    label: string
    description: string
    icon: React.ReactNode
    color: string
  }[] = [
    { 
      key: "priorityLevel", 
      label: "Client Priority", 
      description: "Weight given to client priority levels in scheduling decisions",
      icon: <Users className="w-5 h-5" />,
      color: "blue"
    },
    { 
      key: "taskFulfillment", 
      label: "Task Fulfillment", 
      description: "Importance of completing tasks efficiently and on time",
      icon: <Target className="w-5 h-5" />,
      color: "green"
    },
    { 
      key: "fairness", 
      label: "Fairness (Client Balance)", 
      description: "Ensures equitable distribution of resources across clients",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "orange"
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          badge: "bg-blue-600 text-white",
          icon: "text-blue-400",
          slider: "data-[state=active]:bg-blue-600"
        }
      case "green":
        return {
          badge: "bg-green-600 text-white",
          icon: "text-green-400",
          slider: "data-[state=active]:bg-green-600"
        }
      case "orange":
        return {
          badge: "bg-orange-600 text-white",
          icon: "text-orange-400",
          slider: "data-[state=active]:bg-orange-600"
        }
      default:
        return {
          badge: "bg-gray-600 text-white",
          icon: "text-gray-400",
          slider: "data-[state=active]:bg-gray-600"
        }
    }
  }

  return (
    <div className="space-y-6">
      {fields.map(({ key, label, description, icon, color }) => {
        const colorClasses = getColorClasses(color)
        
        return (
          <Card key={key} className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-800 ${colorClasses.icon}`}>
                      {icon}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{label}</h4>
                      <p className="text-gray-400 text-sm">{description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={colorClasses.badge}>
                    {priorities[key]}/10
                  </Badge>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <Slider
                    value={[priorities[key]]}
                    onValueChange={(value) => setPriority(key, value[0])}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  {/* Scale indicators */}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0 (Low)</span>
                    <span>5 (Medium)</span>
                    <span>10 (High)</span>
                  </div>
                </div>

                {/* Value indicator */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Current Weight:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-800 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          color === 'blue' ? 'bg-blue-600' : 
                          color === 'green' ? 'bg-green-600' : 'bg-orange-600'
                        }`}
                        style={{ width: `${(priorities[key] / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium">{priorities[key]}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-600/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-purple-400 font-medium">Total Configuration Weight</h4>
              <p className="text-gray-400 text-sm">Sum of all priority factors</p>
            </div>
            <Badge variant="outline" className="border-purple-400 text-purple-400 text-lg px-4 py-2">
              {Object.values(priorities).reduce((sum, value) => sum + value, 0)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
