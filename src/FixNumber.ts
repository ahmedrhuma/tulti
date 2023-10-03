export default (value: string) => {
    if(String(value).substring(0, 4) === "د.ل.")
        return `${String(value).substring(5)} ${String(value).substring(0, 3)}`;
    else if(String(value).substring(1, 6) === "-د.ل.") {
        return `${String(value).substring(6)}- ${String(value).substring(2, 5)}`;
    }
    return value;
}