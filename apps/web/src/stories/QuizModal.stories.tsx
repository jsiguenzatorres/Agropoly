import type { Meta, StoryObj } from '@storybook/react'
import { QuizModal } from '../components/ui/QuizModal'
import { QUIZ_BANK } from '../lib/glosario'

const meta: Meta<typeof QuizModal> = {
  title: 'Education/QuizModal',
  component: QuizModal,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof QuizModal>

export const Rentabilidad: Story = {
  args: {
    quiz: QUIZ_BANK[2],  // rentabilidad question
    onClose: () => alert('close'),
  },
}
export const Diversificacion: Story = {
  args: {
    quiz: QUIZ_BANK[1],  // diversification
    onClose: () => alert('close'),
  },
}
export const Hipoteca: Story = {
  args: {
    quiz: QUIZ_BANK[9],  // hipoteca
    onClose: () => alert('close'),
  },
}
