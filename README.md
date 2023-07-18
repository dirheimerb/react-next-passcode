# React Next Passcode OTP Input Component in React

> An open-source TypeScript library for implementing a One-Time Password (OTP) input component in React.

## Introduction

The OTP input component is a collection of input boxes that allows users to enter a one-time password or passcode character by character. This component is commonly used in web and mobile applications for security and validation purposes. This README provides an overview of the OTP input component and explains how to implement it in React, including key scenarios and code implementation.

## Key Features

- Accepts a single character in each input box
- Automatically shifts focus to the next input box on character entry
- Shifts focus to the previous input box when backspacing
- Handles pasting from the clipboard with user-friendly behavior
- Supports advanced scenarios such as determining focus after pasting

## Installation

To use the OTP input component in your React project, you can install it from NPM:

```bash
npm install otp-input-component
```

or

```bash
yarn add otp-input-component
```

## Usage

Here's an example of how to use the OTP input component in your React application:

```jsx
import React, { useState } from 'react'
import OTPInput from 'otp-input-component'

function App() {
  const [otp, setOtp] = useState('')

  const handleOTPChange = (value) => {
    setOtp(value)
  }

  const handleOTPSubmit = () => {
    // Perform validation or submit the OTP
    console.log('Entered OTP:', otp)
  }

  return (
    <div>
      <h1>Enter OTP</h1>
      <OTPInput
        value={otp}
        onChange={handleOTPChange}
        onSubmit={handleOTPSubmit}
      />
    </div>
  )
}

export default App
```

## Props

The OTP input component accepts the following props:

- `value` (string): The current value of the OTP input.
- `onChange` (function): A callback function that is called whenever the OTP input value changes. It receives the updated value as a parameter.
- `onSubmit` (function): A callback function that is called when the OTP input is submitted. It can be used for validation or to trigger further actions.
- `length` (number): The number of input boxes for the OTP. Defaults to 4.
- `secure` (boolean): Whether to display asterisks (\*) instead of the actual input value. Defaults to true.
- `placeholder` (string): The placeholder text for each input box. Defaults to an empty string.

## Contributing

Contributions are welcome! If you have any improvements or new features to add, please submit a pull request. Make sure to follow the code style and add appropriate tests.

## License

This library is open-source and available under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute it as per the terms of the license.
