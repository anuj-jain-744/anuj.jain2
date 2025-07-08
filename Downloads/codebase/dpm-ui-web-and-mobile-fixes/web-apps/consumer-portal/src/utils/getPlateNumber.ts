import { LANGUAGE_ARABIC, LANGUAGE_ENGLISH, NOT_APPLICABLE } from "@dpm/shared-module";

export const getPlateNumber = (vehicleDetail: {
  plateNo?: string | null;
  plateNoText1?: string | null;
  plateNoText2?: string | null;
  plateNoText3?: string | null;
}) => {
  const plateNumber = vehicleDetail?.plateNo
    ? `${vehicleDetail.plateNo} - ${[
      vehicleDetail.plateNoText1,
      vehicleDetail.plateNoText2,
      vehicleDetail.plateNoText3,
    ]
      .map((text) => getPlateNumberLanguage(text))
      .join("")}`
    : NOT_APPLICABLE;

  return plateNumber;
};

const getPlateNumberLanguage = (
  vplateNoText: string | null | undefined,
  lang: string = LANGUAGE_ENGLISH
): string => {
  if (!vplateNoText) return "";
  const [enPlateNoText, arPlateNoText] = vplateNoText.split("-");
  return lang === LANGUAGE_ARABIC ? `${arPlateNoText} ` : enPlateNoText.trim();
};
