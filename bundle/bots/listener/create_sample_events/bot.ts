import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_events(bot: ListenerBotApi) {
	const currentTime = Math.floor(Date.now() / 1000)
	const daySeconds = 60 * 60 * 24
	const hourSeconds = 60 * 60
	const sampleEventData = [
		{
			name: "Requirements Meeting",
			description:
				"We'll learn about what the customer needs and expects from this project.",
			starttime: currentTime + daySeconds * 21,
			endtime: currentTime + daySeconds * 21 + hourSeconds,
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			opportunity: "SAMPLE-OPPORTUNITY-01",
			externalid: "SAMPLE-EVENT-01",
		},
		{
			name: "Project Retrospective",
			description:
				"A time of sharing and learning about what went right with the project. (And what went wrong.)",
			starttime: currentTime + daySeconds * 43,
			endtime: currentTime + daySeconds * 43 + hourSeconds / 2,
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			opportunity: "SAMPLE-OPPORTUNITY-01",
			externalid: "SAMPLE-EVENT-02",
		},
	]
	bot.save(
		"uesio/crm.event",
		sampleEventData.map((sample) => ({
			"uesio/crm.name": sample.name,
			"uesio/crm.description": sample.description,
			"uesio/crm.starttime": sample.starttime,
			"uesio/crm.endtime": sample.endtime,
			...(sample.account && {
				"uesio/crm.related_account": {
					"uesio/core.uniquekey": sample.account,
				},
			}),
			...(sample.contact && {
				"uesio/crm.related_contact": {
					"uesio/core.uniquekey": sample.contact,
				},
			}),
			...(sample.opportunity && {
				"uesio/crm.related_opportunity": {
					"uesio/core.uniquekey": sample.opportunity,
				},
			}),
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
}
