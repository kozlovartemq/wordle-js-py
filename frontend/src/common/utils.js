
export const isValidWord = (value, length) => {
    // return /^[а-яА-Я]{5}$/.test(value);
    return RegExp(`^[а-яА-Я]{${length}}$`).test(value);
}

export const isValidUUID = (value) => {
    return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value);
}
