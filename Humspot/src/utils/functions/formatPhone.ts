

export function formatToE164(phoneNumber: string, countryCode = "1") {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.startsWith(countryCode)) {
    return `+${cleaned}`;
  }
  return `+${countryCode}${cleaned}`;
}

export function formatPhoneNumber(value: string) {
  const phoneNumber = value.replace(/\D/g, "");

  if (phoneNumber.length < 4) return phoneNumber;
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  if (phoneNumber.length < 11) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }
  return `1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
}