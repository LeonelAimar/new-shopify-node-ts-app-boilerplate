<template>
    <div class="card-body">
        <HomeCardFilter />
        <HomeCardTable />
    </div>
    <PaginationRowArrows />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeCardTable from './HomeCardTable.vue'
import HomeCardFilter from './HomeCardFilter.vue'
import PaginationRowArrows from './PaginationRowArrows.vue'

export default defineComponent({
    name: 'HomeCardBody',
    components: {
        HomeCardTable,
        PaginationRowArrows,
        HomeCardFilter
    },
    setup() {
        
    }
});
</script>

<style scoped>

</style>