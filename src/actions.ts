export function sortAsc(data: number[]) {
  let temp;
  for (let i = 0; i < data.length - 1; i++) {
    for (let k = i + 1; k < data.length; k++)
      if (data[i] > data[k]) {
        temp = data[i];
        data[i] = data[k];
        data[k] = temp;
      }
  }

  return data;
}

export function sortDesc(data: number[]) {
  let temp;
  for (let i = 0; i < data.length - 1; i++) {
    for (let k = i + 1; k < data.length; k++)
      if (data[i] < data[k]) {
        temp = data[i];
        data[i] = data[k];
        data[k] = temp;
      }
  }

  return data;
}

export function upperCase(data: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const key in data) {
    if (typeof data[key] === "string") {
      result[key] = data[key].toUpperCase();
    } else {
      result[key] = data[key];
    }
  }

  return result;
}
