/**
 * Responsive Form Components
 * Formularios optimizados para móvil con inputs táctiles (≥44px)
 *
 * Uso:
 * <ResponsiveForm onSubmit={handleSubmit}>
 *   <FormInput label="Email" type="email" required />
 *   <FormTextarea label="Mensaje" rows={4} />
 *   <FormSelect label="Tipo" options={[...]} />
 * </ResponsiveForm>
 */

import { ReactNode, FormHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

// Form Container
interface ResponsiveFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  spacing?: 'sm' | 'md' | 'lg'
}

export function ResponsiveForm({
  children,
  spacing = 'md',
  className = '',
  ...props
}: ResponsiveFormProps) {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-4 md:space-y-6',
    lg: 'space-y-6 md:space-y-8'
  }

  return (
    <form className={`${spacingClasses[spacing]} ${className}`} {...props}>
      {children}
    </form>
  )
}

// Form Input
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
}

export function FormInput({
  label,
  error,
  helpText,
  required,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[48px] ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

// Form Textarea
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  helpText?: string
}

export function FormTextarea({
  label,
  error,
  helpText,
  required,
  className = '',
  rows = 4,
  ...props
}: FormTextareaProps) {
  return (
    <div className="w-full">
      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-y ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        rows={rows}
        required={required}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

// Form Select
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string }[]
  error?: string
  helpText?: string
  placeholder?: string
}

export function FormSelect({
  label,
  options,
  error,
  helpText,
  required,
  placeholder,
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[48px] ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        required={required}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

// Form Checkbox
interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

export function FormCheckbox({
  label,
  description,
  className = '',
  ...props
}: FormCheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5 md:h-6 mt-1">
        <input
          type="checkbox"
          className={`w-5 h-5 md:w-6 md:h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer ${className}`}
          {...props}
        />
      </div>
      <div className="ml-3">
        <label className="text-sm md:text-base font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

// Form Radio Group
interface RadioOption {
  value: string
  label: string
  description?: string
}

interface FormRadioGroupProps {
  name: string
  label: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  error?: string
}

export function FormRadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  required,
  error
}: FormRadioGroupProps) {
  return (
    <div className="w-full">
      <label className="block text-sm md:text-base font-medium text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="flex items-center h-5 md:h-6 mt-1">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="w-5 h-5 md:w-6 md:h-6 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                required={required}
              />
            </div>
            <div className="ml-3">
              <label className="text-sm md:text-base font-medium text-gray-700 cursor-pointer">
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Export all components
export default ResponsiveForm
