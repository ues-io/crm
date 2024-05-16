import { ListenerBotApi } from "@uesio/bots"

export default function create_sample_data(bot: ListenerBotApi) {
	bot.callBot("uesio/crm.default_account_types", {})
	bot.callBot("uesio/crm.default_lead_sources", {})
	bot.callBot("uesio/crm.default_opportunity_stages", {})
	bot.callBot("uesio/crm.create_sample_leads", {})
	bot.callBot("uesio/crm.create_sample_accounts", {})
	bot.callBot("uesio/crm.create_sample_contacts", {})
	bot.callBot("uesio/crm.create_sample_opportunities", {})
	bot.callBot("uesio/crm.create_sample_tasks", {})
	bot.callBot("uesio/crm.create_sample_events", {})
}
