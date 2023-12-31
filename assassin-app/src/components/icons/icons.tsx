import { library } from '@fortawesome/fontawesome-svg-core'
import { IconDefinition, faPoliceBox } from '@fortawesome/pro-regular-svg-icons'
import {
	faBagShopping,
	faBlockQuestion,
	faBook,
	faCameraRetro,
	faCar,
	faCartShopping,
	faChartLineUp,
	faCircleHalfStroke,
	faCity,
	faComputerClassic,
	faDagger,
	faEarthAmericas,
	faFlag,
	faFlask,
	faFlaskRoundPoison,
	faGear,
	faHeadphones,
	faHippo,
	faLemon,
	faLocationDot,
	faPlane,
	faPlanetRinged,
	faPoo,
	faRocketLaunch,
	faShirt,
	faStars,
	faTree,
	faWandMagicSparkles,
} from '@fortawesome/pro-solid-svg-icons'

export const AVAILABLE_ICONS: IconDefinition[] = [
	faBagShopping,
	faBlockQuestion,
	faBook,
	faCameraRetro,
	faCar,
	faCartShopping,
	faChartLineUp,
	faCircleHalfStroke,
	faCity,
	faComputerClassic,
	faDagger,
	faEarthAmericas,
	faFlag,
	faFlask,
	faFlaskRoundPoison,
	faGear,
	faHeadphones,
	faHippo,
	faLemon,
	faLocationDot,
	faPlane,
	faPlanetRinged,
	faPoliceBox,
	faPoo,
	faRocketLaunch,
	faShirt,
	faStars,
	faTree,
	faWandMagicSparkles,
]

export function AddToLibrary() {
	library.add(...AVAILABLE_ICONS)
}
