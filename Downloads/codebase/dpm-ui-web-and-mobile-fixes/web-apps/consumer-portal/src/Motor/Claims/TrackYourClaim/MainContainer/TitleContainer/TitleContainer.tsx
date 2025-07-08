import React from 'react';
import style from './TitleContainer.module.scss';
interface Props {
  title: string,
}

const TitleContainer: React.FC<Props> = ({ title }) => {




  return (
    <div className={style.tycTitleContainer}>
      <div className={style.tycTitleFrame}>
        <div className={style.tycTitleFrameBox}>
          <div className={style.tycTitleFrameText}>
            {title}
          </div>

        </div>
      </div>
    </div>
  )
}

export default TitleContainer