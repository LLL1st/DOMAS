<template>
  <div class="page">
    <div class="bg-white">
      <el-form size="mini" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
		     <el-form-item prop="title">
                <el-input size="mini" v-model="searchForm.title" placeholder="标题" clearable></el-input>
		     </el-form-item>
          <el-form-item>
            <el-button  type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="mini" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <el-row>
        <el-button v-if="hasPermission('notify:oaNotify:add')" type="primary" size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('notify:oaNotify:edit')" type="warning" size="mini" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" >修改</el-button>
        <el-button  v-if="hasPermission('notify:oaNotify:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" >删除
        </el-button>
        <el-button-group class="pull-right">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top">
            <el-button
              type="default"
              size="mini"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
          </el-tooltip>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
      size="mini"
      border
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
	  <el-table-column
        prop="type"
        sortable="custom"
        show-overflow-tooltip
        label="类型">
        <template slot-scope="scope">
            {{ $dictUtils.getDictLabel("oa_notify_type", scope.row.type, '-') }}
        </template>
      </el-table-column>
	  <el-table-column
        prop="title"
        sortable="custom"
        show-overflow-tooltip
        label="标题">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('notify:oaNotify:edit') && scope.row.status==='0'" @click="edit(scope.row.id)">{{scope.row.title}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('notify:oaNotify:view')"  @click="view(scope.row.id)">{{scope.row.title}}</el-link>
          <span v-else>{{scope.row.title}}</span>
        </template>
      </el-table-column>
	  <el-table-column
        prop="content"
        sortable="custom"
        show-overflow-tooltip
        label="内容">
      </el-table-column>
	  <el-table-column
        prop="files"
        sortable="custom"
        show-overflow-tooltip
        label="附件">
        <template slot-scope="scope">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in (scope.row.files || '').split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>
	  <el-table-column
        prop="status"
        sortable="custom"
        label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === '1'"> {{ $dictUtils.getDictLabel("oa_notify_status", scope.row.status, '-') }}</el-tag>
          <el-tag type="danger" v-if="scope.row.status === '0'"> {{ $dictUtils.getDictLabel("oa_notify_status", scope.row.status, '-') }}</el-tag>
        </template>
      </el-table-column>
        <el-table-column
        prop="status"
        sortable="custom"
        label="查阅状态">
        <template slot-scope="scope">
         <div> {{scope.row.readNum + "/" + scope.row.unReadNum}}</div>
        </template>
      </el-table-column>
       <el-table-column
        prop="createBy.name"
        label="发布者">
      </el-table-column>
      <el-table-column
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('notify:oaNotify:view')" type="text" icon="el-icon-view" size="mini" @click="view(scope.row.id)">查看</el-button>
           <el-dropdown  size="mini" style=" margin-left: 10px;">
            <el-button type="text" size="mini">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item  v-if="hasPermission('notify:oaNotify:edit') && scope.row.status==='0'"><el-button type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">修改</el-button></el-dropdown-item>
              <el-dropdown-item v-if="hasPermission('notify:oaNotify:del')">    <el-button  type="text" size="mini" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </template>
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
        <!-- 弹窗, 新增 / 修改 -->
    <OaNotifyForm  ref="oaNotifyForm" @refreshDataList="refreshList"></OaNotifyForm>
  </div>
</template>

<script>
  import OaNotifyForm from './OaNotifyForm'
  export default {
    data () {
      return {
        searchForm: {
          title: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        loading: false
      }
    },
    components: {
      OaNotifyForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/notify/oaNotify/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
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

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.oaNotifyForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.oaNotifyForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.oaNotifyForm.init('view', id)
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
          this.loading = true
          this.$http({
            url: '/notify/oaNotify/deleteAll',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            this.loading = false
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
