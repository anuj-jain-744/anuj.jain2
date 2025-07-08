import style from './style.module.scss';
interface EndorsementDetailsProps {
  label: string;
  value: string | number;
  class?: string
}
export const PolicyDetail: React.FC<EndorsementDetailsProps[]> = ({
  data,
}) => {
  return (
    <div className={style.topTable}>
      <div className={style.box}>
        <div className={style.boxContent}>
          {(data)?.map(
            (item: { label: string; value: string; class: string }, index: number) => (
              <div key={index} className={style.rowLabelValue}>
                <div className={style.packageHeading}>
                  {item?.label}
                </div>
                <div className={`${style.policyValue}  ${item?.class=='premium-amount' ? style.premiumAmount:""}`}>{item?.value}</div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
