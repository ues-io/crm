import { ListenerBotApi } from "@uesio/bots"

export default function createlogin(bot: ListenerBotApi) {
	const redirect = "/site/app/uesio/appkit/changepassword"
	const username = bot.params.get("username")
	const email = bot.params.get("email")
	const code = bot.params.get("code")
	const host = bot.params.get("host")
	const link = host + redirect + "?code=" + code + "&username=" + username
	const from = "info@updates.ues.io"
	const subject = "Welcome to ues.io crm."

	const templateParams = {
		titleText: "Start closing deals.",
		bodyText:
			"Welcome to ues.io CRM. You can now set your password and log in.",
		username,
		resetLink: link,
		laterLink: host,
		logoUrl: host + bot.getFileUrl("uesio/core.logo", ""),
		logoAlt: "ues.io",
		logoWidth: "40",
		footerText: "ues.io - Your app platform",
	}
	const text = bot.mergeTemplateFile(
		"uesio/appkit.emailtemplates",
		"templates/createlogin.txt",
		templateParams
	)

	const html = bot.mergeTemplateFile(
		"uesio/appkit.emailtemplates",
		"templates/createlogin.html",
		templateParams
	)

	bot.runIntegrationAction("uesio/appkit.resend", "sendemail", {
		to: email,
		from,
		subject,
		html,
		text,
	})
}
