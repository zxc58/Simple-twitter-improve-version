/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const chatArea = document.getElementById('chat-area')
const chatHeader = document.getElementById('chat-header')
const chatBody = document.getElementById('chat-body')
const chatContent = document.getElementById('chat-content')
const chatInput = document.getElementById('chat-input')
const chatForm = document.getElementById('chat-form')
const senderInput = document.getElementById('sender-input')
const receiverInput = document.getElementById('receiver-input')
const peopleGroup = document.getElementById('people-group')
const chatNav = document.getElementById('chat-nav')
//
if (chatNav.dataset.newChattingId) {
  const newChatting = {
    id: chatNav.dataset.newChattingId,
    avatar: chatNav.dataset.newChattingAvatar,
    name: chatNav.dataset.newChattingName
  }
  if (!document.getElementById(`chat-user-${newChatting.id}`)) {
    document.getElementById('people-group').innerHTML += newChatter(newChatting, false, '')
  }
  document.getElementById(`chat-user-${newChatting.id}`).click()
}
//
chatHeader.style.height = window.innerHeight * 0.05 + 'px'
chatForm.style.height = window.innerHeight * 0.05 + 'px'
chatBody.style.height = window.innerHeight * 0.9 + 'px'
chatArea.addEventListener('click', () => {
  if (receiverInput.value) {
    document.getElementById(`chat-user-${receiverInput.value}`).querySelector('i').classList.add('hidden')
    const points = document.getElementsByName('point')
    let hiddenLeftNavPoint = true
    for (const point of points) {
      if (!point.classList.contains('hidden')) {
        hiddenLeftNavPoint = false
        break
      }
    }
    if (hiddenLeftNavPoint) {
      publicChatRemind.classList.add('hidden')
    }
  }
})
//
chatForm.addEventListener('submit', function (e) {
  e.preventDefault()
  if (chatInput.value && receiverInput.value) {
    const message = {
      senderId: senderInput.value,
      receiverId: receiverInput.value,
      content: chatInput.value,
      date: new Date().toISOString()
    }
    socket.emit('privateMessage', message)
    chatContent.innerHTML += myMessage(chatInput.value)
    chatContent.scrollTop = chatContent.scrollHeight
    document.getElementById(`chat-user-${receiverInput.value}`).querySelector('small').innerHTML = chatInput.value
    chatInput.value = ''
  }
})
socket.on('privateMessage', (message, sender) => {
  const { senderId, content } = message
  const chatUser = document.getElementById(`chat-user-${senderId}`)
  publicChatRemind.classList.remove('hidden')
  if (senderId === receiverInput.value) {
    chatContent.innerHTML += othersMessage(content)
    chatContent.scrollTop = chatContent.scrollHeight
  }

  if (chatUser) {
    chatUser.querySelector('i').classList.remove('hidden')
    chatUser.querySelector('small').innerHTML = content
  } else {
    document.getElementById('people-group').innerHTML += newChatter(sender, true, content)
  }
})

function newChatter (user, isPoint, content) {
  const hidden = isPoint ? '' : 'hidden'
  return `<a class="nav-link border-bottom blockstyle" name="chat-user" id="chat-user-${user.id}" data-user-id="${user.id}" onclick="change(this)">
        <img src="${user.avatar}" class="rounded-circle" style="width:40px;height:40px">
        <span class="fs-5 fw-bold text-dark" id="chat-user-name">${user.name}</span>
        <br/>
        <small class="text-dark">${content}</small>
        <i class="remindIcon fs-3 ${hidden}" name="point">&bull;</i>
        </a>`
}
function myMessage (message) {
  return `<p class="text-end px-1">
        <span class="rounded-pill px-2 py-1 myMessage">${message}</span>
        </p>`
}
function othersMessage (message) {
  return `<p class="text-start px-1">
        <span class="rounded-pill px-2 py-1 othersMessage">${message}</span>
        </p>`
}
function change (e) {
  const { userId } = e.dataset
  //
  document.getElementById('chat-area').hidden = false
  e.querySelector('i').classList.add('hidden')
  chatHeader.innerHTML = e.querySelector('#chat-user-name').innerHTML
  receiverInput.value = userId
  //
  axios.get(`/api/messages/chat/${userId}`).then(result => {
    const id = Number(userId)
    chatContent.innerHTML = result.data.data.reduce((total, e) => {
      if (id === e.receiverId) { return total + myMessage(e.content) } else { return total + othersMessage(e.content) }
    }, '')
    // chatContent.scrollTop = chatContent.scrollHeight
    $('#chat-content').animate({ scrollTop: chatContent.scrollHeight }, 500)
    if (result.data.newMessage) {
      publicChatRemind.classList.remove('hidden')
    } else {
      publicChatRemind.classList.add('hidden')
    }
  })
}
