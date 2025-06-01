
export const isValidWord = (value, length) => {
    // return /^[а-яА-Я]{5}$/.test(value);
    return RegExp(`^[а-яА-Я]{${length}}$`).test(value);
}

export const isValidUUID = (value) => {
    return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value);
}

export const countOccurrences = (text, search) => {
    let count = 0, position = 0, step = search.length > 0 ? search.length : 1;
    while ((position = text.indexOf(search, position)) !== -1) {
        count++;
        position += step; 
    }
    return count;
}

export const arrayRemove = (array, element) => {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1)
    }
    return array
}

export const areMapsEqual = (map1, map2) => {
    return JSON.stringify(map1) === JSON.stringify(map2)
}