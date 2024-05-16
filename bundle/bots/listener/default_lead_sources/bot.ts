import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function default_lead_sources(bot: ListenerBotApi) {
	bot.save(
		"uesio/crm.lead_source",
		[
			{
				"uesio/crm.api_name": "web",
				"uesio/crm.label": "Web",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "person",
				"uesio/crm.label": "Person",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "phone",
				"uesio/crm.label": "Phone Inquiry",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "partner",
				"uesio/crm.label": "Partner Referral",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "list",
				"uesio/crm.label": "Purchased List",
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
