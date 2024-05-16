import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_leads(bot: ListenerBotApi) {
	const sampleLeadData = [
		{
			firstname: "Randy",
			lastname: "Billingston",
			email: "rbillingston@example.com",
			imagepath: "randy_billingston.jpg",
			rating: "Hot",
			status: "Open",
			source: "web",
			company: "Geonovis Industrial",
			industry: "Electronics",
			phone: "458-430-2394",
			website: "www.gonovis.example.com",
			externalid: "SAMPLE-LEAD-01",
		},
		{
			firstname: "Connie",
			lastname: "Forrester",
			email: "cforrester@example.com",
			imagepath: "connie_forrester.jpg",
			status: "Closed",
			source: "web",
			company: "Geonovis Industrial",
			industry: "Electronics",
			phone: "588-304-2965",
			website: "www.gonovis.example.com",
			externalid: "SAMPLE-LEAD-02",
		},
		{
			firstname: "Josie",
			lastname: "Malkovic",
			email: "jmalkovic@example.com",
			imagepath: "josie_malkovic.jpg",
			rating: "Hot",
			status: "Open",
			source: "partner",
			company: "Fortuna Education Services",
			industry: "Education",
			phone: "291-394-0933",
			website: "www.fortuna.example.com",
			externalid: "SAMPLE-LEAD-03",
		},
		{
			firstname: "Gavin",
			lastname: "Foster",
			email: "gfoster@example.com",
			imagepath: "gavin_foster.jpg",
			rating: "Warm",
			status: "Working",
			source: "person",
			industry: "Electronics",
			phone: "987-643-3567",
			externalid: "SAMPLE-LEAD-04",
		},
		{
			firstname: "Susan",
			lastname: "Birchfield",
			email: "sbirchfield@example.com",
			company: "Henry & Associates",
			status: "Working",
			source: "list",
			industry: "Legal",
			phone: "985-304-8234",
			website: "www.henry-co.example.com",
			externalid: "SAMPLE-LEAD-05",
		},
		{
			firstname: "Avery",
			lastname: "Valentine",
			email: "avalentine@example.com",
			rating: "Cold",
			source: "other",
			company: "Exemplary Apparrel",
			industry: "Retail",
			phone: "876-403-2857",
			website: "www.exemplaryapp.example.com",
			externalid: "SAMPLE-LEAD-06",
		},
		{
			firstname: "Sandy",
			lastname: "Burtrand",
			email: "sburtrand@example.com",
			source: "person",
			imagepath: "sandy_burtrand.jpg",
			industry: "Retail",
			phone: "458-430-2394",
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
			"uesio/crm.status": sample.status,
			"uesio/crm.company": sample.company,
			"uesio/crm.industry": sample.industry,
			"uesio/crm.phone": sample.phone,
			"uesio/crm.website": sample.website,
			...(sample.source && {
				"uesio/crm.source": {
					"uesio/core.uniquekey": sample.source,
				},
			}),
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
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
