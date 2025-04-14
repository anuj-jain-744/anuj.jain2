import React from 'react';
import style from  './Error.module.scss'

const ErrorPage: React.FC = () => {
  return (
    <div className={style.errorContainer}>
      <h1 className={style.errorMessage}>Something went wrong.</h1>
    </div>
  );
};

export default ErrorPage;