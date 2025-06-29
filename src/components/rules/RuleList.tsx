"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Users, Filter, Target, Clock, Layers, ArrowUpDown } from "lucide-react"
import { type Rule, useRuleStore } from "@/store/useRuleStore"

export function RuleList() {
  const rules = useRuleStore((s) => s.rules)
  const removeRule = useRuleStore((s) => s.removeRule)

  const getRuleIcon = (type: string) => {
    switch (type) {
      case "coRun":
        return <Users className="w-4 h-4" />
      case "slotRestriction":
        return <Filter className="w-4 h-4" />
      case "loadLimit":
        return <Target className="w-4 h-4" />
      case "phaseWindow":
        return <Clock className="w-4 h-4" />
      case "patternMatch":
        return <Layers className="w-4 h-4" />
      case "precedenceOverride":
        return <ArrowUpDown className="w-4 h-4" />
      case "TaskPriority":
        return <Target className="w-4 h-4" />
      default:
        return <Layers className="w-4 h-4" />
    }
  }

  const getRuleColor = (type: string) => {
    switch (type) {
      case "coRun":
        return "bg-blue-600"
      case "slotRestriction":
        return "bg-green-600"
      case "loadLimit":
        return "bg-orange-600"
      case "phaseWindow":
        return "bg-purple-600"
      case "patternMatch":
        return "bg-pink-600"
      case "precedenceOverride":
        return "bg-red-600"
      case "TaskPriority":
        return "bg-cyan-600"
      default:
        return "bg-gray-600"
    }
  }

  const renderSummary = (rule: Rule) => {
    switch (rule.type) {
      case "coRun":
        return (
          <div>
            <p className="text-white font-medium">Co-Run Rule</p>
            <p className="text-gray-400 text-sm">
              Tasks: {(rule.tasks ?? []).join(", ")}
            </p>
          </div>
        )
      case "slotRestriction":
        return (
          <div>
            <p className="text-white font-medium">Slot Restriction Rule</p>
            <p className="text-gray-400 text-sm">
              {rule.groupType === "clients" ? "Client Group" : "Worker Group"}: {(rule.groupIDs ?? []).join(", ")}
            </p>
            <p className="text-gray-400 text-sm">
              Min Common Slots: {rule.minCommonSlots}
            </p>
          </div>
        )
      case "loadLimit":
        return (
          <div>
            <p className="text-white font-medium">Load Limit Rule</p>
            <p className="text-gray-400 text-sm">
              Workers: {(rule.groupIDs ?? []).join(", ")}
            </p>
            <p className="text-gray-400 text-sm">
              Max Slots Per Phase: {rule.maxSlotsPerPhase}
            </p>
          </div>
        )
      case "phaseWindow":
        return (
          <div>
            <p className="text-white font-medium">Phase Window Rule</p>
            <p className="text-gray-400 text-sm">Task: {rule.taskId}</p>
            <p className="text-gray-400 text-sm">
              Allowed Phases: {(rule.allowedPhases ?? []).join(", ")}
            </p>
          </div>
        )
      case "patternMatch":
        return (
          <div>
            <p className="text-white font-medium">Pattern Match Rule</p>
            <p className="text-gray-400 text-sm">Pattern: {rule.regex}</p>
            {rule.ruleTemplate && (
              <p className="text-gray-400 text-sm">{rule.ruleTemplate}</p>
            )}
          </div>
        )
      case "precedenceOverride":
      case "TaskPriority":
        return (
          <div>
            <p className="text-white font-medium">
              {rule.type === "precedenceOverride"
                ? "Precedence Override Rule"
                : "Task Priority Rule"}
            </p>
            <p className="text-gray-400 text-sm">
              Priority Order: {(rule.priorityList ?? []).join(" → ")}
            </p>
          </div>
        )
      default:
        return (
          <div>
            <p className="text-white font-medium">Custom Rule</p>
            <p className="text-gray-400 text-sm">
              {JSON.stringify(rule)}
            </p>
          </div>
        )
    }
  }
  

  if (rules.length === 0) {
    return ( 
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-700 rounded-full">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400 text-lg">No rules created yet</p>
              <p className="text-gray-500 text-sm">Start by creating your first rule using AI or manual forms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {rules.map((rule, idx) => (
        <Card key={idx} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getRuleColor(rule.type)} text-white`}>{getRuleIcon(rule.type)}</div>
                <div className="flex-1">{renderSummary(rule)}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={`${getRuleColor(rule.type)} text-white`}>
                  {rule.type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(idx)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
