import { Form, Input, InputNumber, Typography } from "antd";
import "./index.css";
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
  validator,
  showCount,
  maxLength,
  autoSize,
  ...props
}) => {
  // Logic to add commas to numbers
  const numberFormatter = (val) => {
    if (!val) return "";
    return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Logic to remove commas before saving to state/form
  const numberParser = (val) => {
    return val.replace(/\$\s?|(,*)/g, "");
  };

  return (
    <>
      {withoutForm ? (
        textArea ? (
          <Input.TextArea
            placeholder={placeholder || ""}
            value={value || ""}
            showCount={showCount}
            maxLength={maxLength}
            autoSize={autoSize !== undefined ? autoSize : false}
            {...props}
            className="custom-input m-0 fs-14"
            style={{ resize: "none", ...props.style }}
          />
        ) : type === "password" ? (
          <Input.Password
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="custom-input m-0 fs-14"
          />
        ) : type === "number" ? (
          <InputNumber
            type="text"
            placeholder={placeholder || ""}
            value={
              value ? parseFloat(String(value).replace(/,/g, "")) : undefined
            }
            size={size || "middle"}
            disabled={disabled || false}
            formatter={numberFormatter}
            parser={numberParser}
            {...props}
            className="fs-14 w-100"
            controls={false}
          />
        ) : (
          <Input
            type={type || "text"}
            placeholder={placeholder || ""}
            value={value || ""}
            size={size || "middle"}
            disabled={disabled || false}
            {...props}
            className="fs-14"
          />
        )
      ) : (
        <Form.Item
          name={name}
          label={
            <Typography.Text className="fs-14 fw-400 text-white">{label}</Typography.Text>
          }
          tooltip={tooltip || null}
          className="custom-input fs-14"
          rules={
            validator
              ? [
                  {
                    required: required,
                    message: message,
                  },
                  validator,
                ]
              : [
                  {
                    required: required,
                    message: message,
                  },
                ]
          }
        >
          {textArea ? (
            <Input.TextArea
              placeholder={placeholder || ""}
              value={value || ""}
              showCount={showCount}
              maxLength={maxLength}
              autoSize={autoSize !== undefined ? autoSize : false}
              {...props}
              disabled={disabled || false}
              style={{ resize: "none", ...props.style }}
            />
          ) : oTp ? (
            <Input.OTP
              placeholder={placeholder || ""}
              value={value || ""}
              {...props}
              disabled={disabled || false}
            />
          ) : type === "password" ? (
            <Input.Password
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              {...props}
            />
          ) : type === "number" ? (
            <InputNumber
              type="text"
              placeholder={placeholder || ""}
              value={
                value ? parseFloat(String(value).replace(/,/g, "")) : undefined
              }
              size={size || "middle"}
              disabled={disabled || false}
              formatter={numberFormatter}
              parser={numberParser}
              {...props}
              className="w-100"
              controls={false}
            />
          ) : (
            <Input
              type={type || "text"}
              placeholder={placeholder || ""}
              value={value || ""}
              size={size || "middle"}
              disabled={disabled || false}
              {...props}
            />
          )}
        </Form.Item>
      )}
    </>
  );
};
