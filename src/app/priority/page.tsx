import PriorityWeightsForm from '@/components/PriorityWeightsForm'
import RuleExporter from '@/components/ruleExporter'
import React from 'react'

const page = () => {
  return (
    <div>
        <RuleExporter/>
      <PriorityWeightsForm/>
    </div>
  )
}

export default page
