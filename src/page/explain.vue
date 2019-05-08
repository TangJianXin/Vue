<template>
    <div class="fillcontain">
        <head-top></head-top>
		 <p class="explain_text">智慧养老院管理系统</p>
        <p class="explain_text">普通员工可以添加和修改信息</p>
        <p class="explain_text">管理员可以删除信息</p>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    export default {
    	components: {
    		headTop,
    	},
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
</style>
