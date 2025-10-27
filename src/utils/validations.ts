/**
 * @fileoverview Sistema de validaciones reutilizable para formularios
 * @author Journey Sales Compass Team
 * @version 1.0.0
 */

// ========================================
// TIPOS DE VALIDACIÓN
// ========================================

/**
 * Resultado de una validación
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Configuración para validaciones de campos
 */
export interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => ValidationResult;
}

/**
 * Configuración para validaciones de formulario completo
 */
export interface FormValidationConfig {
  [fieldName: string]: ValidationConfig;
}

// ========================================
// VALIDACIONES BÁSICAS
// ========================================

/**
 * Valida si un campo es requerido y no está vacío
 * @param value - Valor a validar
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateRequired("", "Nombre");
 * // { isValid: false, message: "El campo Nombre es requerido" }
 * ```
 */
export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      message: `El campo ${fieldName} es requerido`
    };
  }
  return { isValid: true };
};

/**
 * Valida la longitud mínima de un string
 * @param value - Valor a validar
 * @param minLength - Longitud mínima requerida
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateMinLength("abc", 5, "Código");
 * // { isValid: false, message: "El campo Código debe tener al menos 5 caracteres" }
 * ```
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
  if (value.length < minLength) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe tener al menos ${minLength} caracteres`
    };
  }
  return { isValid: true };
};

/**
 * Valida la longitud máxima de un string
 * @param value - Valor a validar
 * @param maxLength - Longitud máxima permitida
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateMaxLength("abcdefghij", 5, "Código");
 * // { isValid: false, message: "El campo Código no puede tener más de 5 caracteres" }
 * ```
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationResult => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      message: `El campo ${fieldName} no puede tener más de ${maxLength} caracteres`
    };
  }
  return { isValid: true };
};

/**
 * Valida el valor mínimo de un número
 * @param value - Valor a validar
 * @param min - Valor mínimo requerido
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateMin(5, 10, "Precio");
 * // { isValid: false, message: "El campo Precio debe ser mayor o igual a 10" }
 * ```
 */
