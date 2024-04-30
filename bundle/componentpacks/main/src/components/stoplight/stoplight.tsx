import { styles, definition, component } from "@uesio/ui"

type ComponentDefinition = {
	field: string
}

const StyleDefaults = Object.freeze({
	root: ["absolute", "flex", "bottom-0", "right-0", "gap-0.5"],
	circle: ["text-slate-200", "text-xs", "leading-none"],
	warm: ["text-yellow-400"],
	hot: ["text-red-500"],
	cold: ["text-sky-300"],
})

const Component: definition.UC<ComponentDefinition> = (props) => {
	const { context } = props
	const { field } = props.definition
	const Icon = component.getUtility("uesio/io.icon")
	const classes = styles.useStyleTokens(StyleDefaults, props)
	const value = context.getRecord()?.getFieldValue(field)
	return (
		<div className={classes.root}>
			<Icon
				className={styles.cx(
					classes.circle,
					value === "Cold" && classes.cold
				)}
				icon="ac_unit"
				context={context}
			/>
			<Icon
				className={styles.cx(
					classes.circle,
					value === "Warm" && classes.warm
				)}
				icon="partly_cloudy_day"
				context={context}
			/>
			<Icon
				className={styles.cx(
					classes.circle,
					value === "Hot" && classes.hot
				)}
				icon="local_fire_department"
				context={context}
			/>
		</div>
	)
}

export default Component
