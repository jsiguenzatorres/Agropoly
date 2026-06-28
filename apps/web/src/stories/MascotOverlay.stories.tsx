// Storybook stories for MascotOverlay. Run `pnpm storybook` after installation.
// To install: from apps/web run `pnpm dlx storybook@latest init --type react`
import type { Meta, StoryObj } from '@storybook/react'
import { MascotOverlay } from '../components/ui/MascotOverlay'
import { useGameStore } from '../store/gameStore'
import { useEffect } from 'react'
import type { MascotLine } from '../lib/mascot-dialogues'

const Wrapper = ({ line }: { line: MascotLine }) => {
  const show = useGameStore(s => s.showMascot)
  useEffect(() => { show(line) }, [line, show])
  return <MascotOverlay />
}

const meta: Meta<typeof Wrapper> = {
  title: 'Mascots/MascotOverlay',
  component: Wrapper,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Wrapper>

export const DonFomento: Story = {
  args: { line: { id: 'don_fomento', text: 'El BFA confía en vos. ¡Adelante!', mood: 'happy' } },
}
export const Maicita: Story = {
  args: { line: { id: 'maicita', text: '¡Vamos vamos! ¿Qué nos traen los dados?', mood: 'excited' } },
}
export const LaVaquita: Story = {
  args: { line: { id: 'la_vaquita', text: '¡Muuu! Pasaste por el BFA Central.', mood: 'excited' } },
}
export const DonCafe: Story = {
  args: { line: { id: 'don_cafe', text: 'Si la dejás, te la compro yo.', mood: 'neutral' } },
}
export const LaCanche: Story = {
  args: { line: { id: 'la_canche', text: 'No sé cuánto pujar...', mood: 'worried' } },
}
export const LaTormenta: Story = {
  args: { line: { id: 'la_tormenta', text: '⛈️ Los riesgos del campo no perdonan...', mood: 'worried' } },
}
