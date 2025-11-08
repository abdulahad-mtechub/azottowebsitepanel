import { Col, Flex, Row, Typography } from "antd";
import { useInView } from "framer-motion";
import { useAboutData } from '../../../data/aboutData';
import CountUp from "react-countup";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Title } = Typography;

const CounterSection = () => {
    const { formatNumber } = useFormatNumber();
    const { countData } = useAboutData();
    const targetRef = useRef(null);
    const isInView = useInView(targetRef, { once: true });
    const { t } = useTranslation();

    return (
        <div className="feature bg-dark-blue" ref={targetRef}>
            <div className="container">
                <Row gutter={[24, 24]} align={"middle"} justify="space-evenly">
                    {countData?.map((list, i) => {
                        // We no longer need the 'count' variable here.
                        // We will pass the raw 'list.count' number directly to CountUp.
                        return (
                            <Col
                                lg={{ span: 8 }}
                                md={{ span: 24 }}
                                sm={{ span: 24 }}
                                xs={{ span: 24 }}
                                key={i}
                                className={i === 1 ? 'border-l-r' : ''}
                            >
                                <Flex vertical gap={2} align="center">
                                    <Title level={4} className="text-white m-0 fw-500">
                                        {t(list?.title)}
                                    </Title>
                                    <Title className="m-0 text-white fw-500" level={1}>
                                        {isInView ? (
                                            <CountUp
                                                duration={2}
                                                // ✅ Pass the raw number to 'end'
                                                end={list.count} 
                                                // ✅ Use your function to format the output
                                                formattingFn={formatNumber} 
                                            />
                                        ) : (
                                            // Show the formatted '0' on initial load
                                            formatNumber(0)
                                        )}
                                        {list?.sign}
                                    </Title>
                                </Flex>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
};

export { CounterSection };