import { Form, TimePicker, DatePicker, Typography } from "antd";
import dayjs from "dayjs";
import "./index.css";
export const MyTimePicker = ({
  withoutForm,
  name,
  label,
  disabled,
  required,
  message,
  value,
  rangePicker,
  placeholder,
  datePicker,
  ...props
}) => {
  return (
    <>
      {withoutForm ? (
        datePicker ? (
          <DatePicker
            disabled={disabled || false}
            value={value ? dayjs(value, "YYYY-MM-DD") : ""}
            format={"YYYY-MM-DD-"}
            className="w-100"
            {...props}
          />
        ) : rangePicker ? (
          <DatePicker.RangePicker
            disabled={disabled || false}
            value={value ? dayjs(value, "YYYY-MM-DD") : ""}
            className="w-100"
            {...props}
          />
        ) : (
          <TimePicker
            disabled={disabled || false}
            // value={dayjs(value || '00:00')}
            placeholder={placeholder}
            format="HH:mm A"
            className="w-100"
            {...props}
          />
        )
      ) : (
        <Form.Item
          name={name}
          label={
            <Typography.Text className="fs-14 fw-400">{label}</Typography.Text>
          }
          rules={[
            {
              required,
              message,
            },
          ]}
          className=""
        >
          {datePicker ? (
            <DatePicker
              disabled={disabled || false}
              value={value ? dayjs(value, "YYYY-MM-DD") : ""}
              className="w-100"
              {...props}
            />
          ) : rangePicker ? (
            <DatePicker.RangePicker
              disabled={disabled || false}
              value={value ? dayjs(value, "YYYY-MM-DD") : ""}
              className="w-100"
              {...props}
            />
          ) : (
            <TimePicker
              disabled={disabled || false}
              value={dayjs(value || "00:00")}
              format="HH:mm A"
              className="w-100"
              placeholder={placeholder}
              {...props}
            />
          )}
        </Form.Item>
      )}
    </>
  );
};
