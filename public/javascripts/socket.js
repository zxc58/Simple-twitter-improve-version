/* eslint-disable no-undef */

const leftNav = document.getElementById('left-nav')
const publicChatRemind = document.getElementById('public-chat-remind')
//
const { userId } = leftNav.dataset
const socket = io({ query: { userId } })
//
socket.on('notify user', (senderId) => {
  publicChatRemind.classList.remove('hidden')
})
