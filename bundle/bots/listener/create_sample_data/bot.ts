import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_data(bot: ListenerBotApi) {
	const sampleLeadData = [
		{
			firstname: "Randy",
			lastname: "Billingston",
			email: "rbillingston@example.com",
			imagepath: "randy_billingston.jpg",
			rating: "Hot",
			company: "Geonovis Industrial",
			externalid: "SAMPLE-LEAD-01",
		},
		{
			firstname: "Connie",
			lastname: "Forrester",
			email: "cforrester@example.com",
			imagepath: "connie_forrester.jpg",
			company: "Geonovis Industrial",
			externalid: "SAMPLE-LEAD-02",
		},
		{
			firstname: "Josie",
			lastname: "Malkovic",
			email: "jmalkovic@example.com",
			imagepath: "josie_malkovic.jpg",
			rating: "Hot",
			company: "Fortuna Education Services",
			externalid: "SAMPLE-LEAD-03",
		},
		{
			firstname: "Gavin",
			lastname: "Foster",
			email: "gfoster@example.com",
			imagepath: "gavin_foster.jpg",
			rating: "Warm",
			externalid: "SAMPLE-LEAD-04",
		},
		{
			firstname: "Susan",
			lastname: "Birchfield",
			email: "sbirchfield@example.com",
			company: "Henry & Associates",
			externalid: "SAMPLE-LEAD-05",
		},
		{
			firstname: "Avery",
			lastname: "Valentine",
			email: "avalentine@example.com",
			rating: "Cold",
			company: "Exemplary Apparrel",
			externalid: "SAMPLE-LEAD-06",
		},
		{
			firstname: "Sandy",
			lastname: "Burtrand",
			email: "sburtrand@example.com",
			imagepath: "sandy_burtrand.jpg",
			externalid: "SAMPLE-LEAD-07",
		},
	]
	const leadresult = bot.save(
		"uesio/crm.lead",
		sampleLeadData.map((sample) => ({
			"uesio/crm.firstname": sample.firstname,
			"uesio/crm.lastname": sample.lastname,
			"uesio/crm.email": sample.email,
			"uesio/crm.rating": sample.rating,
			"uesio/crm.company": sample.company,
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[]
	)
	sampleLeadData.forEach((sample, index) => {
		if (sample.imagepath) {
			bot.copyFile(
				"uesio/crm.leadpics",
				"images/" + sample.imagepath,
				"uesio/crm.lead",
				leadresult[index]["uesio/core.id"] as string,
				"uesio/crm.image"
			)
		}
	})
}
