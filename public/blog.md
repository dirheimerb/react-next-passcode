# Understanding and Implementing One-Time Password (OTP) Input Component in React

> opensource
> typescript  
> reactjsdevelopment
> webdev

## Introduction

Do you find yourself curious about how the one-time password (OTP) input component operates on an application or webpage? This OTP feature, composed of several input elements, each accepting only one character, behaves as a cohesive unit, akin to a normal input component. In this blog post, we will explain how to create this OTP component, understand its workings, and delve into the various use cases involved with it. Let's dive into it right away!

## Understanding the OTP Component

The OTP or passcode component is essentially a collection of individual input boxes where each box corresponds to a single character of the passcode. This has become a prevalent practice in modern web and mobile applications as part of the validation process. However, implementing this feature is not as straightforward as it seems. It requires handling a variety of scenarios, including key event handling, providing a user-friendly pasting experience, and managing focus shifts in a sensible manner.

## Key Scenarios in a Passcode Component

When designing the passcode component, it's crucial to consider the following scenarios:

### Fundamental scenarios:

Each input box should accept only a single character.
Upon character entry, the focus should automatically shift to the next input element.
When backspacing, the focus should shift from the current to the previous input element.
Advanced scenarios:

Pasting Experience: This includes handling user permissions, determining where the focus should land after pasting, and managing how the input fields are populated when a value is pasted.
Diving into the Code Implementation
Now that we've explored the key scenarios, let's delve into how to implement them. Below is a code snippet demonstrating a more advanced version of the OTP component:

### Advanced scenarios:

- Pasting Experience: This includes handling user permissions, determining where the focus should land after pasting, and managing how the input fields are populated when a value is pasted.

## Diving into the Code Implementation

Now that we've explored the key scenarios, let's delve into how to implement them. Below is a code snippet demonstrating a more advanced version of the OTP component:

State Variables:

```ts
const [arrayValue, setArrayValue] = useState<(string | number)[]>([
  '',
  '',
  '',
  '',
])
const [maskedValue, setMaskedValue] = useState<(string | number)[]>([
  '',
  '',
  '',
  '',
])
const [showTooltip, setShowTooltip] = useState(false)
const inputRefs = useRef<(HTMLInputElement | null)[]>([])
```

The component maintains four separate pieces of state:

arrayValue is the actual value of the four-digit code being entered.
maskedValue is a display-only value which replaces the numbers in arrayValue with asterisks.
showTooltip is a boolean value that toggles the display of a tooltip.
inputRefs holds references to the four input elements.
Page load focus:

```ts
React.useEffect(() => {
  inputRefs.current[0]?.focus()
}, [])
```

This useEffect hook is triggered on initial render, and it sets the focus to the first input field.

Paste function:

```ts
Copy code
const onPaste = (e: React.ClipboardEvent, index: number) => { ... };
```

This function handles pasting from the clipboard. It prevents the default paste action, and instead splits the pasted text into an array. If every character in the array is a number, it updates arrayValue and maskedValue with the pasted values.

`Key down function:`

```ts

const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { ... };
```

This function handles key down events. It prevents the default action for every key that isn't Backspace, Delete, Tab, or a number between 0 and 9. If one of the forbidden keys is pressed, it displays a tooltip for two seconds.

`Change function:`

```ts
const onChange = (e: BaseSyntheticEvent, index: number) => { ... };
```

This function is called whenever the user types into an input. If the input is a number, it updates arrayValue and maskedValue. If the input is not empty, it moves the focus to the next input.

`Key up function:`

```ts
const onKeyUp = (e: KeyboardEvent<HTMLInputElement>, index: number) => { ... };
```

This function is called when a key is released. If Backspace or Delete is released, it clears the current input and moves the focus to the previous input.

`Reset function:`

```ts
const resetInputs = () => { ... };
```

This function resets all inputs and refocuses on the first input.

`Submit function:`

```ts
const handleSubmit = () => { ... };
```

This function handles the form submission. Right now, it simply logs the entered value. You would typically add your database logic here.
