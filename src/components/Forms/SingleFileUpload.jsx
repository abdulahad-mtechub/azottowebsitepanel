import React, { useState, useEffect } from 'react';
import { PlusOutlined, DeleteOutlined, MinusCircleFilled } from '@ant-design/icons';
import { Upload, Form, Typography, Flex, Button } from 'antd';
const { Dragger } = Upload;

const SingleFileUpload = ({ multiple = false, name, required, message, title, onUpload, onRemove, initialFileList = [] }) => {
  const [fileList, setFileList] = useState([]);
  
  useEffect(() => {
    if (Array.isArray(initialFileList) && initialFileList.length > 0) {
      const isDifferent = 
        fileList.length !== initialFileList.length ||
        fileList.some((file, idx) => file.uid !== initialFileList[idx]?.uid);
      
      if (isDifferent) {
        setFileList([...initialFileList]);
      }
    } else if (initialFileList.length === 0 && fileList.length > 0) {
      setFileList([]);
    }
  }, [initialFileList.length, initialFileList[0]?.uid])

  const handleChange = async (info) => {
    let newFileList = [...info.fileList];
  
    if (!multiple) {
      newFileList = newFileList.slice(-1); // keep last one only for single
    }
  
    setFileList(newFileList);
  
    if (multiple) {
      const newFiles = newFileList
        .map(f => f.originFileObj)
        .filter(Boolean);
  
      if (newFiles.length > 0) {
        await onUpload(newFiles);
      }
    } else {
      const file = newFileList[0]?.originFileObj || null;
  
      if (file) {
        await onUpload(file);
      }
    }
  };
  
  
  const handleRemove = (file) => {
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    setFileList(newFileList);
    
    // Call parent component's onRemove handler if provided
    // Parent will handle form field updates and state management
    if (onRemove) {
      onRemove(file);
    }
  };

  return (
    <div className='w-100'>
      <Form.Item
        name={name}
        rules={[
          {
            required,
            message,
          },
        ]}
        className="m-0 w-100"
      >
        {(multiple || fileList.length === 0) && (
          <Dragger
            name="file"
            multiple={multiple}
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 1000);
            }}
            fileList={fileList}
            onChange={handleChange}
            onDrop={(e) => console.log('Dropped files', e.dataTransfer.files)}
            className='upload-d'
          >
            {fileList.length === 0 || multiple ? (
              <Flex vertical align='center' justify='center' className='upload-flex'>
                <PlusOutlined className='fs-16' />
                <p className="ant-upload p-0 m-0 text-black">{title}</p>
              </Flex>
            ) : null}
          </Dragger>
        )}
        {fileList.length > 0 && (
          <div className="w-100">
            {fileList.map(file => (
              <Flex key={file.uid} justify='space-between' className="w-100 p-2 mt-1 upload-border rounded-4">
                <Flex align='flex-start' gap={10} className='w-100'>
                  <img src="/assets/icons/file.png" alt="file-icon" width={24} className='pt-1' fetchPriority="high" />
                  <Flex vertical align='flex-start'>
                    <Typography.Text strong className='text-gray'>{file.name.slice(0, 20)}{file.name.length > 20 ? '...' : ''}</Typography.Text>
                    <Typography.Text className='fs-12'>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </Typography.Text>
                  </Flex>
                </Flex>
                <MinusCircleFilled 
                  className="text-red cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file);
                  }}
                />
              </Flex>
            ))}
          </div>
        )}
      </Form.Item>
    </div>
  );
};

export { SingleFileUpload };