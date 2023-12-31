<template>
  <div class="page">
    <div class="bg-white">
      <el-form size="mini" :inline="true" ref="searchForm" class="query-form" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item prop="name">
        <el-input size="mini" v-model="searchForm.name" placeholder="角色名" clearable></el-input>
        </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch()"  size="mini" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>

      <el-row>
        <el-button v-if="hasPermission('sys:user:add')" type="primary" size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('sys:user:edit')" type="warning" size="mini" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('sys:user:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
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
        v-loading="loading"
        size = "mini"
        highlight-current-row
        border
        @selection-change="selectionChangeHandle"
        @sort-change="sortChangeHandle"
        class="table">
      <el-table-column
        header-align="center"
        align="center"
        type="selection"
        width="50">
      </el-table-column>
        <el-table-column
          type="index" label="#">
        </el-table-column>
      <el-table-column
        prop="name"
        min-width="100px"
        label="角色名称">
          <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('sys:role:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('sys:role:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
       <el-table-column
        prop="enname"
        min-width="120px"
        label="角色英文名称">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="remarks"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="useable"
        label="是否可用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.useable == '0' ? 'danger' : 'success'">
            {{ $dictUtils.getDictLabel("yes_no", scope.row.useable, '否') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="280"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('sys:role:edit')" icon="el-icon-edit" type="text" size="mini" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('sys:role:del')" icon="el-icon-delete" type="text" size="mini" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="hasPermission('sys:role:assign')" icon="el-icon-setting" type="text" size="mini" @click="showAuth(scope.row)">角色授权</el-button>
          <el-button v-if="hasPermission('sys:role:assign')" icon="el-icon-user-solid" type="text" size="mini" @click="showRight(scope.row)">分配用户</el-button>
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
      background=""
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-drawer
      size = "700px"
      :title="`用户列表，所属角色: ${this.roleUserTitle}`"
      :visible.sync="rightVisible"
      direction="rtl">
      <role-user-list  :role-user-title="roleUserTitle" :role-id="roleId" ref="roleUserList" @closeRight="closeRight"></role-user-list>
    </el-drawer>

    <auth-form  :auth-form-title="roleUserTitle" :role-id="roleId" ref="authForm"></auth-form>

        <!-- 弹窗, 新增 / 修改 -->
    <role-form  ref="roleForm" @refreshDataList="refreshList"></role-form>
  </div>
</div>
</template>
<script>
  import RoleForm from './RoleForm'
  import AuthForm from './AuthForm'
  import RoleUserList from './RoleUserList'

  export default {
    data () {
      return {
        searchForm: {
          name: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        dataListSelections: [],
        rightVisible: false,
        roleUserTitle: '',
        roleId: '',
        loading: false
      }
    },
    components: {
      RoleForm,
      AuthForm,
      RoleUserList
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/sys/role/list',
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
        this.$refs.roleForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.roleForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.roleForm.init('view', id)
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
            url: '/sys/role/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            this.loading = false
            if (data && data.success) {
              this.$message.success({dangerouslyUseHTMLString: true,
                message: data.msg})
              this.refreshList()
            }
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      showRight (row) {
        this.roleId = row.id
        this.rightVisible = true
        this.$nextTick(() => {
          this.$refs.roleUserList.refreshList()
          this.roleUserTitle = row.name
        })
      },
      closeRight () {
        this.rightVisible = false
      },
      showAuth (row) {
        this.roleId = row.id
        this.authVisible = true
        this.$nextTick(() => {
          this.$refs.authForm.init(row.id)
          this.roleUserTitle = row.name
        })
      }
    }
  }
</script>
