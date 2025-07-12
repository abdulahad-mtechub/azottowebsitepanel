import { PlusOutlined } from "@ant-design/icons"
import {Row, Col, Space, Button, Typography} from "antd"
export const ModuleTopHeading=({name, onClick, level, className})=>{
    return (
        <Row className={className}>
            <Col span={24}>
                <Space  style={{alignItems:'center'}}>
                    <Typography.Title level={level} className="m-0 fw-500">
                        {
                            name
                        }
                    </Typography.Title>
                    {
                        onClick ?
                        <Button 
                        className="my-0"
                            type="primary" 
                            shape="circle" 
                            size='small' 
                            style={{color:'var(--white-text)',backgroundColor:'var(--brand-color)'}}
                            icon={<PlusOutlined/>}
                            onClick={onClick}
                        />
                        :<></>
                    }
                </Space>
            </Col>
        </Row>
    )
}