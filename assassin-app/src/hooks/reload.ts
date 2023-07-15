import { useEffect } from "react"
import { useRevalidator } from "react-router-dom"

export default function useReload(changedObj: unknown, interval = 15) {
	const { revalidate } = useRevalidator()

	useEffect(() => {
		const intervalId = setInterval(() => { revalidate() }, interval * 1000)
		return () => clearInterval(intervalId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [interval, changedObj])

}
