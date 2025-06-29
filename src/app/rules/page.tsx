"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Brain, Plus, List, Users, Clock, Target, Layers, ArrowUpDown, Filter } from 'lucide-react'

import { useDataStore } from "@/store/useDataStore"
import { useRuleStore } from "@/store/useRuleStore"

import CoRunRuleForm from "@/components/rules/CoRunRule"
import SlotRestrictionForm from "@/components/rules/SlotRestrictionRule"
import { RuleList } from "@/components/rules/RuleList"
import LoadLimitRuleForm from "@/components/rules/LoadLimitRule"
import PhaseWindowForm from "@/components/rules/PhaseWindowRule"
import PatternMatchForm from "@/components/rules/PatternMatchRule"
import PrecedenceOverrideForm from "@/components/rules/PrecedenceOverrideRule"
import TaskPriorityRuleForm from "@/components/rules/TaskPriority"
import NLRuleInput from "@/components/NLRuleInput"
import RuleExporter from "@/components/ruleExporter"
import Navbar from "@/components/Navbar"

export default function RuleBuilderPage() {
  const tasks = useDataStore((s) => s.tasks)
  const clients = useDataStore((s) => s.clients)
  const workers = useDataStore((s) => s.workers)
  const rules = useRuleStore((s) => s.rules)

  const [activeTab, setActiveTab] = useState("ai-rules")

  const getDataStats = () => ({
    clients: clients.length,
    tasks: tasks.length,
    workers: workers.length,
    errors: 0, // No errors on rules page
  })

  const stats = getDataStats()

  const getRuleTypeCount = (type: string) => {
    return rules.filter(rule => rule.type === type).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar stats={stats} />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Settings className="w-8 h-8 mr-3 text-blue-400" />
              Rule Builder
            </h1>
            <p className="text-gray-400 text-lg">Create and manage business rules with AI-powered assistance</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
              {rules.length}  Rules
            </Badge>
            <RuleExporter />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger
              value="ai-rules"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Rule Builder
            </TabsTrigger>
            <TabsTrigger
              value="manual-rules"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Manual Rules
            </TabsTrigger>
            <TabsTrigger
              value="rule-list"
              className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-white"
            >
              <List className="w-4 h-4 mr-2" />
              Manage Rules
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-rules" className="space-y-6">
            <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-blue-400" />
                  AI-Powered Rule Generation
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Describe your business rules in natural language and let AI create them for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NLRuleInput />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Available Data</p>
                      <p className="text-2xl font-bold text-white">
                        {tasks.length + clients.length + workers.length}
                      </p>
                    </div>
                    <Filter className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card> 
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Rule Types</p>
                      <p className="text-2xl font-bold text-white">
                        {new Set(rules.map(r => r.type)).size}
                      </p>
                    </div>
                    <Layers className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manual-rules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tasks.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-400" />
                        Co-Run Rules
                      </div>
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        {getRuleTypeCount('coRun')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Define tasks that must run together
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CoRunRuleForm />
                  </CardContent>
                </Card>
              )}

              {clients.length > 0 && workers.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-green-400" />
                        Slot Restrictions
                      </div>
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        {getRuleTypeCount('slotRestriction')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Set minimum common slots for groups
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SlotRestrictionForm />
                  </CardContent>
                </Card>
              )}

              {workers.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-orange-400" />
                        Load Limits
                      </div>
                      <Badge variant="secondary" className="bg-orange-600 text-white">
                        {getRuleTypeCount('loadLimit')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Control maximum workload per worker
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoadLimitRuleForm />
                  </CardContent>
                </Card>
              )}

              {tasks.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-purple-400" />
                        Phase Windows
                      </div>
                      <Badge variant="secondary" className="bg-purple-600 text-white">
                        {getRuleTypeCount('phaseWindow')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Define allowed phases for tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PhaseWindowForm />
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-pink-400" />
                      Pattern Matching
                    </div>
                    <Badge variant="secondary" className="bg-pink-600 text-white">
                      {getRuleTypeCount('patternMatch')} active
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Create custom pattern-based rules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatternMatchForm />
                </CardContent>
              </Card>

              {tasks.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <ArrowUpDown className="w-5 h-5 mr-2 text-red-400" />
                        Precedence Override
                      </div>
                      <Badge variant="secondary" className="bg-red-600 text-white">
                        {getRuleTypeCount('precedenceOverride')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Set rule execution priority order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PrecedenceOverrideForm />
                  </CardContent>
                </Card>
              )}

              {tasks.length > 0 && (
                <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-cyan-400" />
                        Task Priority
                      </div>
                      <Badge variant="secondary" className="bg-cyan-600 text-white">
                        {getRuleTypeCount('TaskPriority')} active
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Define task execution priority order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskPriorityRuleForm />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rule-list">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  Active Rules Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View, edit, and manage all your active business rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RuleList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
