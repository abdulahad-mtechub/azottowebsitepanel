import {
  Typography,
  Button,
  Flex,
  Image,
  Badge,
  Dropdown,
  Avatar,
  Spin,
  List,
  Divider,
  Card,
  Popover,
  message,
  Modal,
  Radio,
} from "antd";
import "./index.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowRightOutlined, DownOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MobileNavbar } from "./MobileNavbar";
import Cookies from "js-cookie";
import { useLazyQuery, useSubscription, useMutation } from "@apollo/client";
import {
  NAVNOTIFICATION,
  NOTIFICATION,
  ME,
} from "../../../graphql/query";
import { client } from "../../../config/apolloClient";
import { useTranslation } from "react-i18next";
import { NEW_NOTIFICATION_SUBSCRIPTION } from "../../../graphql/subscription";
import { MARK_NOTIFICATION_AS_READ } from "../../../graphql/mutation";
import {
  clearAuthTokens,
  updateAccessToken,
  isAuthenticated as hasValidAccessToken,
} from "../../../utils/tokenManager";
import { clearQueryCache } from "../../../config";
import { CONNECTWALLET, UPDATE_USER } from "../../../graphql/mutation/login"
import { ethers } from "ethers";

const { Text, Title } = Typography;
// Enable dayjs plugins
dayjs.extend(relativeTime);

