import { useState, useRef } from "react";
import {
  Breadcrumb,
  Flex,
  Typography,
  Steps,
  Button,
  message,
  Tooltip,
} from "antd";
import { CheckOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  VinDetailStep,
  CancelModal,
  VinVerificationStep,
} from "../components";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const LOCAL_STORAGE_KEY = "sellBusinessDraft";

const SellVinCreate = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);
  const [iscancel, setIsCancel] = useState(false);
  const navigate = useNavigate();
  const businessDetailFormRef = useRef();

  const [vehicleData, setVehicleData] = useState(() => {
    const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (draft) {
      const parsed = JSON.parse(draft);
      return parsed;
    }
    return {
      vinNumber: null,
      vinPassportId: null,
      documents: [
        {
          title: null,
          fileName: null,
          fileType: null,
          filePath: null,
          description: null,
        },
      ],
    };
  });

  const steps = [
    {
      title: t("VIN + Documents"),
      content: (
        <VinDetailStep
          ref={businessDetailFormRef}
          data={vehicleData}
          setData={setVehicleData}
        />
      ),
    },
    {
      title: t("Verification Results"),
      content: (
        <VinVerificationStep
          ref={businessDetailFormRef}
          data={vehicleData}
          setData={setVehicleData}
          readOnly
        />
      ),
    },
  ];

  const onChange = (value) => setCurrent(value);

  const next = async () => {
    try {
      if (businessDetailFormRef.current) {
        await businessDetailFormRef.current.validate();
      }

      if (current < steps.length - 1) {
        setCurrent(current + 1);
      }
    } catch {
      //
    }
  };

  const items = steps.map((item, index) => ({
    key: item.title,
    title: (
      <span
        className={`custom-step-title ${current >= index ? "completed" : ""}`}
      >
        {item.title}
      </span>
    ),
  }));

  const isCRDocumentUploaded = () => {
    const docs = Array.isArray(vehicleData?.documents)
      ? vehicleData.documents
      : [];
    const crDoc = docs.find(
      (d) => d.title === "Vehicle Registration" && d.filePath,
    );
    return !!crDoc;
  };

  const canPublish = current === steps.length - 1 && isCRDocumentUploaded();

  const handleCreateListing = async () => {
    try {
      if (businessDetailFormRef.current) {
        await businessDetailFormRef.current.validate();
      }
    } catch (error) {
      console.error("Validation failed:", error);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    messageApi.success(t("Submitted to marketplace"));
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setVehicleData({
      vinNumber: null,
      vinPassportId: null,
      documents: [
        {
          title: null,
          fileName: null,
          fileType: null,
          filePath: null,
          description: null,
        },
      ],
    });
    setCurrent(0);
  };

  const handleSaveDraft = () => {
    const cleanedvehicleData = {
      ...vehicleData,
      documents: vehicleData.documents
        .filter(
          (doc) =>
            doc &&
            Object.values(doc).some(
              (val) => val !== null && val !== "" && val !== undefined,
            ),
        )
        .map((doc) => {
          const cleaned = { ...doc };
          delete cleaned.size;
          delete cleaned.__typename;
          delete cleaned.id;
          delete cleaned.documentId;
          return cleaned;
        }),
    };

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(cleanedvehicleData),
    );
    messageApi.success(t("Draft saved locally!"));
  };

  return (
    <>
      {contextHolder}
      <div className="padd mb-2">
        <div className="container">
          <Flex vertical gap={25} className="mt-3">
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
                      onClick={() => navigate("/")}
                    >
                      {t("Home")}
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text className="fw-500 fs-13 text-black">
                      {t("Create a List")}
                    </Text>
                  ),
                },
              ]}
            />
            <Steps
              current={current}
              onChange={onChange}
              items={items}
              progressDot={(dot, { index }) => (
                <span
                  className={`custom-dot ${
                    current > index ? "completed" : ""
                  } ${current === index ? "active" : ""}`}
                >
                  {current > index ? <CheckOutlined /> : dot}
                </span>
              )}
              className="mt-3 steps-create"
            />
            <div className="step-content">{steps[current].content}</div>

            <Flex justify={"space-between"} gap={5} align="center">
              {current === 0 ? (
                <Button
                  type="button"
                  className="btn border-gray text-black"
                  onClick={() => setIsCancel(true)}
                >
                  {t("Cancel")}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="btn border-gray text-black"
                  onClick={() => setCurrent(0)}
                >
                  {t("Re-upload docs")}
                </Button>
              )}
              <Flex gap={10} justify="end">
                <Button
                  className="btn text-black border-gray"
                  onClick={handleSaveDraft}
                >
                  {t("Save as Draft")}
                </Button>
                {current < steps.length - 1 && (
                  <Button
                    type="primary"
                    className="btn bg-brand"
                    onClick={next}
                  >
                    {current === 0 ? t("Verify & Continue") : t("Next")}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Tooltip
                    title={
                      !canPublish
                        ? t("Please upload Vehicle Registration")
                        : ""
                    }
                  >
                    <Button
                      type="primary"
                      disabled={!canPublish}
                      className={`btn ${canPublish ? "bg-brand" : ""}`}
                      style={
                        !canPublish
                          ? {
                              backgroundColor: "#d9d9d9",
                              borderColor: "#d9d9d9",
                              color: "rgba(0, 0, 0, 0.25)",
                              cursor: "not-allowed",
                            }
                          : {}
                      }
                      onClick={handleCreateListing}
                    >
                      {t("Submit to marketplace")}
                    </Button>
                  </Tooltip>
                )}
              </Flex>
            </Flex>
          </Flex>
        </div>
        <CancelModal visible={iscancel} onClose={() => setIsCancel(false)} />
      </div>
    </>
  );
};

export { SellVinCreate };
