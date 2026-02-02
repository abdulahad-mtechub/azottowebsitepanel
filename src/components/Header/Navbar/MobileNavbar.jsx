import { CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  Drawer,
  Flex,
  Image,
  Typography,
  message,
} from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@apollo/client";
import { LOGOUT } from "../../../graphql/mutation";
import { clearAuthTokens } from "../../../utils/tokenManager";
import { client } from "../../../config/apolloClient";
import { ethers } from "ethers";
import {CONNECTWALLET} from "../../../graphql/mutation/login"

const { Title } = Typography;
const { Panel } = Collapse;

const MobileNavbar = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [currentPanel, setCurrentPanel] = useState([]);
  const [currentPanels, setCurrentPanels] = useState([]);
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  const [isDesktop, setIsDesktop] = useState(false);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);

  // Check if user is inactive
  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

  // Build mobile menu data dynamically
  const mobilemenuData = [
    {
      id: 1,
      name: t("Browse Vehicles"),
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1199);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) return null;

  /* =======================
     WALLET CONNECT
  ======================= */

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        messageApi.error("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const messageToSign = `Login to Azotto\nWallet: ${address}`;
      const signature = await signer.signMessage(messageToSign);

      const { data } = await connectWalletMutation({
        variables: { walletAddress: address, signature },
      });

      const result = data?.connectWallet;
      if (!result) throw new Error("Wallet login failed");

      Cookies.set("walletAddress", address, { expires: 7 });
      Cookies.set("userId", result.user.id, { expires: 7 });
      Cookies.set("token", result.token, { expires: 7 });

      message.success("Wallet connected");
      onClose?.();
      navigate("/");

    } catch (error) {
      message.error("Wallet connection failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation();
      onClose?.();
      message.success(t("Logged out successfully"));
    } catch {
      message.warning(t("Network issue. You were logged out locally."));
    } finally {
      // Use centralized token manager
      clearAuthTokens();
      client.resetStore();
      navigate("/");
    }
  };

  return (
    <>
      <Drawer
        onClose={onClose}
        open={visible}
        title={null}
        closeIcon={false}
        className={`bg-dark-blue`}
      >
        <Flex justify="space-between" align="center">
          <NavLink to={"/"} onClick={onClose}>
            <Image
              src="/assets/images/logo.webp"
              alt="Azottologo"
              width={120}
              preview={false}
              fetchPriority="high"
            />
          </NavLink>
          <Button
            aria-labelledby="Close"
            className="bg-transparent border-0 p-0"
            onClick={onClose}
          >
            <CloseOutlined className="text-white fs-18" />
          </Button>
        </Flex>
        <div className="mt-3">
          <Collapse
            activeKey={currentPanel}
            onChange={(keys) => {
              setCurrentPanel(keys);
            }}
            ghost
          >
            {mobilemenuData?.map((menu, f) => (
              <Panel
                className={
                  currentPanel.includes(String(f))
                    ? "panel-active panel"
                    : "panel"
                }
                showArrow={false}
                header={
                  menu?.path ? (
                    <NavLink
                      to={menu.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                      }}
                      className="text-white"
                    >
                      <Title level={5} className="text-white m-0">
                        {menu?.name}
                      </Title>
                    </NavLink>
                  ) : (
                    <Title level={5} className="text-white m-0">
                      {menu?.name}
                    </Title>
                  )
                }
                key={f}
                extra={
                  currentPanel?.findIndex((x) => x == f) > -1 ? (
                    <MinusOutlined className="text-white fs-14" />
                  ) : (
                    <PlusOutlined className="text-white fs-14" />
                  )
                }
              >
                <div>
                  {f === 0 && (
                    <NavLink
                      to={"/businesslisting"}
                      className="text-white fs-14 block p-2 pl-2"
                      onClick={() => onClose()}
                    >
                      <Title level={5} className="text-white m-0">
                        {t("Browse All")}
                      </Title>
                    </NavLink>
                  )}
                  <Collapse
                    activeKey={currentPanels}
                    onChange={(keys) => {
                      setCurrentPanels(keys);
                    }}
                    ghost
                  >
                    {menu?.children?.map((menuchild, f) =>
                      menuchild?.innerchildren ? (
                        <Panel
                          className={
                            currentPanels.includes(String(f))
                              ? "panel-active panel"
                              : "panel"
                          }
                          showArrow={false}
                          header={
                            <Title level={5} className="text-white m-0">
                              {menuchild?.name}
                            </Title>
                          }
                          key={f}
                          extra={
                            currentPanels?.findIndex((x) => x == f) > -1 ? (
                              <MinusOutlined className="text-white fs-14" />
                            ) : (
                              <PlusOutlined className="text-white fs-14" />
                            )
                          }
                        >
                          <Flex vertical gap={10}>
                            {menuchild?.innerchildren?.map((innerLink, i) => (
                              <NavLink
                                to={innerLink?.path}
                                onClick={onClose}
                                className="text-white fs-14"
                                key={i}
                              >
                                {innerLink?.title}
                              </NavLink>
                            ))}
                          </Flex>
                        </Panel>
                      ) : (
                        <NavLink
                          to={menuchild?.Path}
                          onClick={onClose}
                          className="text-white fs-14 block mb-2"
                        >
                          {menuchild?.name}
                        </NavLink>
                      ),
                    )}
                  </Collapse>
                </div>
              </Panel>
            ))}
          </Collapse>
          <Flex vertical>
            <NavLink
              to={"/article"}
              onClick={onClose}
              className="text-white fs-14 mb-1 block p-2 pl-2"
            >
              <Title level={5} className="text-white m-0">
                {t("Articles")}
              </Title>
            </NavLink>
            <NavLink
              to={"/faq"}
              onClick={onClose}
              className="text-white fs-14 block mb-2 p-2 pl-2"
            >
              <Title level={5} className="text-white m-0">
                {t("FAQs")}
              </Title>
            </NavLink>
            {userId && (
              <NavLink
                to={"/profiledashboard"}
                onClick={onClose}
                className="text-white fs-14 block mb-2 p-2 pl-2"
              >
                <Title level={5} className="text-white m-0">
                  {t("My Profile")}
                </Title>
              </NavLink>
            )}
          </Flex>
          <Flex vertical gap={10} align="center" justify="center">
            {userId ? (
              <>
                <Button
                  aria-labelledby="Sell a Vehicle"
                  className="btn bg-brand mt-3 w-100"
                  onClick={() => {
                    if (!isUserInactive) {
                      navigate("/sellvincreate");
                      onClose();
                    }
                  }}
                  disabled={isUserInactive}
                  style={{
                    opacity: isUserInactive ? 0.6 : 1,
                    cursor: isUserInactive ? "not-allowed" : "pointer",
                  }}
                >
                  <PlusOutlined /> {t("Sell a Vehicle")}
                </Button>
                <Button
                  aria-labelledby="Logout"
                  className="btn btn-outline w-100"
                  danger
                  loading={logoutLoading}
                  onClick={handleLogout}
                >
                  {t("Logout")}
                </Button>
              </>
            ) : (
              <>
               <Button
                  className="btn btn-outline w-100"
                  onClick={connectWallet}
                >
                  {"Connect Wallet"}
                </Button>
              </>
            )}
          </Flex>
        </div>
      </Drawer>
    </>
  );
};

export { MobileNavbar };
