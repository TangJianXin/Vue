import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const register = r => require.ensure([], () => r(require('@/page/register')), 'register');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addOldPeople = r => require.ensure([], () => r(require('@/page/addOldPeople')), 'addOldPeople');
const addEmployer = r => require.ensure([], () => r(require('@/page/addEmployer')), 'addEmployer');
const addDepartment = r => require.ensure([], () => r(require('@/page/addDepartment')), 'addDepartment');
const addBed = r => require.ensure([], () => r(require('@/page/addBed')), 'addBed');
const addEquipment = r => require.ensure([], () => r(require('@/page/addEquipment')), 'addEquipment');
const departmentList = r => require.ensure([], () => r(require('@/page/departmentList')), 'departmentList');
const oldPeopleList = r => require.ensure([], () => r(require('@/page/oldPeopleList')), 'oldPeopleList');
const employerList = r => require.ensure([], () => r(require('@/page/employerList')), 'employerList');
const bedList = r => require.ensure([], () => r(require('@/page/bedList')), 'bedList');
const equipmentList = r => require.ensure([], () => r(require('@/page/equipmentList')), 'equipmentList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const routes = [
	{
		path: '/',
		redirect:'login'
	},
	{
		path:'/register',
		component: register
	},
	{
		path: '/login',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/addOldPeople',
			component: addOldPeople,
			meta: ['添加数据', '添加老人'],
		},{
			path: '/addEmployer',
			component: addEmployer,
			meta: ['添加数据', '添加员工'],
		},{
			path: '/addDepartment',
			component: addDepartment,
			meta: ['添加数据', '添加部门'],
		},{
			path: '/addBed',
			component: addBed,
			meta: ['添加数据', '添加床位'],
		},
		{
			path: '/addEquipment',
			component: addEquipment,
			meta: ['添加数据', '添加设备'],
		},
		{
			path: '/departmentList',
			component: departmentList,
			meta: ['数据管理', '部门列表'],
		},{
			path: '/oldPeopleList',
			component: oldPeopleList,
			meta: ['数据管理', '老人列表'],
		},{
			path: '/employerList',
			component: employerList,
			meta: ['数据管理', '员工列表'],
		},{
			path: '/bedList',
			component: bedList,
			meta: ['数据管理', '床位列表'],
		},{
			path: '/equipmentList',
			component: equipmentList,
			meta: ['数据管理', '设备列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '说明'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
