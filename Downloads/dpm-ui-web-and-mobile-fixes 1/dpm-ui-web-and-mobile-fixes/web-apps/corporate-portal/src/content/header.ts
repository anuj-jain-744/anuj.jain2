import {
  OrgShufflePhone,
  OrgShuffleEmail,
  OrgShuffleLocation,
  OrgShuffleMessage,
  OrgShuffleChat,
  OrgShuffleLogo,
  WhiteShufflePhone,
  WhiteShuffleEmail,
  WhiteShuffleLocation,
  WhiteShuffleMessage,
  WhiteShuffleChat,
  WhiteShuffleLogo,
  WhatsappIcon,
  EnglishIcon,
  ArabicIcon,
  MotorNavitem,
  MotorNavBanner,
  ClaimIcon,
} from "../assets/Header";

import { AppleStore, HuaweiStore, AndroidStore } from "../assets/Footer";

export const HeaderContent = {
  shuffle: {
    org: [
      OrgShufflePhone,
      OrgShuffleEmail,
      OrgShuffleLocation,
      OrgShuffleMessage,
      OrgShuffleChat,
      OrgShuffleLogo,
    ],
    white: [
      WhiteShufflePhone,
      WhiteShuffleEmail,
      WhiteShuffleLocation,
      WhiteShuffleMessage,
      WhiteShuffleChat,
      WhiteShuffleLogo,
    ],
  },
  languageContent: [
    { key: "ar", label: "Arabic", image: ArabicIcon, subLabel: "العربية" },
    { key: "en",label: "English", image: EnglishIcon, subLabel: "Worldwide" },
  ],
};
