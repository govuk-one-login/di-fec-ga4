const EMAIL_PATTERN = /[^\s=/?&#+]+(?:@|%40)[^\s=/?&+]+/g;
const POSTCODE_PATTERN =
  /\b[A-PR-UWYZ][A-HJ-Z]?\d[0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*\d(?!refund)[ABD-HJLNPQ-Z]{2,3}\b/gi;
const PHONE_NUMBER_PATTERN_1 = /\b\d{4} \d{7}\b/g;
const PHONE_NUMBER_PATTERN_2 = /\b\d{4}\d{7}\b/g;

// e.g. 01/01/1990 or 01-01-1990 or 1-1-1990 or 1/1/1990 or 01\01\1990 or 1\1\1990
const DATE_PATTERN_NUMERIC_1 = /\d{1,2}([-\/\\])\d{1,2}([-\/\\])\d{4}/g; // eslint-disable-line no-useless-escape

// e.g. 1990/01/01 or 1990-01-01 or 1990-1-1 or 1990/1/1 or 1990\1\1 or 1990\01\01
const DATE_PATTERN_NUMERIC_2 = /\d{4}([-\/\\])\d{1,2}([-\/\\])\d{1,2}/g; // eslint-disable-line no-useless-escape

// e.g. 01/01/90 or 01-01-90 or 1-1-90 or 1/1/90 or 01\01\90 or 1\1\90
const DATE_PATTERN_NUMERIC_3 = /\d{1,2}([-\/\\])\d{1,2}([-\/\\])\d{2}/g; // eslint-disable-line no-useless-escape

// e.g. 1(st) (of) Jan(uary) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
const DATE_PATTERN_STRING_1 =
  /\d{1,2}(?:st|nd|rd|th)?\s(?:of\s)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s(?:')?(\d{4}|\d{2})/gi;

// e.g. Jan(uary) 1(st) 1990 (or 90 or '90) - where the bracketed characters are optional parts that can be matched
const DATE_PATTERN_STRING_2 =
  /(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t)?(?:ember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s\d{1,2}?(?:st|nd|rd|th)?\s(?:')?(\d{4}|\d{2})/gi;

// specific URL parameters to be redacted from accounts URLs
const RESET_PASSWORD_TOKEN_PATTERN = /reset_password_token=[a-zA-Z0-9-]+/g;
const UNLOCK_TOKEN_PATTERN = /unlock_token=[a-zA-Z0-9-]+/g;
const STATE_PATTERN = /state=.[^&]+/g;

const isDate = function (value: string) {
  if (
    value.match(DATE_PATTERN_NUMERIC_1) ||
    value.match(DATE_PATTERN_NUMERIC_2) ||
    value.match(DATE_PATTERN_NUMERIC_3) ||
    value.match(DATE_PATTERN_STRING_1) ||
    value.match(DATE_PATTERN_STRING_2)
  ) {
    return true;
  } else {
    return false;
  }
};

const isPostCode = function (value: string) {
  if (value.match(POSTCODE_PATTERN)) {
    return true;
  } else {
    return false;
  }
};

const isPhoneNumber = function (value: string) {
  if (
    value.match(PHONE_NUMBER_PATTERN_1) ||
    value.match(PHONE_NUMBER_PATTERN_2)
  ) {
    return true;
  } else {
    return false;
  }
};

export function stripPIIFromString(value: string) {
  let stripped = value.replace(EMAIL_PATTERN, "[email]");
  stripped = stripped.replace(
    RESET_PASSWORD_TOKEN_PATTERN,
    "reset_password_token=[reset_password_token]",
  );
  stripped = stripped.replace(
    UNLOCK_TOKEN_PATTERN,
    "unlock_token=[unlock_token]",
  );
  stripped = stripped.replace(STATE_PATTERN, "state=[state]");

  if (isDate(value)) {
    const DATE_REDACTION_STRING = "[date]";
    stripped = stripped.replace(DATE_PATTERN_NUMERIC_1, DATE_REDACTION_STRING);
    stripped = stripped.replace(DATE_PATTERN_NUMERIC_2, DATE_REDACTION_STRING);
    stripped = stripped.replace(DATE_PATTERN_NUMERIC_3, DATE_REDACTION_STRING);
    stripped = stripped.replace(DATE_PATTERN_STRING_1, DATE_REDACTION_STRING);
    stripped = stripped.replace(DATE_PATTERN_STRING_2, DATE_REDACTION_STRING);
  } else if (isPostCode(value)) {
    const POSTCODE_REDACTION_STRING = "[postcode]";
    stripped = stripped.replace(POSTCODE_PATTERN, POSTCODE_REDACTION_STRING);
  } else if (isPhoneNumber(value)) {
    const PHONENUMBER_REDACTION_STRING = "[phonenumber]";
    stripped = stripped.replace(
      PHONE_NUMBER_PATTERN_1,
      PHONENUMBER_REDACTION_STRING,
    );
    stripped = stripped.replace(
      PHONE_NUMBER_PATTERN_2,
      PHONENUMBER_REDACTION_STRING,
    );
  }

  return stripped;
}
