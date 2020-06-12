<template>
    <div class="game-start">
    <div id="game-title"> 1A2B</div>
    <el-image class="game-logo" :src="logo" fit="fill"></el-image>
    <el-row class="game-button">
      <el-button  type="primary" round @click="click_start">开始游戏</el-button>
    </el-row>
    <el-row class="game-button">
      <el-button   type="warning" round @click="show_rule" >规则介绍</el-button>
    </el-row>
    <el-row class="game-button">
      <el-button  type="info" round @click="game_set(null)">游戏设置 </el-button>
    </el-row>
    <el-dialog title="选择游戏" :visible.sync="choose_game" width="80%" class="choose-game">
      <span>新建一个游戏或者通过房间号加入游戏</span>
      <div style="padding: 20px 0 20px 0">
        <el-button type="success" style="display:inline" @click="create_game">创建游戏</el-button>
        <el-button type="primary" style="display:inline" @click="join_game">加入游戏</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
import {Config} from '../js/config'
import {mapState} from 'vuex'
import axios from 'axios'
export default {
  name: 'GameStart',
  data () {
    return {
      rule_text: Config.rule_text,
      choose_game: false,
      logo: require('../assets/avatar-in.png')
    }
  },
  methods: {
    show_rule: function () {
      this.$alert(this.rule_text, '游戏规则', {
        confirmButtonText: '确定',
        callback: () => {}
      })
    },
    game_set: function (callback) {
      this.$prompt('请输入玩家名', '游戏设置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (value === null) {
          throw new Error('NULL PLAYER NAME')
        } else {
          this.$store.commit('SET_PLAYER_NAME', value)
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        }
        if (callback !== null) {
          callback()
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          type: 'error',
          message: '设置失败'
        })
      })
    },
    click_start: function () {
      if (this.player_name === '') {
        this.game_set(this.show_choose_game)
      } else {
        this.show_choose_game()
      }
    },
    show_choose_game: function () {
      this.choose_game = true
    },
    enter_room: function () {
      this.$router.push({
        path: Config.room_url + this.room_id
      })
    },
    join_game: function () {
      this.choose_game = false
      this.$prompt('请输入房间号', '加入房间', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$store.commit('SET_ROOM_ID', value)
        this.$message({
          type: 'success',
          message: '加入房间成功'
        })
        this.enter_room()
      }).catch(() => {
      })
    },
    create_game: function () {
      this.choose_game = false
      axios
        .put(Config.create_room_url)
        .then((response) => {
          this.$store.commit('SET_ROOM_ID', response.data.id)
          this.$store.commit('SET_ROOM_KEY', response.data.key)
          this.$message({
            type: 'success',
            message: ' 创建游戏成功'
          })
          this.enter_room()
        })
        .catch(error => {
          console.log(error.stack)
        })
    }
  },
  computed: {
    ...mapState([
      'player_name',
      'room_key',
      'room_id'
    ])
  }
}
</script>

<style >

.game-button{
  margin: 40px;
  font-size: 25px;
}

.game-start{
  height: inherit;
  margin: 0;
  padding: 0;
  border: 0;
}

.game-logo{
  width: 150px;
  height: 150px;
  margin: 0 0 40px 0;
}

.el-message-box{
  width: auto !important;
}

#game-title{
  margin: auto;
  padding: 50px;
  background-color: transparent;
  font-weight: normal;
  font-size :64px;
  color: aliceblue;
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
