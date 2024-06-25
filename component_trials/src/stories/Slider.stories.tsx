import type { Meta, StoryObj } from '@storybook/react';
import Slider from '../components/slider/Slider';

const meta: Meta<typeof Slider> = {
  parameters: {
    layout: 'centered',
  },
  component: Slider,
};

export default meta;
type Story = StoryObj<typeof Slider>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Multi: Story = {
  args: {
    type: 'multi',
    min: 100,
    max: 280,
    rangeColor: 'blue',
    step: 1,
  }

};

export const Single: Story = {
   args: {
    type: 'single',
    min: 100,
    max: 280,
    rangeColor: 'blue',
    step: 1,
  }

};