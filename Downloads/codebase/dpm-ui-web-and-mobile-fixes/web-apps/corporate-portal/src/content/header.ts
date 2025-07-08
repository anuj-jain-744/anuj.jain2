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
  EnglishIcon,
  ArabicIcon,
  BlueBranchLocator,
  BlueContact,
  BlueContactPerson,
  BlueFeedback,
  BlueResponse,
  BlueWalaaLogo,
} from "../assets/Header";


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
    blue: [
      
      BlueContact,
      BlueFeedback,
      BlueBranchLocator,
      BlueResponse,
      BlueContactPerson,
      BlueWalaaLogo,
    ],
  },
  languageContent: [
    { key: "ar", label: "Arabic", image: ArabicIcon, subLabel: "العربية" },
    { key: "en",label: "English", image: EnglishIcon, subLabel: "Worldwide" },
  ],
};
