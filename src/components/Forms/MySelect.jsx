import {Form, Select, Typography} from 'antd';
import './index.css'
export const MySelect = ({withoutForm,name,label,mode,disabled,showKey,required,message,value,options,validator, ...props}) => {
  return (
    withoutForm?
      <Select 
        maxTagCount= 'responsive'
        className='select'
        value={value || ''} 
        mode={mode || ''} 
        disabled={disabled || false} 
        {...props}
      >
          {
              options?.map(opt=><Select.Option value={opt?.id} key={opt?.id}>{opt?.name}</Select.Option>)
          }
          
      </Select>
      :
    <Form.Item
      name={name}
      label={<Typography.Text className="fs-14 fw-400">{label}</Typography.Text>}
      rules={validator ? [
        {
        required,
        message,
        },
        validator,
      ] : [
        {
        required,
        message,
        },
      ]}
      className='custom-select'
      >
              <Select 
                value={value || ''} 
                mode={mode || ''} 
                disabled={disabled || false} 
                maxTagCount= 'responsive'
                {...props}
                >
                  {
                      options?.map(opt=><Select.Option value={showKey ? opt?.id : opt.name} key={opt?.id}>{opt?.name}</Select.Option>)
                  }
              </Select>
      </Form.Item>  
  )
}