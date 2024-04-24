import type { Meta, StoryObj } from '@storybook/react';
import Slider from '../components/Slider';
import '../index.css'

const meta: Meta<typeof Slider> = {
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
  render: () => <Slider type='multi' min={100} max={280} rangeColor='blue'/>  ,
};

export const Single: Story = {
  render: () => <Slider type='single' min={100} max={280} rangeColor='blue'/>  ,
};