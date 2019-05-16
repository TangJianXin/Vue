<template>
    <div>
        <head-top></head-top>
        <visitor-pie></visitor-pie>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import visitorPie from '@/components/visitorPie'
    export default {
    	data(){
    		return {
    		}
    	},
    	components: {
    		headTop,
            visitorPie,
    	},
    	mounted(){
    	},
    	methods: {
    	}
    }
</script>

<style lang="less">
	@import '../style/mixin';
	
</style>
