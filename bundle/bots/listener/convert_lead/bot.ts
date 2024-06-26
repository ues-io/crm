import { FieldValue, ListenerBotApi, WireRecord } from "@uesio/bots"

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
	let contactAccountId = ""

	// 1: Load in current lead information
	const leadResult = bot.load({
		collection: "uesio/crm.lead",
		fields: [
			// Contact Fields
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
				id: "uesio/crm.phone",
			},
			{
				id: "uesio/crm.phone_business",
			},
			{
				id: "uesio/crm.phone_mobile",
			},
			{
				id: "uesio/crm.location",
			},
			{
				id: "uesio/crm.mailing_city",
			},
			{
				id: "uesio/crm.mailing_street",
			},
			{
				id: "uesio/crm.mailing_state_province",
			},
			{
				id: "uesio/crm.mailing_country",
			},
			{
				id: "uesio/crm.mailing_zip_postal",
			},
			{
				id: "uesio/crm.title",
			},
			{
				id: "uesio/crm.department",
			},
			{
				id: "uesio/crm.social",
			},
			{
				id: "uesio/crm.image",
				fields: [
					{
						id: "uesio/core.id",
					},
				],
			},
			// Account Fields
			{
				id: "uesio/crm.company",
			},
			{
				id: "uesio/crm.industry",
			},
			{
				id: "uesio/crm.description",
			},
			{
				id: "uesio/crm.website",
			},
			{
				id: "uesio/crm.no_employees",
			},
			// Opportunity Fields
			{
				id: "uesio/crm.topic",
			},
			{
				id: "uesio/crm.expected_revenue",
			},
			{
				id: "uesio/crm.close_date",
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

	const tasksResult = bot.load({
		collection: "uesio/crm.task",
		fields: [
			{
				id: "uesio/core.id",
			},
		],
		conditions: [
			{
				field: "uesio/crm.related_lead",
				operator: "EQ",
				value: lead,
			},
		],
	})

	const eventsResult = bot.load({
		collection: "uesio/crm.event",
		fields: [
			{
				id: "uesio/core.id",
			},
		],
		conditions: [
			{
				field: "uesio/crm.related_lead",
				operator: "EQ",
				value: lead,
			},
		],
	})

	//bot.log.info("Lead Result", leadResultItem)

	//bot.log.info("Activity Result", activityResult)

	// 2: If the contact action is link, verify that that contact
	// exists. And get the relevant data.
	if (contactAction === "link") {
		const contactResult = bot.load({
			collection: "uesio/crm.contact",
			fields: [
				{
					id: "uesio/crm.account",
				},
			],
			conditions: [
				{
					field: "uesio/core.id",
					operator: "EQ",
					value: contact,
				},
			],
		})

		if (contactResult.length !== 1) {
			throw new Error("Could not find linked contact.")
		}

		const contactResultItem = contactResult[0]
		const contactAccount = contactResultItem["uesio/crm.account"] as Record<
			string,
			FieldValue
		>

		contactAccountId = contactAccount?.["uesio/core.id"] as string
	}

	// 3: Create Account Record
	if (contactAccountId) {
		// Skip this process. We don't need to create or link an account here.
		accountId = contactAccountId
	} else if (accountAction === "create") {
		//bot.log.info("Creating New Account")

		const company = leadResultItem["uesio/crm.company"]
		const industry = leadResultItem["uesio/crm.industry"]
		const description = leadResultItem["uesio/crm.description"]
		const website = leadResultItem["uesio/crm.website"]
		const noEmployees = leadResultItem["uesio/crm.no_employees"]

		if (!company) {
			throw new Error(
				"Must provide a company name to create a new account"
			)
		}

		const accountSaveResult = bot.save("uesio/crm.account", [
			{
				"uesio/crm.name": company,
				"uesio/crm.industry": industry,
				"uesio/crm.description": description,
				"uesio/crm.website": website,
				"uesio/crm.no_employees": noEmployees,
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

	// 4: Create or Link Contact Record
	if (contactAction === "create") {
		//bot.log.info("Creating New Contact")

		const firstname = leadResultItem["uesio/crm.firstname"]
		const lastname = leadResultItem["uesio/crm.lastname"]
		const email = leadResultItem["uesio/crm.email"]
		const phone = leadResultItem["uesio/crm.phone"]
		const phoneBusiness = leadResultItem["uesio/crm.phone_business"]
		const phoneMobile = leadResultItem["uesio/crm.phone_mobile"]
		const location = leadResultItem["uesio/crm.location"]
		const mailingCity = leadResultItem["uesio/crm.mailing_city"]
		const mailingStreet = leadResultItem["uesio/crm.mailing_street"]
		const mailingState = leadResultItem["uesio/crm.mailing_state_province"]
		const mailingCountry = leadResultItem["uesio/crm.mailing_country"]
		const mailingZip = leadResultItem["uesio/crm.mailing_zip_postal"]
		const title = leadResultItem["uesio/crm.title"]
		const department = leadResultItem["uesio/crm.department"]
		const social = leadResultItem["uesio/crm.social"]

		const imageFileId = leadResultItem["uesio/crm.image"] as string

		const contactSaveResult = bot.save("uesio/crm.contact", [
			{
				"uesio/crm.firstname": firstname,
				"uesio/crm.lastname": lastname,
				"uesio/crm.email": email,
				"uesio/crm.phone": phone,
				"uesio/crm.phone_business": phoneBusiness,
				"uesio/crm.phone_mobile": phoneMobile,
				"uesio/crm.location": location,
				"uesio/crm.mailing_city": mailingCity,
				"uesio/crm.mailing_street": mailingStreet,
				"uesio/crm.mailing_state_province": mailingState,
				"uesio/crm.mailing_country": mailingCountry,
				"uesio/crm.mailing_zip_postal": mailingZip,
				"uesio/crm.title": title,
				"uesio/crm.department": department,
				"uesio/crm.social": social,
				"uesio/crm.account": {
					"uesio/core.id": accountId,
				},
			},
		] as unknown as WireRecord[])?.[0]

		contactId = contactSaveResult["uesio/core.id"] as string

		// If we have a lead image, transfer it to the new contact.
		if (imageFileId) {
			bot.copyUserFile(
				imageFileId,
				"uesio/crm.contact",
				contactId,
				"uesio/crm.image"
			)
		}

		//bot.log.info("Created New Contact", contactSaveResult)
	} else if (contactAction === "link") {
		//bot.log.info("Linking Contact")
		contactId = contact
	} else {
		throw new Error("Invalid Contact Convert Action")
	}

	// 5: Migrate Activity to Contact
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

	// 6: Migrate Tasks to Contact
	if (tasksResult.length) {
		bot.save(
			"uesio/crm.task",
			tasksResult.map((task) => ({
				"uesio/core.id": task["uesio/core.id"],
				"uesio/crm.related_contact": {
					"uesio/core.id": contactId,
				},
			})) as unknown as WireRecord[]
		)
	}

	// 7: Migrate Events to Contact
	if (eventsResult.length) {
		bot.save(
			"uesio/crm.event",
			eventsResult.map((event) => ({
				"uesio/core.id": event["uesio/core.id"],
				"uesio/crm.related_contact": {
					"uesio/core.id": contactId,
				},
			})) as unknown as WireRecord[]
		)
	}

	// 8: Create Opportunity Record
	if (opportunityAction === "create") {
		//bot.log.info("Creating New Opportunity")

		const topic = leadResultItem["uesio/crm.topic"]
		const expectedRevenue = leadResultItem["uesio/crm.expected_revenue"]
		const closeDate = leadResultItem["uesio/crm.close_date"]

		if (topic) {
			bot.save("uesio/crm.opportunity", [
				{
					"uesio/crm.topic": topic,
					"uesio/crm.expected_revenue": expectedRevenue,
					"uesio/crm.close_date": closeDate,
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

	// 9: Update Existing Lead Record Status
	bot.save("uesio/crm.lead", [
		{
			"uesio/core.id": lead,
			"uesio/crm.status": "CONVERTED",
		},
	] as unknown as WireRecord[])

	bot.addResult("contactid", contactId)
}
