var Config = {
  rule_text: '系统会生成一个四位数字给玩家们猜。\n' +
            '游戏开始后，系统会提示轮到哪一位玩家猜数字（每位玩家有20秒的时间猜），当前猜数字的玩家把猜的数字发在聊天版上，系统会将猜测的结果以A和B来表示。\n' +
            'A代表猜测的数字中，数字相同且位置也正确的个数。\n ' +
            'B代表猜测的数字中，数字相同但位置不一样的个数。\n ' +
            '举例来说，如果答案数字为1234，你猜的数字为5283，其中2被猜到且位置正确，3也被猜到但位置不对，所以结果会出现1A1B。\n ' +
            '游戏由先完整猜出数字的人获得胜利（也就是先得到4A的玩家）。',
  max_player: 8,
  create_room_url: 'http://127.0.0.1:8085/rooms',
  room_socket_url: function (id, playerName) {
    return 'ws://127.0.0.1:8085/rooms/' + id + '/player?name=' + playerName
  },
  room_url: '/game/',
  root_url: '/'
}

export {Config}
