export function removeEmptyFromObj(obj: any, remove: boolean = false): any {
  return remove 
  ? Object.fromEntries(
        Object.entries(obj).filter(([p, v]) => {
          // console.log(p);
          return v === false || v ;
        })
      )
    : Object.fromEntries(
        Object.entries(obj).map((p, v) =>
          p[1] || p[1] === false ? p : [p[0], null]
        )
      );
}
export function isEmptyObj(obj: object) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}
export default function getMonthAbbreviation(monthNumber: any) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  } else {
    return 'Invalid Month';
  }
}
export function parseObj(field: string, obj: any) {
  if (field === 'this') {
    return obj;
  }
  let result: any;
  field?.split('||').forEach((str: string) => {
    let data = obj;
    str.split('.').forEach((str: string) => {
      if (data) {
        data = data[str];
      }
    });
    if (data || !result) {
      result = data;
    }
  });
  if (result !== false && !result) {
    // result = 'Not Set';
    result = '';
  }
  return result;
}

export function formatPhoneNumber(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  return `+1 ${digitsOnly.substring(1, 4)} ${digitsOnly.substring(
    4,
    7
  )} ${digitsOnly.substring(7)}`;
}



export function formatDateTimeForInput(dateTimeString: string | null) {
  // Створення об'єкта Date з рядка
  if (dateTimeString === null) {
    return undefined;
  }
  let dateObject = new Date(dateTimeString);

  // Отримання компонентів дати та часу
  let year = dateObject.getFullYear();
  let month = ('0' + (dateObject.getMonth() + 1)).slice(-2); // Додаємо 1, оскільки місяці у JavaScript нумеруються з 0
  let day = ('0' + dateObject.getDate()).slice(-2);
  let hours = ('0' + dateObject.getHours()).slice(-2);
  let minutes = ('0' + dateObject.getMinutes()).slice(-2);

  // Форматування у рядок для вставки в HTML input
  let formattedDateTime =
    year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
  console.log(formattedDateTime.slice(0, 10));
  return formattedDateTime.slice(0, 10);
}

export const Sum = (array: number[])  => array.reduce((partialSum, a) => partialSum + a, 0);

export const formatDateTime = (date: string) => date + 'T00:00:00.000000'