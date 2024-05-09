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

	//bot.log.info("Lead Result", leadResultItem)

	//bot.log.info("Activity Result", activityResult)

	// 2: Create Account Record
	if (accountAction === "create") {
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

	// 3: Create Contact Record
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
				"uesio/crm.mailing_state": mailingState,
				"uesio/crm.mailing_country": mailingCountry,
				"uesio/crm.mailing_zip_postal": mailingZip,
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

	// 6: Update Existing Lead Record Status
	bot.save("uesio/crm.lead", [
		{
			"uesio/core.id": lead,
			"uesio/crm.lead_status": "CONVERTED",
		},
	] as unknown as WireRecord[])

	bot.addResult("contactid", contactId)
}
