import * as botkit from "botkit"
import { HearsCallback, SlackBot, SlackController, SlackSpawnConfiguration } from "botkit"
import { SlackEvent } from "./slack-event";
import { SlackMessageType } from "./slack-message-type";
import { ApplicationConfig } from '../../../shared/constants/config/application-config';
import { Component } from '../../../component/component';
import { ConfigKey } from '../../../shared/constants/config/config-key';

@Component.default
export class SlackService {

    private TOKEN = "token";
    private USER = "user";

    constructor() {
        this.controller = botkit.slackbot(this.SLACK_CONFIG);
        this.bot = this.controller.spawn(this.SLACK_SPAWN_CONFIG);
        this.start();
    }

    private SLACK_CONFIG: any = {
        json_file_store: './' + ApplicationConfig.get(ConfigKey.RUNTIME_DATA_DIR) + '/db_slack_bot_ci/',
        clientSigningSecret: 'slack_secret_rpi',
        log: false,
        disable_startup_messages: true
    };

    private SLACK_SPAWN_CONFIG: SlackSpawnConfiguration = {
        token: this.TOKEN
    };

    private MESSAGE_PATTERN = '(.*)';
    private MESSAGE_TYPES = [SlackMessageType.DIRECT_MESSAGE, SlackMessageType.DIRECT_MENTION, SlackMessageType.MENTION, SlackMessageType.AMBIENT];

    private isReady = false;
    private notSentQ: Array<string> = [];

    private controller: SlackController;
    private bot: SlackBot;

    private start() {
        this.bot.startRTM((err, bot: SlackBot, payload) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
        });

        this.registerOn(SlackEvent.RTM_OPEN, () => {
            //console.log('ON RTM OPEN');
            this.isReady = true;
            this.notSentQ.forEach((el) => this.send(el));
            this.notSentQ = [];
        });
    }

    registerHears(cb: HearsCallback<any,any,any>) {
        this.controller.hears(
            this.MESSAGE_PATTERN,
            this.MESSAGE_TYPES.map((smt) => smt.code),
            cb);
    }

    registerOn(event: SlackEvent, cb: HearsCallback<any,any,any>) {
        this.controller.on(event.code, cb)
    }

    send(message: string) {
        if(!this.isReady) {
            this.notSentQ.push(message);
        } else {
            this.bot.startPrivateConversation({user: this.USER}, function (err, convo) {
                if (err) {
                    console.log(err);
                } else {
                    convo.say(message);
                }
            });
        }
    }
}
