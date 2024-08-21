

export const safeAsyncCall = async <T>(fn: () => Promise<T>) => {
  try {
    return { result: await fn() }
  } catch (error) {
    return { error }
  }
}

export const invoke = <T>(fn: () => T) => fn()