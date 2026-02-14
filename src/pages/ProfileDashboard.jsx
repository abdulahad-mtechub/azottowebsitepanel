import {
  Breadcrumb,
  Flex,
  Typography,
  Button,
  Row,
  Col,
  Card,
  Segmented,
  Avatar,
  Grid,
} from "antd";
import {
  ArrowLeftOutlined,
  MenuOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {

  AllVehicles,
  Basicinformation,
  BuyerPurchasedVehicle,
  Changepassword,
  CustomTabs,
  Editprofile,
  ModuleTopHeading,
  Profilestatistics,
  SellerAlerts,
  SoldVehicles,
  ProfileSidebar,
} from "../components";
import { useEffect, useState, useMemo } from "react";
import {
  NAVUSERDATA,
  ME,
} from "../graphql/query";
import { useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useFormatNumber } from "../hooks";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const ProfileDashboard = () => {
  const userId = Cookies.get("userId");
  const navigate = useNavigate();
  const { formatNumber } = useFormatNumber();
  const screens = useBreakpoint();

  const profiletabData = {
    Seller: [
      { key: "sellerdashboard", label: "Dashboard" },
      {
        key: "sellerlist",
        label: "My Vehicles",
        children: [
          { key: "sellerBusiness", label: "All Vehicles" },
          { key: "sellerSoldBusiness", label: "Sold Vehicles" },
        ],
      },
      { key: "selleralert", label: "Notifications" },
      { key: "sellerwallet", label: "Settings" },
    ],
    Buyer: [
      { key: "buyerdashboard", label: "Dashboard" },
      { key: "purchasedvehicles", label: "Purchased Vehicles" },
      { key: "buyeralert", label: "Notifications" },
      { key: "buyerwallet", label: "Settings" },
    ],
    Dealer: [
      { key: "dealerdashboard", label: "Dashboard" },
      {
        key: "dealerlist",
        label: "Purchased Vehicles",
        children: [
          { key: "dealerBusiness", label: "Verified VINs" },
          { key: "dealerSoldBusiness", label: "Requests" },
        ],
      },
      { key: "dealertransactions", label: "Transactions" },
      { key: "dealeralert", label: "Notifications" },
      { key: "dealerwallet", label: "Settings" },
    ],
  };

  const roleToParentTab = {
    SELLER: "Seller",
    CUSTOMER: "Buyer",
    DEALER: "Dealer",
  };

  const getInitialParentTab = () => {
    const saved = localStorage.getItem("profileParentTab");
    return saved === "Seller" || saved === "Buyer" || saved === "Dealer"
      ? saved
      : "Seller";
  };  

  const getInitialChildTabs = () => {
    const saved = localStorage.getItem("profileChildTabs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {
      Seller: profiletabData.Seller?.[0]?.key,
      Buyer: profiletabData.Buyer?.[0]?.key,
      Dealer: profiletabData.Dealer?.[0]?.key,
    };
  };
  
  // Get current month start and end dates
  const getCurrentMonthRange = () => {
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
    return [dayjs(startDate), dayjs(endDate)];
  };

  const [parentTab, setParentTab] = useState(getInitialParentTab);
  const [addwalletvisible, setAddWalletVisible] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [dateRange, setDateRange] = useState(getCurrentMonthRange);
  const [getUser, { data: me }] = useLazyQuery(NAVUSERDATA);
  const [getUserDetails, { data: meDetails }] = useLazyQuery(ME);

  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isedit, setIsEdit] = useState(false);
  const [activeChildTab, setActiveChildTab] = useState(getInitialChildTabs);

  useEffect(() => {
    if (userId) {
      getUser({ variables: { getNavUserId: userId } });
      getUserDetails({ variables: { getUserId: userId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (me?.getNavUser) {
      setUser(me.getNavUser);
    }
  }, [me]);

  useEffect(() => {
    if (meDetails?.getUser) {
      setUserRole(meDetails.getUser.role || null);
    }
  }, [meDetails]);

  const allowedParentTabs = useMemo(() => {
    const role = userRole;
    const mapped = role ? roleToParentTab[role] : null;
    return mapped ? [mapped] : ["Seller", "Buyer", "Dealer"];
  }, [userRole]);

  const segmentedOptions = useMemo(() => {
    return allowedParentTabs.map((tab) => ({
      label: tab === "Buyer" ? "Customer" : tab,
      value: tab,
    }));
  }, [allowedParentTabs]);

  useEffect(() => {
    if (!userRole) return;
    const mapped = roleToParentTab[userRole];
    if (!mapped) return;
    setParentTab(mapped);
    const firstTabKey = profiletabData[mapped]?.[0]?.key;
    if (firstTabKey) {
      setActiveChildTab((prev) => ({
        ...prev,
        [mapped]: firstTabKey,
      }));
    }
  }, [userRole]);

  // Fetch seller stats with date range
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
    }
  }, [dateRange]);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("profileParentTab", parentTab);
  }, [parentTab]);

  useEffect(() => {
    localStorage.setItem("profileChildTabs", JSON.stringify(activeChildTab));
  }, [activeChildTab]);

  const handleParentChange = (value) => {
  if (dateRange?.[0] && dateRange?.[1]) {
    const startDate = dateRange[0].format("YYYY-MM-DD");
    const endDate = dateRange[1].format("YYYY-MM-DD");

    if (value === "Seller") {

    }

    if (value === "Buyer") {
      getBuyerUser({ variables: { startDate, endDate } });
    }

    if (value === "Dealer") {
      
    }
  }

  setParentTab(value);

  const firstTabKey = profiletabData[value]?.[0]?.key;
  if (firstTabKey) {
    setActiveChildTab((prev) => ({
      ...prev,
      [value]: firstTabKey,
    }));
  }
};


  const dealerStatisticsData = useMemo(() => {

  
    // set dummy stat
    const stats = {
      favouriteBusinessesCount: 15,
      vinsVerified: 8,
      finalizedDealsCount: 3,
    }
    return [
      {
        title: "Favourite Businesses",
        value: stats.favouriteBusinessesCount,
      },
      {
        title: "VINs Verified",
        value: stats.vinsVerified,
      },
      {
        title: "Finalized Deals",
        value: stats.finalizedDealsCount,
      },
    ];
  }, [ formatNumber]);
  
  const tabContent = {
    Seller: {
      sellerdashboard: (
        <Flex vertical gap={20}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={"Profile"} />
            <Flex gap={5}>
              <Button
                aria-labelledby="Password Manager"
                className="btn rounded-8 border-brand text-brand"
                type="button"
                onClick={() => setVisible(true)}
              >
                {"Password Manager"}
              </Button>
              <Button
                aria-labelledby="Edit Profile"
                className="btn bg-brand rounded-8"
                type="button"
                onClick={() => setIsEdit(true)}
              >
                {"Edit Profile"}
              </Button>
            </Flex>
          </Flex>
          <Basicinformation
            title={"Basic Information"}
          />
          <Profilestatistics
           
            title={"Profile Statistics"}
            dateRange={dateRange}
   
          />
        </Flex>
      ),
      sellerBusiness: <AllVehicles />,
      sellerSoldBusiness: (
        <Flex vertical gap={20}>
          <Flex align="center">
            <ModuleTopHeading level={4} name={"Sold Businesses"} />
          </Flex>
          <SoldVehicles />
        </Flex>
      ),
      selleralert: (
        <Flex vertical gap={20}>
          <ModuleTopHeading level={4} name={"Alerts"} />
          <SellerAlerts />
        </Flex>
      ),
    },
    Dealer: {
      dealerdashboard: (
        <Flex vertical gap={20}>
        <Flex justify="space-between">
          <ModuleTopHeading level={4} name={"Profile"} />
          <Flex gap={5}>
            <Button
              aria-labelledby="Password Manager"
              className="btn rounded-8 border-brand text-brand"
              type="button"
              onClick={() => setVisible(true)}
            >
              {"Password Manager"}
            </Button>
            <Button
              aria-labelledby="Edit Profile"
              className="btn bg-brand rounded-8"
              type="button"
              onClick={() => setIsEdit(true)}
            >
              {"Edit Profile"}
            </Button>
          </Flex>
        </Flex>
        <Basicinformation
          title={"Basic Information"}
        />
        <Profilestatistics
          title={"Profile Statistics"}
          dateRange={dateRange}
        />
      </Flex>
      ),
      dealerBusiness: <AllVehicles />,
      dealerSoldBusiness: <SoldVehicles />,
      dealeralert: <SellerAlerts />,
    },
    
    Buyer: {
      buyerdashboard: (
        <Flex vertical gap={20}>
          <Flex justify="space-between">
            <ModuleTopHeading level={4} name={"Profile"} />
            <Flex gap={5}>
              <Button
                aria-labelledby="Password Manager"
                className="btn rounded-8 border-brand text-brand"
                type="button"
                onClick={() => setVisible(true)}
              >
                {"Password Manager"}
              </Button>
              <Button
                aria-labelledby="Edit Profile"
                className="btn bg-brand rounded-8"
                type="button"
                onClick={() => setIsEdit(true)}
              >
                {"Edit Profile"}
              </Button>
            </Flex>
          </Flex>
          <Basicinformation
            title={"Basic Information"}
          />
          <Profilestatistics
            title={"Profile Statistics"}
            dateRange={dateRange}
          />
        </Flex>
      ),
      buyervehicles: (
        <>
          <BuyerPurchasedVehicle />
        </>
      ),
      buyeralert: (
        <>
          <Flex vertical gap={20}>
            <ModuleTopHeading level={4} name={"Alerts"} />
            <SellerAlerts />
          </Flex>
        </>
      ),
    },
  };
  const isMobileOrTablet = !screens.lg;
  const handleButtonClick = () => {
    if (isMobileOrTablet) {
      setIsSidebarVisible(true);
    } else {
      navigate(-1);
    }
  };

  const buttonTooltipTitle = isMobileOrTablet
    ? "Profile Sidebar"
    : "Go Back";

  const buttonIcon = isMobileOrTablet ? (
    <MenuOutlined className="fs-16" />
  ) : (
    <ArrowLeftOutlined className="fs-16" />
  );

  return (
    <div className="padd mb-2">
      <div className="container">
        <Flex className="mt-3" gap={5} align="flex-start" vertical>
          <Button
            aria-labelledby={buttonTooltipTitle}
            className="btn border-gray text-black p-2 d-lg-none"
            type="button"
            onClick={handleButtonClick}
          >
            {buttonIcon}
          </Button>
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
                    className="fs-13 text-gray"
                    onClick={() => navigate("/")}
                  >
                    {"Home"}
                  </Text>
                ),
              },
              {
                title: (
                  <Text className="fw-500 fs-13 text-black">
                    {"Profile"}
                  </Text>
                ),
              },
            ]}
          />
        </Flex>

        <Row gutter={[24, 24]} className="mt-3">
          <Col xs={0} sm={0} md={0} lg={8} xl={6}>
            <Card className="radius-12 border-gray">
              <Flex vertical gap={30}>
                <Flex vertical align="center" justify="center" gap={5}>
                  <Avatar
                    size={40}
                    className="fs-16 text-brand fw-bold bg-light-brand textuppercase"
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <Title level={5} className="fw-500">
                    {user?.name?.charAt(0)?.toUpperCase() +
                      user?.name?.slice(1)}
                  </Title>
                </Flex>
                <Flex vertical gap={10}>
                  <Flex justify="center">
                  <Segmented
                    className="custom-segment"
                    options={segmentedOptions}
                    value={parentTab}
                    onChange={handleParentChange}
                  />
                  </Flex>
                  <div className="text-center mt-4">
                    <CustomTabs
                      items={profiletabData[parentTab]}
                      activeKey={activeChildTab[parentTab]}
                      onChange={(key) => {
                        setActiveChildTab((prev) => ({
                          ...prev,
                          [parentTab]: key,
                        }));
                      }}
                    />
                  </div>
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={16} xl={18}>
            {tabContent?.[parentTab]?.[activeChildTab[parentTab]] || (
              <div>{"Invalid Tab"}</div>
            )}
          </Col>
        </Row>
      </div>

      <ProfileSidebar
        visible={isSidebarVisible}
        parentTab={parentTab}
        user={user}
        activeChildTab={activeChildTab}
        profiletabData={profiletabData}
        handleParentChange={handleParentChange}
        setActiveChildTab={setActiveChildTab}
        segmentedOptions={segmentedOptions}
        onClose={() => setIsSidebarVisible(false)}
      />

      <Changepassword visible={visible} onClose={() => setVisible(false)} />
      <Editprofile
        visible={isedit}
        onClose={() => setIsEdit(false)}
        userData={user}
      />
    </div>
  );
};

export { ProfileDashboard };
