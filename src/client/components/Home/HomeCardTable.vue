<template>
    <div class="card-body-section table-responsive-wrapper">
        <table class="table table-hover" v-if="resources.length > 0">
            <thead>
                <tr>
                    <th scope="col" class="sort">
                        <a href="#" class="btn btn-link-sort active">ID</a>
                    </th>
                    <th scope="col" class="sort">
                        <a href="#" class="btn btn-link-sort">Order #</a>
                    </th>
                    <th scope="col" class="sort">
                        <a href="#" class="btn btn-link-sort">Created at</a>
                    </th>
                    <th scope="col" class="sort">
                        <a href="#" class="btn btn-link-sort">State</a>
                    </th>
                    <th scope="col" class="sort">
                        <a href="#" class="btn btn-link-sort">Amount</a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <ResourceRow 
                    v-for="resource of resources" 
                    :resource="resource"
                    :key="resource._id"
                />
            </tbody>
        </table>
        <div v-if="resources.length > 0" class="col-12 mt-3 countLists">
            <p class="text-muted">
                Showing {{ resources.length }} / {{ totalDocs }} elements
            </p>
        </div>
        <div v-else class="emptyLists">There's no shippings created yet.</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ResourceRow from './ResourceRow.vue'
import AppStore from '../../store/AppStore'

export default defineComponent({
    name: 'HomeCardTable',
    components: {
        ResourceRow
    },
    setup() {
        const resources = reactive(AppStore.state.data.docs)
        return {
            resources,
            totalDocs: AppStore.state.data.totalDocs
        }
    },
})
</script>

<style scoped>
th:not(.right) { text-align: left; }
th:not(.center) { text-align: left; }
.right { text-align: right; }
.center { text-align: center !important; }
.emptyLists {
    font-size: 2rem;
    padding: 10px;
}
.countLists p {
    width: auto;
    float: right;
}

</style>