import { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Context } from "../../context/index";
import { DarkModeContext } from "../../context/DarkModeContext";
import { Tree, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";
import { getReferralByIdApi } from "../../components/api";

const Organization = () => {
  const {
    state: { user },
  } = useContext(Context);
  const { isDarkMode } = useContext(DarkModeContext);

  const mainUser = user?.user;
  const mainUserId = mainUser?._id;

  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Recursive Tree Function
  const tree = async (user, userId) => {
    try {
      const res = await getReferralByIdApi(userId);

      // Check if data exists
      if (res?.data?.user?.length > 0) {
        const referrals = res.data.user[0]?.referrals || [];
        const children = [];

        for (const item of referrals) {
          const child = {
            title: (
              <>
                <UserOutlined
                  style={{
                    marginRight: "5px",
                    color: "#1890ff",
                  }}
                />
                {item.user?.name || "Anonymous"} (BV:78437843)
                {/* {item.user?.name || "Anonymous"} (BV:{item.user?._id}) */}
              </>
            ),

            key: item.user?._id,
            icon: (
              <UserOutlined
                style={{
                  color: "#1890ff",
                }}
              />
            ),
            children: [],
          };
          child.children = await tree(item.user, item.user?._id); // Call tree recursively for each referral's user
          children.push(child);
        }
        return children;
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  useEffect(() => {
    const generateTreeData = async () => {
      if (mainUser) {
        const data = await tree(mainUser, mainUserId);
        setTreeData(data);
        // Get all the keys from the treeData and set them as expanded keys
        const allKeys = [];
        const extractKeys = (treeData) => {
          treeData.forEach((item) => {
            allKeys.push(item.key);
            if (item.children && item.children.length > 0) {
              extractKeys(item.children);
            }
          });
        };
        extractKeys(data);
        setExpandedKeys(allKeys);
      }
    };
    generateTreeData();
  }, [mainUser, mainUserId]);

  return (
    <UserRoute>
      <h1 className="jumbotron text-center square">🏛️ Your Organization</h1>
      <Card title="Your Team">
        <Tree
          showLine
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          treeData={treeData}
        />
      </Card>
    </UserRoute>
  );
};

export default Organization;
