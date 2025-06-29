"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Loader2, Sparkles } from "lucide-react"
import { useRuleStore } from "@/store/useRuleStore"
import { useDataStore } from "@/store/useDataStore"
import { generateRuleFromText } from "@/lib/generateRuleFromText"

export default function NLRuleInput() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const addRule = useRuleStore((s) => s.addRule)
  const clients = useDataStore((s) => s.clients)
  const tasks = useDataStore((s) => s.tasks)
  const workers = useDataStore((s) => s.workers)

  const handleGenerate = async () => {
    if (!text.trim()) return
    setLoading(true)

    try {
      const rule = await generateRuleFromText(text, { clients, tasks, workers })
      if (rule) {
        addRule(rule)
        setText("")
      } else {
        alert("❌ Failed to generate a valid rule.")
      }
    } catch (error) {
      console.error("Error generating rule:", error)
      alert("❌ Failed to generate a valid rule.")
    } finally {
      setLoading(false)
    }
  }

  // const examplePrompts = [
  //   "Tasks longer than 2 phases should only be assigned to W001 and W003",
  //   "Client C001 and C002 must have at least 3 common time slots",
  //   "Worker W005 should not handle more than 2 tasks per phase",
  //   "Task T001 can only run in phases 1, 3, and 5",
  // ]

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">AI Rule Generator</span>
            </div>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your business rule in natural language..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[100px] resize-none"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Rule...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Rule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            Example Prompts
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {examplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setText(prompt)}
                className="text-left p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-colors border border-gray-600 hover:border-gray-500"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
