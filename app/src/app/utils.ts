export function ConvertStatus(status: string): string {
	switch(status) {
		case "started":
			return "Started!"
		case "ready":
			return "Ready to Start"
		case "not-ready":
			return "Not Ready"
		default:
			return "Unknown"
	}
}
