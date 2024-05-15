import { styles, definition, component } from "@uesio/ui"

const StyleDefaults = Object.freeze({
	root: ["flex", "justify-center"],
	circle: ["text-slate-200", "text-xl", "leading-none"],
	warm: ["text-yellow-400"],
	hot: ["text-red-500"],
	cold: ["text-sky-400"],
})

const Component: definition.UC = (props) => {
	const { context } = props
	const Icon = component.getUtility("uesio/io.icon")
	const classes = styles.useStyleTokens(StyleDefaults, props)
	const value = context.getRecord()?.getFieldValue("rating")
	let icon = ""
	let iconClass = ""
	if (value === "Cold") {
		icon = "ac_unit"
		iconClass = classes.cold
	} else if (value === "Warm") {
		icon = "partly_cloudy_day"
		iconClass = classes.warm
	} else if (value === "Hot") {
		icon = "local_fire_department"
		iconClass = classes.hot
	} else {
		icon = "mist"
	}
	return (
		<div className={styles.cx(classes.root)}>
			<Icon
				className={styles.cx(classes.circle, iconClass)}
				icon={icon}
				context={context}
			/>
		</div>
	)
}

export default Component
