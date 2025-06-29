"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Settings, Sliders } from 'lucide-react'

import PriorityWeightsForm from "@/components/PriorityWeightsForm"
import RuleExporter from "@/components/ruleExporter"
import Navbar from "@/components/Navbar"
import { useDataStore } from "@/store/useDataStore"
import { usePriorityStore } from "@/store/usePriorityStore"
import { useRuleStore } from "@/store/useRuleStore"

const PriorityPage = () => {
  const tasks = useDataStore((s) => s.tasks)
  const clients = useDataStore((s) => s.clients)
  const workers = useDataStore((s) => s.workers)
  const rules = useRuleStore((s) => s.rules)
  const priorities = usePriorityStore((s) => s.priorities)

  const getDataStats = () => ({
    clients: clients.length,
    tasks: tasks.length,
    workers: workers.length,
    errors: 0, // No errors on priority page
  })

  const stats = getDataStats()

  // Calculate total weight for normalization display
  const totalWeight = Object.values(priorities).reduce((sum, value) => sum + value, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar stats={stats} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Target className="w-8 h-8 mr-3 text-purple-400" />
              Priority Configuration
            </h1>
            <p className="text-gray-400 text-lg">Configure priority weights and export your complete rule set</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
              {rules.length} Rules Configured
            </Badge>
            <RuleExporter />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Weights Form - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sliders className="w-6 h-6 mr-2 text-purple-400" />
                  Prioritization Weights
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Adjust the relative importance of different factors in your scheduling algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriorityWeightsForm />
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="space-y-6">
            {/* Weight Summary */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Weight Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Client Priority</span>
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {priorities.priorityLevel}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Task Fulfillment</span>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      {priorities.taskFulfillment}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Fairness Balance</span>
                    <Badge variant="secondary" className="bg-orange-600 text-white">
                      {priorities.fairness}/10
                    </Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Total Weight</span>
                    <Badge variant="outline" className="border-purple-400 text-purple-400">
                      {totalWeight}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Status */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                  <Settings className="w-5 h-5 mr-2 text-blue-400" />
                  Configuration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Active Rules</span>
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      {rules.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Data Sources</span>
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      {stats.clients + stats.tasks + stats.workers}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Priority Factors</span>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      3
                    </Badge>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Status</span>
                    <Badge 
                      variant="secondary" 
                      className={totalWeight > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                    >
                      {totalWeight > 0 ? "Configured" : "Incomplete"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-600/50">
              <CardHeader>
                <CardTitle className="text-purple-400 text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  Your priority configuration is {totalWeight > 0 ? "ready" : "incomplete"}. 
                  {totalWeight > 0 
                    ? " You can export your complete rule set including priorities." 
                    : " Please set priority weights before exporting."
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriorityPage
