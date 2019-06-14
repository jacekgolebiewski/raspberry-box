export class SlackMessageType {
    static DIRECT_MENTION = new SlackMessageType("direct_mention");
    static MENTION = new SlackMessageType("mention");
    static DIRECT_MESSAGE = new SlackMessageType("direct_message");
    static AMBIENT = new SlackMessageType("ambient");

    constructor(public code: string) {}
}