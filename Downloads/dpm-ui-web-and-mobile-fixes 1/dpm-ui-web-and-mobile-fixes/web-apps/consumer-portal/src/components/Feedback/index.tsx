import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSelector } from "react-redux";
import { callAPI, RootState } from "@dpm/shared-module";
import { DataContext } from '../../DataContext';
const { VITE_BACKEND_BASE_URL } = import.meta.env;

import p1 from '../../assets/Feedback/Poor.svg';
import p2 from '../../assets/Feedback/Fair.svg';
import p3 from '../../assets/Feedback/Good.svg';
import p4 from '../../assets/Feedback/VeryGood.svg';
import p5 from '../../assets/Feedback/Excellent.svg';

import s1 from '../../assets/Feedback/PoorS.svg';
import s2 from '../../assets/Feedback/FairS.svg';
import s3 from '../../assets/Feedback/GoodS.svg';
import s4 from '../../assets/Feedback/VeryGoodS.svg';
import s5 from '../../assets/Feedback/ExcellentS.svg';

import t1 from '../../assets/Feedback/PoorT.svg';
import t2 from '../../assets/Feedback/FairT.svg';
import t3 from '../../assets/Feedback/GoodT.svg';
import t4 from '../../assets/Feedback/VeryGoodT.svg';
import t5 from '../../assets/Feedback/ExcellentT.svg';

import { Bounce, toast } from 'react-toastify';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ThemeTextarea from "../../../src/claims/components/ThemeTextarea";
import ThemeButton from"../../../src/claims/register/TrackClaim/utils/BaseButton";
import { Modal } from 'react-bootstrap';
// Example smiley images URLs or paths
const smileyImages = [
    { src: p1 },
    { src: p2 },
    { src: p3 },
    { src: p4 },
    { src: p5 }
];

const smileySelectedImages = [
    { src: s1 },
    { src: s2 },
    { src: s3 },
    { src: s4 },
    { src: s5 }
];

const smileyImagesTravel = [
    { src: t1 },
    { src: t2 },
    { src: t3 },
    { src: t4 },
    { src: t5 }
];
interface FeedbackSectionProps {
    url: string,
    feedbackData: any,
    feedbackType?: boolean; 
    hideHeader?: boolean;
    handleClose?: () => void
}

const Feedback: React.FC<FeedbackSectionProps> = ({
  url,
  feedbackData,
  feedbackType,
  hideHeader = false,
  handleClose,
}) => {
    const [rating, setRating] = useState(0); // Default to 0 to always have smilies unselected
    const [emojiTextArray, setEmojiTextArray] = useState<string[]>([]); // Default to empty array
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showModal, setShowModal] = useState(false);                      
    const[selectedFeeling,setSelectedFeeling]=useState(null);
    const[selectedIndex,setselectedIndex]=useState<number>();
    const [ratingText, setRatingText] = useState<any>('');
    const userID = useSelector((state: RootState) => state.auth.userInfo?.userId);
    const handleOpenModal = (itemindex:number) => 
        {setShowModal(true);
            setselectedIndex(itemindex);

        }
    const handleCloseModal = () => {
    setShowModal(false)
    setSelectedFeeling(null);
    handleClose?.();
    };
    const handleSubmit = () => {
        fetchData();
        setShowModal(false);
        handleCloseModal();
    };
    interface LanguageData {
        how_likely_recommend: string;
        feedback: string;
        feedback_window_description:string;
        feed_back_text:string;
    }
    const languageData = useContext<LanguageData | null>(DataContext);


    const setSliderValue = (index: number) => {
        setRating(index + 1);

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
              ownerId: userID,
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

            if (response?.message?.toUpperCase() === "SUCCESS" || response?.status?.toUpperCase() === "MATCH") {
                toast.success(response?.data?.message, {
                    icon: <CheckCircleIcon />,
                    className: "success-cust",
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            } else if (response?.message?.toUpperCase() === "ERROR" || response?.message?.toUpperCase() === "INTERNAL_SERVER_ERROR") {
                toast.error(response?.errors[0]?.messages?.message_en, {
                    icon: <WarningAmberOutlinedIcon />,
                    className: "error-cust",
                    position: "top-right",
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            } else {
            }
        } catch (error) {
            console.error("Feedback Submit failed with error", error);
            toast.error("Feedback Submit Failed With Error", {
                icon: <WarningAmberOutlinedIcon />,
                className: "error-cust",
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        } finally {
        }
    };
    const handleChange = (e: any) => {
        const receivedText = e?.target?.value;
        setRatingText(receivedText);
    }
    useEffect(() => {
        const textArray = languageData?.feedback.split(',');
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
            {languageData ? (
               <> <div className={`${feedbackType ? "innerContainerSurvey"
                    : "innerContainerFeedback"}`}>
                    {!hideHeader && <div className='FeebackText'>
                        {languageData?.how_likely_recommend}
                    </div>}
                    {rating > -1 && (
                        <div className='feedbackEmojiSection'>
                            {!feedbackType ? (
                            smileyImages.map((item, index) => (
                                <div className='emojiContainer' key={index} onClick={() => setSliderValue(index)}>
                                    {rating === index + 1 ? (
                                        <>
                                            <img src={smileySelectedImages[index].src} alt={`Selected emoji ${index + 1}`} />
                                            <label className='selectedLbl'>{emojiTextArray[index]}</label>
                                        </>
                                    ) : (
                                        <>
                                            <img src={item.src} alt={`Unselected emoji ${index + 1}`} />
                                            <label>{emojiTextArray[index]}</label>
                                        </>
                                    )}

                                </div>
                            ))
                        ) : (<>
                        {smileyImagesTravel.map((item, index) => (
                                    <div className='emojiContainer' key={index} onClick={() => setSliderValue(index)}>
                                        <>
                                            <img src={item.src} alt={`Unselected emoji ${index + 1}`} onClick={()=>handleOpenModal(index)}/>

                                        </>


                                    </div>
                                ))}
                        
                        </>
                        )}
                        </div>
                    )}
                </div>
                <>
                <Modal show={showModal} onHide={handleCloseModal} className="modalContainer">
                            <Modal.Header closeButton>
                                <Modal.Title>{languageData?.feed_back_text}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <h5 className='feedback-pop-heading'>{languageData?.how_likely_recommend}</h5>
                                    <div className='emojipopuptext'>
                                    {smileyImagesTravel.map((item, index) => (
                                        <div className='emojiContainer' key={index}>
                                    <img src={item.src} alt={`Unselected emoji ${index + 1}`} />
                                     { selectedIndex===index &&
                                    <div className="curved-grey-box">
            <div className="curved-grey-boxText">
            {emojiTextArray[index]}
                </div>
          </div>
}
                                </div>
                            ))}
                        </div>
                        <p>{languageData?.feedback_window_description}</p>
                        <ThemeTextarea
                            placeholder="Add a comment"
                            classes="themetextarea-cust"
                            value={ratingText}
                            onChangehandler={(e) => handleChange(e)}
                        />
                                </Modal.Body>
                                <Modal.Footer>
                                <div className='button-align'>
                            <ThemeButton
                                classes="walaa-medium-500"
                                variant="trackClaim"
                                isDisabled={false}
                                title="Submit Feedback"
                                icon={true}
                                onClickhandler={handleSubmit}
                            />
                        </div>
</Modal.Footer>
                        </Modal>
                    </></>

            ) : (
                <div>Loading...</div>
            )}
        </>
    );
};

export default Feedback;
