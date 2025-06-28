// src/store/useRuleStore.ts
import { create } from "zustand";

// Types for different rule structures
export type CoRunRule = {
  type: "coRun";
  tasks: string[];
};

export type SlotRestrictionRule = {
  type: "slotRestriction";
  groupType: "clients" | "workers";
  groupIDs: string[];
  minCommonSlots: number;
};

export type LoadLimitRule = {
  type: "loadLimit";
  groupIDs: string[];
  maxSlotsPerPhase: number;
};

export type PhaseWindowRule = {
  type: "phaseWindow";
  taskId: string;
  allowedPhases: number[];
};

export type PatternMatchRule = {
  type: "patternMatch";
  regex: string;
  ruleTemplate: string;
  params: Record<string, unknown>;
};

export type PrecedenceOverrideRule = {
  type: "precedenceOverride";
  priorityList: string[]; // ordered list of rule types or taskIDs
};

export type TaskPriority = {
  type: "TaskPriority";
  priorityList: string[]; // ordered list of rule types or taskIDs
};

// Union type
export type Rule =
  | CoRunRule
  | SlotRestrictionRule
  | LoadLimitRule
  | PhaseWindowRule
  | PatternMatchRule
  | PrecedenceOverrideRule
  | TaskPriority;

type RuleStore = {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  removeRule: (index: number) => void;
  clearRules: () => void;
};

export const useRuleStore = create<RuleStore>((set) => ({
  rules: [],
  addRule: (rule) =>
    set((state) => ({
      rules: [...state.rules, rule],
    })),
  removeRule: (index) =>
    set((state) => ({
      rules: state.rules.filter((_, i) => i !== index),
    })),
  clearRules: () => set({ rules: [] }),
}));