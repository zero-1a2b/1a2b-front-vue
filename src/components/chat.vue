<template>
    <div class="container">
            <el-switch
            class="filter"
            v-model="filter"
            active-color="#13ce66"
            active-text="仅显示系统聊天">
            </el-switch>
        <div class="message-list">
            <el-scrollbar ref="chat_board" style="height:inherit;">
                <ul class="msg-cont">
                <li v-for="message in showList" :key="message.msg_index">
                    {{message.playerName + ' : ' + message.msg}}
                </li>
                </ul>
            </el-scrollbar>
        </div>
        <div class="message-input">
            <el-input v-model="msg" placeholder="来聊些什么吧~" @keyup.enter.native="sendMsg"></el-input>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import {mapState, mapGetters} from 'vuex'
import {SocketMsg} from '../js/socket_msg'
export default {
    name: "ChatBoard",
    data(){
        return{
            filter: false,
            msg: '',
            guess_reg: /^[0-9]{4}$/
        }
    },
    methods: {
        sendMsg: function(){
            this.chatMsg()
            if (this.guess_reg.exec(this.msg) !== null && this.guess_state){
                this.guessNum()
            }
            this.msg = ''
        },
        guessNum: function (){
             this.$store.commit('GUESS_NUM', {
                 num: parseInt(this.msg),
                 playerName: this.player_name
             })
        },
        chatMsg: function () {
            this.$store.commit('SEND_MESSAGE',{
                msg: this.msg,
                playerName: this.player_name
            })
        },
        scrollDown: function() {
            this.$refs.chat_board.wrap.scrollTop = this.$refs.chat_board.wrap.scrollHeight
        }
    },
    mounted(){
        this.$store.commit('SET_MSGLIST', [{
            msg_index: 0,
            message_type: 1,
            playerName: '系统',
            msg: '祝大家玩得开心~'
        }])
    },
    computed: {
        ...mapState([
            'msgList',
            'player_name'
        ]),
        ...mapGetters([
            'guess_state'
        ]),
        showList: function () {
            if (this.filter === true){
                return this.msgList.filter( (msg) => {
                    return msg.message_type === 1
                })
            }else{
                return this.msgList
            }
        }
    },
    watch: {
        showList: function () {
            this.$nextTick(this.scrollDown)
        }
    }
}
</script>
<style lang="scss" scoped >
  .btn-group-custom{
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 10px;
  }
  .container{
      height: 90%;
      margin: 0;
      padding: 0;
  }

.message-list{
    clear: both;
    background-color: rgba($color: #a9a9a9, $alpha: 0.5);
    height: 82%;
}

.filter .el-switch__label{
    color: antiquewhite 
    }
.filter{
    float:right;
    display: block;
}

.msg-cont{
    text-align: left;
    height: inherit;
    list-style-type: none;
    margin: 0px;
    padding: 0px;
    > li{
        display: block;
    }
}

  .btn-group-custom .btn {
    float: right;
  }

.message-input{
    margin: 0;
    padding: 0;
}
</style>
