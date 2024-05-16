import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function default_opportunity_stages(bot: ListenerBotApi) {
	bot.save(
		"uesio/crm.opportunity_stage",
		[
			{
				"uesio/crm.api_name": "value_prop",
				"uesio/crm.label": "Value Proposition",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "needs_analysis",
				"uesio/crm.label": "Needs Analysis",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "qualification",
				"uesio/crm.label": "Qualification",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "prospecting",
				"uesio/crm.label": "Prospecting",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "review",
				"uesio/crm.label": "Negotiation/Review",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "closed_won",
				"uesio/crm.label": "Closed Won",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "closed_lost",
				"uesio/crm.label": "Closed Lost",
				"uesio/crm.active": true,
			},
		] as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
}
