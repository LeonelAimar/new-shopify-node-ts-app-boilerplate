import { reactive } from 'vue';
import axios from 'axios';
import { PaginationModel } from "../interfaces/PaginationModel";

// Interfaces
import { AppState } from "../interfaces/StateInterfaces";
import { AppMode, IActionPayload, IAppConfig } from "../interfaces/AppInterfaces";

const state = reactive<AppState>({
    appTitle: 'Mercado Pago',
    shopUri: '[shop-uri].myshopify.com', 
    shopApiKey: '1f9310c696f77775d3842e0b2417fc4c', 
    toast: { 
        message: '', 
        isOpen: false 
    }, 
    loading: false, 
    data: {
        totalDocs: undefined,
        limit: undefined,
        totalPages: undefined,
        page: undefined,
        pagingCounter: undefined,
        hasPrevPage: undefined,
        hasNextPage: undefined,
        prevPage: undefined,
        nextPage: undefined,
        hasMore: undefined,
        docs: []
    },
    filtering: {
        status: null,
        checkoutId: '',
        resourceId: '',
        orderName: ''
    },
    additional: {
        ip: ''
    }
})

const methods = {
    setLoading( loadingState: boolean ) {
        state.loading = loadingState
    },
    closeToast() {
        state.toast.isOpen = false
    },
    showToast( message: string, seconds: number | undefined = 3 ) {
        state.toast.message = message
        state.toast.isOpen = true
        setTimeout(() => state.toast.isOpen = false, seconds*1000)
    },
    async fetchData( payload: IActionPayload ): Promise<PaginationModel<any>> {
        try {
            this.setLoading(true)
            let getUrl: string = `/api/v1/resource?page=${payload.page}`
            payload.sort = { createdAt: 'DESC' }
    
            if ( payload.query ) getUrl += `&query=${JSON.stringify(payload.query)}`
            if ( payload.sort ) getUrl += `&sort=${JSON.stringify(payload.sort)}`
    
            const request = await axios.get<PaginationModel<any>>(getUrl)
            const { data } = request
    
            state.data = data
            this.setLoading(false)
            
            return data
        } catch (err) {
            console.log(err)
            
            this.setLoading(false)
            state.data.totalDocs = 1
            state.data.page = 1
            state.data.totalPages = 1

            return { 
                ...state.data, 
                ...state.data.docs = [{
                    _id: 'asdkjuhasdukas12',
                    createdAt: new Date(Date.now()).toISOString(),
                    orderName: '# 1512',
                    status: 3,
                    transactionAmount: 1515
                }]
            }
        }
    },
    async fetchConfig(): Promise<void> {
        const getUrl = `/api/v1/config`

        const request = await axios.get<{ config: IAppConfig }>(getUrl)
        const { config } = request.data
        
        state.config = Object.keys(config).length > 0 ? config : {
            _id: '',
            apiProductionKey: '',
            apiProductionUrl: '',
            apiSandboxKey: '',
            apiSandboxUrl: '',
            apiProductionAccessToken: '',
            apiProductionClientId: '',
            apiProductionClientSecret: '',
            apiSandboxAccessToken: '',
            mode: AppMode.SANDBOX,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
    },
    async getIp() {
        try {
            const requestIp = await axios.get<{ ip: string }>('https://api.ipify.org/?format=json')
            state.additional.ip = requestIp.data.ip
            // console.log(requestIp.data)
        } catch (err) {
            console.error( err )
        }
    },
    async initFetchings() {
        this.fetchConfig()
    }
}

export default {
    state,
    methods,
}