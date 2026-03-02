const apiConfig = {
  auth: {
    login: '/auth/login'
  },
  chatModel: {
    add: '/chatModel/add',
    findAll: '/chatModel/findAll',
    delete: '/chatModel/delete',
    update: '/chatModel/update',
  },
  ollama: {
    chata: '/ollama/chat',
    chatStream: '/ollama/chatStream',
  },
  conversations: {
    add: '/conversations/add',
    update: '/conversations/update',
    updateMsg: '/conversations/updateMsg',
    saveMsg: '/conversations/saveMsg',
    findList: '/conversations/findList',
    delete: '/conversations/delete',
    deleteMsg: '/conversations/deleteMsg',
    findMsgByConversationId: '/conversations/findMsgByConversationId',
  }
}

export const baseUrl = `http://127.0.0.1:9999/${process.env.UMI_ENV === 'dev' ? 'api' : ''}`

export default apiConfig