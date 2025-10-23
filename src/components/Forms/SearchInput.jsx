import { Form, Input } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { normalizeSearchInput } from '../../utils';
import './index.css'

export const SearchInput = ({
  withoutForm, 
  name, 
  tooltip, 
  type, 
  size, 
  disabled, 
  required, 
  message, 
  value, 
  placeholder, 
  textArea, 
  validator, 
  debounceDelay = 500,
  onDebouncedChange,
  ...props 
}) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const debouncedValue = useDebounce(internalValue, debounceDelay);
  const lastDebouncedValue = useRef('');

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // Call onDebouncedChange when debounced value changes (prevent infinite calls)
  // Apply sanitization before calling the debounced callback
  useEffect(() => {
    if (onDebouncedChange && debouncedValue !== lastDebouncedValue.current) {
      const sanitizedValue = normalizeSearchInput(debouncedValue);
      lastDebouncedValue.current = debouncedValue;
      onDebouncedChange(sanitizedValue);
    }
  }, [debouncedValue, onDebouncedChange]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    // Call original onChange if provided
    if (props.onChange) {
      props.onChange(e);
    }
  };
    return (
        <>
            {
                withoutForm ?
                    textArea ?
                        <Input.TextArea
                            placeholder={placeholder || ''}
                            value={internalValue}
                            {...props}
                            onChange={handleChange}
                            disabled={disabled || false}
                            className='searchinputno'
                        /> :
                    type==='password' ?
                        <Input.Password
                            placeholder={placeholder || ''}
                            value={internalValue}
                            size={size || 'middle'}
                            disabled={disabled || false}
                            {...props}
                            onChange={handleChange}
                            className='searchinputno'
                            />:
                        <Input
                            type={type || 'text'}
                            placeholder={placeholder || ''}
                            value={internalValue}
                            size={size || 'middle'}
                            disabled={disabled || false}
                            {...props}
                            onChange={handleChange}
                            className='searchinputno'
                        />
                :
                <Form.Item
                    name={name}
                    tooltip={tooltip || null}
                    rules={validator ? [
                        {
                            required: required,
                            message: message,
                        },
                        validator
                    ] : [
                        {
                            required: required,
                            message: message,
                        },
                    ]}
                    className='custom-input1 fs-14 m-0'
                >
                    {
                        textArea ?
                            <Input.TextArea
                                placeholder={placeholder || ''}
                                value={internalValue}
                                {...props}
                                onChange={handleChange}
                                disabled={disabled || false}
                            /> :
                        type==='password' ?
                            <Input.Password
                                placeholder={placeholder || ''}
                                value={internalValue}
                                size={size || 'middle'}
                                disabled={disabled || false}
                                {...props}
                                onChange={handleChange}
                                />:
                            <Input
                                type={type || 'text'}
                                placeholder={placeholder || ''}
                                value={internalValue}
                                size={size || 'middle'}
                                disabled={disabled || false}
                                {...props}
                                onChange={handleChange}
                            />
                    }
                </Form.Item>

            }
        </>
    )
}