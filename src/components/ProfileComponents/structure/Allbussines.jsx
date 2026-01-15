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
  Space,
  Tooltip,
  Grid,
} from "antd";
import { useNavigate } from "react-router-dom";
import { GETSELLERBUSINESS } from "../../../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { Singlebusinessview } from "./Singlebusinessview";
import { ModuleTopHeading } from "../../Pagecomponents";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { truncateChars } from "../../../utils";
import { CustomPagination, LoadingCard } from "../../ui";
import { useFormatNumber } from "../../../hooks";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const Allbussines = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { t, i18n } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const isArabic = i18n.language === "ar";
  const [currentPage, setCurrentPage] = useState(1);
  const [singledetail, setSingleDetail] = useState(null);
  const [limit, setLimit] = useState(10);

  const [getSellerBusinesses, { data: sellerBusinesses, loading }] =
    useLazyQuery(GETSELLERBUSINESS, {
      fetchPolicy: "network-only",
    });

  const allBusinessesData =
    sellerBusinesses?.getAllSellerBusinesses?.businesses?.map((biz) => ({
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
      offerCount: biz.offerCount,
      save: "no",
      child: [
        { subtitle: formatNumber(biz.revenue), subdesc: t("Revenue/month") },
        { subtitle: formatNumber(biz.profit), subdesc: t("Profit/month") },
        {
          subtitle: `${formatNumber(biz.capitalRecovery)} ${t("months")}`,
          subdesc: t("Capital Recovery"),
        },
      ],
    })) || [];

  useEffect(() => {
    const offSet = (currentPage - 1) * limit;
    getSellerBusinesses({ variables: { limit, offSet } });
  }, [currentPage, limit, getSellerBusinesses]);

  if (singledetail) {
    return (
      <Singlebusinessview
        singledetail={singledetail}
        setSingleDetail={setSingleDetail}
      />
    );
  }
  const buttonGroupGap = screens.xs ? 4 : 12;
  const buttonGroupFlexDirection = screens.xs ? "vertical" : "horizontal";

  const shouldMainFlexWrap = screens.xs || screens.sm || screens.md;
  const mainFlexGap = screens.xs ? 8 : screens.sm || screens.md ? 12 : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <span className="badge-active rounded-8">{t("Active")}</span>;
      case "INACTIVE":
        return (
          <span className="badge-inactive rounded-8">{t("Inactive")}</span>
        );
      case "REJECT":
        return (
          <span className="badge-inactive rounded-8">{t("Rejected")}</span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="badge-review rounded-8">{t("Under Review")}</span>
        );
      default:
        return null;
    }
  };

  return (
    <Flex gap={20} vertical>
      <Flex justify="space-between" align="center">
        <ModuleTopHeading level={4} name={t("All Businesses")} />
        <Flex gap={5}>
          <Button
            aria-labelledby={t("Sell a Business")}
            className="btn bg-brand rounded-8"
            type="button"
            onClick={() => navigate("/sellbusinesscreate")}
          >
            <PlusOutlined /> {t("Sell a Business")}
          </Button>
        </Flex>
      </Flex>
      <Card className="border-gray">
        {loading ? (
          <LoadingCard loading={true} height={460} minHeight={460} />
        ) : allBusinessesData?.length === 0 ? (
          <LoadingCard
            isEmpty={true}
            emptyText={t("No Business Found")}
            height={460}
            minHeight={460}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {allBusinessesData?.map((pro, i) => (
              <Col
                lg={{ span: 12 }}
                md={{ span: 12 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
                key={i}
              >
                <Card
                  className="h-100 border-gray rounded-12 card-cs cursor"
                  onClick={() => setSingleDetail(pro?.id)}
                >
                  <Flex vertical gap={20}>
                    <Flex
                      justify="space-between"
                      align={screens.xs ? "flex-start" : "center"}
                      wrap={shouldMainFlexWrap ? "wrap" : "nowrap"}
                      gap={mainFlexGap}
                    >
                      <Flex
                        gap={buttonGroupGap}
                        align="center"
                        direction={buttonGroupFlexDirection}
                        style={{
                          flexGrow: 1,
                          flexShrink: 1,
                          minWidth: screens.xs ? "100%" : "auto",
                        }}
                      >
                        <Button
                          className="fs-13"
                          aria-labelledby={t(
                            isArabic
                              ? pro?.category?.arabicName
                              : pro?.category?.name
                          )}
                        >
                          {truncateChars(
                            isArabic
                              ? pro?.category?.arabicName
                              : pro?.category?.name,
                            14
                          )}
                        </Button>

                        {pro?.isByTakbeer !== undefined && (
                          <Button
                            aria-labelledby={t("Type")}
                            className={`fs-12 text-white ${
                              pro.isByTakbeer ? "bg-brand" : "bg-black"
                            }`}
                          >
                            <Space align="center" size={4} wrap={false}>
                              {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
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
                      {getStatusBadge(pro?.businessStatus)}
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
                      <Title className="" level={5}>
                        {pro?.businessTitle}
                      </Title>
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
                        split={
                          <Divider type="vertical" className="m-0 h-auto" />
                        }
                        align="center"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {pro?.child?.map((item, c) => (
                          <Flex
                            vertical
                            align="center"
                            justify="center"
                            key={c}
                          >
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
                      <Flex align="center" justify="space-between">
                        <Flex gap={3} align="center">
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
                              {formatNumber(pro?.price)}
                            </Title>
                          </span>
                        </Flex>
                        <Text className="text-brand fs-14">
                          {formatNumber(
                            pro.offerCount >= 10 ? 10 : pro.offerCount
                          )}
                          {pro.offerCount >= 10 ? "+" : ""} {t("Offers")}
                        </Text>
                      </Flex>
                    </div>
                  </Flex>
                </Card>
              </Col>
            ))}
            {sellerBusinesses?.getAllSellerBusinesses?.totalCount > 0 && (
              <CustomPagination
                totalItems={
                  sellerBusinesses?.getAllSellerBusinesses?.totalCount || 0
                }
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
          </Row>
        )}
      </Card>
    </Flex>
  );
};

export { Allbussines };
