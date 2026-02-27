import { EditOutlined, PlusOutlined } from "@ant-design/icons"
import { ModalForm, ProFormDigit, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import { Button, Form, Tooltip } from "antd"
import { ModelItem } from "./model.type";



const AddModel: React.FC<{
  add?: (v: ModelItem) => Promise<boolean>;
  initialValues?: ModelItem;
  update?: (v: ModelItem) => Promise<boolean>
}> = ({ add, initialValues, update }) => {
  const [form] = Form.useForm<ModelItem>();
  return (
    <ModalForm<ModelItem>
      form={form}
      modalProps={{ destroyOnClose: true }}
      onFinish={initialValues ? update : add}
      title={`${initialValues ? '编辑' : '新建'}`}
      trigger={
        initialValues ?
          <Tooltip title='编辑'>
            <Button color="primary" variant="text" icon={<EditOutlined />} />
          </Tooltip> :
          <Button type="primary" icon={<PlusOutlined />}>新建</Button>
      }
    >
      <ProFormText hidden={!!initialValues} initialValue={initialValues?.id} name='id' />
      <ProFormText
        label="模型名称"
        initialValue={initialValues?.modelName}
        fieldProps={{ maxLength: 64 }}
        rules={[{ required: true, message: '请输入模型名称' }]}
        name="modelName"
        placeholder="请输入模型名称"
      />
      <ProFormDigit
        label="maxTokens"
        name="maxTokens"
        min={1024}
        max={10000}
        initialValue={initialValues?.maxTokens ?? 1024}
        fieldProps={{ precision: 0 }}
      />
      <ProFormDigit
        label="temperature"
        name="temperature"
        min={0}
        max={2}
        initialValue={initialValues?.temperature ?? 0.6}
        fieldProps={{ precision: 1, defaultValue: 0.6 }}
      />
      <ProFormSwitch
        name="isDefault"
        label="是否默认模型"
        initialValue={initialValues?.isDefault}
        fieldProps={{
          checkedChildren: '是',
          unCheckedChildren: '否'
        }} />
      <ProFormTextArea
        initialValue={initialValues?.descrition}
        fieldProps={{ maxLength: 128 }}
        name='descrition'
        placeholder="请输入模型描述"
        label='模型描述'
      />
    </ModalForm>
  )
}

export default AddModel