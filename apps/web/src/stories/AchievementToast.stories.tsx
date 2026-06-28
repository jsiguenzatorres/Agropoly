import type { Meta, StoryObj } from '@storybook/react'
import { AchievementToast } from '../components/ui/AchievementToast'
import { useAchievementToastStore } from '../store/achievementToastStore'
import { ACHIEVEMENTS } from '../lib/achievements'
import { useEffect } from 'react'

const Wrapper = ({ id }: { id: keyof typeof ACHIEVEMENTS }) => {
  const push = useAchievementToastStore(s => s.push)
  useEffect(() => { push(ACHIEVEMENTS[id]) }, [id, push])
  return <AchievementToast />
}

const meta: Meta<typeof Wrapper> = {
  title: 'Notifications/AchievementToast',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Wrapper>

export const PrimerPropietario: Story = { args: { id: 'primer_propietario' } }
export const MonopolioOccidente: Story = { args: { id: 'monopolio_occidente' } }
export const ExpertoFinanciero:  Story = { args: { id: 'experto_financiero' } }
export const AmigoVaquita:       Story = { args: { id: 'amigo_vaquita' } }
