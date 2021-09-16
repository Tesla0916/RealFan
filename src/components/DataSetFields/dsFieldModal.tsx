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
        name="字段详情"
        form={form}
      >
        <Form.Item
          label="字段名称"
          name="name"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="字段类型"
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
          label="引用总数"
        >
          <div>
            {dsFieldModalData?.dsFieldCitedList?.length}
          </div>
        </Form.Item>

        <Form.Item
          label="引用详情"
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
                        查看
                      </span>
                      <span
                        className="actionBtn delete"
                        onClick={() => onEditChartFieldClick(EDatasetFieldsTypes.DELETE_CHART_FIELDS, dsFieldCitedItem)}
                      >
                        删除
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
      title="字段详情"
      cancelText="取消"
      okText="确定"
      destroyOnClose
      width={800}
      wrapClassName="datasetModal"
    >
      { formNode }
    </Modal>
  );
}

// 1. 获取所有的表
// 2. 根据当前选中的字段获取包含该字段的图表
// 3. 组装一下塞进去
// 4. 返回组装后的数据
function useGetCurrentDsFieldsDetail(): IDatasetFieldDetail | null {
  const dataSetFields = useRecoilValue(dataSetFieldsSelector);
  const currentDsFieldId = useRecoilValue(currentDsFieldIdAtom);

  const reportIds = useRecoilValue(reportIdsAtom);
  const reports = reportStore.useGetValue(reportIds) as IReport[];

  // 获取字段被引用的所有数据列表
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

  // 需要判断 find方法 返回 undefined 的情况
  if (currentDsFieldId && tempDsFieldDetail) {
    return {
      ...tempDsFieldDetail,
      dsFieldCitedList
    };
  }
  return null;
}

// 当dsField中modal查看按钮点击时 去处理其他模块的更新
// 1. 修改当前选中报表
// 2. 修改当前选中图表组件
// 3. 高亮当前选中图表的类型
// 4. 高亮当前对应的图表字段
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
