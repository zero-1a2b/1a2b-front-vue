<template>
    <div class="game-ui">
          <el-row class="game-head" :gutter="12">
            <el-col :span="12" :offset="6">
              <el-card class="game-card">
                  房间号：{{room_id}}
              </el-card>
            </el-col>
            <el-col :span="6" style="float:right; padding:0;">
              <el-button style="float:right; margin: 0 0 0 0 " type="danger" @click="leave_room">离开</el-button>
            </el-col>
          </el-row>
        <div class="flip">
          <FlipBoard/>
        </div>
        <div class="player-status">
          <StatusBoard/>
        </div>
        <div class="chat-board">
          <ChatBoard/>
        </div>
    </div>
</template>

<script>
import ChatBoard from './chat'
import FlipBoard from './flip'
import StatusBoard from './playerStatus'
import {mapState, mapGetters} from 'vuex'
import {Config} from '../js/config'
import {SocketMsg} from '../js/socket_msg'
export default {
  name: 'GameUI',
  components: {ChatBoard, FlipBoard, StatusBoard},
  data () {
    return {
    }
  },
  methods: {
    leave_room: function () {
      this.$confirm('确定要离开游戏吗？', '离开游戏', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '离开房间!'
        })
        this.$store.commit('DISCONNECT_SOCKET')
        this.$router.push({
          path: Config.root_url
        })
      }).catch(() => {
      })
    },
    initWebSocket: function () {
      // init  player list before init websocket
      this.$store.commit('CONNECT_SOCKET', {id: this.room_id, player_name: this.player_name})
      this.$store.commit('BIND_ONMESSAGE', this.onMessageCallback)
    },
    initRoom: function () {
      this.$store.commit('SET_READY_PLAYERS', [])
      this.$store.commit('SET_GAME_PLAYERS', [])
      this.$store.commit('SET_GUESSER', -1)
      this.$store.commit('SET_MSG_COUNTER')
      this.$store.commit('SET_COUNT_NUM', 1829)
    },
    reset_guesser: function () {
      this.$store.commit('SET_GUESSER', 0)
    },
    start_event: function () {
      // Start Event
      this.$store.commit('GET_GAME_STATE')
      this.$store.commit('ADD_MSG', {
        msg: '游戏开始,每位玩家只有20s的时间猜数字',
        playerName: '系统',
        messageType: 1
      })
    },
    join_event: function (data) {
      this.$store.commit('ADD_PLAYER', {
        name: data.player
      })
    },
    ready_event: function (data) {
      this.$store.commit('PLAYER_READY', {
        name: data.player
      })
    },
    unready_event: function (data) {
      this.$store.commit('PLAYER_UNREADY', {
        name: data.player
      })
    },
    left_event: function (data) {
      this.$store.commit('REMOVE_PLAYER', {
        name: data.player
      })
    },
    chat_event: function (data) {
      // Chat Event
      this.$store.commit('ADD_MSG', {
        msg: data.msg.msg,
        playerName: data.msg.name,
        messageType: 0
      })
    },
    guess_num: function (data) {
      this.setFlip(data.event.a, data.event.b)
      this.$store.commit('ADD_MSG', {
        msg: SocketMsg.guess_1a2b(data.event.player, data.event.guess, data.event.a, data.event.b),
        playerName: '系统',
        messageType: 1
      })
    },
    timeout: function () {
      this.$store.commit('ADD_MSG', {
        msg: '游戏超时，有请下一位',
        playerName: '系统',
        messageType: 1
      })
    },
    next_player: function () {
      this.$store.commit('INC_GUESSER')
    },
    game_event: function (data) {
      switch (data.event.type) {
        case 'guess':
          this.guess_num(data)
          break
        case 'timeout':
          this.timeout()
          break
      }
      this.next_player()
    },
    finish_game: function () {
      this.$store.commit('ADD_MSG', {
        msg: '游戏结束，请大家退出游戏房间',
        playerName: '系统',
        messageType: 1
      })
    },
    update_game_state: function (data) {
      this.$store.commit('SET_GAME_STATE', {
        guesser: data.resp.game.guesser,
        players: data.resp.game.players
      })
      this.$nextTick(this.reset_guesser)
    },
    onMessageCallback: function (event) {
      let data = JSON.parse(event.data)
      console.log(data)
      // Game Event
      if (data.type === undefined && data.resp !== null) {
        if (data.resp.type === 'get_game_state') {
          this.update_game_state(data)
        }
      }
      switch (data.type) {
        case 'game':
          this.game_event(data)
          break
        case 'chat':
          this.chat_event(data)
          break
        case 'game_started':
          this.start_event()
          break
        case 'ready':
          this.ready_event(data)
          break
        case 'unready':
          this.unready_event(data)
          break
        case 'join':
          this.join_event(data)
          break
        case 'left':
          this.left_event(data)
          break
        case 'game_finished':
          this.finish_game()
          break
      }
    },
    setFlip: function (a, b) {
      let result = 10809
      result = a * 1000 + result + b * 10
      console.log(result)
      this.$store.commit('SET_COUNT_NUM', result)
    }
  },
  computed: {
    ...mapState([
      'room_id',
      'player_name',
      'sock',
      'guesser',
      'gamePlayers'
    ]),
    ...mapGetters([
      'current_player'
    ])
  },
  watch: {
    guesser: function () {
      if (this.guesser >= 0) {
        this.$store.commit('ADD_MSG', {
          msg: SocketMsg.guess_player(this.current_player),
          playerName: '系统',
          messageType: 1
        })
      }
    }
  },
  mounted () {
    this.initWebSocket()
    this.initRoom()
  }
}
</script>

<style lang="scss" scoped>
.room-id{
  height: 50px;
}

.game-head{
    height: 15%;
    width: 100%;
    border: 10px;
    margin: 0;
    padding: 0;
}
.chat-board{
    height: 35%;
    border: 10px;
    margin: 0;
    padding: 0;
}

.player-status{
  height: 30%;
    border: 10px;
}

.flip{
    height: 20%;
    border: 10px;
}

.game-ui{
  height: inherit;
}

.game-card{
  background-color: #584b42;
  color: #dee3e2;
  border: 0;
}

</style>

<style>
.el-message-box{
  width: auto !important;
}
</style>
