import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_contacts(bot: ListenerBotApi) {
	const sampleContactData = [
		{
			firstname: "Connie",
			lastname: "Forrester",
			email: "cforrester@example.com",
			title: "Marketing Director",
			department: "Marketing",
			role: "decision_maker",
			imagepath: "connie_forrester.jpg",
			account: "SAMPLE-ACCOUNT-01",
			externalid: "SAMPLE-CONTACT-01",
		},
		{
			firstname: "Dan",
			lastname: "Steele",
			email: "steeleman@example.com",
			title: "IT Specialist",
			department: "Marketing",
			role: "evaluator",
			imagepath: "dan_steele.jpg",
			account: "SAMPLE-ACCOUNT-02",
			externalid: "SAMPLE-CONTACT-02",
		},
	]
	const contactresult = bot.save(
		"uesio/crm.contact",
		sampleContactData.map((sample) => ({
			"uesio/crm.firstname": sample.firstname,
			"uesio/crm.lastname": sample.lastname,
			"uesio/crm.email": sample.email,
			"uesio/crm.title": sample.title,
			"uesio/crm.department": sample.department,
			...(sample.account && {
				"uesio/crm.account": {
					"uesio/core.uniquekey": sample.account,
				},
			}),
			...(sample.role && {
				"uesio/crm.role": {
					"uesio/core.uniquekey": sample.role,
				},
			}),
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
	sampleContactData.forEach((sample, index) => {
		if (sample.imagepath) {
			bot.copyFile(
				"uesio/crm.contactpics",
				"images/" + sample.imagepath,
				"uesio/crm.contact",
				contactresult[index]["uesio/core.id"] as string,
				"uesio/crm.image"
			)
		}
	})
}
