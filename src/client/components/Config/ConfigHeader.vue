<template>
    <div class="configHeaderContainer">
        <div v-if="route.params.message">
            <div class="banner"
                tabindex="0" role="status" 
                :class="{ 
                    'banner--success': route.params.type === 'success',
                    'banner--warning': route.params.type === 'warning',
                    'banner--critical': route.params.type === 'critical',
                    'banner--info': route.params.type === 'info'
                }"
            >
                <div class="banner__ribbon">
                    <span class="polaris-icon polaris-icon__has-backdrop">
                        <svg class="polaris-icon__svg" viewBox="0 0 20 20" v-if="route.params.type === 'success'">
                            <g fill-rule="evenodd">
                                <circle fill="currentColor" cx="10" cy="10" r="9"></circle>
                                <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m2.293-10.707L9 10.586 7.707 9.293a1 1 0 1 0-1.414 1.414l2 2a.997.997 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414"></path>
                            </g>
                        </svg>
                        <svg class="polaris-icon__svg" viewBox="0 0 20 20" v-else-if="route.params.type === 'critical'">
                             <g fill-rule="evenodd">
                                <circle fill="currentColor" cx="10" cy="10" r="9"></circle>
                                <path d="M2 10c0-1.846.635-3.543 1.688-4.897l11.209 11.209A7.954 7.954 0 0 1 10 18c-4.411 0-8-3.589-8-8m14.312 4.897L5.103 3.688A7.954 7.954 0 0 1 10 2c4.411 0 8 3.589 8 8a7.952 7.952 0 0 1-1.688 4.897M0 10c0 5.514 4.486 10 10 10s10-4.486 10-10S15.514 0 10 0 0 4.486 0 10"></path>
                            </g>
                        </svg>
                        <svg class="polaris-icon__svg" viewBox="0 0 20 20" v-else-if="route.params.type === 'warning'">
                            <g fill-rule="evenodd">
                                <circle fill="currentColor" cx="10" cy="10" r="9"></circle>
                                <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-13a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1m0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2"></path>
                            </g>
                        </svg>
                        <svg class="polaris-icon__svg" viewBox="0 0 20 20" v-else-if="route.params.type === 'info'">
                            <g fill-rule="evenodd">
                                <circle cx="10" cy="10" r="9" fill="currentColor"></circle>
                                <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m1-5v-3a1 1 0 0 0-1-1H9a1 1 0 1 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2m-1-5.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2"></path>
                            </g>
                        </svg>
                        <svg class="polaris-icon__svg" viewBox="0 0 20 20" v-else>
                            <g fill-rule="evenodd">
                                <path fill="currentColor" d="M2 3h11v4h6l-2 4 2 4H8v-4H3"></path>
                                <path d="M16.105 11.447L17.381 14H9v-2h4a1 1 0 0 0 1-1V8h3.38l-1.274 2.552a.993.993 0 0 0 0 .895zM2.69 4H12v6H4.027L2.692 4zm15.43 7l1.774-3.553A1 1 0 0 0 19 6h-5V3c0-.554-.447-1-1-1H2.248L1.976.782a1 1 0 1 0-1.953.434l4 18a1.006 1.006 0 0 0 1.193.76 1 1 0 0 0 .76-1.194L4.47 12H7v3a1 1 0 0 0 1 1h11c.346 0 .67-.18.85-.476a.993.993 0 0 0 .044-.972l-1.775-3.553z"></path>
                            </g>
                        </svg>
                    </span>
                </div>
                <div>
                    <h3>{{ route.params.message }}</h3>
                    <a href="#" 
                        class="btn btn-outline" v-if="route.params.additionalText"
                        @click.prevent="goToRouter(String(route.params.additionalLink))"
                    >{{ route.params.additionalText }}</a>
                </div>
            </div>
        </div>
        <div class="configHeader">
            <nav class="page-header__navigation goBackArrow">
                <a href="#" class="btn btn-link-gray page-header__back" @click.prevent="goHome()">
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20"><path d="M12 16a.997.997 0 0 1-.707-.293l-5-5a.999.999 0 0 1 0-1.414l5-5a.999.999 0 1 1 1.414 1.414L8.414 10l4.293 4.293A.999.999 0 0 1 12 16" fill-rule="evenodd"></path></svg>
                    Volver a órdenes
                </a>
            </nav>
            <h2 class="display-2 mb-5 config--title">
                Configuración
            </h2>
        </div>
        <div class="page-header__actions row mb-3">
            <div class="col-md-10"></div>
            <div class="col-md-2 actionsContainer">
                <button type="button" class="btn btn-primary" 
                    @click.prevent="$emit('saveCategory')"
                >
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20"><path d="M17 4h-3a1 1 0 1 0 0 2h2v10H4V4h3.586L9 5.414v5.172L7.707 9.293a1 1 0 0 0-1.414 1.414l3 3a.996.996 0 0 0 1.414 0l3-3a1 1 0 0 0-1.414-1.414L11 10.586V5a.997.997 0 0 0-.293-.707l-2-2A.994.994 0 0 0 8 2H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"></path></svg>
                    Actualizar
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppStore from '../../store/AppStore';

export default defineComponent({
    setup() {
        const router = useRouter()
        const route = useRoute()
        const page = computed(() => AppStore.state.data.page) as ComputedRef<number>
        
        const goHome = () => router.push({ 
            name: 'Home', 
            params: { fetchPage: page.value }
        })

        const goToRouter = ( link: string ) => router.push({ path: link })

        return { 
            goHome,
            route,
            goToRouter
        }
    },
})
</script>

<style lang="scss" scoped>
.goBackArrow {
    left: 2rem;
    position: absolute;
    transform: scale(1.2);
    z-index: 10;
    
    @media screen and (max-width: 1000px) {
        top: 100%;
    }
}
.configHeader {
    display: flex;
    justify-content: center;
    position: relative;
}
.actionsContainer {
    display: flex;
    place-content: flex-end;
}
.actionsContainer button:not(:first-child) {
    margin-left: 1rem;
}

.config--title {
    padding-bottom: .5rem;
    border-bottom: 1px solid rgb(98 112 199);
    width: 75%;
}

.configHeaderContainer {
    margin-top: 2rem;
}
</style>