import crypto from 'crypto';
import config from '../config/config';
import jwt from 'jsonwebtoken'

import { IUser } from '../interfaces/UserInterface'
import { PaginationModel } from 'mongoose-paginate-ts';
import axios, { AxiosError } from 'axios';

class HelpersController {
    public hash256( data: string ): string {
        return crypto.createHash('sha256').update(data, 'binary').digest('base64');
    }

    public createToken( user: IUser ): string {
        return jwt.sign({
            id: user.id,
            userName: user.userName,
            role: user.role
        }, config.JWT.SECRET_TOKEN, {
            noTimestamp: true
        })
    }

    public authenticateJwt( token: string ) {
        jwt.verify(token, config.JWT.SECRET_TOKEN, (err, user) => {
            if ( err ) return { status: false }
            return { status: true, user }
        })
    }

    public formatVoidPagination( totalDocs: number, limit: number, page: number ): PaginationModel<any> {
        return {
            totalDocs,
            limit,
            totalPages: totalDocs / limit,
            page,
            pagingCounter: page,
            hasPrevPage: false,
            hasNextPage: false,
            prevPage: 0,
            nextPage: 0,
            hasMore: false,
            docs: []
        }
    }

    public async sendSlackMessage( whereWas: string, sectionErrorJson: any ): Promise<any> {
        console.log(JSON.stringify(sectionErrorJson))
        try {
            await axios.post(
                'https://hooks.slack.com/services/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', 
                {
                    blocks: [
                        {
                            type: 'header',
                            text: {
                                type: 'plain_text',
                                text: config.GLOBAL.APP_NAME,
                                emoji: true
                            }
                        },
                        {
                            type: 'section',
                            fields: [{
                                type: 'mrkdwn',
                                text: `*Resource:*\n${whereWas}`
                            }]
                        },
                        ...sectionErrorJson
                    ]
                }
            )
        } catch (err) {
            console.log(err)
            const error: AxiosError<any> = err

            return this.sendSlackMessage('Slack Messager', [
                {
                    type: 'section',
                    fields: [
                        {
                            type: 'mrkdwn',
                            text: `*Error:*\n\`\`\`${JSON.stringify(error.response.data || err)}\`\`\``
                        }
                    ]
                }
            ])
        }
    }
}

export default new HelpersController()
