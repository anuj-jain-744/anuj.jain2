import "./index.scss";

export default function BuyProductHeading({ heading, headingImage, classNames }: Readonly<{ heading: string; headingImage?:string; classNames?: string; }>) {
    return (
        <div className={`motor-vehical-heading ${classNames ?? ""}`} data-testid="vehicalHead">
            {heading}
            {headingImage && <img src={headingImage} alt={heading} />}
        </div>
    )
}