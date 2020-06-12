import Vue from 'vue'
import Vuex from 'vuex'
import {Config} from '../js/config'
import {SocketMsg} from '../js/socket_msg'

Vue.use(Vuex)

export const Store = new Vuex.Store({
  state: {
    player_name: '',
    count_num: 1829,
    playersReady: [],
    gamePlayers: [],
    max_player: Config.max_player,
    guesser: -10,
    msgList: [],
    msgCounter: 1,
    room_key: 0,
    room_id: 'null',
    game_started: false,
    sock: null
  },
  getters: {
    PLAYER_NAME: state => {
      return state.player_name
    },
    COUNT_NUM: state => {
      return state.count_num
    },
    PLAYERS: state => {
      return state.current_flip
    },
    MSGLIST: state => {
      return state.msgList
    },
    ROOM_ID: state => {
      return state.room_id
    },
    ROOM_KEY: state => {
      return state.room_key
    },
    guess_state: state => {
      return state.gamePlayers[state.guesser] === state.player_name
    },
    current_player: state => {
      return state.gamePlayers[state.guesser]
    }
  },
  mutations: {
    SET_PLAYER_NAME: (state, payload) => {
      state.player_name = payload
    },
    SET_COUNT_NUM: (state, payload) => {
      state.count_num = payload
    },
    SET_MSGLIST: (state, payload) => {
      state.msgList = payload
    },
    ADD_PLAYER: (state, payload) => {
      state.playersReady.push({
        name: payload.name,
        is_ready: 0
      })
    },
    SET_READY_PLAYERS: (state, payload) => {
      state.playersReady = payload
    },
    SET_GAME_PLAYERS: (state, payload) => {
      state.gamePlayers = payload
    },
    PLAYER_READY: (state, payload) => {
      let index = state.playersReady.findIndex(e => e.name === payload.name)
      state.playersReady[index].is_ready = 1
    },
    PLAYER_UNREADY: (state, payload) => {
      let index = state.playersReady.findIndex(e => e.name === payload.name)
      state.playersReady[index].is_ready = 0
    },
    REMOVE_PLAYER: (state, payload) => {
      state.playersReady = state.playersReady.filter(({name}) => name !== payload.name)
    },
    ADD_MSG: (state, payload) => {
      state.msgList.push(SocketMsg.chat(payload.msg, payload.playerName, state.msgCounter, payload.messageType))
      state.msgCounter += 1
    },
    SET_MSG_COUNTER: (state, payload) => {
      state.msgCounter = payload
    },
    SET_ROOM_ID: (state, payload) => {
      state.room_id = payload
    },
    SET_ROOM_KEY: (state, payload) => {
      state.room_key = payload
    },
    CONNECT_SOCKET: (state, payload) => {
      state.sock = new WebSocket(Config.room_socket_url(payload.id, payload.player_name))
    },
    DISCONNECT_SOCKET: (state) => {
      state.sock.close()
    },
    READY_STATE: (state, payload) => {
      state.sock.send(SocketMsg.ready(payload.playerName))
    },
    UNREADY_STATE: (state, payload) => {
      state.sock.send(SocketMsg.unready(payload.playerName))
    },
    START_STATE: (state) => {
      state.sock.send(SocketMsg.start())
      state.game_started = true
    },
    GUESS_NUM: (state, payload) => {
      state.sock.send(SocketMsg.guess(payload.num, payload.playerName))
    },
    INC_GUESSER: (state) => {
      state.guesser = (state.guesser + 1) % state.gamePlayers.length
    },
    BIND_ONMESSAGE: (state, payload) => {
      state.sock.onmessage = payload
    },
    SET_GUESSER: (state, payload) => {
      state.guesser = payload
    },
    SET_GAME_STATE: (state, payload) => {
      state.guesser = payload.guesser
      state.gamePlayers = payload.players
    },
    SEND_MESSAGE: (state, payload) => {
      state.sock.send(SocketMsg.chat_socket(payload.msg, payload.playerName))
    },
    GET_GAME_STATE: (state) => {
      state.sock.send(SocketMsg.game_state())
    },
    GAME_STARTED: (state) => {
      state.game_started = true
    }
  }
})
