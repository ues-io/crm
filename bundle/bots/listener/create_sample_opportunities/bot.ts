import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function create_sample_opportunities(bot: ListenerBotApi) {
	const getDateOffset = (offsetDays: number) => {
		const date = new Date()
		date.setDate(date.getDate() + offsetDays)
		return date.toISOString().substring(0, 10)
	}
	const date = new Date()
	date.setDate(date.getDate() + 1)
	date.toISOString().substring(0, 10)
	const sampleOpportunityData = [
		{
			topic: "Website Buildout",
			description:
				"Connie needs us to totally revamp the existing website and replace with the new design system for Geonovis.",
			expected_revenue: 3100,
			close_date: getDateOffset(30),
			stage: "value_prop",
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			externalid: "SAMPLE-OPPORTUNITY-01",
		},
		{
			topic: "New Networking Equipment",
			description:
				"Replace all existing networking equipement with the new NX-7000 zipdata AI aware system.",
			expected_revenue: 1900,
			close_date: getDateOffset(57),
			stage: "needs_analysis",
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			externalid: "SAMPLE-OPPORTUNITY-02",
		},
		{
			topic: "Planning and System Review",
			description:
				"A two-hour onsite with the devs to scope requirements for the new buildout.",
			expected_revenue: 500,
			close_date: getDateOffset(87),
			stage: "value_prop",
			contact: "SAMPLE-CONTACT-01",
			account: "SAMPLE-ACCOUNT-01",
			externalid: "SAMPLE-OPPORTUNITY-03",
		},
		{
			topic: "E-commerce Retrofit",
			description:
				"Build out their ecommerce infrastructure. They'll need a product catalog plus automated pricing.",
			expected_revenue: 2300,
			close_date: getDateOffset(12),
			stage: "prospecting",
			contact: "SAMPLE-CONTACT-02",
			account: "SAMPLE-ACCOUNT-02",
			externalid: "SAMPLE-OPPORTUNITY-04",
		},
		{
			topic: "Saas Renewal with Services",
			description:
				"They're happing with the product and want to add seats. We'll also be discussing a support contact.",
			expected_revenue: 4500,
			close_date: getDateOffset(121),
			stage: "review",
			contact: "SAMPLE-CONTACT-02",
			account: "SAMPLE-ACCOUNT-02",
			externalid: "SAMPLE-OPPORTUNITY-05",
		},
	]
	bot.save(
		"uesio/crm.opportunity",
		sampleOpportunityData.map((sample) => ({
			"uesio/crm.topic": sample.topic,
			"uesio/crm.description": sample.description,
			"uesio/crm.expected_revenue": sample.expected_revenue,
			"uesio/crm.close_date": sample.close_date,
			...(sample.account && {
				"uesio/crm.account": {
					"uesio/core.uniquekey": sample.account,
				},
			}),
			...(sample.contact && {
				"uesio/crm.contact": {
					"uesio/core.uniquekey": sample.contact,
				},
			}),
			...(sample.stage && {
				"uesio/crm.stage": {
					"uesio/core.uniquekey": sample.stage,
				},
			}),
			"uesio/crm.external_id": sample.externalid,
		})) as unknown as WireRecord[],
		{
			upsert: true,
		}
	)
}
