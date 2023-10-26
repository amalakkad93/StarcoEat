// InputComponent is a reusable component for rendering input fields.
// It accepts various props for customization, such as 'value', 'error' for error messages, 'width' for width styling,
// 'className' for custom CSS classes, and 'inputClassName' for custom input element classes.
// The component also supports a 'placeholder' attribute based on the 'label' passed in the props.
//
// Example usage:
// <InputComponent
//   value={inputValue}
//   error={inputError}
//   width="full"
//   className="custom-input-container"
//   inputClassName="custom-input"
//   label="Your Label"
//   onChange={handleInputChange}
// />

import "./FormContainer.css";
export default function InputComponent({
  value,
  error,
  width = "full",
  className = "",
  inputClassName = "",
  ...restProps
}) {
  return (
    <div className={`input-wrapper ${width} ${className}`}>
      <input
        value={value}
        className={`${inputClassName} ${error ? "error-border" : ""}`}
        placeholder={`Enter ${restProps.label}`}
        {...restProps}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

