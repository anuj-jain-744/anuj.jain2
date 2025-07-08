import React from 'react';
import successIcon from '../../assets/Claims/GreenSuccess.svg';
import './style.scss';

interface SuccessGreenProps {
    lblText: string;
    message: string;
}

const SuccessGreen: React.FC<SuccessGreenProps> = ({ lblText, message }) => {
    return (
        <>
            <div className='componentpopupStatusSection'>
                <img className='GreenIcon' src={successIcon} alt="Green Success Icon" />
                <div className='messageGreenSection'>
                    <label className='messageGreenSectionLbl'>{lblText}</label>
                </div>
                <p className='messageSection'>
                    {message}
                </p>
            </div>
            <br />
        </>
    );
};

export default SuccessGreen;