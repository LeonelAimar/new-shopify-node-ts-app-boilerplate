<template>
    <div class="col-12">
        <nav>
            <ul class="pagination">
              <li class="page-item">
                <a class="btn" :class="{ 'disabled': !hasPrevPage }" 
                    href="#" @click.prevent="movePage(page - 1)" 
                    :tabindex="!hasPrevPage ? -1 : ''"
                >
                  <span class="polaris-icon">
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20">
                      <path d="M17 9H5.414l3.293-3.293a.999.999 0 1 0-1.414-1.414l-5 5a.999.999 0 0 0 0 1.414l5 5a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L5.414 11H17a1 1 0 1 0 0-2" fill-rule="evenodd"></path>
                    </svg>
                  </span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>
              <li class="page-item">
                <a class="btn" :class="{ 'disabled': !hasNextPage }" 
                    href="#" @click.prevent="movePage(page + 1)" 
                    :tabindex="!hasNextPage ? -1 : ''"
                >
                  <span class="polaris-icon">
                    <svg class="polaris-icon__svg" viewBox="0 0 20 20">
                      <path d="M17.707 9.293l-5-5a.999.999 0 1 0-1.414 1.414L14.586 9H3a1 1 0 1 0 0 2h11.586l-3.293 3.293a.999.999 0 1 0 1.414 1.414l5-5a.999.999 0 0 0 0-1.414" fill-rule="evenodd"></path>
                    </svg>
                  </span>
                  <span class="sr-only">Next</span>
                </a>
              </li>
            </ul>
        </nav>
    </div>
    <div class="col-12 lowerText">
        <small class="text-muted">
            Showing {{ page }} 
            of {{ totalPages }} 
            {{ totalPages === 1 ? 'page' : 'pages' }}
        </small>
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import AppStore from '../../store/AppStore';

export default defineComponent({
    setup() {
        const route = useRoute()
        const hasNextPage = computed(() => AppStore.state.data.hasNextPage)
        const hasPrevPage = computed(() => AppStore.state.data.hasPrevPage)
        const totalDocs = computed(() => AppStore.state.data.totalDocs)
        const totalPages = computed(() => AppStore.state.data.totalPages) as ComputedRef<number>
        const page = computed(() => AppStore.state.data.page) as ComputedRef<number>

        const movePage = ( pagPage: any ) => {
            if ( (pagPage > page.value && hasNextPage.value) ||
                (pagPage < page.value && hasPrevPage.value) 
            ) {
                AppStore.methods.fetchData({ page: pagPage })
                if ( route.params.message ) {
                    delete route.params.message
                    delete route.params.type
                }
            } else {
                AppStore.methods.showToast('No se encuentran más paginas con datos')
                console.log('Dat page, does not exist')
            }
        }

        return {
            hasNextPage, 
            hasPrevPage,
            page,
            totalPages,
            movePage,
        }
    },
})
</script>

<style scoped>
.col-12 { z-index: 600; }
.lowerText {
    margin-bottom: 1rem;
}

.pagination {
    justify-content: center;
}
</style>