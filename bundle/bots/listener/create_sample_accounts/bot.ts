import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_accounts(bot: ListenerBotApi) {
	const sampleAccountData = [
		{
			name: "Geonovis Industrial",
			type: "prospect",
			imagepath: "geonovis_industrial.jpg",
			industry: "Electronics",
			phone: "458-430-2394",
			website: "www.gonovis.example.com",
			externalid: "SAMPLE-ACCOUNT-01",
		},
		{
			name: "Graviton Coffee Roasters",
			type: "partner",
			imagepath: "graviton_coffee.jpg",
			industry: "Food",
			phone: "329-234-2345",
			website: "www.graviton.example.com",
			externalid: "SAMPLE-ACCOUNT-02",
		},
	]
	const accountresult = bot.save(
		"uesio/crm.account",
		sampleAccountData.map((sample) => ({
			"uesio/crm.name": sample.name,
			"uesio/crm.industry": sample.industry,
			"uesio/crm.phone": sample.phone,
			"uesio/crm.website": sample.website,
			...(sample.type && {
				"uesio/crm.type": {
					"uesio/core.uniquekey": sample.type,
				},
			}),
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
	sampleAccountData.forEach((sample, index) => {
		if (sample.imagepath) {
			bot.copyFile(
				"uesio/crm.accountpics",
				"images/" + sample.imagepath,
				"uesio/crm.account",
				accountresult[index]["uesio/core.id"] as string,
				"uesio/crm.logo"
			)
		}
	})
}
