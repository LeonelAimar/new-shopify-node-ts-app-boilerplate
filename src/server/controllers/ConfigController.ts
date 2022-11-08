// Interfaces
import { Request, Response } from 'express'

// Models
import AppConfig from '../models/AppCfgModel'

class ConfigController {
    public async getConfig( req: Request, res: Response ): Promise<Response> {
        try {
            const configs = await AppConfig.find()
            return res.json({
                config: configs[0] ? configs[0] : {}
            })
        } catch (err) {
            return res.status(500).json({ message: 'Error while retrieving configs' })
        }
    }

    public async setConfig( req: Request, res: Response ): Promise<Response> {
        const errors = []
        if ( !req.body.mode ) errors.push('Please send app mode ENUM value')
        if ( !req.body.apiSandboxUrl ) errors.push('Please send test api url')
        if ( errors.length > 0 ) return res.status(400).json({ created: false, errors })

        try {
            const existConfigs = await AppConfig.countDocuments()
            if ( existConfigs > 0 ) {
                const config = await AppConfig.find()
                return res.json({
                    created: false,
                    message: 'Not created, already exists a configuration',
                    config: config[0]
                })
            } else {
                const configData = {} as any
                Object.keys(req.body).forEach( key => { if ( req.body[key] ) configData[key] = req.body[key] })

                const newCfg = new AppConfig(configData)
                const config = await newCfg.save()

                return res.status(201).json({
                    created: true,
                    config
                })
            }
        } catch (err) {
            return res.status(500).json({ errors: ['Error while creating or updating config on server'] })
        }
    }

    public async updateConfig( req: Request, res: Response ): Promise<Response> {
        if ( Object.keys(req.body).length === 0 )
            return res.status(400).json({ updated: false, message: 'Please send payload to update' })

        const { configId } = req.params
        try {
            req.body.updatedAt = Date.now()
            const updateConfig = await AppConfig.findByIdAndUpdate( configId, req.body, { new: true })
            return res.json({
                updated: true,
                message: 'Sucessfully updated',
                config: updateConfig
            })
        } catch (err) {
            return res.status(500).json({ message: `Error while updating ${configId} config` })
        }
    }
}

export default new ConfigController()
