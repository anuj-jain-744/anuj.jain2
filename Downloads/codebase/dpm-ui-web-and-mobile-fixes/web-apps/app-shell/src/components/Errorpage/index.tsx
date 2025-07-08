import React, { useEffect } from 'react';
import './index.scss'; // Assuming you have a corresponding SCSS file for styling
import { useLocation, useNavigate } from 'react-router-dom';

export const Errorpage = () => {
  const location = useLocation()
  const navigate = useNavigate();

  useEffect(() => {
    if(location.pathname !== "/") {
      navigate("/");
    }
  }, [location.pathname])

 return (
    <div className="error-page">
      <h1>Oops!</h1>
      <p>Something went wrong. Please try again!</p>
    </div>
  );
};

export default Errorpage
