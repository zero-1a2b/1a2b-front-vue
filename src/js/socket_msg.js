var SocketMsg = {
  ready: function (playerName) {
    let msg = {
      'type': 'ready',
      'player': playerName
    }
    return JSON.stringify(msg)
  },
  unready: function (playerName) {
    let msg = {
      'type': 'unready',
      'player': playerName
    }
    return JSON.stringify(msg)
  },
  start: function () {
    let msg = {
      'type': 'start'
    }
    return JSON.stringify(msg)
  },
  guess: function (num, playerName) {
    let result = []
    result.push(Math.floor(num / 1000))
    result.push(Math.floor(num / 100) % 10)
    result.push(Math.floor(num / 10) % 10)
    result.push(num % 10)
    let msg = {
      'type': 'game',
      'request': {
        'type': 'guess',
        'player': playerName,
        'guess': result
      }
    }
    return JSON.stringify(msg)
  },
  chat: function (msg, playerName, counter, messageType) {
    return {
      msg_index: counter,
      message_type: messageType,
      playerName: playerName,
      msg: msg
    }
  },
  guess_1a2b: function (playerName, num, a, b) {
    num = num.join('')
    return '玩家 ' + playerName + ' 的数字：' + num + '. 结果：  ' + a + 'A ' + b + 'B'
  },
  guess_player: function (playerName) {
    return '现在轮到 ' + playerName + ' 猜数字'
  },
  chat_socket: function (msg, playerName) {
    let result = {
      'type': 'chat',
      'msg': {
        'name': playerName,
        'msg': msg
      }
    }
    return JSON.stringify(result)
  },
  game_state: function () {
    let result = {
      'type': 'get_game_state'
    }
    return JSON.stringify(result)
  }
}

export {SocketMsg}
