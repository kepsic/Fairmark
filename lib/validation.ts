
/**
 * Validation utilities for user inputs
 */

export const validation = {
  /**
   * Validate and sanitize user name
   * - Length: 1-50 characters
   * - No special HTML characters
   */
  userName: (name: string): { isValid: boolean; error?: string; sanitized: string } => {
    const trimmed = name.trim()

    if (!trimmed) {
      return { isValid: false, error: 'Name cannot be empty', sanitized: '' }
    }

    if (trimmed.length > 50) {
      return { isValid: false, error: 'Name must be 50 characters or less', sanitized: trimmed.slice(0, 50) }
    }

    if (trimmed.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters', sanitized: trimmed }
    }

    // Basic XSS prevention - escape HTML special characters
    const sanitized = trimmed
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return { isValid: true, sanitized }
  },

  /**
   * Validate group name
   * - Length: 3-100 characters
   * - No special HTML characters
   */
  groupName: (name: string): { isValid: boolean; error?: string; sanitized: string } => {
    const trimmed = name.trim()

    if (!trimmed) {
      return { isValid: false, error: 'Group name cannot be empty', sanitized: '' }
    }

    if (trimmed.length < 3) {
      return { isValid: false, error: 'Group name must be at least 3 characters', sanitized: trimmed }
    }

    if (trimmed.length > 100) {
      return { isValid: false, error: 'Group name must be 100 characters or less', sanitized: trimmed.slice(0, 100) }
    }

    const sanitized = trimmed
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return { isValid: true, sanitized }
  },

  /**
   * Validate description
   * - Max length: 500 characters
   */
  description: (desc: string): { isValid: boolean; error?: string; sanitized: string } => {
    const trimmed = desc.trim()

    if (trimmed.length > 500) {
      return { isValid: false, error: 'Description must be 500 characters or less', sanitized: trimmed.slice(0, 500) }
    }

    const sanitized = trimmed
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')

    return { isValid: true, sanitized }
  },

  /**
   * Validate hours
   * - Range: 0 - 1000
   * - Non-negative
   */
  hours: (hours: number): { isValid: boolean; error?: string; value: number } => {
    if (isNaN(hours)) {
      return { isValid: false, error: 'Hours must be a valid number', value: 0 }
    }

    if (hours < 0) {
      return { isValid: false, error: 'Hours cannot be negative', value: 0 }
    }

    if (hours > 1000) {
      return { isValid: false, error: 'Hours must be less than 1000', value: 1000 }
    }

    return { isValid: true, value: hours }
  },

  /**
   * Validate tasks
   * - Range: 0 - 10000
   * - Non-negative integer
   */
  tasks: (tasks: number): { isValid: boolean; error?: string; value: number } => {
    if (isNaN(tasks)) {
      return { isValid: false, error: 'Tasks must be a valid number', value: 0 }
    }

    if (!Number.isInteger(tasks)) {
      return { isValid: false, error: 'Tasks must be a whole number', value: Math.floor(tasks) }
    }

    if (tasks < 0) {
      return { isValid: false, error: 'Tasks cannot be negative', value: 0 }
    }

    if (tasks > 10000) {
      return { isValid: false, error: 'Tasks must be less than 10000', value: 10000 }
    }

    return { isValid: true, value: tasks }
  },

  /**
   * Validate total tasks needed
   * - Range: 1 - 10000
   * - Positive integer
   */
  totalTasksNeeded: (total: number): { isValid: boolean; error?: string; value: number } => {
    if (isNaN(total)) {
      return { isValid: false, error: 'Total tasks must be a valid number', value: 10 }
    }

    if (!Number.isInteger(total)) {
      return { isValid: false, error: 'Total tasks must be a whole number', value: Math.floor(total) }
    }

    if (total < 1) {
      return { isValid: false, error: 'Total tasks must be at least 1', value: 1 }
    }

    if (total > 10000) {
      return { isValid: false, error: 'Total tasks must be less than 10000', value: 10000 }
    }

    return { isValid: true, value: total }
  },

  /**
   * Validate group ID format (UUID)
   */
  groupId: (id: string): { isValid: boolean; error?: string } => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const trimmed = id.trim()

    if (!trimmed) {
      return { isValid: false, error: 'Group ID cannot be empty' }
    }

    // Also allow demo group IDs
    if (trimmed.startsWith('demo-group-')) {
      return { isValid: true }
    }

    if (!uuidRegex.test(trimmed)) {
      return { isValid: false, error: 'Invalid group ID format' }
    }

    return { isValid: true }
  }
}