const Navbar = ({ setGetCategory }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    Cookies.get("userRole") || null,
  );
  const [roleUserId, setRoleUserId] = useState(null);
    /* =======================
     AUTH STATE
  ======================= */

  const [walletAddress, setWalletAddress] = useState(
    Cookies.get("walletAddress") || null
  );
  const [userId, setUserId] = useState(Cookies.get("userId") || null);
  const [isLoggedIn, setisLoggedIn] = useState(!!Cookies.get("userId"));
  const [isshow, setIsShow] = useState(!!Cookies.get("userId"));

  const isAuthenticated =
    !!Cookies.get("walletAddress") && hasValidAccessToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dropdownOpen]);

  const browseHoverTimeoutRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const NOTIFICATIONS_PAGE_SIZE = 10;
  const notificationOffsetRef = useRef(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const loadingNotificationsRef = useRef(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const listContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [getNavNotification, { data: navNotificationsData }] =
    useLazyQuery(NAVNOTIFICATION);
  const [getNotification] = useLazyQuery(NOTIFICATION);
  const [getUserDetails] = useLazyQuery(ME);
  const processedVerificationNotificationsRef = useRef(new Set());

  const loadNotifications = useCallback(
    async (reset = false) => {
      if (!userId || loadingNotificationsRef.current) {
        return;
      }

      const nextOffset = reset ? 0 : notificationOffsetRef.current;
      loadingNotificationsRef.current = true;
      setIsLoadingNotifications(true);

      try {
        const { data } = await getNotification({
          variables: {
            userId,
            limit: NOTIFICATIONS_PAGE_SIZE,
            offSet: nextOffset,
          },
          fetchPolicy: "network-only",
        });

        const payload = data?.getNotifications;
        if (!payload) {
          setHasMoreNotifications(false);
          return;
        }

        const fetchedNotifications = payload.notifications ?? [];

        setNotifications((prev) => {
          const base = reset ? [] : prev;
          const merged = [...base];
          fetchedNotifications.forEach((item) => {
            if (!merged.some((existing) => existing.id === item.id)) {
              merged.push(item);
            }
          });
          return merged;
        });

        notificationOffsetRef.current =
          nextOffset + fetchedNotifications.length;
        setHasMoreNotifications(
          fetchedNotifications.length === NOTIFICATIONS_PAGE_SIZE,
        );

        if (reset && listContainerRef.current) {
          listContainerRef.current.scrollTop = 0;
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        loadingNotificationsRef.current = false;
        setIsLoadingNotifications(false);
      }
    },
    [userId, getNotification, NOTIFICATIONS_PAGE_SIZE],
  );

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [connectWalletMutation] = useMutation(CONNECTWALLET);
  const [updateUser, { loading: updateUserLoading }] =
    useMutation(UPDATE_USER);
  const logoutLoading = false;

  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newNotif = subscriptionData.data?.newNotification;

      // Read current userId from cookies to avoid using a stale closure
      const currentUserId = Cookies.get("userId");
      // handle other notification types for removed the caching like new offers etc.
        clearQueryCache("getAllSellerBusinesses");
        clearQueryCache("getNotifications");
      

      if (newNotif && newNotif.user?.id === currentUserId) {
        setNotifications((prev) => {
          if (prev.some((item) => item.id === newNotif.id)) {
            return prev;
          }
          notificationOffsetRef.current += 1;
          return [newNotif, ...prev];
        });

        setUnreadCount((prev) => prev + 1);

        if (dropdownOpen) {
          setHasMarkedRead(false);
        }

        const isVerificationNotification =
          newNotif.message?.toLowerCase().includes("verified successfully") ||
          newNotif.name?.toLowerCase().includes("account verified");

        if (
          isVerificationNotification &&
          !processedVerificationNotificationsRef.current.has(newNotif.id)
        ) {
          processedVerificationNotificationsRef.current.add(newNotif.id);

          messageApi.success(t("Your account has been verified successfully!"));
          Cookies.set("userStatus", "verified", { expires: 7, path: "/" });
        }
      }
    },
  });

  // Sync userId state with cookies - critical for logout detection
  useEffect(() => {
    const cookieUserId = Cookies.get("userId");

    // If cookies are cleared but state still has userId, clear state immediately
    if (!cookieUserId && userId) {
      setUserId(null);
      setisLoggedIn(false);
      setIsShow(false);
      setNotifications([]);
      setUnreadCount(0);
    }
    // If cookies have userId but state doesn't, sync it (e.g., page refresh)
    else if (cookieUserId && !userId) {
      setUserId(cookieUserId);
      setisLoggedIn(true);
      setIsShow(true);
    }
  }, [userId, location.pathname]); // Check on userId changes and route changes

  useEffect(() => {
    // Only fetch user data if userId exists AND user is logged in
    if (userId && isLoggedIn) {
      getNavNotification();
    }
  }, [userId, isLoggedIn, getNavNotification]);

  useEffect(() => {
    if (userId) {
      const navCount = navNotificationsData?.getNotificationCount;
      if (typeof navCount === "number") {
        setUnreadCount(navCount);
      }
    }
  }, [navNotificationsData, userId]);

  useEffect(() => {
    if (!dropdownOpen) {
      setHasMarkedRead(false);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen || hasMarkedRead || !userId) {
      return;
    }

    if (unreadCount === 0) {
      setHasMarkedRead(true);
      return;
    }

    markNotificationAsRead({ variables: { userId } })
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );
        getNavNotification();
      })
      .catch(() => {})
      .finally(() => setHasMarkedRead(true));
  }, [
    dropdownOpen,
    hasMarkedRead,
    unreadCount,
    markNotificationAsRead,
    userId,
    getNavNotification,
  ]);

  useEffect(() => {
    setIsShow(isLoggedIn);
  }, [isLoggedIn]);

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

      const message = `Login to Azotto\nWallet: ${address}`;
      const signature = await signer.signMessage(message);

      const { data } = await connectWalletMutation({
        variables: { walletAddress: address, signature },
      });

      const result = data?.connectWallet;
      if (!result) throw new Error("Wallet login failed");

      Cookies.set("walletAddress", address, { expires: 7 });
      Cookies.set("userId", result.user.id, { expires: 7 });
      updateAccessToken(result.token);

      setWalletAddress(address);
      setUserId(result.user.id);
      setisLoggedIn(true);
      setIsShow(true);

      messageApi.success("Wallet connected");
      let shouldAskRole = !Cookies.get("userRole");
      try {
        const { data: userDetails } = await getUserDetails({
          variables: { getUserId: result.user.id },
          fetchPolicy: "network-only",
        });
        const role = userDetails?.getUser?.role || null;
        if (role) {
          Cookies.set("userRole", role, { expires: 7 });
          shouldAskRole = false;
        } else {
          shouldAskRole = true;
        }
      } catch (error) {
        console.error("Failed to load user role", error);
      }
      if (shouldAskRole) {
        setSelectedRole(null);
        setRoleUserId(result.user.id);
        setRoleModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Wallet connection failed");
    }
  };

  const handleRoleConfirm = async () => {
    if (!selectedRole) {
      messageApi.error("Please select a role");
      return;
    }
    const effectiveUserId = roleUserId || userId;
    if (!effectiveUserId) {
      messageApi.error("Unable to update role. Please try again.");
      return;
    }
    try {
      await updateUser({
        variables: {
          input: {
            id: effectiveUserId,
            role: selectedRole,
          },
        },
      });
      Cookies.set("userRole", selectedRole, { expires: 7 });
      setRoleModalOpen(false);
      messageApi.success(`Role set to ${selectedRole}`);
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to update role");
    }
  };

  const handleLogout = async () => {
    // Client-only logout: clear cookies and local state
    clearAuthTokens();
    Cookies.remove("walletAddress");
    Cookies.remove("token");
    Cookies.remove("userRole");
    try {
      await client.clearStore();
    } catch (storeError) {
      console.error("Failed to clear Apollo cache during logout:", storeError);
    }

    setWalletAddress(null);
    setUserId(null);
    setisLoggedIn(false);
    setIsShow(false);
    setDropdownOpen(false);
    setBrowseOpen(false);
    setNotifications([]);
    setUnreadCount(0);

    message.success(t("Logged out successfully"));
    navigate("/");
  };

  // Check if user is inactive
  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

  const items = [
    {
      key: "1",
      label: (
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            if (!isUserInactive) {
              navigate("/profiledashboard");
            }
          }}
          style={{
            opacity: isUserInactive ? 0.5 : 1,
            cursor: isUserInactive ? "not-allowed" : "pointer",
          }}
        >
          {t("My Profile")}
        </a>
      ),
      disabled: isUserInactive,
    },
    {
      key: "2",
      label: (
        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            setIsShow(false);
            handleLogout();
          }}
        >
          {logoutLoading ? t("Logging out...") : t("Logout")}
        </a>
      ),
    },
  ];

  const handleDropdownChange = (open) => {
    setDropdownOpen(open);
    if (open) {
      setHasMarkedRead(false);
      if (userId) {
        notificationOffsetRef.current = 0;
        setNotifications([]);
        setHasMoreNotifications(true);
        loadNotifications(true);
        getNavNotification();
      }
    } else {
      setHasMarkedRead(false);
    }
  };

  const handleListScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= 16;
      if (
        isNearBottom &&
        hasMoreNotifications &&
        !loadingNotificationsRef.current
      ) {
        loadNotifications();
      }
    },
    [hasMoreNotifications, loadNotifications],
  );

  const dropdownContent = useMemo(() => {
    const data = notifications;
    const showInitialLoader =
      dropdownOpen && data.length === 0 && isLoadingNotifications;
    const showLoadMoreSpinner =
      dropdownOpen &&
      data.length > 0 &&
      isLoadingNotifications &&
      hasMoreNotifications;

    return (
      <Card className="rounded-12 card-cs size-notify border-0">
        <Text>
          {t("Notification")} ({unreadCount})
        </Text>
        <Divider className="bg-divider my-2" />
        {showInitialLoader ? (
          <Flex align="center" justify="center" style={{ minHeight: 120 }}>
            <Spin size="small" />
          </Flex>
        ) : data.length > 0 ? (
          <div
            ref={listContainerRef}
            onScroll={handleListScroll}
            style={{
              maxHeight: 400,
              overflowY: "auto",
            }}
            className="overflowstyle"
          >
            <List
              itemLayout="horizontal"
              dataSource={data}
              className="overflow-scroll"
              renderItem={(item, index) => {
                const createdAtMoment = item?.createdAt
                  ? dayjs(item.createdAt)
                  : null;
                const relativeTime = createdAtMoment
                  ? createdAtMoment.fromNow()
                  : "";
                const absoluteTime = createdAtMoment
                  ? createdAtMoment.format("MMM DD, YYYY • hh:mm A")
                  : "";
                const itemClassName = `notification-item ${
                  item?.isRead ? "read" : "unread"
                }`;
                const titleText = item?.name || t("Notification");

                return (
                  <List.Item key={item?.id ?? index} className={itemClassName}>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={`/assets/icons/notify-ic.png`} size={30} />
                      }
                      title={
                        <Text
                          className={`notification-title ${
                            item?.isRead ? "read" : "unread"
                          }`}
                        >
                          {titleText}
                        </Text>
                      }
                      description={
                        <Flex
                          vertical
                          gap={4}
                          className="notification-description"
                        >
                          {item?.message && (
                            <Text className="fs-13 text-gray notification-message">
                              {item.message}
                            </Text>
                          )}
                          {(relativeTime || absoluteTime) && (
                            <Flex gap={8} align="center">
                              {relativeTime && (
                                <Text className="fs-12 text-gray notification-time-relative">
                                  {relativeTime}
                                </Text>
                              )}
                              {relativeTime && absoluteTime && (
                                <Text className="fs-12 text-gray">•</Text>
                              )}
                              {absoluteTime && (
                                <Text className="fs-12 text-gray notification-time-absolute">
                                  {absoluteTime}
                                </Text>
                              )}
                            </Flex>
                          )}
                        </Flex>
                      }
                    />
                  </List.Item>
                );
              }}
            />
            {showLoadMoreSpinner && (
              <Flex justify="center" className="mt-2">
                <Spin size="small" />
              </Flex>
            )}
          </div>
        ) : (
          <Text className="fs-13 text-gray">{t("No notifications yet.")}</Text>
        )}
      </Card>
    );
  }, [
    notifications,
    unreadCount,
    dropdownOpen,
    isLoadingNotifications,
    hasMoreNotifications,
    handleListScroll,
    t,
    NOTIFICATIONS_PAGE_SIZE,
  ]);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    const container = listContainerRef.current;
    if (!container) {
      return;
    }

    const parentScrollable = container.parentElement;
    if (!parentScrollable) {
      return;
    }

    const parentScrollHandler = (event) => {
      handleListScroll(event);
    };

    parentScrollable.addEventListener("scroll", parentScrollHandler, {
      passive: true,
    });

    return () => {
      parentScrollable.removeEventListener("scroll", parentScrollHandler);
    };
  }, [dropdownOpen, handleListScroll]);

  // Cleanup any pending hover-close timers when component unmounts
  useEffect(() => {
    return () => {
      if (browseHoverTimeoutRef.current) {
        clearTimeout(browseHoverTimeoutRef.current);
      }
    };
  }, []);

  // Handlers for smooth open/close of the top-level Browse menu
  const handleBrowseEnter = () => {
    if (browseHoverTimeoutRef.current) {
      clearTimeout(browseHoverTimeoutRef.current);
    }
    setBrowseOpen(true);
  };

  const handleBrowseLeave = () => {
    // Small delay prevents flicker when moving between parent and dropdown
    browseHoverTimeoutRef.current = setTimeout(() => {
      setBrowseOpen(false);
    }, 120);
  };

  return (
    <>
      {contextHolder}
      <div className="gen-navbar-container relative">
        {isMobile ? (
          <div className="w-100">
            <div className="gen-navbar-small">
              <div className="gen-navbar-inner">
                <div className="gen-navbar-left">
                  <Link to={"/"}>
                    <img
                      src={"/assets/images/logo.webp"}
                      width={"100%"}
                      alt="azotto-logo"
                      fetchPriority="high"
                    />
                  </Link>
                </div>
                <div className="gen-navbar-right">
                  <Flex align="center" gap={10}>
                    <Button
                      className="bg-transparent border-0 p-0"
                      onClick={() => setVisible(true)}
                    >
                      <img
                        src="/assets/icons/menu-icon.png"
                        alt="hamburger icon"
                        width={30}
                        fetchPriority="high"
                      />
                    </Button>
                    {isshow && isMobile && (
                      <Popover
                        content={dropdownContent}
                        trigger="click"
                        placement="bottomRight"
                        open={dropdownOpen}
                        onOpenChange={handleDropdownChange}
                      >
                        <Badge
                          size="small"
                          count={unreadCount}
                          overflowCount={99}
                        >
                          <Button
                            aria-labelledby="Notification"
                            className="bg-transparent border-0 p-0"
                          >
                            <Image
                              src="/assets/icons/notification.png"
                              width={"28px"}
                              preview={false}
                              alt="notification icon"
                              className="up"
                              fetchPriority="high"
                            />
                          </Button>
                        </Badge>
                      </Popover>
                    )}
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={"gen-navbar"}>
            <div className="gen-navbar-inner container">
              <Flex gap={20} align="center">
                <div className="gen-navbar-left">
                  <Link to={"/"}>
                    <img
                      src="/assets/images/logo.svg"
                      width={"100%"}
                      className="one"
                      alt="azotto-logo"
                      fetchPriority="high"
                    />
                  </Link>
                </div>
                <ul className="nav-list">
                  <li
                    onMouseEnter={handleBrowseEnter}
                    onMouseLeave={handleBrowseLeave}
                    className={browseOpen ? "open" : ""}
                  >
                    <NavLink to={""}>
                      <Flex gap={10}>
                        <Text className="text-white nav-item">
                          {t("Purchased Vehicles")}
                        </Text>
                        <DownOutlined className="fs-12 text-white" />
                      </Flex>
                    </NavLink>

                    <ul
                      className="dropdown"
                      style={{ display: browseOpen ? "block" : undefined }}
                    >
                      <li className="drop-item">
                        <NavLink
                          to={"/businesslisting"}
                          className="drop-link"
                          onClick={() => setGetCategory(null)}
                        >
                          <Flex gap={10} align="center">
                            <Image
                              src={"/assets/icons/browseall.png"}
                              alt="browse all icon"
                              width={30}
                              height={30}
                              className="pt-1s"
                              preview={false}
                              fetchPriority="high"
                            />
                            <Flex
                              justify="space-between"
                              gap={50}
                              align="flex-start"
                              className="w-100"
                            >
                              <Title level={5} className="m-0 fw-500">
                                {t("Browse All")}
                              </Title>
                              <ArrowRightOutlined className="arr text-brand pt-1s" />
                            </Flex>
                          </Flex>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </Flex>
              <Flex gap={10} align="center">
                {!isAuthenticated ? (
                  <>
                    <Button
                      className="btn border-gray text-black"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                    <Button
                      className="btn bg-brand"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                    <Button className="btn bg-brand" onClick={connectWallet}>
                      Connect Wallet
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="btn bg-brand"
                      onClick={() => navigate("/sellvincreate")}
                    >
                      Create Listing
                    </Button>
                    <Dropdown menu={{ items }} trigger={["click"]}>
                      <Flex align="center" gap={8} style={{ cursor: "pointer" }}>
                        <Avatar className="bg-light-brand text-brand">
                          {walletAddress?.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <DownOutlined className="text-white fs-12" />
                      </Flex>
                    </Dropdown>
                  </>
                )}
              </Flex>
            </div>
          </div>
        )}
      </div>
      <Modal
        title={t("Select your role")}
        open={roleModalOpen}
        onCancel={() => setRoleModalOpen(false)}
        centered
        footer={
          <Flex justify="center" gap={8}>
            <Button
              className="btn text-black border-gray"
              onClick={() => setRoleModalOpen(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              className="btn bg-brand"
              onClick={handleRoleConfirm}
              loading={updateUserLoading}
            >
              {t("Continue")}
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap={12}>
          <Text className="fs-14 text-gray">
            {t("Please choose the role you are here for on our platform.")}
          </Text>
          <Radio.Group
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <Flex vertical gap={8}>
              <Radio value="DEALER">{t("Dealer")}</Radio>
              <Radio value="SELLER">{t("Seller")}</Radio>
              <Radio value="CUSTOMER">{t("Customer")}</Radio>
            </Flex>
          </Radio.Group>
        </Flex>
      </Modal>
      <MobileNavbar visible={visible} onClose={() => setVisible(false)} />
    </>
  );
};

export { Navbar };
