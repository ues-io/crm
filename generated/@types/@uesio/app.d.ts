
declare module "@uesio/app/selectlists/uesio/crm" {
	export type Gender = "Male" | "Female" | "Other"
	export type LeadStatus = "working contacted" | "Closed - Converted" | "Closed - Not Converted" | "Open - Not Contacted"
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