import cx from 'classnames';
import { useEffect, } from 'react';
import _ from 'lodash';
import { useRecoilValue, } from 'recoil';
import { reportIdsAtom, currentReportIdAtom, } from '../../modules/report/atom';
import useReportModule from '../../modules/report/hooks';
import styles from './index.module.css';
import { reportStore } from '../../store';
import { INormalizedReport, } from '../../types';

export default function ReportBar() {
  const reportIds = useRecoilValue(reportIdsAtom);
  // 通过所有主键去获取具体值 这个地方是获取所有的表格
  const reports = reportStore.useGetShallowValue(reportIds) as INormalizedReport[];
  const currReportId = useRecoilValue(currentReportIdAtom);
  const { initReports, changeReportId, } = useReportModule();

  useEffect(() => {
    initReports();
  }, [initReports]);

  const reportItems = _.map(reports, (reportItem, i) => {
    return (
      <div
        className={cx(styles.reportItem, {
          [styles.active]: reportItem.id === currReportId,
        })}
        key={i}
        onClick={() => {
          changeReportId(reportItem.id);
        }}
      >
        {reportItem.name}
      </div>
    );
  });

  return (
    <div className={styles.reportBar}>
      {reportItems}
    </div>
  );
}