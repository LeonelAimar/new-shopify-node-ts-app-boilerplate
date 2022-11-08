<template>
    <div class="col-md-12 mt-5">
        <ConfigHeader @saveCategory="updateAppConfig" />
        <section v-if="configData && Object.keys(configData).length > 0">
            <div class="row no-gutters">
                <div class="col-md-6 card-annotation">
                    <h3>Modifique las configuraciones para la App → Mercado Pago</h3>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <form>
                                <div class="form-group">
                                    <label for="inputState" reqlabel>Modo App</label>
                                    <select class="form-control" v-model="configData.mode">
                                        <option value="null" selected disabled>Seleccione un modo</option>
                                        <option v-for="(mode, index) in AppMode" :key="index"
                                            :value="Object.keys(AppMode)[Object.values(AppMode).indexOf(mode)]"
                                        >{{ Object.keys(AppMode)[Object.values(AppMode).indexOf(mode)] }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>API Sandbox URL</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte URL de API para Sandbox mode" required
                                        v-model="configData.apiSandboxUrl"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>API Sandbox PublicKey</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte PublicKey de API para Sandbox mode" required
                                        v-model="configData.apiSandboxKey"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>Access Token Sandbox Key</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte AccessToken de API para Sandbox mode" required
                                        v-model="configData.apiSandboxAccessToken"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>API Production URL</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte URL de API para Production mode" required
                                        v-model="configData.apiProductionUrl"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>API Production Public Key</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte PublicKey de API para Production mode" required
                                        v-model="configData.apiProductionKey"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>Access Token Production Key</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte AccessToken de API para Production mode" required
                                        v-model="configData.apiProductionAccessToken"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>ClientId Production</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte ClientId de API para Production mode" required
                                        v-model="configData.apiProductionClientId"
                                    />
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label" for="titleInput" reqlabel>Client Secret Production</label>
                                    <input type="text" class="form-control" 
                                        id="titleInput" placeholder="Inserte Client Secret de API para Production mode" required
                                        v-model="configData.apiProductionClientSecret"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import ShopifyApp from '@/providers/ShopifyAppProvider'

import { HelpersClass } from '@/providers/HelpersService'
import AppStore from '@/store/AppStore';
import ConfigHeader from '@/components/Config/ConfigHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

import { IAppConfig, AppMode } from '@/interfaces/AppInterfaces'

export default defineComponent({
    components: {
        ConfigHeader,
        LoadingSpinner
    },
    setup() {
        const router = useRouter()
        const configData = reactive<IAppConfig>(AppStore.state.config as IAppConfig)

        onMounted(() => HelpersClass.hideHeader())
        onUnmounted(() => {
            HelpersClass.hideHeader(false)
            AppStore.methods.initFetchings()
        })

        
        const updateAppConfig = async () => {            
            try {
                let dataConfig: { created?: boolean, updated?: boolean, config: IAppConfig }

                if ( configData._id === '' ) {
                    const request = await axios.post<{
                        created: boolean,
                        config: IAppConfig
                    }>(`/api/v1/config`, configData)
                    const { data } = request
                    dataConfig = data
                    AppStore.state.config = data.config
                } else {
                    const request = await axios.put<{
                        updated: boolean,
                        message: string,
                        config: IAppConfig
                    }>(`/api/v1/config/${configData._id}`, configData)
                    const { data } = request
                    dataConfig = data
                    AppStore.state.config = data.config
                }
                
                if ( dataConfig.updated || dataConfig.created ) {
                    router.push({
                        name: 'Config',
                        params: {
                            id: configData._id,
                            message: 'Configuración actualizada correctamente',
                            type: 'success'
                        }
                    })
                } else {
                    const params = {} as any
                    
                    params.id = configData._id
                    params.type = 'warning'
                    params.message = 'La configuración no ha sido actualizada debido a un error de sistema'

                    router.push({
                        name: 'Config',
                        params
                    })
                }

            } catch(err: any) {
                console.error(err)
                router.push({
                    name: 'Config',
                    params: {
                        id: configData._id,
                        message: `La configuración no ha sido actualizada debido a → ${err.isAxiosError && err.response.data.errors.join(' | ') || err.message}`,
                        type: 'critical'
                    }
                })
            }
        }

        return {
            configData,
            updateAppConfig,
            AppMode,
            methods: AppStore.methods
        }
    },
})
</script>

<style lang="scss" scoped>
.gatewayProviderImg {
    max-width: 84px;
}

.gatewayProvidersRow {
    border-bottom: 1px solid #dfdfdf;
    border-radius: 1rem;
    padding-bottom: .75rem;
    margin-bottom: 2rem;
}
.gatewayProviderColumn {
    max-height: 30rem;
    overflow-y: scroll;
    height: auto;

    li {
        position: relative;
        width: 100%;
        height: 75px;
        font-weight: 600;

        img {
            position: absolute;
            left: 25%;
            transform: translateX(-25%);
        }

        span {
            position: absolute;
            top: 50%;
            left: 70%;
            transform: translateX(-50%) translateY(-50%);
            padding: .75rem;
            border: 1px solid #ccc;
            border-radius: 1rem;
        }

        &:hover {
            background-color: rgb(243, 243, 243);
            cursor: pointer;
        }

        &.active {
            background-color: rgb(192, 192, 192);
            border: 1px solid #ccc;
            span { border-color: #000; }
        }
    }
}

.commerceButtons {
    position: relative;
    padding-bottom: 4rem;

    @media screen and (min-width: 1367px) {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    // @media screen and (max-width: 1599px) and (min-width: 481px) {
    //      .btn-primary {
    //         &:first-of-type { float: left !important; }
    //         &:last-of-type {
    //             position: relative;
    //             float: right !important;
    //         }
    //     }

    //     .btn-danger {
    //         position: absolute;
    //         left: 50%;
    //         transform: translateX(-50%);
    //     }
    // }

    @media screen and (max-width: 1366px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 2rem;
        button {
            width: 100%;
            &:not(:first-child) { margin-top: .75rem; }
        }
    }
}

.issuerSelected {
    span {
        border-radius: 1rem;
        padding: .75rem;
        border: 1px solid #ccc;
        // float: right;
    }
}

.loadingCommerces {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 75%;
    justify-content: center;
    align-items: center;

    span {
        margin-top: 1rem;
        font-size: 2rem;
    }
}
</style>