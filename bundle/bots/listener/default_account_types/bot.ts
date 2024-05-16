import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function default_account_types(bot: ListenerBotApi) {
	bot.save(
		"uesio/crm.account_type",
		[
			{
				"uesio/crm.api_name": "prospect",
				"uesio/crm.label": "Prospect",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "customer",
				"uesio/crm.label": "Customer",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "partner",
				"uesio/crm.label": "Partner",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "investor",
				"uesio/crm.label": "Investor",
				"uesio/crm.active": true,
			},
			{
				"uesio/crm.api_name": "competitor",
				"uesio/crm.label": "Competitor",
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
