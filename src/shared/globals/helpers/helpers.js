class Helpers {
  firstLetterUppercase(str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string");
    }
    const valueString = str?.toLowerCase();
    return valueString
      .split(" ")
      .map(
        (value) =>
          `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`
      )
      .join(" ");
  }
  lowerCase(str) {
    return str?.toLowerCase();
  }
  generateRandomIntegers(integerLength) {
    const characters = "0123456789";
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }
  generateRandomString(stringLength) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < stringLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  }
  validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
    return usernameRegex.test(username);
  }
  validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
  }
  validateString(str) {
    return typeof str === "string";
  }
  validateInteger(integer) {
    return typeof integer === "number" && Number.isInteger(integer);
  }
  validateBoolean(bool) {
    return typeof bool === "boolean";
  }
  validateObject(obj) {
    return typeof obj === "object";
  }
  validateArray(arr) {
    return Array.isArray(arr);
  }
  validateDate(date) {
    return date instanceof Date;
  }
  validateFunction(func) {
    return typeof func === "function";
  }
  validateNull(value) {
    return value === null;
  }
  validateUndefined(value) {
    return value === undefined;
  }
  validateEmpty(value) {
    return value === "";
  }
  validateNonEmpty(value) {
    return !this.validateEmpty(value);
  }
  validateZero(value) {
    return value === 0;
  }
  validateNonZero(value) {
    return !this.validateZero(value);
  }
  parseJson(prop) {
    try {
      JSON.parse(prop);
    } catch (error) {
      return prop;
    }
    return JSON.parse(prop);
  }

  isDataURL(value) {
    const dataUrlRegex =
      /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataUrlRegex.test(value);
  }
  static shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }
  static escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
}
const helpers = new Helpers();
module.exports = helpers;
