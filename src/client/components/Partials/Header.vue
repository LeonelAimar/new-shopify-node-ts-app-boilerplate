<template>
    <header class="page-header" id="giftListHeader">
        <div class="page-header__content">
            <h1 class="display-2">{{ appTitle }}</h1>
        </div>
        <div class="page-header__actions row">
            <div class="col-md-9">
                <a href="/api/v1/csv" target="_blank" class="btn btn-link-gray">
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20"><path d="M9.293 13.707l-3-3a.999.999 0 1 1 1.414-1.414L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a.999.999 0 1 1 1.414 1.414l-3 3a.999.999 0 0 1-1.414 0zM17 16a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h14z"></path></svg>
                    Export CSV
                </a>
            </div>                
            <div class="col-md-3 actionsContainer">
                <button type="button" class="btn btn-primary" @click.prevent="goConfigPage()">
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20"><path d="M17 4h-3a1 1 0 1 0 0 2h2v10H4V4h3.586L9 5.414v5.172L7.707 9.293a1 1 0 0 0-1.414 1.414l3 3a.996.996 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V5a.997.997 0 0 0-.293-.707l-2-2A.994.994 0 0 0 8 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"></path></svg>
                    Configuraciones
                </button>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppStore from '../../store/AppStore'

export default defineComponent({
    setup() {
        const router = useRouter()
        const goConfigPage = () => router.push({ path: '/config' })

        return { 
            appTitle: AppStore.state.appTitle, 
            goConfigPage
        }
    },
})
</script>


<style scoped>
header {
    text-align: start;
}
.actionsContainer {
    display: flex;
    place-content: flex-end;
    /* justify-content: space-evenly; */
}
</style>