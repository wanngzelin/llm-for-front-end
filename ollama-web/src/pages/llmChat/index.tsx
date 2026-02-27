import { useEffect, useMemo, useState } from "react";
import { Avatar, List, Layout, type GetProp } from "antd";
import { Conversations, Sender, Bubble, type ConversationsProps, type BubbleItemType, BubbleListProps } from '@ant-design/x';
import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import request from "@/utils/request";
import apiConfig from "../../../config/apiConfig";
import { IMsg, IConversation } from './llmChat.vo';
import { ItemType } from "@ant-design/x/es/conversations";
import { useBubbleList } from "@/utils/hooks";

const { Sider, Content } = Layout;

const LLMChat: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [activeKey, setActiveKey] = useState<string>() // 当前选中的会话
  const [items, set, add, update] = useBubbleList();
  const [conversationList, setConversationList] = useState<ItemType[]>([])// 所有的会话记录

  /**
   * 转换对话数据为菜单显示格式
   * @param item IConversation[]
   */
  const formatList = (item: IConversation[]): ItemType[] => {
    return item.map(v => ({ key: v.id, label: v.title, icon: <HistoryOutlined /> }))
  }

  /**
   * 提交对话
   * @param msg string
   */
  const onSubmit = async (msg: string) => {
    let currentId: string
    if (!activeKey) {
      currentId = await createConversation(msg)
    }
    setContent('')
    setLoading(true)
    const chatObj: IMsg = { role: 'user', content: msg, conversationId: activeKey ?? currentId!, key: activeKey ?? currentId! }
    add(chatObj)
    const aiMessage = await chatWithAi(chatObj)
    if (aiMessage) {
      add({ role: 'ai', content: aiMessage.content, key: aiMessage.id! })
    }
    setLoading(false)
  }

  /**
   * 创建会话
   * @param title 
   */
  const createConversation = async (title: string): Promise<string> => {
    const { data } = await request.post<IConversation>(apiConfig.conversations.add, { title })
    setConversationList(v => ([...formatList([data]), ...v]))
    setActiveKey(data.id)
    return data.id
  }

  /**
   * 查询所有会话记录
   */
  const findList = async () => {
    const { data } = await request.get<IConversation[]>(apiConfig.conversations.findList)
    setConversationList(() => formatList(data))
    if (data && data.length) {
      const conversationId = data[0].id
      setActiveKey(conversationId)
      setLoading(true)
      await findMsgByConversationId(conversationId)
    } else {
      setActiveKey(undefined)
      set([])
      setConversationList([])
      setLoading(false)
    }
  }

  /**
   * 根据会话id获取对话记录
   * @param conversationId string
   */
  const findMsgByConversationId = async (id: string) => {
    const { data } = await request.get<IMsg[]>(apiConfig.conversations.findMsgByConversationId, { params: { id } })
    const historyMsg: BubbleItemType[] = data.map(v => ({
      key: v.id!,
      content: v.content,
      role: v.role === "assistant" ? 'ai' : v.role
    }))
    set(historyMsg)
    setLoading(false)
  }

  /**
   * 删除会话
   * @param id string
   */
  const deleteConversation = async (id: string) => {
    setLoading(true)
    const { success } = await request.delete(`${apiConfig.conversations.delete}/${id}`)
    if (success) {
      findList()
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    findList()
  }, [])

  /**
   * 与AI对话
   * @returns 
   */
  const chatWithAi = async (context: IMsg) => {
    try {
      const { data } = await request.post<IMsg>(apiConfig.ollama.chata, context)
      return data
    } catch (error) {
      return null
    }
  }

  /**
   * 会话切换时调用
   * @param key string
   */
  const onActiveChange = async (key: string) => {
    setActiveKey(key)
    setLoading(true)
    await findMsgByConversationId(key)
  }

  // 配置会话操作
  const menuConfig: ConversationsProps['menu'] = (val) => ({
    items: [
      {
        label: '删除会话',
        key: val.key,
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (itemInfo) => {
      itemInfo.domEvent.stopPropagation();
      deleteConversation(itemInfo.key)
    },
  });

  const memoRole: BubbleListProps['role'] = useMemo(() => ({
    ai: {
      typing: true,
      avatar: <Avatar size='small' className="bg-green-500 text-white mt-1">AI</Avatar>
    },
    user: {
      placement: 'end',
      avatar: <Avatar size='small' className="bg-blue-500 text-white mt-1">U</Avatar>
    }
  }), [])

  return (
    <Layout className='h-full'>
      <Sider theme="light" className="shadow-md">
        <Conversations
          creation={{
            label: '新建对话',
            onClick: () => createConversation('新对话')
          }}
          menu={menuConfig}
          activeKey={activeKey}
          onActiveChange={onActiveChange}
          items={conversationList}
        />
      </Sider>
      <Content className="pl-2">
        <div className="h-[calc(100%-60px)] overflow-y-auto p-4">
          <Bubble.List
            autoScroll
            role={memoRole}
            items={items}
          />
          {/* <List
            dataSource={messageList}
            renderItem={(msg) => (
              <Bubble
                placement={msg.role !== 'user' ? 'start' : 'end'}
                content={msg.content}
                typing={msg.role === 'user' ? false : true}
                avatar={
                  <Avatar size='small' className={`${msg.role !== 'user' ? 'bg-green-500' : 'bg-blue-500'} text-white mt-1`}>
                    {msg.role !== 'user' ? 'AI' : 'U'}
                  </Avatar>
                }
              />
            )}
          /> */}
        </div>
        <Sender
          placeholder="开始对话"
          className="bg-white"
          value={content}
          onChange={v => setContent(v)}
          loading={loading}
          onSubmit={onSubmit}
        />
      </Content>
    </Layout>
  )
}
export default LLMChat