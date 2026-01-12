import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  message,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  OfferSellerModal,
  RequestMeetingModal,
  ProceedToPurchaseModal,
} from "../modal";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CREATE_OFFER } from "../../../graphql/mutation/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { CHECK_OFFER_EXISTS } from "../../../graphql/query/offer";
import { CHECKMEETINGEXISTS } from "../../../graphql/query/meeting";
import { useFormatNumber } from "../../../hooks";

const { Title, Text } = Typography;

const BusinessInfoCard = ({ data }) => {
  const { formatNumber } = useFormatNumber();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userId;
  const navigate = useNavigate();

  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";
  const [createOffer, { loading: createOfferLoading }] =
    useMutation(CREATE_OFFER);
  const [hasExistingOffer, setHasExistingOffer] = useState(false);
  const [existingMeeting, setExistingMeeting] = useState(false);
  const [existingProceedToPay, setExistingProceedToPay] = useState(false);
  const isArabic = localStorage.getItem("lang") === "ar";

  const { data: offerExistsData, refetch: refetchOfferExists } = useQuery(
    CHECK_OFFER_EXISTS,
    {
      variables: {
        businessId: data?.id,
        buyerId: userId,
      },
      skip: !userId || !data?.id,
      fetchPolicy: "cache-and-network",
    }
  );

  const { data: meetingExistsData, refetch: refetchMeetingExists } = useQuery(
    CHECKMEETINGEXISTS,
    {
      variables: {
        businessId: data?.id,
        buyerId: userId,
      },
      skip: !userId || !data?.id,
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    if (offerExistsData?.checkOfferExists) {
      setHasExistingOffer(offerExistsData.checkOfferExists.exists);
      setExistingProceedToPay(offerExistsData.checkOfferExists.isProceedToPay);
    }
  }, [offerExistsData]);

  useEffect(() => {
    if (meetingExistsData?.checkMeetingExists !== undefined) {
      setExistingMeeting(meetingExistsData.checkMeetingExists);
    }
  }, [meetingExistsData]);

  const businessInfoData = [
    {
      id: 1,
      icon: "/assets/icons/verification.png",
      title: t("Verified By Jusoor"),
      subtitle: t("Identity Verification"),
    },
    {
      id: 2,
      icon: "/assets/icons/businessprice.png",
      title: formatNumber(data?.price || "0"),
      subtitle: t("Business Price"),
    },
    {
      id: 3,
      icon: "/assets/icons/businesscate.png",
      title: isArabic
        ? data?.category?.arabicName
        : data?.category?.name || t("Unknown"),
      subtitle: t("Business Category"),
    },
    {
      id: 5,
      icon: "/assets/icons/businessloc.png",
      title: `${t(data?.district) || t("Unknown")}`,
      subtitle: t("Business Location"),
    },
  ];

  const [offerseller, setOfferSeller] = useState(false);
  const [offerMode, setOfferMode] = useState("offer");
  const [meetingmodal, setMeetingModal] = useState(false);
  const [proceedModal, setProceedModal] = useState(false);

  const handleAction = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate("/login");
    }
  };

  const handleProceedButtonClick = () => {
    handleAction(() => setProceedModal(true));
  };

  const handleConfirmProceed = async () => {
    try {
      const { data: response } = await createOffer({
        variables: {
          input: {
            businessId: data?.id,
            price: data?.price,
            isProceedToPay: true,
          },
        },
      });

      if (response?.createOffer?.id) {
        setProceedModal(false);
        messageApi.success(
          t("Your purchase request has been sent to the seller!")
        );
        // Refetch to update button states
        refetchOfferExists();
      }
    } catch (error) {
      console.error("Error creating proceed to purchase offer:", error);
      messageApi.error(t("Failed to send purchase request. Please try again."));
    }
  };

  return (
    <>
      {contextHolder}
      <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={5} className="m-0">
              {t("Business Info")}
            </Title>
          </Col>
          {businessInfoData?.map((stat, i) => (
            <Col span={24} key={i}>
              <Flex gap={10}>
                <div
                  className={`icon-pre ${
                    stat.id === 1 ? "bg-light-green" : null
                  }`}
                >
                  <Image
                    src={stat?.icon}
                    preview={false}
                    width={"100%"}
                    alt={t("stats icon")}
                  />
                </div>
                <Flex vertical gap={2}>
                  <Title
                    level={5}
                    className={`m-0 ${
                      stat.id === 1 ? "text-green" : "text-brand"
                    }`}
                  >
                    {stat.id === 2 && (
                      <img
                        src="/assets/icons/reyal-b.png"
                        width={16}
                        alt={t("currency-symbol")}
                        fetchPriority="high"
                      />
                    )}{" "}
                    {stat.id === 1 ? (
                      <Space>
                        {stat?.title}
                        <Tooltip
                          title={t(
                            "The Jusoor has verified the identity of the business owner."
                          )}
                        >
                          <img
                            src="/assets/icons/info.png"
                            width={18}
                            alt={t("info-icon")}
                            fetchPriority="high"
                            className="center"
                          />
                        </Tooltip>
                      </Space>
                    ) : (
                      stat?.title
                    )}
                  </Title>
                  <Text className="text-gray fs-12 fw-500">
                    {stat?.subtitle}
                  </Text>
                </Flex>
              </Flex>
            </Col>
          ))}
          <Col span={24}>
            <Divider className="m-0" />
          </Col>
          {data?.seller?.id !== userId && (
            <Col span={24}>
              <Flex vertical gap={5}>
                <Button
                  className="btn bg-brand"
                  aria-labelledby={t("Make an Offer")}
                  onClick={() =>
                    handleAction(() => {
                      setOfferMode("offer");
                      setOfferSeller(true);
                    })
                  }
                  disabled={hasExistingOffer || isUserInactive}
                  style={{
                    opacity: hasExistingOffer || isUserInactive ? 0.5 : 1,
                    cursor:
                      hasExistingOffer || isUserInactive
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isUserInactive
                    ? t("Verification Pending")
                    : hasExistingOffer
                    ? t("Offer Already Submitted")
                    : t("Make an Offer")}
                </Button>
                <Button
                  aria-labelledby={t("Request Meeting")}
                  disabled={existingMeeting || isUserInactive}
                  className="btn bg-dark-blue"
                  onClick={() => handleAction(() => setMeetingModal(true))}
                  style={{
                    opacity: existingMeeting || isUserInactive ? 0.5 : 1,
                    cursor:
                      existingMeeting || isUserInactive
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isUserInactive
                    ? t("Verification Pending")
                    : existingMeeting
                    ? t("Meeting Already Requested")
                    : t("Request Meeting")}
                </Button>
                <Button
                  aria-labelledby={t("Proceed to Purchase")}
                  className="btn bg-green text-white"
                  onClick={handleProceedButtonClick}
                  disabled={
                    hasExistingOffer || existingProceedToPay || isUserInactive
                  }
                  style={{
                    opacity:
                      hasExistingOffer || existingProceedToPay || isUserInactive
                        ? 0.5
                        : 1,
                    cursor:
                      hasExistingOffer || existingProceedToPay || isUserInactive
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isUserInactive
                    ? t("Verification Pending")
                    : existingProceedToPay
                    ? t("Purchase Request Sent")
                    : hasExistingOffer
                    ? t("Offer Already Submitted")
                    : t("Proceed to Purchase")}
                </Button>
              </Flex>
            </Col>
          )}
        </Row>
      </Card>

      <OfferSellerModal
        businessId={data?.id}
        visible={offerseller}
        onClose={() => {
          setOfferSeller(false);
          refetchOfferExists();
        }}
        mode={offerMode}
        refetch={refetchOfferExists}
      />
      <ProceedToPurchaseModal
        visible={proceedModal}
        onClose={() => setProceedModal(false)}
        businessPrice={data?.price || 0}
        onConfirm={handleConfirmProceed}
        loading={createOfferLoading}
      />
      <RequestMeetingModal
        businessId={data?.id}
        visible={meetingmodal}
        onlyMeeting={true}
        onClose={() => {
          setMeetingModal(false);
        }}
        refetch={refetchMeetingExists}
      />
    </>
  );
};

export { BusinessInfoCard };
