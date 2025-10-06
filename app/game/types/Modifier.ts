export interface Modifier {
  name: string
  description: string
  modifierType: 'buff' | 'debuff' | 'neutral'
}