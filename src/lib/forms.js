export const getError = (errors, name) => name.split('.').reduce((node, key) => node?.[key], errors)
