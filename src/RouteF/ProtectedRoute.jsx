import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Result, Button, Typography, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  isAuthenticated,
  hasValidSession,
  getUserStatus,
} from "../utils/tokenManager";
import { refreshAccessToken } from "../utils/tokenRefreshService";

const { Text } = Typography;

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      const hasAccess = isAuthenticated();
      const hasSession = hasValidSession();

      // Case 1: Has access token - user is authenticated
      if (hasAccess) {
        setIsAuthorized(true);
        return;
      }

      // Case 2: No access token but has refresh token - try to recover
      if (!hasAccess && hasSession) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
        return;
      }

      setIsAuthorized(false);
    };

    checkAuth();
  }, [location.pathname]);
  // If not authorized, redirect to home
  if (!isAuthorized) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const userStatus = getUserStatus();
  const rawPath = location.pathname || "/";
  const pathname = rawPath.replace(/\/+$/, "") || "/";

  const isProfileDashboard =
    pathname === "/profiledashboard" || pathname === "/sellbusinesscreate";
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

  if (isUserInactive && isProfileDashboard) {
    return (
      <div
        className="padd-1 relative"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
        }}
      >
        <div className="container">
          <Result
            icon={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
            title={t("Account Verification Pending")}
            subTitle={
              <Text style={{ fontSize: "16px" }}>
                {t(
                  "Your account is not verified yet. Please contact support to verify your account. Once your account is verified, you will get full access to all features."
                )}
              </Text>
            }
            extra={[
              <Flex gap={10} justify="center" key="actions">
                <Button
                  type="primary"
                  key="home"
                  onClick={() => navigate("/")}
                  className="bg-brand"
                >
                  {t("Go to Home")}
                </Button>
                <Button
                  key="listings"
                  onClick={() => navigate("/businesslisting")}
                >
                  {t("View Business Listings")}
                </Button>
              </Flex>,
            ]}
          />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
