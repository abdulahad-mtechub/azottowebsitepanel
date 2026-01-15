import { RightOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Typography,
  Spin,
  Image,
  Space,
} from "antd";
import { SingleInprogressSteps } from "./SingleInprogressSteps";
import { GETDEAL, GETUSERACTIVEBANK } from "../../../graphql";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { getNamePreview } from "../../../utils";

const { Title, Text } = Typography;

const SingleCompleteDeal = ({ completedeal, setCompleteDeal }) => {
  const { t } = useTranslation();

  const dealId = completedeal.key;

  const { data, loading } = useQuery(GETDEAL, {
    variables: { getDealId: dealId },
    fetchPolicy: "network-only",
  });
  const { data: userBank } = useQuery(GETUSERACTIVEBANK, {
    variables: { getUserActiveBanksId: data?.getDeal?.buyer?.id },
    fetchPolicy: "network-only",
  });

  const banks = userBank?.getUserActiveBanks;
  const deal = data?.getDeal
    ? {
        key: data?.getDeal?.id,
        businessTitle: data?.getDeal?.business?.businessTitle || "-",
        buyerId: data?.getDeal?.buyer?.id || null,
        buyerName: getNamePreview(data?.getDeal?.buyer?.name) || "-",
        sellerId: data?.getDeal?.business?.seller?.id || null,
        sellerName:
          getNamePreview(data?.getDeal?.business?.seller?.name) || "-",
        finalizedOffer: data?.getDeal?.offer?.price
          ? `${data?.getDeal?.offer?.price.toLocaleString()}`
          : "-",
        status: data?.getDeal?.status || 0,
        date: data?.getDeal?.createdAt
          ? new Date(data?.getDeal?.createdAt).toLocaleDateString()
          : "-",
        busines: data?.getDeal?.business || "-",
        banks: banks || "-",
        isCommissionVerified: data?.getDeal?.isCommissionVerified || false,
        isDsaSeller: data?.getDeal?.isDsaSeller || false,
        isDsaBuyer: data?.getDeal?.isDsaBuyer || false,
        isDocVedifiedSeller: data?.getDeal?.isDocVedifiedSeller || false,
        isDocVedifiedBuyer: data?.getDeal?.isDocVedifiedBuyer || false,
        isSellerCompleted: data?.getDeal?.isSellerCompleted || false,
        isBuyerCompleted: data?.getDeal?.isBuyerCompleted || false,
        isPaymentVedifiedSeller:
          data?.getDeal?.isPaymentVedifiedSeller || false,
        commission: data?.getDeal?.offer?.commission || 0,
      }
    : null;

  // Determine status based on boolean fields
  const getStatusLabel = (deal) => {
    if (!deal) return t("Pending");

    // Check if deal is cancelled
    if (deal.status === "CANCEL") {
      return t("Cancelled");
    }

    // Check completion status
    if (deal.isBuyerCompleted && deal.isSellerCompleted) {
      return t("Completed");
    }
    if (deal.isBuyerCompleted) {
      return t("Buyer Completed");
    }
    if (deal.isSellerCompleted) {
      return t("Seller Completed");
    }

    // Step 4: Payment verification
    if (deal.isDsaSeller && deal.isDsaBuyer && !deal.isPaymentVedifiedSeller) {
      return t("Payment Verification Pending");
    }
    if (deal.isPaymentVedifiedSeller && !deal.isBuyerCompleted) {
      return t("Finalizing Deal");
    }

    // Step 3: DSA signing
    if (deal.isCommissionVerified && !deal.isDsaSeller && !deal.isDsaBuyer) {
      return t("Seller & Buyer DSA Pending");
    }
    if (deal.isCommissionVerified && !deal.isDsaSeller && deal.isDsaBuyer) {
      return t("Seller DSA Pending");
    }
    if (deal.isCommissionVerified && deal.isDsaSeller && !deal.isDsaBuyer) {
      return t("Buyer DSA Pending");
    }

    // Step 2: Commission verification
    if (!deal.isCommissionVerified) {
      return t("Commission Pending");
    }
    if (deal.isCommissionVerified) {
      return t("Commission Verified");
    }

    return t("Pending");
  };

  // Get badge class based on deal status
  const getStatusBadgeClass = (deal, status) => {
    if (!deal) return "sendstatus";

    // Cancelled deals
    if (deal.status === "CANCEL") {
      return "inactive";
    }

    // Completed deals
    if (
      (deal.isBuyerCompleted && deal.isSellerCompleted) ||
      deal.isBuyerCompleted ||
      deal.isSellerCompleted
    ) {
      return "success";
    }

    // Verified states (payment or DSA verified)
    if (
      status === t("Payment Verified") ||
      status === t("Commission Verified") ||
      status === t("Finalizing Deal") ||
      deal.isPaymentVedifiedSeller ||
      (deal.isDsaSeller && deal.isDsaBuyer) ||
      deal.isCommissionVerified
    ) {
      return "received";
    }

    // Pending states
    return "sendstatus";
  };

  const dealInfo = [
    { title: t("Seller Name"), desc: deal?.sellerName },
    { title: t("Buyer Name"), desc: deal?.buyerName },
    {
      title: t("Finalized Offer"),
      desc: (
        <Space size={5}>
          <Image
            src="/assets/icons/reyal-b.png"
            alt="Reyal"
            width={16}
            height={16}
            preview={false}
          />
          <Text>{deal?.finalizedOffer}</Text>
        </Space>
      ),
    },
    { title: t("Status"), desc: getStatusLabel(deal) },
  ];

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 490 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!deal) return <Text>{t("No deal found")}</Text>;

  return (
    <Flex vertical gap={20}>
      <Flex vertical gap={25}>
        <Breadcrumb
          separator={
            <Text className="text-gray">
              <RightOutlined className="fs-10" />
            </Text>
          }
          items={[
            {
              title: (
                <Text
                  className="fs-13 text-gray cursor"
                  onClick={() => setCompleteDeal(null)}
                >
                  {t("Deals")}
                </Text>
              ),
            },
            {
              title: (
                <Text className="fw-500 fs-13 text-black">
                  {completedeal?.title}
                </Text>
              ),
            },
          ]}
        />
      </Flex>

      <Flex gap={15} align="center">
        <Button
          aria-labelledby={t("Arrow left")}
          type="button"
          className="p-0 border-0 bg-transparent"
          onClick={() => setCompleteDeal(null)}
        >
          <Image
            src="/assets/icons/back-arr.png"
            alt={t("Arrow Left")}
            width={22}
            height={22}
            preview={false}
          />
        </Button>
        <Title level={4} className="m-0">
          {completedeal?.title}
        </Title>
      </Flex>

      <Card className="radius-12 border-gray">
        <div className="deals-status">
          <Row gutter={[16, 16]}>
            {dealInfo.map((list, index) => (
              <Col xs={24} sm={12} md={6} lg={6} key={index}>
                <Flex vertical gap={5}>
                  <Text className="fw-600 fs-14 text-gray">{list?.title}</Text>
                  {list?.title === t("Status") ? (
                    <Text
                      className={`${getStatusBadgeClass(
                        deal,
                        list?.desc
                      )} fs-12 badge-cs fw-500 fit-content`}
                    >
                      {list?.desc}
                    </Text>
                  ) : (
                    <Text className="fs-14 fw-500 text-black">
                      {list?.desc}
                    </Text>
                  )}
                </Flex>
              </Col>
            ))}
          </Row>
        </div>

        <SingleInprogressSteps inprogressdeal={deal} />
      </Card>
    </Flex>
  );
};

export { SingleCompleteDeal };
