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
    chata: '/ollama/chat'
  },
  conversations: {
    add: '/conversations/add',
    saveMsg: '/conversations/saveMsg',
    findList: '/conversations/findList',
    delete: '/conversations/delete',
    findMsgByConversationId: '/conversations/findMsgByConversationId',
  }
}

export default apiConfig