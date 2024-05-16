import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function default_contact_roles(bot: ListenerBotApi) {
	bot.save(
		"uesio/crm.contact_role",
		[
			{
				"uesio/crm.api_name": "business_user",
				"uesio/crm.label": "Business User",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "decision_maker",
				"uesio/crm.label": "Decision Maker",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "economic_buyer",
				"uesio/crm.label": "Economic Buyer",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "economic_decision_maker",
				"uesio/crm.label": "Economic Decision Maker",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "evaluator",
				"uesio/crm.label": "Evaluator",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "executive_sponsor",
				"uesio/crm.label": "Executive Sponsor",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "influencer",
				"uesio/crm.label": "Influencer",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "technical_buyer",
				"uesio/crm.label": "Technical Buyer",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "other",
				"uesio/crm.label": "Other",
				"uesio/crm.active": true,
			},
		] as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
}
