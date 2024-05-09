import { ListenerBotApi, WireRecord } from "@uesio/bots"

export default function convert_lead(bot: ListenerBotApi) {
	const contactAction = bot.params.get("contactaction") as string
	const accountAction = bot.params.get("accountaction") as string
	const opportunityAction = bot.params.get("opportunityaction") as string

	const lead = bot.params.get("lead") as string
	const contact = bot.params.get("contact") as string
	const account = bot.params.get("account") as string
	const opportunity = bot.params.get("opportunity") as string

	// 0: Do some quick validation
	if (contactAction === "link" && !contact) {
		throw new Error("Please provide a contact for linking.")
	}

	if (accountAction === "link" && !account) {
		throw new Error("Please provide an account for linking.")
	}

	if (opportunityAction === "link" && !opportunity) {
		throw new Error("Please provide an opportunity for linking.")
	}

	let contactId = ""
	let accountId = ""

	// 1: Load in current lead information
	const leadResult = bot.load({
		collection: "uesio/crm.lead",
		fields: [
			{
				id: "uesio/crm.firstname",
			},
			{
				id: "uesio/crm.lastname",
			},
			{
				id: "uesio/crm.email",
			},
			{
				id: "uesio/crm.topic",
			},
			{
				id: "uesio/crm.company",
			},
		],
		conditions: [
			{
				field: "uesio/core.id",
				operator: "EQ",
				value: lead,
			},
		],
	})

	if (leadResult.length !== 1) {
		throw new Error("Could not find lead to convert.")
	}

	const leadResultItem = leadResult[0]

	const activityResult = bot.load({
		collection: "uesio/crm.activity",
		fields: [
			{
				id: "uesio/crm.name",
			},
			{
				id: "uesio/crm.type",
			},
			{
				id: "uesio/crm.description",
			},
		],
		conditions: [
			{
				field: "uesio/crm.parent",
				operator: "EQ",
				value: lead,
			},
		],
	})

	//bot.log.info("Lead Result", leadResultItem)

	//bot.log.info("Activity Result", activityResult)

	// 2: Create Account Record
	if (accountAction === "create") {
		//bot.log.info("Creating New Account")
		const company = leadResultItem["uesio/crm.company"]

		if (!company) {
			throw new Error(
				"Must provide a company name to create a new account"
			)
		}

		const accountSaveResult = bot.save("uesio/crm.account", [
			{
				"uesio/crm.name": company,
			},
		] as unknown as WireRecord[])?.[0]

		accountId = accountSaveResult["uesio/core.id"] as string

		//bot.log.info("Created New Account", accountSaveResult)
	} else if (accountAction === "link") {
		//bot.log.info("Linking Account")

		accountId = account
	} else {
		throw new Error("Invalid Account Convert Action")
	}

	// 3: Create Contact Record
	if (contactAction === "create") {
		//bot.log.info("Creating New Contact")

		const contactSaveResult = bot.save("uesio/crm.contact", [
			{
				"uesio/crm.firstname": leadResultItem["uesio/crm.firstname"],
				"uesio/crm.lastname": leadResultItem["uesio/crm.lastname"],
				"uesio/crm.email": leadResultItem["uesio/crm.email"],
				"uesio/crm.account": {
					"uesio/core.id": accountId,
				},
			},
		] as unknown as WireRecord[])?.[0]

		contactId = contactSaveResult["uesio/core.id"] as string

		//bot.log.info("Created New Contact", contactSaveResult)
	} else if (contactAction === "link") {
		//bot.log.info("Linking Contact")
		bot.save("uesio/crm.contact", [
			{
				"uesio/core.id": contact,
				"uesio/crm.account": {
					"uesio/core.id": accountId,
				},
			},
		] as unknown as WireRecord[])

		contactId = contact
	} else {
		throw new Error("Invalid Contact Convert Action")
	}

	// 4: Migrate Activity to Contact
	if (activityResult.length) {
		bot.save(
			"uesio/crm.activity",
			activityResult.map((activity) => ({
				"uesio/crm.name": activity["uesio/crm.name"],
				"uesio/crm.type": activity["uesio/crm.type"],
				"uesio/crm.description": activity["uesio/crm.description"],
				"uesio/crm.parent": {
					"uesio/core.id": contactId,
				},
			})) as unknown as WireRecord[]
		)
	}

	// 5: Create Opportunity Record
	if (opportunityAction === "create") {
		//bot.log.info("Creating New Opportunity")

		const topic = leadResultItem["uesio/crm.topic"]

		if (topic) {
			bot.save("uesio/crm.opportunity", [
				{
					"uesio/crm.topic": topic,
					"uesio/crm.account": {
						"uesio/core.id": accountId,
					},
					"uesio/crm.contact": {
						"uesio/core.id": contactId,
					},
				},
			] as unknown as WireRecord[])
		}
	} else if (opportunityAction === "link") {
		//bot.log.info("Linking Opportunity")
		bot.save("uesio/crm.opportunity", [
			{
				"uesio/core.id": opportunity,
				"uesio/crm.account": {
					"uesio/core.id": accountId,
				},
				"uesio/crm.contact": {
					"uesio/core.id": contactId,
				},
			},
		] as unknown as WireRecord[])
	} else if (opportunityAction === "none") {
		//bot.log.info("Skipping Opportunity Process")
	} else {
		throw new Error("Invalid Opportunity Convert Action")
	}

	// 6: Update Existing Lead Record Status
	bot.addResult("contactid", contactId)
}
