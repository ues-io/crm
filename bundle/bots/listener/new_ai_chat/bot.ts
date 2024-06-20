import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function new_ai_chat(bot: ListenerBotApi) {
	const parent = bot.params.get("parent")

	// Get Lead info
	const leadResult = bot.load({
		collection: "uesio/crm.lead",
		fields: [
			{
				id: "uesio/crm.firstname",
			},
			{
				id: "uesio/crm.lastname",
			},
			{
				id: "uesio/crm.status",
			},
			{
				id: "uesio/crm.rating",
			},
			{
				id: "uesio/crm.source",
				fields: [
					{
						id: "uesio/crm.label",
					},
				],
			},
			{
				id: "uesio/crm.email",
			},
			{
				id: "uesio/crm.phone",
			},
			{
				id: "uesio/crm.next_steps",
			},
			{
				id: "uesio/crm.company",
			},
			{
				id: "uesio/crm.industry",
			},
			{
				id: "uesio/crm.topic",
			},
			{
				id: "uesio/crm.expected_revenue",
			},
			{
				id: "uesio/crm.close_date",
			},
		],
		conditions: [
			{
				field: "uesio/core.id",
				operator: "EQ",
				value: parent,
			},
		],
	})
	if (!leadResult?.length) {
		throw new Error(
			"No record found that matches the parent record specified"
		)
	}
	const lead = leadResult[0]
	const firstname = lead["uesio/crm.firstname"]
	const lastname = lead["uesio/crm.lastname"]
	const status = lead["uesio/crm.status"]
	const rating = lead["uesio/crm.rating"]
	const source = (lead["uesio/crm.source"] as Record<string, string>)?.[
		"uesio/crm.label"
	]
	const phone = lead["uesio/crm.phone"]
	const email = lead["uesio/crm.email"]
	const nextSteps = lead["uesio/crm.next_steps"]
	const company = lead["uesio/crm.company"]
	const industry = lead["uesio/crm.industry"]
	const topic = lead["uesio/crm.topic"]
	const expectedRevenue = lead["uesio/crm.expected_revenue"]
	const closeDate = lead["uesio/crm.close_date"]
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

	// Loop over the messages and put them in the right format
	const messages = messagesResult.map((message) => ({
		role: message["uesio/crm.type"] === "REQUEST" ? "user" : "assistant",
		content: message["uesio/crm.description"],
	}))

	const systemMessage = `
	You are a Sales Assistant helping work on a lead named ${firstname} ${lastname}.
	You know the following data about this lead.
	status: ${status}
	rating: ${rating}
	source: ${source}
	next steps: ${nextSteps}
	email: ${email}
	phone: ${phone}
	company: ${company}
	industry: ${industry}
	opportunity topic: ${topic}
	expected revenue: ${expectedRevenue}
	close date: ${closeDate}
	`

	const result = bot.runIntegrationAction(
		"uesio/aikit.bedrock",
		"invokemodel",
		{
			//model: "anthropic.claude-3-sonnet-20240229-v1:0",
			model: "anthropic.claude-3-haiku-20240307-v1:0",
			messages,
			system: systemMessage,
		}
	) as string

	// Backwards Compat
	const compatResult = Array.isArray(result) ? result[0] : result

	bot.save("uesio/crm.ai_chat", [
		{
			"uesio/crm.description": compatResult,
			"uesio/crm.type": "RESPONSE",
			"uesio/crm.parent": {
				"uesio/core.id": parent,
			},
		},
	] as unknown as WireRecord[])
}
