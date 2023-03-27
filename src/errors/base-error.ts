export class BaseError extends Error {
	isOperational: boolean

	constructor(message: string, isOperational: boolean) {
		super(message)

		this.isOperational = isOperational
	}
}
