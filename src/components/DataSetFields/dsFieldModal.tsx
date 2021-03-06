import { useCallback, useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentDsFieldIdAtom,
} from '../../modules/dataset/atom';
import { IReportsDetail, EDatasetFieldsTypes, EDeleteChartFieldTypes, IReport, IDatasetFieldDetail } from '../../types';
import { datasetFieldStore, reportStore } from '../../store';
import { useChartEditorActions } from '../../modules/chartEditor/hooks';
import { currentReportIdAtom, reportIdsAtom } from '@/modules/report/atom';
import { currentChartIdAtom } from '@/modules/reportEditor/atom';
import { currentChartFieldIdAtom } from '@/modules/chartEditor/atom';
import { dataSetFieldsSelector } from '@/modules/dataset/selectors';
import _ from 'lodash';

interface IDatasetFieldModal {
  modalVisible: boolean
  onModalCancel: () => void;
}

export default function DatasetFieldModal(props: IDatasetFieldModal) {
  const [modalVisible, setModalVisible] = useState(props.modalVisible);
  const [form] = Form.useForm();
  const dsFieldModalData = useGetCurrentDsFieldsDetail();

  const setStoreOfDatasetField = datasetFieldStore.useSetState();
  const currentDsFieldId = useRecoilValue(currentDsFieldIdAtom);
  const { deleteChartField } = useChartEditorActions();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };

  useEffect(() => {
    if (dsFieldModalData) {
      form.setFieldsValue(dsFieldModalData);
    }
  }, [form, dsFieldModalData]);

  const clickModalOkBtn = async () => {
    let res;
    try {
      res = await form.validateFields();
    } catch (error) {
      return;
    }
    setStoreOfDatasetField(currentDsFieldId, res);
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    props.onModalCancel();
  };

  const viewDsField = useViewDsField();

  const onEditChartFieldClick = (type: EDatasetFieldsTypes, reportsDetailItem: IReportsDetail) => {
    const { chartFieldId } = reportsDetailItem;
    if (type === EDatasetFieldsTypes.VIEW_CHART_FIELDS) {
      viewDsField(reportsDetailItem);
      props.onModalCancel();
    } else {
      deleteChartField(chartFieldId, EDeleteChartFieldTypes.DELETE_AT_DATASET_FIELD_MODAL);
    }
  };

  const formNode = (
    <>
      <Form
        {...layout}
        name="????????????"
        form={form}
      >
        <Form.Item
          label="????????????"
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="????????????"
          name="dataType"
        >
          <Select>
            {
              ['number', 'string', 'boolean'].map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          label="????????????"
        >
          <div>
            {dsFieldModalData?.dsFieldCitedList?.length}
          </div>
        </Form.Item>

        <Form.Item
          label="????????????"
        >
          <div className="reportDetail">
            {
              dsFieldModalData?.dsFieldCitedList?.map((dsFieldCitedItem) => {
                return (
                  <div
                    key={dsFieldCitedItem.chartId}
                    className="reportDetailItem"
                  >
                    <div className="textDisplay">
                      {dsFieldCitedItem.reportId}
                      -&gt;
                      {dsFieldCitedItem.chartName}
                      -&gt;
                      {dsFieldCitedItem.chartFieldName}
                    </div>

                    <div className="actions">
                      <span
                        className="actionBtn view"
                        onClick={() => onEditChartFieldClick(EDatasetFieldsTypes.VIEW_CHART_FIELDS, dsFieldCitedItem)}
                      >
                        ??????
                      </span>
                      <span
                        className="actionBtn delete"
                        onClick={() => onEditChartFieldClick(EDatasetFieldsTypes.DELETE_CHART_FIELDS, dsFieldCitedItem)}
                      >
                        ??????
                      </span>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <Modal
      onOk={clickModalOkBtn}
      onCancel={closeModal}
      visible={modalVisible}
      title="????????????"
      cancelText="??????"
      okText="??????"
      destroyOnClose
      width={800}
      wrapClassName="datasetModal"
    >
      { formNode }
    </Modal>
  );
}

// 1. ??????????????????
// 2. ?????????????????????????????????????????????????????????
// 3. ?????????????????????
// 4. ????????????????????????
function useGetCurrentDsFieldsDetail(): IDatasetFieldDetail | null {
  const dataSetFields = useRecoilValue(dataSetFieldsSelector);
  const currentDsFieldId = useRecoilValue(currentDsFieldIdAtom);

  const reportIds = useRecoilValue(reportIdsAtom);
  const reports = reportStore.useGetValue(reportIds) as IReport[];

  // ??????????????????????????????????????????
  const dsFieldCitedList: IReportsDetail[] = [];
  _.forEach(reports, (reportItem) => {
    _.forEach(reportItem.charts, (chartItem) => {
      _.forEach(chartItem.fields, (chartFieldItem) => {
        if (chartFieldItem.dsFieldId === currentDsFieldId) {
          dsFieldCitedList.push({
            reportId: reportItem.id,
            chartName: chartItem.name,
            chartId: chartItem.id,
            chartFieldName: chartFieldItem.name,
            dsFieldId: chartFieldItem.dsFieldId,
            chartFieldId: chartFieldItem.chartFieldId
          });
        }
      });
    });
  });

  const tempDsFieldDetail = _.find(dataSetFields, { id: currentDsFieldId });

  // ???????????? find?????? ?????? undefined ?????????
  if (currentDsFieldId && tempDsFieldDetail) {
    return {
      ...tempDsFieldDetail,
      dsFieldCitedList
    };
  }
  return null;
}

// ???dsField???modal????????????????????? ??????????????????????????????
// 1. ????????????????????????
// 2. ??????????????????????????????
// 3. ?????????????????????????????????
// 4. ?????????????????????????????????
function useViewDsField() {
  const setCurrentReportId = useSetRecoilState(currentReportIdAtom);
  const setCurrentChartId = useSetRecoilState(currentChartIdAtom);
  const setCurrentChartFieldId = useSetRecoilState(currentChartFieldIdAtom);

  return useCallback((reportsDetailItem: IReportsDetail) => {
    setCurrentReportId(reportsDetailItem.reportId);
    setCurrentChartId(reportsDetailItem.chartId);
    setCurrentChartFieldId(reportsDetailItem.chartFieldId);
  }, [setCurrentChartFieldId, setCurrentChartId, setCurrentReportId]);
}
