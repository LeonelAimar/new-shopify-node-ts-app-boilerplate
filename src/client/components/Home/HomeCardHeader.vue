<template>
    <div class="card-header-actions">
        <ul class="card-header-tabs">
            <li class="card-header-tab">
                <a href="#" 
                    @click.prevent="setStatusFiltering(null)"
                    :class="{ 'active': filtering.status === null }"
                >Todos</a>
            </li>
            <li class="card-header-tab">
                <a href="#"
                    @click.prevent="setStatusFiltering(ResourceStatus.PREPARING)"
                    :class="{ 'active': filtering.status === ResourceStatus.PREPARING }"
                >Pagados</a>
            </li>
            <li class="card-header-tab">
                <a href="#"
                    @click.prevent="setStatusFiltering(ResourceStatus.IN_TRANSIT)"
                    :class="{ 'active': filtering.status === ResourceStatus.IN_TRANSIT }"
                >Cancelados</a>
            </li>
            <li class="card-header-tab">
                <a href="#"
                    @click.prevent="setStatusFiltering(ResourceStatus.DELIVERED)"
                    :class="{ 'active': filtering.status === ResourceStatus.DELIVERED }"
                >Devueltos</a>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppStore from '../../store/AppStore';

import { reqQuery, ResourceStatus } from '../../interfaces/AppInterfaces';

export default defineComponent({
    name: 'HomeCardHeader',
    setup() {
        const setStatusFiltering = ( statusVal: number | null ) => {
            console.log(statusVal)

            AppStore.state.filtering.status = statusVal
            const query = ( statusVal === null ) ? {} : { payed: { $eq: statusVal } }
            AppStore.methods.fetchData({ 
                page: AppStore.state.data.page as number,
                query: query as reqQuery
            })
        }

        return {
            filtering: AppStore.state.filtering,
            setStatusFiltering,
            ResourceStatus
        }
    }
});
</script>

<style scoped>

</style>