import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Typography,
  Spin,
  Space,
  Tooltip,
} from "antd";
import { useLazyQuery } from "@apollo/client";
import { GETSELLERSOLDBUSINESS } from "../../../graphql/query";
import { useTranslation } from "react-i18next";
import { truncateChars } from "../../../utils";
import { useFormatNumber } from "../../../hooks";
import { CustomPagination } from "../../ui";

const { Title, Text, Paragraph } = Typography;

const Soldbussines = () => {
  const { t, i18n } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const isArabic = i18n.language === "ar";

  const [
    getSellerSoldBusinesses,
    { data: sellerSoldBusinesses, loading, error },
  ] = useLazyQuery(GETSELLERSOLDBUSINESS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const offSet = (currentPage - 1) * limit;
    getSellerSoldBusinesses({ variables: { limit, offSet } });
  }, [currentPage, limit, getSellerSoldBusinesses]);

  const soldBusinessesData =
    sellerSoldBusinesses?.getAllSellerSoldBusinesses?.businesses?.map(
      (biz) => ({
        id: biz.id,
        title: biz.businessTitle,
        categoryName: isArabic ? biz.category.arabicName : biz.category.name,
        description: biz.description,
        isSaved: biz.isSaved,
        amount: formatNumber(biz.price),
        price: biz.price,
        businessTitle: biz.businessTitle,
        category: biz.category,
        isByTakbeer: biz.isByTakbeer,
        businessStatus: biz.businessStatus,
        save: "no",
        child: [
          { subtitle: formatNumber(biz.revenue), subdesc: t("Revenue/month") },
          { subtitle: formatNumber(biz.profit), subdesc: t("Profit/month") },
          {
            subtitle: `${formatNumber(biz.capitalRecovery)} ${t("months")}`,
            subdesc: t("Capital Recovery"),
          },
        ],
      })
    ) || [];

  return (
    <Card className="border-gray">
      {loading ? (
        <Flex justify="center" align="center" style={{ minHeight: "300px" }}>
          <Spin size="large" />
        </Flex>
      ) : error ? (
        <Flex justify="center" align="center" style={{ minHeight: "300px" }}>
          <Text type="danger">
            {t("Error loading sold businesses")}: {error.message}
          </Text>
        </Flex>
      ) : (
        <Row gutter={[16, 16]}>
          {soldBusinessesData?.map((pro, i) => (
            <Col
              lg={{ span: 12 }}
              md={{ span: 12 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
              key={i}
            >
              <Card
                className="h-100 border-gray rounded-12 card-cs"
                aria-disabled={true}
                style={{
                  opacity: 0.6,
                  backgroundColor: "#FCFCFD",
                  cursor: "not-allowed",
                  pointerEvents: "none",
                }}
              >
                <Flex vertical gap={20}>
                  <Flex justify="space-between" align="center" gap={10} wrap>
                    <Flex gap={10} wrap>
                      <Button
                        className="fs-13"
                        aria-labelledby={pro?.category?.name}
                      >
                        {truncateChars(
                          isArabic
                            ? pro?.category?.arabicName
                            : pro?.category?.name,
                          20
                        )}
                      </Button>
                      {pro?.isByTakbeer !== undefined && (
                        <Button
                          aria-labelledby={t("Type")}
                          className={`fs-12 text-white ${
                            pro.isByTakbeer ? "bg-brand" : "bg-black"
                          }`}
                        >
                          <Space align="center" justify="center">
                            <Text className="fs-12 text-white">
                              {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                            </Text>
                            <Tooltip
                              title={
                                pro.isByTakbeer
                                  ? t(
                                      "Taqbeel refers to transferring a business by buying only the assets such as equipment or contracts without purchasing the trade name, brand, or commercial registration."
                                    )
                                  : t(
                                      "Acquisition means a full purchase of the business, including its brand, trade name, CR, assets, and even liabilities."
                                    )
                              }
                            >
                              <img
                                src="/assets/icons/info-a.png"
                                width={16}
                                alt="takbeel-icon"
                                fetchPriority="high"
                                className="center"
                              />
                            </Tooltip>
                          </Space>
                        </Button>
                      )}
                    </Flex>
                    <Flex>
                      {pro?.businessStatus === "ACTIVE" ? (
                        <span className="badge-active rounded-8">
                          {t("Active")}
                        </span>
                      ) : pro?.businessStatus === "INACTIVE" ? (
                        <span className="badge-inactive rounded-8">
                          {t("Inactive")}
                        </span>
                      ) : pro?.businessStatus === "UNDER_REVIEW" ? (
                        <span className="badge-review rounded-8">
                          {t("Under Review")}
                        </span>
                      ) : pro?.businessStatus === "SOLD" ? (
                        <span className="badge-active rounded-8">
                          {t("Sold")}
                        </span>
                      ) : null}
                    </Flex>
                  </Flex>
                  <div>
                    <div className="w-full card-img mb-2 rounded-12">
                      <img
                        src="/assets/images/card-1.webp"
                        width={"100%"}
                        height={"100%"}
                        alt={t("product-image")}
                        fetchPriority="high"
                      />
                    </div>
                    <Title level={5}>{pro?.businessTitle}</Title>
                    <div className="h-80">
                      <Paragraph
                        ellipsis={{
                          rows: 3,
                          expandable: false,
                          symbol: "more",
                        }}
                        className="fs-14 text-gray"
                      >
                        {pro?.description}
                      </Paragraph>
                    </div>
                    <Divider className="my-1" />
                    <Space
                      split={<Divider type="vertical" className="m-0 h-auto" />}
                      align="center"
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      {pro?.child?.map((item, c) => (
                        <Flex vertical align="center" justify="center" key={c}>
                          <Title level={5} className="text-brand m-0 fs-13">
                            {item?.subtitle}
                          </Title>
                          <Text className="text-gray fs-12">
                            {item?.subdesc}
                          </Text>
                        </Flex>
                      ))}
                    </Space>
                    <Divider className="my-1" />
                    <Flex gap={3} align="center">
                      {/* <Image src='/assets/icons/reyal.webp' alt={t('currency-symbol')} preview={false} width={20} />
                                        <Title level={4} className='m-0'>{pro?.amount}</Title> */}
                      <span className="currency-display">
                        <Image
                          src="/assets/icons/reyal.webp"
                          alt={t("currency-symbol")}
                          preview={false}
                          width={20}
                        />
                        <Title
                          level={4}
                          className="m-0"
                          style={{
                            display: "inline-block",
                            marginLeft: "12px",
                          }}
                        >
                          {pro?.amount}
                        </Title>
                      </span>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            </Col>
          ))}

          {sellerSoldBusinesses?.getAllSellerSoldBusinesses?.totalCount > 0 && (
            <CustomPagination
              totalItems={
                sellerSoldBusinesses?.getAllSellerSoldBusinesses?.totalCount ||
                0
              }
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}
          {sellerSoldBusinesses?.getAllSellerSoldBusinesses?.totalCount ===
            0 && (
            <Col span={24} className="text-center mt-4">
              <Text>{t("No Business Found")}</Text>
            </Col>
          )}
        </Row>
      )}
    </Card>
  );
};

export { Soldbussines };
