import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faChartLineUp,
	faCircleHalfStroke,
	faComputerClassic,
	faDagger,
	faEarthAmericas,
	faFlag,
	faFlask,
	faFlaskRoundPoison,
	faPlanetRinged,
	faStars,
} from '@fortawesome/pro-solid-svg-icons'

export const AVAILABLE_ICONS = [
	faFlask,
	faFlaskRoundPoison,
	faPlanetRinged,
	faCircleHalfStroke,
	faDagger,
	faChartLineUp,
	faComputerClassic,
	faStars,
	faFlag,
	faEarthAmericas,
]

export function AddToLibrary() {
	library.add(...AVAILABLE_ICONS)
}
