# Custom Slider Component

## Overview
This custom Slider component is designed for React applications using TypeScript. It supports both single and multi-range functionality, allowing users to select a value or a range of values within a specified limit.

## Features
- **Single and Multi-Range Modes**: Choose between a single thumb slider or a dual-thumb range slider.
- **Customizable Appearance**: Customize the color of the slider range through a simple prop.

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

To include the Slider component in your project, you can import it as follows:
## Overview
This custom Slider component is designed for React applications using TypeScript. It supports both single and multi-range functionality, allowing users to select a value or a range of values within a specified limit.

## Features
- **Single and Multi-Range Modes**: Choose between a single thumb slider or a dual-thumb range slider.
- **Customizable Appearance**: Customize the color of the slider range.
- **Dynamic Value Adjustment**: Set minimum and maximum values, with optional steps between values.
- **Custom Renderers**: Optional custom renderers for slider handles and tooltips.
- **Styling**: Apply custom styles via `style` prop.

## Installation
To install the Slider component in your project, ensure you have a React environment set up and then import the component as shown in the usage section below.

## Usage
Here is a basic example of how to use the Slider component in your application:

```jsx
import React from 'react';
import Slider from './path-to-slider-component';

const App = () => {
  const handleSliderChange = (newValue) => {
    console.log('New Range Selected:', newValue);
  };

  return (
    <div>
      <Slider
        rangeColor="#f0f0f0"
        type="multi"
        min={0}
        max={100}
        step={1}
        value={{ min: 10, max: 90 }}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default App;