
const mapTree = (tree: any, path: string, value: any) => {
    const keys = path.split(".");
    let updatedState = { ...tree };
    let nestedObject: { [k: string]: any } = updatedState;

    for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i].includes('[') ? keys[i].substring(0, keys[i].indexOf('[')) : keys[i];
        const currentValue = nestedObject[currentKey];

        if (Array.isArray(currentValue)) {
            if (keys[i].includes('[')) {
                const arrayKey = keys[i].substring(keys[i].indexOf('[') + 1, keys[i].indexOf(']'));
                if (keys[i + 1]) {
                    nestedObject[currentKey] = [...currentValue];
                    nestedObject[currentKey][arrayKey] = { ...currentValue[Number(arrayKey)] };
                    nestedObject = nestedObject[currentKey][arrayKey];
                    continue;
                }
            } else {
                nestedObject[currentKey] = [...currentValue];
            }
        } else if (typeof currentValue === "object") {
            nestedObject[currentKey] = { ...currentValue };
        } else {
            console.error(`Invalid key: ${path}`);
        }

        nestedObject = nestedObject[currentKey];
    }

    if (Array.isArray(nestedObject[keys[keys.length - 1]])) {
        nestedObject[keys[keys.length - 1]].push(value);
    } else {
        nestedObject[keys[keys.length - 1]] = value;
    }

    return updatedState;
};

export default mapTree;