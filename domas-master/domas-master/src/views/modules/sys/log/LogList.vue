<template>
    <div class="jp-common-layout page">
      <div class="jp-common-layout-left">
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
      <div class="el-scrollbar__wrap">
        <div class="el-scrollbar__view">
        <el-menu @select="changeLog" style="margin-top:10px">
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">登陆日志</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>
            <span slot="title">访问日志</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">异常日志</span>
          </el-menu-item>
        </el-menu>
        </div>
      </div>
        </div>
      </div>
      <div class="jp-common-layout-center jp-flex-main">
        <div class="top bg-white">
          <el-form size="mini" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item prop="searchDates">
          <el-date-picker
            v-model="searchDates"
            type="daterange"
            size="mini"
            align="right"
            value-format="yyyy-MM-dd hh:mm:ss"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="title">
            <el-input size="mini" v-model="searchForm.title" placeholder="操作菜单" clearable></el-input>
        </el-form-item>
        <el-form-item prop="createBy.name">
            <el-input size="mini" v-model="searchForm.createBy.name" placeholder="操作用户" clearable></el-input>
        </el-form-item>
        <el-form-item prop="requestUri">
            <el-input size="mini" v-model="searchForm.requestUri" placeholder="URI" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
          <el-button @click="resetSearch()" size="mini" icon="el-icon-refresh-right">重置</el-button>
          <el-button v-if="hasPermission('sys:log:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                     :disabled="dataListSelections.length <= 0" plain>删除
          </el-button>
          <el-button v-if="hasPermission('sys:log:del')" type="danger"   size="mini" icon="el-icon-delete" @click="empty()" plain>清空
          </el-button>
          <el-button @click="refreshList" size="mini" icon="el-icon-refresh-right">刷新</el-button>
        </el-form-item>
      </el-form>
        <el-table
          :data="dataList"
          border
          v-loading = "loading"
          size="mini"
          height="calc(100% - 107px)"
          @selection-change="selectionChangeHandle"
          class="table-nobutton">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
           <el-table-column v-if="searchForm.type == '3'" type="expand">
            <template slot-scope="props">
              <el-form size="mini" label-position="left" inline class="demo-table-expand">
                <el-form-item label="异常信息：">
                  <span style="color:red">{{ props.row.exception }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            type="index" label="#">
          </el-table-column>
          <el-table-column
            prop="title"
            show-overflow-tooltip
             width="150"
            label="操作菜单">
          </el-table-column>
          <el-table-column
            prop="createBy.name"
            label="操作用户">
          </el-table-column>
           <el-table-column
            prop="createBy.company.name"
            label="公司">
          </el-table-column>
          <el-table-column
            prop="requestUri"
            width="150"
            show-overflow-tooltip
            sortable="requestUri"
            label="URI">
          </el-table-column>
          <el-table-column
            prop="method"
            width="100"
            show-overflow-tooltip
            label="提交方式">
          </el-table-column>
           <el-table-column
            prop="remoteAddr"
            width="100"
            :show-overflow-tooltip="true"
            label="操作者IP">
          </el-table-column>
          <el-table-column
            prop="createDate"
            width="150"
            :show-overflow-tooltip="true"
            label="操作时间">
          </el-table-column>
        </el-table>
       <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 15, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    </div>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        searchForm: {
          type: '1',
          title: '',
          createBy: {
            name: ''
          },
          requestUri: '',
          beginDate: '',
          endDate: ''
        },
        searchDates: [],
        dataList: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        loading: false,
        dataListSelections: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    activated () {
      this.refreshList()
    },
    watch: {
      searchDates () {
        if (this.searchDates) {
          this.searchForm.beginDate = this.searchDates[0]
          this.searchForm.endDate = this.searchDates[1]
        } else {
          this.searchForm.beginDate = ''
          this.searchForm.endDate = ''
        }
      }
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/sys/log/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      changeLog (index) {
        this.searchForm.type = index
        this.refreshList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
         // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
          // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(
             '/sys/log/delete',
             {params: {'ids': ids}}
          ).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      empty () {
        this.$confirm(`确定清空日志吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(
             '/sys/log/empty'
          ).then(({data}) => {
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      resetSearch () {
        this.searchDates = []
        this.$refs.searchForm.resetFields()
        this.$nextTick(() => {
          this.refreshList()
        })
      }
    }
  }
</script>
