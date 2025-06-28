"use client";

import { useDataStore } from "@/store/useDataStore";
import CoRunRuleForm from "@/components/rules/CoRunRule";
import SlotRestrictionForm from "@/components/rules/SlotRestrictionRule";
import { RuleList } from "@/components/rules/RuleList";
import LoadLimitRuleForm from "@/components/rules/LoadLimitRule";
import PhaseWindowForm from "@/components/rules/PhaseWindowRule";
import PatternMatchForm from "@/components/rules/PatternMatchRule";
import PrecedenceOverrideForm from "@/components/rules/PrecedenceOverrideRule";
import TaskPriorityRuleForm from "@/components/rules/TaskPriority";
import NLRuleInput from "@/components/NLRuleInput";
import RuleExporter from "@/components/ruleExporter";

export default function RuleBuilderPage() {
  const tasks = useDataStore((s) => s.tasks); // ✅ Get globally shared task data
  const clients = useDataStore((s) => s.clients);
  const workers = useDataStore((s) => s.workers);

  

  return (
    <div className="p-6 space-y-6">
      <div className="w-full flex justify-between">
      <h1 className="text-xl font-bold mb-4">🔧 Rule Builder</h1>
      <RuleExporter/>
      </div>
      <NLRuleInput />
      {tasks.length > 0 && <CoRunRuleForm />}
      {clients.length > 0 && workers.length > 0 && <SlotRestrictionForm />}
        {workers.length > 0 && <LoadLimitRuleForm />  }

      {tasks.length > 0 && <PhaseWindowForm />}
      <PatternMatchForm/>
      {tasks.length > 0 && <PrecedenceOverrideForm />}
      {tasks.length > 0 && <TaskPriorityRuleForm />}
      <RuleList />
      {/* ...More rule forms here... */}
    </div>
  );
} 
