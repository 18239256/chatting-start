'use client';

import clsx from "clsx";
import { 
  FieldErrors, 
  FieldValues, 
  UseFormRegister 
} from "react-hook-form";

interface TextareaProps {
  label: string;
  id: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>,
  errors: FieldErrors,
  disabled?: boolean,
  placeholder?: string,
  rows?:number,
  cols?:number,
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  id,
  register,
  required,
  errors,
  disabled,
  placeholder,
  rows,
  cols,
}) => {
  return ( 
    <div>
      <label 
        htmlFor={id} 
        className="
          block 
          text-sm 
          font-medium 
          leading-6 
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          cols={cols}
          {...register(id, { required })}
          className={clsx(`
            form-input
            block 
            w-full 
            rounded-md 
            border-0 
            py-1.5
            px-1.5 
            text-gray-900 
            shadow-sm 
            ring-1 
            ring-inset 
            ring-gray-300 
            placeholder:text-gray-400 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-sky-600 
            sm:text-sm 
            sm:leading-6`,
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
      </div>
    </div>
   );
}
 
export default Textarea;