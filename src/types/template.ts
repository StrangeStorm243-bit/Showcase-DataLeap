export type Role = 'Sales' | 'Operations' | 'Engineering' | 'HR' | 'Marketing' | 'Executive'

export type Category = 'Monitoring' | 'Outreach' | 'Reporting' | 'Triage' | 'Research' | 'Onboarding' | 'Communication' | 'Automation'

export type Complexity = 'Beginner' | 'Intermediate' | 'Advanced'

export type TriggerType = 'schedule' | 'webhook' | 'integration_event'

export interface AgentTemplate {
  id: string
  name: string
  description: string
  role: Role
  category: Category
  tools: string[]
  trigger: {
    type: TriggerType
    description: string
  }
  estimatedTimeSaved: string
  setupTime: string
  complexity: Complexity
  instructions: string
  popularityScore: number
}
