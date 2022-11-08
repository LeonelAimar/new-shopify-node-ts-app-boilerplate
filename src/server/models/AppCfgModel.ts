import { model, Schema } from 'mongoose'
import { IAppConfig } from '../interfaces/AppInterfaces'

const appConfigSchema = new Schema<IAppConfig>({
    mode: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    apiSandboxUrl: { type: String, default: '' },
    apiProductionUrl: { type: String, default: '' },
    apiSandboxKey: { type: String, default: '' },
    apiSandboxAccessToken: { type: String, default: '' },
    apiProductionKey: { type: String, default: '' },
    apiProductionAccessToken: { type: String, default: '' },
    apiProductionClientId: { type: String, default: '' },
    apiProductionClientSecret: { type: String, default: '' }
}) 

appConfigSchema.pre('updateOne', function(next) {
    this.set({ updatedAt: Date.now() })
    next()
})

appConfigSchema.pre('save', function(next) {
    this.set({ updatedAt: Date.now() })
    next()
})

export default model<IAppConfig>('AppConfig', appConfigSchema)
