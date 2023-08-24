<template>
     <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
            <i :class="icon" class="card-panel-icon"></i>
        </div>
        <div class="card-panel-description">
            <div class="card-panel-text">
                {{title}}
            </div>
            <count-to :start-val="start" :end-val="end"
                        :duration="duration" class="card-panel-num"/>
        </div>
    </div>
</template>
<script>
import CountTo from 'vue-count-to'
export default {
  props: {
    start: {
      default: 0,
      type: Number
    },
    end: {
      default: 0,
      type: Number
    },
    duration: {
      default: 0,
      type: Number
    },
    title: {
      default: '',
      type: String
    },
    icon: {
      default: '',
      type: String
    },
    color: {
      default: '#36a3f7',
      type: String
    }
  },
  components: {
    CountTo
  }
}
</script>
<style scoped lang="less">
  .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #ffffff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-people {
                    background: #36a3f7;
                }
            }
            .icon-people {
                 color: #36a3f7;
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
</style>
