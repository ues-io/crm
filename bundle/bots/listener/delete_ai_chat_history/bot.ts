import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function delete_ai_chat_history(bot: ListenerBotApi) {
	const parent = bot.params.get("parent")

	// Get the previous messages
	const messagesResult = bot.load({
		collection: "uesio/crm.ai_chat",
		fields: [
			{
				id: "uesio/crm.description",
			},
			{
				id: "uesio/crm.type",
			},
		],
		conditions: [
			{
				field: "uesio/crm.parent",
				operator: "EQ",
				value: parent,
			},
		],
	})

	bot.delete("uesio/crm.ai_chat", messagesResult as unknown as WireRecord[])
}
