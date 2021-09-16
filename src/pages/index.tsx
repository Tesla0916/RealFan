import { dynamic } from 'umi';
import { useEffect, useState, StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import ReportBar from '../components/ReportBar';
import DataSetArea from '../components/DatasetArea';
import DsFieldsArea from '../components/DataSetFields';
import Header from '../components/Header';
import ChartTypes from '../components/ChartPicker';
import ReportEditor from '../components/ReportEditor';
import ChartFields from '../components/ChartFields';
import styles from '../styles/Home.module.css';
import Mediator from '@/components/Mediator';

export default function Home() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  // @ts-ignore
  const RecoilizeDebugger = dynamic(() => import('../recoilize'), { ssr: false });

  useEffect(() => {
    const rootDom = document.getElementById('__next') as HTMLDivElement;

    if (typeof window.document !== 'undefined') {
      setRoot(rootDom);
    }
  }, [root]);

  return (
    <StrictMode>
      <RecoilRoot>
        <RecoilizeDebugger root={root} />
        <Mediator />
        <div>
          <div className={styles.container}>
            <div className={styles.headerBar}>
              <Header />
            </div>

            <div className={styles.main}>
              <div className={styles.dataSet}>
                <div className={styles.dsPicker}>
                  <DataSetArea />
                </div>
                <div className={styles.dsFields}>
                  <DsFieldsArea />
                </div>
              </div>

              <div className={styles.chartArea}>
                <div className={styles.chartPicker}>
                  <ChartTypes />
                </div>
                <div className={styles.chartFields}>
                  <ChartFields />
                </div>
              </div>

              <div className={styles.reportEditor}>
                <ReportEditor />
              </div>
            </div>

            <div className={styles.reportBar}>
              <ReportBar />
            </div>
          </div>
        </div>
      </RecoilRoot>
    </StrictMode>
  );
}
