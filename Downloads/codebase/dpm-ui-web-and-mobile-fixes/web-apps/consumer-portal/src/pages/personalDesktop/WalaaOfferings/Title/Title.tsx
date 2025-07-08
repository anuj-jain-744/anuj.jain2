import React from "react";

import style from './Title.module.scss';

interface Props {
    title: string;
    description: string;
}

const Title:React.FC<Props> = ({title, description}) => {
    return (
        <div className={style.container}>
            <div className={style.titleLabel}>{title}</div>
            <div className={style.descriptionLabel}>{description}</div>
        </div>
    )
}

export default Title;