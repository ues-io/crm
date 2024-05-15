import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_data(bot: ListenerBotApi) {
	bot.save("uesio/crm.lead", [
		{
			"uesio/crm.firstname": "Randy",
			"uesio/crm.lastname": "Billingston",
			"uesio/crm.email": "rbillingston@example.com",
		},
	] as unknown as WireRecord[])
}
