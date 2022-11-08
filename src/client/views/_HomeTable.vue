<template>
    <Loading v-if="isLoading" />
    <section class="card" v-else>
        <HomeMessages />
        <HomeCardHeader />
        <HomeCardBody />
    </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import HomeCardHeader from '../components/Home/HomeCardHeader.vue'
import HomeCardBody from '../components/Home/HomeCardBody.vue'
import Loading from '../components/Partials/Loading.vue'
import HomeMessages from '../components/Home/HomeMessages.vue'

import AppStore from '../store/AppStore'
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Home',
    components: {
        HomeCardHeader, HomeCardBody,
        Loading, HomeMessages
    },
    setup() {
        const route = useRoute()
        const isLoading = computed(() => AppStore.state.loading)

        const initHome = ( async ( pageFetching: number ) => {
            const data = await AppStore.methods.fetchData({ page: pageFetching })
            // console.log(data)
        })( Number(route.params.fetchPage) || 1 )

        AppStore.methods.getIp()

        return {
            isLoading
        }
    }
});
</script>

<style scoped>

</style>