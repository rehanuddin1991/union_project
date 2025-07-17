// utils/numberConverter.js

export function convertToBanglaNumber(englishNumber) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return englishNumber.toString().split('').map(d => banglaDigits[parseInt(d)]).join('');
}