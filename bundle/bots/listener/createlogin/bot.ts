import { ListenerBotApi } from "@uesio/bots"

export default function createlogin(bot: ListenerBotApi) {
	const redirect = "/site/app/uesio/core/changepassword"
	const username = bot.params.get("username")
	const email = bot.params.get("email")
	const code = bot.params.get("code")
	const host = bot.params.get("host")
	const link = host + redirect + "?code=" + code + "&username=" + username
	const contentType = "text/html"
	const from = "info@ues.io"
	const fromName = "ues.io"
	const subject = "Welcome to ues.io crm."
	const body = `
	<!DOCTYPE html>
	<html>
		<body>
			A user account has been created for you in ues.io crm.<br/>
			Your username is: ${username}.<br/>
			<br/>
			To set your password and log in for the first time, click the link below:<br/>
			${link}<br/>
			<br/>
			To easily log in to your site later, save this URL:
			${host}<br/>
		</body>
	</html>`

	bot.runIntegrationAction("uesio/core.sendgrid", "sendemail", {
		to: [email],
		toNames: [username],
		from,
		fromName,
		subject,
		plainBody: body,
		contentType,
	})
}
