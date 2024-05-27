import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function new_ai_chat(bot: ListenerBotApi) {
	const input = bot.params.get("input")
	const parent = bot.params.get("parent")
	const result = bot.runIntegrationAction(
		"uesio/core.bedrock",
		"invokemodel",
		{
			model: "anthropic.claude-v2",
			input,
		}
	) as string[]
	bot.save("uesio/crm.ai_chat", [
		{
			"uesio/crm.description": result[0],
			"uesio/crm.type": "RESPONSE",
			"uesio/crm.parent": {
				"uesio/core.id": parent,
			},
		},
	] as unknown as WireRecord[])?.[0]
}
