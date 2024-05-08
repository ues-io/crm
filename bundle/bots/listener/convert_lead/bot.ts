import { ListenerBotApi } from "@uesio/bots"

export default function convert_lead(bot: ListenerBotApi) {
	bot.log.info("params", bot.params)
}
