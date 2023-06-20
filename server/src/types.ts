export type Bindings = {
	/* eslint-disable no-undef */
	R2BUCKET: R2Bucket
	D1DATABASE: D1Database
	/* eslint-enable no-undef */
}

export interface AssassinRecord {
	name: string;
	target?: string;
}