export const validateMin = (value: number, min: number, fieldName: string): ValidationResult => {
  if (value < min) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser mayor o igual a ${min}`
    };
  }
  return { isValid: true };
};

/**
 * Valida el valor máximo de un número
 * @param value - Valor a validar
 * @param max - Valor máximo permitido
 * @param fieldName - Nombre del campo para el mensaje de error
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateMax(15, 10, "Precio");
 * // { isValid: false, message: "El campo Precio debe ser menor o igual a 10" }
 * ```
 */
export const validateMax = (value: number, max: number, fieldName: string): ValidationResult => {
  if (value > max) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser menor o igual a ${max}`
    };
  }
  return { isValid: true };
};

/**
 * Valida un patrón regex
 * @param value - Valor a validar
 * @param pattern - Patrón regex a aplicar
 * @param fieldName - Nombre del campo para el mensaje de error
 * @param customMessage - Mensaje personalizado de error (opcional)
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validatePattern("invalid-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email");
 * // { isValid: false, message: "El campo Email tiene un formato inválido" }
 * ```
 */
export const validatePattern = (
  value: string, 
  pattern: RegExp, 
  fieldName: string, 
  customMessage?: string
): ValidationResult => {
  if (!pattern.test(value)) {
    return {
      isValid: false,
      message: customMessage || `El campo ${fieldName} tiene un formato inválido`
    };
  }
  return { isValid: true };
};

// ========================================
// VALIDACIONES ESPECÍFICAS
// ========================================

/**
 * Valida un email
 * @param email - Email a validar
 * @param fieldName - Nombre del campo (por defecto "Email")
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateEmail("invalid-email", "Correo electrónico");
 * // { isValid: false, message: "El campo Correo electrónico debe ser un email válido" }
 * ```
 */
export const validateEmail = (email: string, fieldName: string = "Email"): ValidationResult => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return validatePattern(email, emailPattern, fieldName, `El campo ${fieldName} debe ser un email válido`);
};

/**
 * Valida un número de teléfono
 * @param phone - Teléfono a validar
 * @param fieldName - Nombre del campo (por defecto "Teléfono")
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validatePhone("123", "Número de teléfono");
 * // { isValid: false, message: "El campo Número de teléfono debe tener al menos 10 dígitos" }
 * ```
 */
export const validatePhone = (phone: string, fieldName: string = "Teléfono"): ValidationResult => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe tener al menos 10 dígitos`
    };
  }
  return { isValid: true };
};

/**
 * Valida un DNI/ID
 * @param dni - DNI a validar
 * @param fieldName - Nombre del campo (por defecto "DNI")
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateDNI("123", "Cédula");
 * // { isValid: false, message: "El campo Cédula debe tener entre 7 y 12 dígitos" }
 * ```
 */
export const validateDNI = (dni: string, fieldName: string = "DNI"): ValidationResult => {
  const cleanDNI = dni.replace(/\D/g, '');
  if (cleanDNI.length < 7 || cleanDNI.length > 12) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe tener entre 7 y 12 dígitos`
    };
  }
  return { isValid: true };
};

/**
 * Valida un valor monetario
 * @param value - Valor a validar
 * @param fieldName - Nombre del campo (por defecto "Valor")
 * @param minValue - Valor mínimo (por defecto 0)
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateCurrency(-100, "Precio", 0);
 * // { isValid: false, message: "El campo Precio debe ser mayor a 0" }
 * ```
 */
export const validateCurrency = (value: number, fieldName: string = "Valor", minValue: number = 0): ValidationResult => {
  if (value <= minValue) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser mayor a ${minValue}`
    };
  }
  return { isValid: true };
};

/**
 * Valida una fecha
 * @param date - Fecha a validar (string en formato YYYY-MM-DD)
 * @param fieldName - Nombre del campo (por defecto "Fecha")
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateDate("invalid-date", "Fecha de inicio");
 * // { isValid: false, message: "El campo Fecha de inicio debe ser una fecha válida" }
 * ```
 */
export const validateDate = (date: string, fieldName: string = "Fecha"): ValidationResult => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser una fecha válida`
    };
  }
  return { isValid: true };
};

/**
 * Valida que una fecha sea futura
 * @param date - Fecha a validar (string en formato YYYY-MM-DD)
 * @param fieldName - Nombre del campo (por defecto "Fecha")
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateFutureDate("2020-01-01", "Fecha de inicio");
 * // { isValid: false, message: "El campo Fecha de inicio debe ser una fecha futura" }
 * ```
 */
export const validateFutureDate = (date: string, fieldName: string = "Fecha"): ValidationResult => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(dateObj.getTime())) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser una fecha válida`
    };
  }
  
  if (dateObj < today) {
    return {
      isValid: false,
      message: `El campo ${fieldName} debe ser una fecha futura`
    };
  }
  
  return { isValid: true };
};

// ========================================
// VALIDADOR DE CAMPOS INDIVIDUALES
// ========================================

/**
 * Valida un campo individual con múltiples reglas
 * @param value - Valor a validar
 * @param config - Configuración de validación
 * @param fieldName - Nombre del campo
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = validateField("test@email.com", {
 *   required: true,
 *   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
 *   custom: (val) => val.includes('@company.com') ? 
 *     { isValid: true } : 
 *     { isValid: false, message: "Debe ser un email de la empresa" }
 * }, "Email corporativo");
 * ```
 */
export const validateField = (
  value: any, 
  config: ValidationConfig, 
  fieldName: string
): ValidationResult => {
  // Validar campo requerido
  if (config.required) {
    const requiredResult = validateRequired(value, fieldName);
    if (!requiredResult.isValid) {
      return requiredResult;
    }
  }

  // Si el campo no es requerido y está vacío, es válido
  if (!config.required && (value === null || value === undefined || value === '')) {
    return { isValid: true };
  }

  // Validar longitud mínima
  if (config.minLength && typeof value === 'string') {
    const minLengthResult = validateMinLength(value, config.minLength, fieldName);
    if (!minLengthResult.isValid) {
      return minLengthResult;
    }
  }

  // Validar longitud máxima
  if (config.maxLength && typeof value === 'string') {
    const maxLengthResult = validateMaxLength(value, config.maxLength, fieldName);
    if (!maxLengthResult.isValid) {
      return maxLengthResult;
    }
  }

  // Validar valor mínimo
  if (config.min !== undefined && typeof value === 'number') {
    const minResult = validateMin(value, config.min, fieldName);
    if (!minResult.isValid) {
      return minResult;
    }
  }

  // Validar valor máximo
  if (config.max !== undefined && typeof value === 'number') {
    const maxResult = validateMax(value, config.max, fieldName);
    if (!maxResult.isValid) {
      return maxResult;
    }
  }

  // Validar patrón regex
  if (config.pattern && typeof value === 'string') {
    const patternResult = validatePattern(value, config.pattern, fieldName);
    if (!patternResult.isValid) {
      return patternResult;
    }
  }

  // Validación personalizada
  if (config.custom) {
    const customResult = config.custom(value);
    if (!customResult.isValid) {
      return customResult;
    }
  }

  return { isValid: true };
};

// ========================================
// VALIDADOR DE FORMULARIOS COMPLETOS
// ========================================

/**
 * Resultado de validación de formulario
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: { [fieldName: string]: string };
}

/**
 * Valida un formulario completo con múltiples campos
 * @param formData - Datos del formulario
 * @param config - Configuración de validación para cada campo
 * @returns Resultado de la validación del formulario
 * 
 * @example
 * ```typescript
 * const formData = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   age: 25
 * };
 * 
 * const config = {
 *   name: { required: true, minLength: 2 },
 *   email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
 *   age: { required: true, min: 18, max: 100 }
 * };
 * 
 * const result = validateForm(formData, config);
 * // { isValid: true, errors: {} }
 * ```
 */
export const validateForm = (
  formData: { [key: string]: any }, 
  config: FormValidationConfig
): FormValidationResult => {
  const errors: { [fieldName: string]: string } = {};
  let isValid = true;

  for (const [fieldName, fieldConfig] of Object.entries(config)) {
    const value = formData[fieldName];
    const result = validateField(value, fieldConfig, fieldName);
    
    if (!result.isValid) {
      errors[fieldName] = result.message || `El campo ${fieldName} es inválido`;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// ========================================
// UTILIDADES DE FORMATEO
// ========================================

/**
 * Formatea un número como moneda
 * @param value - Valor numérico a formatear
 * @param locale - Locale para el formateo (por defecto 'en-US')
 * @param currency - Código de moneda (por defecto 'USD')
 * @returns String formateado como moneda
 * 
 * @example
 * ```typescript
 * const formatted = formatCurrency(1234.56);
 * // "1,234.56"
 * ```
 */
export const formatCurrency = (value: number, locale: string = 'en-US', currency?: string): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  if (currency) {
    options.style = 'currency';
    options.currency = currency;
  }
  
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Parsea un input de moneda a número
 * @param input - String de entrada con formato de moneda
 * @returns Número parseado
 * 
 * @example
 * ```typescript
 * const parsed = parseCurrencyInput("1,234.56");
 * // 1234.56
 * ```
 */
export const parseCurrencyInput = (input: string): number => {
  // Remove all non-numeric characters except decimal point and commas
  const cleaned = input.replace(/[^\d.,]/g, '');
  
  // Handle multiple decimal points by keeping only the first one
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    const integerPart = parts[0].replace(/,/g, ''); // Remove commas from integer part
    const decimalPart = parts.slice(1).join('').replace(/,/g, ''); // Remove commas from decimal part
    return parseFloat(`${integerPart}.${decimalPart}`) || 0;
  }
  
  // Remove commas before parsing
  const cleanedValue = cleaned.replace(/,/g, '');
  return parseFloat(cleanedValue) || 0;
};

/**
 * Limpia un input de moneda para edición
 * @param input - String de entrada
 * @returns String limpio para edición
 * 
 * @example
 * ```typescript
 * const cleaned = cleanCurrencyInput("$1,234.56");
 * // "1234.56"
 * ```
 */
export const cleanCurrencyInput = (input: string): string => {
  // Remove all non-numeric characters except decimal point and commas
  let cleaned = input.replace(/[^\d.,]/g, '');
  
  // Remove leading zeros except for "0." or single "0"
  if (cleaned.length > 1) {
    cleaned = cleaned.replace(/^0+/, '');
    // If we removed everything, keep at least one zero
    if (cleaned === '' || cleaned === '.') {
      cleaned = '0';
    }
  }
  
  return cleaned;
};

// ========================================
// CONFIGURACIONES PREDEFINIDAS
// ========================================

/**
 * Configuraciones de validación comunes para reutilizar
 */
export const CommonValidations = {
  // Validación de email
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => ({
      isValid: value.length <= 254,
      message: value.length > 254 ? "El email es demasiado largo" : undefined
    })
  } as ValidationConfig,

  // Validación de teléfono
  phone: {
    required: true,
    custom: (value: string) => validatePhone(value)
  } as ValidationConfig,

  // Validación de DNI
  dni: {
    required: true,
    custom: (value: string) => validateDNI(value)
  } as ValidationConfig,

  // Validación de nombre
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  } as ValidationConfig,

  // Validación de moneda
  currency: {
    required: true,
    custom: (value: number) => validateCurrency(value, "Valor", 0)
  } as ValidationConfig,

  // Validación de fecha futura
  futureDate: {
    required: true,
    custom: (value: string) => validateFutureDate(value)
  } as ValidationConfig
};
