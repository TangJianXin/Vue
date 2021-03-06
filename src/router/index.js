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
const addFunds = r => require.ensure([], () => r(require('@/page/addFunds')), 'addFunds');
const departmentList = r => require.ensure([], () => r(require('@/page/departmentList')), 'departmentList');
const oldPeopleList = r => require.ensure([], () => r(require('@/page/oldPeopleList')), 'oldPeopleList');
const employerList = r => require.ensure([], () => r(require('@/page/employerList')), 'employerList');
const bedList = r => require.ensure([], () => r(require('@/page/bedList')), 'bedList');
const equipmentList = r => require.ensure([], () => r(require('@/page/equipmentList')), 'equipmentList');
const fundsList = r => require.ensure([], () => r(require('@/page/fundsList')), 'fundsList');
const ageFigure= r => require.ensure([], () => r(require('@/page/ageFigure')), 'ageFigure');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const addQuota = r => require.ensure([], () => r(require('@/page/addQuota')), 'addQuota');
const quotaList = r => require.ensure([], () => r(require('@/page/quotaList')), 'quotaList');
const fundsFigure = r => require.ensure([], () => r(require('@/page/fundsFigure')), 'fundsFigure');
const departmentFigure = r => require.ensure([], () => r(require('@/page/departmentFigure')), 'departmentFigure');

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
			path: '/addFunds',
			component: addFunds,
			meta: ['添加数据', '资金记录'],
		},
		{
			path: '/departmentList',
			component: departmentList,
			meta: ['数据管理', '部门管理'],
		},{
			path: '/oldPeopleList',
			component: oldPeopleList,
			meta: ['数据管理', '老人管理'],
		},{
			path: '/employerList',
			component: employerList,
			meta: ['数据管理', '员工管理'],
		},{
			path: '/bedList',
			component: bedList,
			meta: ['数据管理', '床位列表'],
		},{
			path: '/equipmentList',
			component: equipmentList,
			meta: ['数据管理', '设备管理'],
		},{
			path: '/fundsList',
			component: fundsList,
			meta: ['数据管理', '资金流水'],
		},
		{
			path: '/ageFigure',
			component: ageFigure,
			meta: ['图表统计', '年龄画像'],
		},
		{
			path: '/fundsFigure',
			component: fundsFigure,
			meta: ['图表统计', '资金用途'],
		},
		{
			path: '/departmentFigure',
			component: departmentFigure,
			meta: ['图表统计', '部门数据'],
		},
		{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '个人中心'],
		},
		{
			path: '/addQuota',
			component: addQuota,
			meta: ['监控指标', '指标采集'],
		},
		{
			path: '/quotaList',
			component: quotaList,
			meta: ['监控指标', '体征指标'],
		},]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
