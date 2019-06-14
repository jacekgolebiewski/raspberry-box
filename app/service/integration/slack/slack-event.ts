export class SlackEvent {
    static RTM_OPEN = new SlackEvent("rtm_open");
    static RTM_CLOSE = new SlackEvent("rtm_close");
    static BOT_CHANNEL_JOIN = new SlackEvent("bot_channel_join");

    constructor(public code: string) {}
}