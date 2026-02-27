import { useEffect, useState } from "react";
import { ProList } from "@ant-design/pro-components"
import { Button, Checkbox, Descriptions, message, Popconfirm, Space, Tag, Tooltip } from "antd"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddModalForm from "./AddModalForm";
import request from "@/utils/request";
import apiConfig from "../../../config/apiConfig";
import { ModelItem } from "./model.type";


const Model: React.FC = () => {
  const [dataSource, setDataSource] = useState<ModelItem[]>([])

  const add = async (data: ModelItem) => {
    const { success } = await request.post(apiConfig.chatModel.add, data)
    if (success) {
      findAll()
    }
    return success
  }

  const findAll = async () => {
    const { success, data } = await request.get<ModelItem[]>(apiConfig.chatModel.findAll)
    if (success && data?.length) {
      setDataSource(data)
    }
  }

  const deleteModel = async (id: string) => {
    const { success, message: msg } = await request.delete(`${apiConfig.chatModel.delete}/${id}`)
    if (success) {
      message.success(msg)
      findAll()
    }
  }

  const updateModel = async (data: ModelItem) => {
    const { success, message: msg } = await request.post(apiConfig.chatModel.update, data)
    if (success) {
      message.success(msg)
      findAll()
    }
    return success
  }

  useEffect(() => {
    findAll()
  }, [])

  return (
    <ProList
      rowKey='id'
      className="h-full"
      headerTitle='模型管理'
      ghost={false}
      itemCardProps={{ ghost: false }}
      showActions="hover"
      grid={{ gutter: 16, column: 3 }}
      toolBarRender={() => [<AddModalForm add={add} />]}
      dataSource={dataSource}
      metas={{
        title: { dataIndex: 'name', render: (d, v) => <Tag className="text-sm" color='geekblue'>{v.modelName}</Tag> },
        actions: {
          dataIndex: 'isDefault',
          cardActionProps: 'extra',
          render(d, v) {
            return (
              <>
                <Space>
                  <AddModalForm initialValues={v} update={updateModel} />
                  <Tooltip title="删除">
                    <Popconfirm title='确认要删除？' onConfirm={() => deleteModel(v.id!)}>
                      <Button color="danger" variant="text" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Tooltip>
                </Space>
                {
                  v.isDefault ? (
                    <Tooltip title='是否默认'>
                      <Checkbox className="absolute top-[-2px] left-0" checked={v.isDefault} />
                    </Tooltip>
                  ) : null
                }
              </>
            )
          },
        },
        content: {
          render: (d, val) => {
            return (
              <Descriptions column={1}>
                <Descriptions.Item label='temperature'>{val.temperature}</Descriptions.Item>
                <Descriptions.Item label='maxTokens'>{val.maxTokens}</Descriptions.Item>
                <Descriptions.Item label='descrition'>{val.descrition}</Descriptions.Item>
              </Descriptions>
            )
          }
        }
      }}
    />
  )
}

export default Model