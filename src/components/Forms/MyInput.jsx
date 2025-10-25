import { Form, Input, Typography } from 'antd';
import './index.css'
export const MyInput = ({
    withoutForm, 
    name, 
    label, 
    tooltip, 
    type, 
    size, 
    disabled, 
    required, 
    message, 
    value, 
    placeholder, 
    textArea, 
    oTp, 
    nolabel=true, 
    validator, 
    showCount,
    maxLength,
    autoSize,
    ...props 
}) => {
    return (
        <>
            {
                withoutForm ?
                    textArea ?
                        <Input.TextArea
                            placeholder={placeholder || ''}
                            value={value || ''}
                            showCount={showCount}
                            maxLength={maxLength}
                            autoSize={autoSize !== undefined ? autoSize : false}
                            {...props}
                            className='custom-input m-0 fs-14'
                            style={{ resize: 'none', ...props.style }}
                        /> :
                    type==='password' ?
                        <Input.Password
                            placeholder={placeholder || ''}
                            value={value || ''}
                            size={size || 'middle'}
                            disabled={disabled || false}
                            {...props}
                            className='custom-input m-0 fs-14'
                            />:
                        <Input
                            type={type || 'text'}
                            placeholder={placeholder || ''}
                            value={value || ''}
                            size={size || 'middle'}
                            disabled={disabled || false}
                            {...props}
                            className='fs-14'
                        />
                :
                <Form.Item
                    name={name}
                    label={<Typography.Text className='fs-14 fw-400'>{label}</Typography.Text>}
                    tooltip={tooltip || null}
                    className='custom-input fs-14'
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
                >
                    {
                        textArea ?
                            <Input.TextArea
                                placeholder={placeholder || ''}
                                value={value || ''}
                                showCount={showCount}
                                maxLength={maxLength}
                                autoSize={autoSize !== undefined ? autoSize : false}
                                {...props}
                                disabled={disabled || false}
                                style={{ resize: 'none', ...props.style }}
                            /> :
                            oTp ?
                            <Input.OTP 
                                placeholder={placeholder || ''}
                                value={value || ''}
                                {...props}
                                disabled={disabled || false}
                            /> :
                        type==='password' ?
                            <Input.Password
                                placeholder={placeholder || ''}
                                value={value || ''}
                                size={size || 'middle'}
                                disabled={disabled || false}
                                {...props}
                                />:
                            <Input
                                type={type || 'text'}
                                placeholder={placeholder || ''}
                                value={value || ''}
                                size={size || 'middle'}
                                disabled={disabled || false}
                                {...props}
                            />
                    }
                </Form.Item>

            }
        </>
    )
}