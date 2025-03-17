import React, { ChangeEvent } from "react";

type InputType = "text" | "password" | "date" | "email" | "number" | "tel";

interface InputFieldProps {
  type?: InputType;
  id?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string | null;
  min?: string | number;
  max?: string | number;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  required,
  disabled,
  className,
  error,
  min,
  max,
}) => {
  const inputTypes: InputType[] = [
    "text",
    "password",
    "date",
    "email",
    "number",
    "tel",
  ];
  const currentType: InputType = inputTypes.includes(type as InputType)
    ? (type as InputType)
    : "text";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`input-field-container ${className || ""}`}>
      {label && (
        <label
          htmlFor={id}
          className={`input-label ${required ? "required" : ""}`}
        >
          {label}
        </label>
      )}

      <input
        type={currentType}
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={currentType === "date" && min ? min : undefined}
        max={currentType === "date" && max ? max : undefined}
        className={`input-field ${error ? "input-error" : ""}`}
      />

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;

// 사용 예시
/*
import React, { useState } from 'react';
import InputField from './InputField';

const FormExample = () => {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    birthdate: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  
  return (
    <form>
      <InputField
        type="text"
        id="username"
        name="username"
        label="사용자 이름"
        value={formValues.username}
        onChange={handleChange}
        required
        placeholder="사용자 이름을 입력하세요"
      />
      
      <InputField
        type="password"
        id="password"
        name="password"
        label="비밀번호"
        value={formValues.password}
        onChange={handleChange}
        required
      />
      
      <InputField
        type="date"
        id="birthdate"
        name="birthdate"
        label="생년월일"
        value={formValues.birthdate}
        onChange={handleChange}
        min="1900-01-01"
        max="2023-12-31"
      />
      
      <button type="submit">제출</button>
    </form>
  );
};
*/
