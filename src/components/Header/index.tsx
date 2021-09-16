import { useRecoilValue, } from 'recoil';
import { currentReportInfoSelector } from '../../modules/report/selectors';
import styles from './index.module.css';

export default function Header() {
  const currentReportInfo = useRecoilValue(currentReportInfoSelector);

  if (!currentReportInfo) {
    return null;
  }
  return (
    <div className={styles.title}>
      {currentReportInfo.name}
    </div>
  );
}