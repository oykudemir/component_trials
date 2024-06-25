# Oyku's React Slider

## Overview
This custom Slider component is designed for React applications using TypeScript. It supports both single and multi-range functionality, allowing users to select a value or a range of values within a specified limit.

## Features
- **Single and Multi-Range Modes**: Choose between a single thumb slider or a dual-thumb range slider.
- **Customizable Appearance**: Customize the color of the slider range.
- **Dynamic Value Adjustment**: Set minimum and maximum values, with optional steps between values.
- **Custom Renderers**: Optional custom renderers for slider handles and tooltips.
- **Styling**: Apply custom styles via `style` prop.

## Properties

| Property         | Type                          | Description                                                  | Required |
|------------------|-------------------------------|--------------------------------------------------------------|----------|
| `rangeColor`     | `string`                      | Color of the slider's range.                                 | No       |
| `type`           | `'multi'` or `'single'`       | Specifies whether the slider is a single or multi-range.     | Yes      |
| `min`            | `number`                      | Minimum value of the slider.                                 | Yes      |
| `max`            | `number`                      | Maximum value of the slider.                                 | Yes      |
| `step`           | `number`                      | The granularity of the slider.                               | No       |
| `value`          | `{ min: number; max: number}` | Current value or range of values selected in the slider.     | Yes      |
| `onChange`       | `function`                    | Callback function that is called when the slider value changes. | Yes    |
| `HandleRenderer` | `React.FC`                    | Optional custom React component for rendering the slider handle. | No     |
| `TooltipRenderer`| `React.FC`                    | Optional custom React component for rendering a tooltip on the slider handle. | No |
| `style`          | `React.CSSProperties`         | Optional style object to apply custom styles to the slider.  | No       |

## Installation
To install the Slider component in your project, ensure you have a React environment set up and then import the component as shown in the usage section below.

## Usage
Here is a basic example of how to use the Slider component in your application:

```tsx
import React from 'react';
import {Slider} from 'oykus-react-slider'

function App() {

  const handleSliderChange = (newValue: {min: number, max:number}) => {
    console.log('New Range Selected:', newValue);
  };


interface HeartIconProps {
  color?: string;
  size?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({ color = 'red', size = '24' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={color} viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"/>
    </svg>
  );
};
  return (
    <div>
      <Slider
        rangeColor="red"
        type="multi"
        min={0}
        max={100}
        step={1}
        value={{ min: 10, max: 90 }}
        onChange={handleSliderChange}
        TooltipRenderer={HeartIcon}
      />
    </div>
  );
}

export default App;