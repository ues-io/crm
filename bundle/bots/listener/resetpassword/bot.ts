import { ListenerBotApi } from "@uesio/bots"

export default function resetpassword(bot: ListenerBotApi) {
	const redirect = "/site/app/uesio/core/changepassword"
	const username = bot.params.get("username")
	const email = bot.params.get("email")
	const code = bot.params.get("code")
	const host = bot.params.get("host")
	const link = host + redirect + "?code=" + code + "&username=" + username
	const from = "info@updates.ues.io"
	const subject = "Password change requested in ues.io crm"

	const templateParams = {
		titleText: "Reset your password.",
		bodyText:
			"Your password has been reset. Click below to create a new one.",
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
		"templates/resetpassword.txt",
		templateParams
	)

	const html = bot.mergeTemplateFile(
		"uesio/appkit.emailtemplates",
		"templates/resetpassword.html",
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
