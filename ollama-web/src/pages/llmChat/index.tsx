import { useEffect, useMemo, useState } from "react";
import { Avatar, Layout, List, type GetProp } from "antd";
import { Conversations, Sender, Bubble, Think, type ConversationsProps, type BubbleListProps } from '@ant-design/x';
import { XMarkdown } from '@ant-design/x-markdown'
import { DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from "dayjs";

import request from "@/utils/request";
import apiConfig, { baseUrl } from "../../../config/apiConfig";
import { IMsg, IConversation } from './llmChat.vo';
import { ItemType } from "@ant-design/x/es/conversations";
import { useBubbleList } from "@/utils/hooks";
import { getAuthHeaders } from "@/utils/tools";
import { IExBubbleItemType, ILLamaVo } from "@/typeVo";
import { AIROLE } from "@/utils/constant.enum";

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
   * 修改会话标题名称
   * @param id string
   * @param title string
   */
  const updateTitle = async (id: string, title: string) => {
    const { data } = await request.post<IConversation>(apiConfig.conversations.update, { id, title })
    const item = formatList([data])[0]
    setConversationList((v) => {
      return v.map(k => {
        if (k.key === data.id) return item
        return k
      })
    })
  }

  /**
   * 提交对话
   * @param msg string
   */
  const onSubmit = async (msg: string) => {
    let currentId: string
    /** 如果没有不存在会话，先生成会话 */
    if (!activeKey) {
      currentId = await createConversation(msg)
    }
    /** 如果是新建的会话，没有历史记录，修改第一条消息为标题 */
    if (activeKey && items.length === 0) {
      await updateTitle(activeKey, msg)
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
   * 流式对话接口
   * @param content 对话内容
   */
  const streamChat = async (content: string) => {
    setLoading(true)
    /** 保存用户当前输入的问题 */
    const { data } = await request.post<{ id: string }>(apiConfig.conversations.saveMsg, {
      conversationId: activeKey,
      content,
      role: AIROLE.USER
    })
    add({ key: data.id, content, role: 'user' })
    setContent('')
    /** 先创建待存储的AI回复信息 */
    const { data: AIRes } = await request.post<{ id: string }>(apiConfig.conversations.saveMsg, {
      conversationId: activeKey,
      content: '',
      think: '',
      role: AIROLE.ASSISTANT
    })
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(), // 添加 token
    };

    const response = await fetch(`http://127.0.0.1:9999${apiConfig.ollama.chatStream}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        role: 'user', content,
        conversationId: activeKey
      }),
    });
    /** 更新UI列表 */
    add({ key: AIRes.id, content: '', think: '', role: 'ai' })
    if (!response.ok) {
      setLoading(false)
      await request.delete(`${apiConfig.conversations.deleteMsg}/${AIRes.id}`)
      return
    }
    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');

    let buffer = '';
    let AiContent = ''; // AI回复的内容
    let AIThink = '' // AI 思考的内容
    let thinkDone = false; // 是否思考完成
    let durationT; // AI思考的时间
    let duration = '0'; // AI思考的时间
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 将新收到的字节解码为文本，并追加到缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按行分割处理
        const events = buffer.split('\n');
        // 最后一个可能是不完整的，保留在 buffer 中
        buffer = events.pop() || '';

        for (const event of events) {
          if (event.trim() === '') continue;
          try {
            const parsed: ILLamaVo = JSON.parse(event);
            if (!durationT) durationT = dayjs(parsed.created_at)
            if (parsed.message.thinking) AIThink += parsed.message.thinking;
            if (parsed.message.content) {
              thinkDone = true
              AiContent += parsed.message.content;
              duration = dayjs(parsed.created_at).diff(durationT, 'seconds').toString()
            }
            update(AIRes.id, { content: AiContent, think: AIThink, thinkDone, thinkDuration: thinkDone ? duration : undefined })
          } catch (e) {
            console.error('Failed to parse line:', event, e);
          }
        }
      }
    }
    catch (error) {
      console.log(error);
    }
    finally {
      // 确保释放读取器
      reader.releaseLock()
      setLoading(false)
      if (response.ok) {
        request.post(apiConfig.conversations.updateMsg, {
          id: AIRes.id,
          content: AiContent,
          think: AIThink,
          role: AIROLE.ASSISTANT,
          thinkDuration: Number(duration)
        })
      }
    }
  }

  /**
   * 创建会话
   * @param title 
   */
  const createConversation = async (title: string): Promise<string> => {
    const { data } = await request.post<IConversation>(apiConfig.conversations.add, { title })
    setConversationList(v => ([...formatList([data]), ...v]))
    setActiveKey(data.id)
    set([])
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
    const historyMsg: IExBubbleItemType[] = data.map(v => ({
      key: v.id!,
      content: v.content,
      role: v.role === AIROLE.ASSISTANT ? 'ai' : v.role,
      ...(v.role === AIROLE.ASSISTANT ? {
        think: v.think,
        thinkDone: true,
        thinkDuration: v.thinkDuration
      } : {})
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
      avatar: <Avatar size='small' className="bg-green-500 text-white mt-1">AI</Avatar>,

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
          {/* <Bubble.List
            autoScroll
            role={memoRole}
            items={items}
          /> */}
          <List
            dataSource={items}
            renderItem={(msg) => (
              <Bubble
                className="mb-4"
                placement={msg.role !== 'user' ? 'start' : 'end'}
                content={msg.content}
                streaming={msg?.think ? true : false}
                typing={msg.role === 'user' ? false : true}
                avatar={
                  <Avatar size='small' className={`${msg.role !== 'user' ? 'bg-green-500' : 'bg-blue-500'} text-white mt-1`}>
                    {msg.role !== 'user' ? 'AI' : 'U'}
                  </Avatar>
                }
                contentRender={msg.role === 'user' ? undefined : () => (
                  <>
                    {msg.think ? <Think
                      defaultExpanded={!msg.thinkDone}
                      blink={!msg.thinkDone}
                      loading={!msg.thinkDone}
                      title={msg.thinkDone ? `思考了 ${msg.thinkDuration ? msg.thinkDuration + '秒' : ''}` : '思考中...'}>{msg.think}</Think>
                      : null
                    }
                    <XMarkdown content={msg.content} />
                  </>
                )}
              />
            )}
          />
        </div>

        <Sender
          placeholder="开始对话"
          className="bg-white"
          value={content}
          onChange={v => setContent(v)}
          loading={loading}
          onSubmit={streamChat}
        />
      </Content>
    </Layout>
  )
}
export default LLMChat