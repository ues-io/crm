
declare module "@uesio/app/selectlists/uesio/crm" {
	export type Gender = "Male" | "Female" | "Other"
	export type LeadStatus = "Working" | "Converted" | "Closed" | "Open"
	export type Rating = "Warm" | "Hot" | "Cold"
	export type Salutation = "Sir" | "Madam" | "Mr" | "Mrs" | "Miss"
}
declare module "@uesio/app/bots/listener/uesio/crm/convert_lead" {

	type Params = {
		lead: string
		contactaction: string
		accountaction: string
		opportunityaction: string
		contact?: string
		account?: string
		opportunity?: string
	}

	export type {
		Params
	}
}
declare module "@uesio/app/bots/listener/uesio/crm/createlogin" {

	type Params = {
		username: string
		email: string
		code: string
		host: string
	}

	export type {
		Params
	}
}
declare module "@uesio/app/bots/listener/uesio/crm/forgotpassword" {

	type Params = {
		username: string
		email: string
		code: string
		host: string
	}

	export type {
		Params
	}
}
declare module "@uesio/app/bots/listener/uesio/crm/new_ai_chat" {

	type Params = {
		input: string
		parent: string
	}

	export type {
		Params
	}
}