export type Kernel = [
	number, number, number,
	number, number, number,
	number, number, number,
]

export const identity = [
	0, 0, 0,
	0, 1, 0,
	0, 0, 0,
]

export const sharpen = [
	0, -1, 0,
	-1, 5, -1,
	0, -1, 0,
]