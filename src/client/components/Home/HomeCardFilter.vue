<template>
    <div class="row no-margins card-body-section">
        <form class="col-12" id="filterForm" @submit.prevent="handleFilter($event)">
            <div class="form-row col-12">
                <div class="form-group col-md-6">
                    <input type="text" 
                        id="filterId" class="form-control" placeholder="ID Shipment"
                        v-model="filtering.resourceId" data-filter="shipmentId" @input="clearOtherFilters"
                    >
                </div>
                <div class="form-group col-md-6">
                    <input type="text" 
                        id="filterEmail" v-model="filtering.orderName" @input="clearOtherFilters"
                        placeholder="# Shopify Order" class="form-control" data-filter="orderName"
                    >
                </div>
            </div>
            <button type="submit" class="d-none">Filter</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import AppStore from '../../store/AppStore'

export default defineComponent({
    setup() {
        const filtering = reactive(AppStore.state.filtering)
        type EntryTuple = [string, any]

        const handleFilter = async (evt: Event) => {
            const formTarget = evt.target as HTMLFormElement
            const clearElements = formTarget.elements
            const existFilter = Object.entries(filtering).filter( elem => elem[1] !== null && elem[1] !== '' )
            let query = {} as any

            if ( existFilter.length > 0 ) {
                existFilter.forEach( (keyVal: EntryTuple) => {
                    if ( keyVal[0] === 'shipmentId' ) query._id = keyVal[1]
                    if ( keyVal[0] === 'orderName' ) query.orderName = { $regex: keyVal[1].trim().replace(/#/g, ''), $options: 'i' }
                })
            }

            AppStore.methods.fetchData({ page: 1, query })
        }

        const clearOtherFilters = ( event: Event ) => {
            Object.entries(filtering).forEach( (elem: EntryTuple) => {
                const [key, val] = elem
                if ( key !== (event.target as HTMLInputElement).dataset.filter ) {
                    if ( key === 'resourceId' ) AppStore.state.filtering.resourceId = ''
                    if ( key === 'orderName' ) AppStore.state.filtering.orderName = ''
                }
            })
        }

        return { 
            handleFilter,
            filtering,
            clearOtherFilters
        }
    },
})
</script>