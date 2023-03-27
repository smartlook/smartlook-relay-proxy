import type { z } from 'zod'

import { BaseError } from './base-error.js'

export class ConfigError extends BaseError {
	issues: z.ZodIssue[]

	constructor(issues: z.ZodIssue[], message: string, isOperational = false) {
		super(message, isOperational)

		this.issues = issues
	}
}
