"use client";
import React, {
  useRef,
  useState,
  KeyboardEvent,
  BaseSyntheticEvent,
} from "react";

export default function Passcode() {
  const [arrayValue, setArrayValue] = useState<(string | number)[]>([
    "",
    "",
    "",
    "",
  ]);
  const [maskedValue, setMaskedValue] = useState<(string | number)[]>([
    "",
    "",
    "",
    "",
  ]);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const onPaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").split("");
    if (paste.every((item) => !isNaN(Number(item)))) {
      let newInputValue = [...arrayValue];
      let newMaskedValue = [...maskedValue];
      for (let i = 0; i < paste.length; i++) {
        if (index + i < arrayValue.length) {
          newInputValue[index + i] = paste[i];
          newMaskedValue[index + i] = "*";
        }
      }
      setArrayValue(newInputValue);
      setMaskedValue(newMaskedValue);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const keyCode = parseInt(e.key);
    if (
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !(e.metaKey && e.key === "v") &&
      !(keyCode >= 0 && keyCode <= 9)
    ) {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  const onChange = (e: BaseSyntheticEvent, index: number) => {
    const input = e.target.value;

    if (!isNaN(input)) {
      setArrayValue((preValue: (string | number)[]) => {
        const newArray = [...preValue];
        newArray[index] = input;
        return newArray;
      });

      setMaskedValue((prevValue: (string | number)[]) => {
        const newArray = [...prevValue];
        newArray[index] = "*";
        return newArray;
      });

      if (input !== "" && index < arrayValue.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      setArrayValue((prevValue: (string | number)[]) => {
        const newArray = [...prevValue];
        newArray[index] = "";
        return newArray;
      });

      setMaskedValue((prevValue: (string | number)[]) => {
        const newArray = [...prevValue];
        newArray[index] = "";
        return newArray;
      });

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };
  const resetInputs = () => {
    setArrayValue(["", "", "", ""]);
    setMaskedValue(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = () => {
    console.log(arrayValue.join(""));
    // TODO: Add your Database logic here
  };

  return (
    <div className="flex flex-wrap space-x-2">
      <label
        className="text-gray-300 mx-2 text-sm font-bold mb-2"
        htmlFor="passcode"
      >
        OTP
      </label>
      <div className="w-full space-x-2">
        {maskedValue.map((value: string | number, index: number) => (
          <input
            key={`index-${index}`}
            ref={(el) => el && (inputRefs.current[index] = el)}
            inputMode="numeric"
            maxLength={1}
            name="passcode"
            type="text"
            value={String(value)}
            onChange={(e) => onChange(e, index)}
            onKeyUp={(e) => onKeyUp(e, index)}
            onKeyDown={(e) => onKeyDown(e)}
            // onFocus={(e) => onFocus(e, index)}
            onPaste={(e) => onPaste(e, index)}
            className="w-12 h-12 border-2 border-gray-200 text-black focus:outline-none focus:border-blue-400 text-center"
            autoComplete="off"
            accessKey={String(index)}
          />
        ))}
      </div>
      {showTooltip ? (
        <div className="flex mt-6 p-1 h-12 border-2 border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-400 text-center">
          <div className="mt-2 text-sm text-red-500">
            Only numbers are allowed.
          </div>
        </div>
      ) : (
        <div className="flex space-x-2 mt-4">
          <button
            onClick={resetInputs}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
}
