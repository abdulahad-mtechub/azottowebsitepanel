import { useState } from 'react';
import { Card, Row, Col, Flex, Typography, Dropdown, Button, Image } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents';
import { NavLink } from 'react-router-dom';
import { DeleteModal } from '../../ui';
import {GETADMINBANK } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { AddWalletModal } from '../modal';

const { Title, Text } = Typography;
const SellerWallet = ({addwalletvisible, setAddWalletVisible}) => {
    const [deletemodal, setDeleteModal] = useState(false)
    const { loading, error, data:bankData } = useQuery(GETADMINBANK);

    const data = (bankData?.getAdminBanks || []).map((bank, index) => ({
        key: `${index + 1}`,
        bankname: bank?.bankName,
        title: bank?.accountTitle || 'N/A', // Replace with real title if available
        accountnumber: bank?.accountNumber,
        expirydate: bank?.createdAt // If expiry isn't part of your data, keep this placeholder
    }));
    const items = [
        { label: <NavLink onClick={()=>setDeleteModal(true)}>Remove Account</NavLink>, key: 0 },
    ]
    return (
        <>
            <Card className='border-gray'>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Title level={5} className='m-0'>Saved Accounts</Title>
                    </Col>
                    {
                        data?.map((wallet, index) =>(
                            <Col xs={24} sm={24} md={12} lg={12} key={index}>
                        <Card className='walletCard'>
                            <Flex vertical gap={30}>
                                <Flex justify='space-between'>
                                    <Flex align='center' gap={5}>
                                        <Image src="/assets/icons/home.png" width={35} preview={false} alt="bank-icon" />
                                        <Title level={5} className='m-0 text-white fw-normal'>{wallet?.bankname}</Title>
                                    </Flex>
                                    <Flex>
                                        <Dropdown menu={{ items }} trigger={["click"]}>
                                            <Button aria-labelledby='dropdown icon' className="bg-transparent border-0 p-0">
                                                <img src="/assets/icons/line-dot.png"  alt="dropdown-icon" width={25} fetchpriority="high" />
                                            </Button>
                                        </Dropdown>
                                    </Flex>
                                </Flex>
                                <Flex justify='space-between'>
                                    <Flex vertical gap={5}>
                                        <Title level={5} className='m-0 text-white fw-500'>{wallet?.title}</Title>
                                        <Text className='fs-16 text-white'>{wallet?.accountnumber}</Text>
                                    </Flex>
                                    <Flex vertical gap={5}>
                                        <Text className='text-white fs-14'>Expires</Text>
                                        <Text className='fs-12 text-white'>{wallet?.expirydate}</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>
                        ))
                    }
                </Row>
            </Card>
            <AddWalletModal 
                visible={addwalletvisible}
                onClose={()=>setAddWalletVisible(false)}
            />
            <DeleteModal 
                visible={deletemodal}
                onClose={()=>setDeleteModal(false)}
                type='danger'
                buttontext='Yes, Remove Account'
                title='Remove Bank Account?'
                subtitle='Are you sure you want to delete this bank account? This action cannot be undone, and any active deals won’t be able to send payments to this account.'
            />
        </>
    )
}

export { SellerWallet } 
