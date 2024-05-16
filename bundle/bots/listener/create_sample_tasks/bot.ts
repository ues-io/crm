import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_tasks(bot: ListenerBotApi) {
	const currentTime = Math.floor(Date.now() / 1000)
	const daySeconds = 60 * 60 * 24
	const sampleTaskData = [
		{
			name: "Determine Materials Needed",
			description:
				"I need to figure out what materials I need for this buildout.",
			due_by: currentTime + daySeconds * 30,
			is_completed: false,
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			opportunity: "SAMPLE-OPPORTUNITY-01",
			externalid: "SAMPLE-TASK-01",
		},
		{
			name: "Coordinate Work Timeline",
			description: "Finalize the timeine for the buildout.",
			due_by: currentTime + daySeconds * 35,
			is_completed: false,
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			opportunity: "SAMPLE-OPPORTUNITY-01",
			externalid: "SAMPLE-TASK-02",
		},
	]
	bot.save(
		"uesio/crm.task",
		sampleTaskData.map((sample) => ({
			"uesio/crm.name": sample.name,
			"uesio/crm.description": sample.description,
			"uesio/crm.due_by": sample.due_by,
			"uesio/crm.is_completed": sample.is_completed,
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
