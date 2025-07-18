import { Text } from "@twilio-paste/core";
import { Menu, MenuButton, MenuItem, useMenuState } from "@twilio-paste/menu";
import { Client, ConnectionState, User } from "@twilio/conversations";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readUserProfile } from "../api";
import { LOGO_SUB_TITLE, LOGO_TITLE } from "../branding";
import { AppState } from "../store";
import styles from "../styles";
import { getTranslation } from "./../utils/localUtils";
import { Avatar } from "./Avatar";
import UserProfileModal from "./modals/UserProfileModal";

type AppHeaderProps = {
  user: string;
  onSignOut: () => void;
  connectionState: ConnectionState;
  client?: Client;
};
const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  onSignOut,
  connectionState,
  client,
}) => {
  const menu = useMenuState();

  const [showUserProfileModal, setUserProfileModal] = useState(false);

  const [userProfile, setUserProfile] = useState<User | undefined>(undefined);

  const handleUserProfileModalClose = () => setUserProfileModal(false);

  const local = useSelector((state: AppState) => state.local);
  const online = getTranslation(local, "online");
  const connecting = getTranslation(local, "connecting");
  const offline = getTranslation(local, "offline");
  const signout = getTranslation(local, "signout");
  const userProfileTxt = getTranslation(local, "userProfileTxt");

  const label: "online" | "connecting" | "offline" = useMemo(() => {
    switch (connectionState) {
      case "connected":
        return "online";
      case "connecting":
        return "connecting";
      default:
        return "offline";
    }
  }, [connectionState]);

  const handleUserProfileModalOpen = async () => {
    const userProfileTemp = await readUserProfile(user, client);
    setUserProfile(userProfileTemp);
    setUserProfileModal(true);
  };

  // const handleAllowNotificationPermissions = async () => {
  //   const permission = await Notification.requestPermission();
  //   console.log("Notification permission requested");
  //   if (permission !== "granted") {
  //     alert(
  //       "You need to allow notification permissions to receive updates from the app."
  //     );
  //   }
  // };

  return (
    <div style={styles.appHeader}>
      <div style={styles.flex}>
        <div style={styles.appLogoTitle}>
          {LOGO_TITLE}
          <div style={styles.appLogoSubTitle}>{LOGO_SUB_TITLE}</div>
        </div>
      </div>
      <div style={styles.userTile}>
        {/* {Notification.permission !== "granted" && (
          <Button
            variant="secondary"
            size="small"
            onClick={handleAllowNotificationPermissions}
          >
            Allow Notification Permissions
          </Button>
        )} */}
        <div
          style={{
            padding: "0 10px",
            textAlign: "right",
          }}
        >
          <Text as="span" style={styles.userName}>
            {user}
          </Text>
          <Text
            as="span"
            color={
              label === "online"
                ? "colorTextPrimaryWeak"
                : label === "connecting"
                ? "colorTextIconBusy"
                : "colorTextWeaker"
            }
            style={styles.userStatus}
          >
            {label === "online"
              ? online
              : label === "connecting"
              ? `${connecting}...`
              : offline}
          </Text>
        </div>
        <MenuButton {...menu} variant="link" size="reset">
          <Avatar name={user} />
        </MenuButton>
        <Menu {...menu} aria-label="Preferences">
          <MenuItem {...menu} onClick={onSignOut}>
            {signout}
          </MenuItem>
          <MenuItem {...menu} onClick={handleUserProfileModalOpen}>
            {userProfileTxt}
          </MenuItem>
        </Menu>
      </div>
      {showUserProfileModal && (
        <UserProfileModal
          isModalOpen={showUserProfileModal}
          handleClose={handleUserProfileModalClose}
          user={userProfile}
        ></UserProfileModal>
      )}
    </div>
  );
};

export default AppHeader;
