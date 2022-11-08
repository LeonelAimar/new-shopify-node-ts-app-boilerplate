<template>
    <tr>
        <td>
            <a href="#" 
                :data-id="resource._id"
                @click.prevent="detailsPage( resource._id )"
            >{{ resource._id?.slice(0, 8) }}</a>
        </td>
        <td>{{ resource.orderName || '#N/A' }}</td>
        <td>{{ dateTime }}</td>
        <td>
            <span class="badge" 
                :class="{ 
                    'badge--warning': resource.status == ResourceStatus.PREPARING, 
                    'badge--attention': resource.status == ResourceStatus.IN_TRANSIT, 
                    'badge--success': resource.status == ResourceStatus.DELIVERED
                }"
            >
                {{ 
                    resource.status === ResourceStatus.PREPARING
                    ? 'Pending' 
                    : resource.status === ResourceStatus.IN_TRANSIT
                        ? 'In transit'
                        : 'Delivered' 
                }}
            </span>
        </td>
        <td>$ {{ resource.transactionAmount }}</td>
    </tr>
</template>

<script lang="ts">
import { IResource, ResourceStatus } from '../../interfaces/AppInterfaces'
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
    name: 'ResourceRow',
    props: {
        resource: {
            required: true,
            type: Object as PropType<IResource>
        }
    },
    setup( props ) {
        const router = useRouter()
        const { createdAt } = props.resource
        const unixTime = new Date(Date.parse(createdAt as any))
        const dateTime = `${unixTime.toLocaleDateString('es-ES')} - ${unixTime.toLocaleTimeString('es-ES')}`

        const detailsPage = ( id?: string ) => {
            if ( !id ) return
            router.push({ path: `/resource/${id}` })
        }

        return {
            dateTime,
            detailsPage,
            ResourceStatus
        }
    },
})
</script>

<style scoped>
td:not(.right) {
    text-align: left;
}

td:not(.center) {
    text-align: left;
}

.right {
    text-align: right;
}
.center {
    text-align: center !important;
}
</style>
