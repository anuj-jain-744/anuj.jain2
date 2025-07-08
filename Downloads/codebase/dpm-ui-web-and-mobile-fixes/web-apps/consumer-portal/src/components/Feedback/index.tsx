import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { callAPI, RootState, TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";
import { DataContext } from "../../DataContext";
const { VITE_BACKEND_BASE_URL } = import.meta.env;

import p1 from "../../assets/Feedback/Poor.svg";
import p2 from "../../assets/Feedback/Fair.svg";
import p3 from "../../assets/Feedback/Good.svg";
import p4 from "../../assets/Feedback/VeryGood.svg";
import p5 from "../../assets/Feedback/Excellent.svg";

import s1 from "../../assets/Feedback/PoorS.svg";
import s2 from "../../assets/Feedback/FairS.svg";
import s3 from "../../assets/Feedback/GoodS.svg";
import s4 from "../../assets/Feedback/VeryGoodS.svg";
import s5 from "../../assets/Feedback/ExcellentS.svg";

import t1 from "../../assets/Feedback/PoorT.svg";
import t2 from "../../assets/Feedback/FairT.svg";
import t3 from "../../assets/Feedback/GoodT.svg";
import t4 from "../../assets/Feedback/VeryGoodT.svg";
import t5 from "../../assets/Feedback/ExcellentT.svg";

import v1 from "../../assets/Feedback/PoorV.svg";
import v2 from "../../assets/Feedback/FairV.svg";
import v3 from "../../assets/Feedback/GoodV.svg";
import v4 from "../../assets/Feedback/VeryGoodV.svg";
import v5 from "../../assets/Feedback/ExcellentV.svg";

import { Bounce, toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ThemeButton from "../../../src/claims/register/TrackClaim/utils/BaseButton";
import ThemeTextarea from "components/ThemeComponents/ThemeTextarea";
// Example smiley images URLs or paths

interface LanguageData {
  how_likely_recommend: string;
  feedback: string;
  feedback_window_description: string;
  feed_back_text: string;
  how_feel: string;
  your_input: string;
  loading: string;
}

const smileyImages = [
  { src: p1 },
  { src: p2 },
  { src: p3 },
  { src: p4 },
  { src: p5 },
];

const smileySelectedImages = [
  { src: s1 },
  { src: s2 },
  { src: s3 },
  { src: s4 },
  { src: s5 },
];

const smileyImagesTravel = [
  { src: t1 },
  { src: t2 },
  { src: t3 },
  { src: t4 },
  { src: t5 },
];
const smileySelected = [
  { src: v1 },
  { src: v2 },
  { src: v3 },
  { src: v4 },
  { src: v5 },
];
interface FeedbackSectionProps {
  url: string;
  feedbackData: { ownerId: string, rating?: number, message?: string };
  feedbackType?: boolean;
  hideHeader?: boolean;
  handleClose?: () => void;
  onSliderOpen?: (val: boolean) => void
}

const Feedback: React.FC<FeedbackSectionProps> = ({
  url,
  feedbackData,
  feedbackType,
  hideHeader = false,
  handleClose,
  onSliderOpen,
}) => {
  const [rating, setRating] = useState(0); // Default to 0 to always have smilies unselected
  const [emojiTextArray, setEmojiTextArray] = useState<string[]>([]); // Default to empty array
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedIndex, setselectedIndex] = useState<number>();
  const [ratingText, setRatingText] = useState<string>("");
  const userID = useSelector((state: RootState) => state.auth.userInfo?.userId);
  const [showOpenSlider, setShowOpenSlider] = useState(false); // Add state to control openslider visibility

  const handleOpenModal = (itemindex: number) => {
    setselectedIndex(itemindex);
    setShowOpenSlider(true);
    onSliderOpen?.(true)
  };

  const handleCloseModal = () => {
    handleClose?.();
    setShowOpenSlider(false);
    onSliderOpen?.(false)
  };

  const handleSubmit = () => {
    fetchData();
    handleCloseModal();
  };


  const languageData = useContext<LanguageData | null>(DataContext);

  const setSliderValue = (index: number) => {
    setRating(index + 1);
    setselectedIndex(index);
    setShowOpenSlider(true);
    onSliderOpen?.(true);
    // Reset the timer if clicked again
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set a new timer
    // timerRef.current = setTimeout(() => {
    //     feedbackData.rating = index + 1;
    //     //point to trigger the API call
    //     fetchData();
    // }, 5000);
  };

  const fetchData = async () => {
    try {
      feedbackData = {
        ...feedbackData,
        rating: rating + 1,
        message: ratingText,
      };
      feedbackData.ownerId = feedbackData.ownerId ?? userID;
      const response = await callAPI(
        "post",
        VITE_BACKEND_BASE_URL + url,
        feedbackData
      );

      if (
        response?.message?.toUpperCase() === "SUCCESS" ||
        response?.status?.toUpperCase() === "MATCH"
      ) {
        toast.success(response?.data?.message, {
          icon: <CheckCircleIcon />,
          className: "success-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else if (
        response?.message?.toUpperCase() === "ERROR" ||
        response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR"
      ) {
        toast.error(response?.errors[0]?.messages?.message_en, {
          icon: <WarningAmberOutlinedIcon />,
          className: "error-cust",
          position: "top-right",
          autoClose: TOAST_AUTOCLOSE_TIMER || false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Feedback Submit failed with error", error);
      toast.error("Feedback Submit Failed With Error", {
        icon: <WarningAmberOutlinedIcon />,
        className: "error-cust",
        position: "top-right",
        autoClose: TOAST_AUTOCLOSE_TIMER || false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const receivedText = e?.target?.value;
    // setRatingText(receivedText);
    if (receivedText.length <= 1000) {
      setRatingText(receivedText);
    }
  };

  useEffect(() => {
    const textArray = languageData?.feedback?.split(",");
    setEmojiTextArray(textArray || []);
    // Cleanup the timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return (
    <>
      {languageData && (
        <>
          <div
            className={`${feedbackType ? "innerContainerSurvey" : "innerContainerFeedback"
              }`}
          >
            {!hideHeader && (
              <div className="FeebackText">
                {languageData?.how_likely_recommend}
              </div>
            )}
            {rating > -1 && !showOpenSlider && (
              <div className="feedbackEmojiSection">
                {!feedbackType ? (
                  smileyImages.map((item, index) => (
                    <div
                      className="emojiContainer"
                      key={index}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSliderValue(index)}
                    >
                      {rating === index + 1 ? (
                        <>
                          <img
                            src={smileySelectedImages[index].src}
                            alt={`Selected emoji ${index + 1}`}
                          />
                          <label className="selectedLbl">
                            {emojiTextArray[index]}
                          </label>
                        </>
                      ) : (
                        <>
                          <img
                            src={item.src}
                            alt={`Unselected emoji ${index + 1}`}
                          />
                          <label>{emojiTextArray[index]}</label>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    {smileyImagesTravel.map((item, index) => (
                      <div
                        className="emojiContainer"
                        key={index}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSliderValue(index)}
                      >
                        <>
                          <img
                            src={item.src}
                            alt={`Unselected emoji ${index + 1}`}
                            data-testid={`image_travel_${index}`}
                            //onClick={() => handleOpenModal(index)}
                          />
                        </>

                      </div>
                    ))}

                  </>

                )}
              </div>
            )}

            {showOpenSlider && (
              <div className="openslider">
                <div className="howfeel">{languageData?.how_feel ?? ""}</div>
                <div className='emojipopuptext'>
                  {feedbackType ? (
                    smileyImagesTravel.map((item, index) => (
                      <div className='emojiContainer' key={index} role="button" tabIndex={0} onClick={() => {
                        setRating(index + 1);
                        setselectedIndex(index);
                      }}>
                        <img
                          src={selectedIndex === index ? smileySelected[index].src : item.src}
                          alt={`emoji-${index}`}
                        />
                        {selectedIndex === index && (
                          <div className="curved-grey-box">
                            <div className="curved-grey-boxText">
                              {emojiTextArray[index]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    smileyImages.map((item, index) => (
                      <div className='emojiContainer' key={index} role="button" tabIndex={0} onClick={() => {
                        setRating(index + 1);
                        setselectedIndex(index);
                      }}>
                        <img
                          src={selectedIndex === index ? smileySelectedImages[index].src : item.src}
                          alt={`emoji-${index}`}
                        />
                        {selectedIndex === index && (
                          <div className="curved-grey-box">
                            <div className="curved-grey-boxText">
                              {emojiTextArray[index]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <p className="your-input-text">{languageData?.your_input}</p>
                <ThemeTextarea
                  placeholder="Add a comment"
                  classes="themetextarea-cust feedback-textarea"
                  value={ratingText}
                  onChangehandler={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                />
                <div className="char-text"> <p>Max <span>1000</span> Character</p></div>

                <div className='button-align'>
                  <ThemeButton classes="walaa-medium-500 feedbackbtn" variant="trackClaim"
                    // isDisabled={false} 
                    title="Submit Feedback"
                    icon={true} onClickhandler={handleSubmit} />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Feedback;
