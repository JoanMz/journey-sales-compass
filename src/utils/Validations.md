# Sistema de Validaciones Reutilizable

Este documento describe cómo usar el sistema de validaciones centralizado para formularios en Journey Sales Compass.

## 📋 Tabla de Contenidos

- [Instalación y Uso](#instalación-y-uso)
- [Validaciones Básicas](#validaciones-básicas)
- [Validaciones Específicas](#validaciones-específicas)
- [Validador de Campos Individuales](#validador-de-campos-individuales)
- [Validador de Formularios Completos](#validador-de-formularios-completos)
- [Utilidades de Formateo](#utilidades-de-formateo)
- [Configuraciones Predefinidas](#configuraciones-predefinidas)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Mejores Prácticas](#mejores-prácticas)

## 🚀 Instalación y Uso

```typescript
import { 
  validateField, 
  validateForm, 
  validateEmail, 
  validateCurrency,
  CommonValidations,
  formatCurrency,
  parseCurrencyInput 
} from '@/utils/validations';
```

## 🔧 Validaciones Básicas

### validateRequired
Valida si un campo es requerido y no está vacío.

```typescript
const result = validateRequired("", "Nombre");
// { isValid: false, message: "El campo Nombre es requerido" }
```

### validateMinLength / validateMaxLength
Valida la longitud de strings.

```typescript
const result = validateMinLength("abc", 5, "Código");
// { isValid: false, message: "El campo Código debe tener al menos 5 caracteres" }
```

### validateMin / validateMax
Valida valores numéricos.

```typescript
const result = validateMin(5, 10, "Precio");
// { isValid: false, message: "El campo Precio debe ser mayor o igual a 10" }
```

### validatePattern
Valida patrones regex.

```typescript
const result = validatePattern("invalid-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email");
// { isValid: false, message: "El campo Email tiene un formato inválido" }
```

## 🎯 Validaciones Específicas

### validateEmail
Valida formato de email.

```typescript
const result = validateEmail("invalid-email", "Correo electrónico");
// { isValid: false, message: "El campo Correo electrónico debe ser un email válido" }
```

### validatePhone
Valida números de teléfono.

```typescript
const result = validatePhone("123", "Número de teléfono");
// { isValid: false, message: "El campo Número de teléfono debe tener al menos 10 dígitos" }
```

### validateDNI
Valida DNI/ID.

```typescript
const result = validateDNI("123", "Cédula");
// { isValid: false, message: "El campo Cédula debe tener entre 7 y 12 dígitos" }
```

### validateCurrency
Valida valores monetarios.

```typescript
const result = validateCurrency(-100, "Precio", 0);
// { isValid: false, message: "El campo Precio debe ser mayor a 0" }
```

### validateDate / validateFutureDate
Valida fechas.

```typescript
const result = validateFutureDate("2020-01-01", "Fecha de inicio");
// { isValid: false, message: "El campo Fecha de inicio debe ser una fecha futura" }
```

## 🔍 Validador de Campos Individuales

### validateField
Valida un campo con múltiples reglas.

```typescript
const result = validateField("test@email.com", {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  custom: (val) => val.includes('@company.com') ? 
    { isValid: true } : 
    { isValid: false, message: "Debe ser un email de la empresa" }
}, "Email corporativo");
```

## 📝 Validador de Formularios Completos

### validateForm
Valida un formulario completo.

```typescript
const formData = {
  name: "John Doe",
  email: "john@example.com",
  age: 25
};

const config = {
  name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age: { required: true, min: 18, max: 100 }
};

const result = validateForm(formData, config);
// { isValid: true, errors: {} }
```

## 💰 Utilidades de Formateo

### formatCurrency
Formatea números como moneda.

```typescript
const formatted = formatCurrency(1234.56);
// "1,234.56"

const formattedWithCurrency = formatCurrency(1234.56, 'es-CO', 'COP');
// "$1.234,56"
```

### parseCurrencyInput
Parsea input de moneda a número.

```typescript
const parsed = parseCurrencyInput("1,234.56");
// 1234.56
```

### cleanCurrencyInput
Limpia input de moneda para edición.

```typescript
const cleaned = cleanCurrencyInput("$1,234.56");
// "1234.56"
```

## ⚙️ Configuraciones Predefinidas

### CommonValidations
Configuraciones comunes para reutilizar.

```typescript
// Usar validación de email predefinida
const emailResult = validateField(email, CommonValidations.email, "Email");

// Usar validación de teléfono predefinida
const phoneResult = validateField(phone, CommonValidations.phone, "Teléfono");

// Usar validación de moneda predefinida
const currencyResult = validateField(amount, CommonValidations.currency, "Monto");
```

## 📚 Ejemplos Prácticos

### Ejemplo 1: Formulario de Usuario

```typescript
import { validateForm, CommonValidations } from '@/utils/validations';

const userFormData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "3001234567",
  dni: "12345678"
};

const userValidationConfig = {
  name: CommonValidations.name,
  email: CommonValidations.email,
  phone: CommonValidations.phone,
  dni: CommonValidations.dni
};

const result = validateForm(userFormData, userValidationConfig);
if (!result.isValid) {
  console.log("Errores:", result.errors);
}
```

### Ejemplo 2: Formulario de Factura

```typescript
import { validateForm, validateCurrency, validateFutureDate } from '@/utils/validations';

const invoiceFormData = {
  ciudad_salida: "Bogotá",
  ciudad_llegada: "Medellín",
  fecha_inicio: "2024-12-01",
  fecha_regreso: "2024-12-05",
  tarifa_adulto: 500000,
  tarifa_nino: 250000
};

const invoiceValidationConfig = {
  ciudad_salida: { required: true, minLength: 2 },
  ciudad_llegada: { required: true, minLength: 2 },
  fecha_inicio: { required: true, custom: (val) => validateFutureDate(val, "Fecha de inicio") },
  fecha_regreso: { required: true, custom: (val) => validateFutureDate(val, "Fecha de regreso") },
  tarifa_adulto: { required: true, custom: (val) => validateCurrency(val, "Tarifa adulto", 0) },
  tarifa_nino: { custom: (val) => val > 0 ? validateCurrency(val, "Tarifa niño", 0) : { isValid: true } }
};

const result = validateForm(invoiceFormData, invoiceValidationConfig);
```

### Ejemplo 3: Input de Moneda con Formateo

```typescript
import { formatCurrency, parseCurrencyInput, cleanCurrencyInput } from '@/utils/validations';

// En un componente React
const [displayValue, setDisplayValue] = useState('0,00');
const [rawValue, setRawValue] = useState('0');
const [numericValue, setNumericValue] = useState(0);

const handleCurrencyChange = (inputValue: string) => {
  const cleaned = cleanCurrencyInput(inputValue);
  setRawValue(cleaned);
};

const handleCurrencyBlur = () => {
  const parsed = parseCurrencyInput(rawValue);
  const formatted = formatCurrency(parsed);
  
  setNumericValue(parsed);
  setDisplayValue(formatted);
  setRawValue(parsed.toString());
};

const handleCurrencyFocus = () => {
  setRawValue(numericValue.toString());
};
```

## 🎯 Mejores Prácticas

### 1. Usar Configuraciones Predefinidas
```typescript
// ✅ Bueno
const emailResult = validateField(email, CommonValidations.email, "Email");

// ❌ Evitar
const emailResult = validateField(email, {
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}, "Email");
```

### 2. Validar en Tiempo Real
```typescript
// En un input
const handleInputChange = (value: string) => {
  setValue(value);
  const result = validateField(value, fieldConfig, fieldName);
  setError(result.isValid ? null : result.message);
};
```

### 3. Validar al Enviar
```typescript
const handleSubmit = (formData: FormData) => {
  const result = validateForm(formData, validationConfig);
  
  if (!result.isValid) {
    setErrors(result.errors);
    return;
  }
  
  // Proceder con el envío
  submitForm(formData);
};
```

### 4. Mensajes de Error Personalizados
```typescript
const customValidation = {
  required: true,
  custom: (value: string) => ({
    isValid: value.length >= 8,
    message: "La contraseña debe tener al menos 8 caracteres"
  })
};
```

### 5. Validaciones Condicionales
```typescript
const conditionalValidation = {
  required: true,
  custom: (value: string, formData: any) => {
    if (formData.type === 'premium' && value.length < 10) {
      return {
        isValid: false,
        message: "Los usuarios premium necesitan un código de 10 caracteres"
      };
    }
    return { isValid: true };
  }
};
```

## 🔧 Configuración de Tipos

### ValidationConfig
```typescript
interface ValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => ValidationResult;
}
```

### FormValidationConfig
```typescript
interface FormValidationConfig {
  [fieldName: string]: ValidationConfig;
}
```

### ValidationResult
```typescript
interface ValidationResult {
  isValid: boolean;
  message?: string;
}
```

## 🚨 Manejo de Errores

### Mostrar Errores en UI
```typescript
const [errors, setErrors] = useState<{[key: string]: string}>({});

const validateAndSetErrors = (formData: FormData) => {
  const result = validateForm(formData, validationConfig);
  setErrors(result.errors);
  return result.isValid;
};

// En el JSX
{errors.email && (
  <span className="text-red-500 text-sm">{errors.email}</span>
)}
```

### Limpiar Errores
```typescript
const clearError = (fieldName: string) => {
  setErrors(prev => {
    const newErrors = { ...prev };
    delete newErrors[fieldName];
    return newErrors;
  });
};
```

## 📈 Extensibilidad

### Crear Validaciones Personalizadas
```typescript
// Validación personalizada para códigos de descuento
const validateDiscountCode = (code: string, fieldName: string = "Código"): ValidationResult => {
  if (!code.startsWith('DISCOUNT_')) {
    return {
      isValid: false,
      message: `El ${fieldName} debe comenzar con 'DISCOUNT_'`
    };
  }
  
  if (code.length !== 15) {
    return {
      isValid: false,
      message: `El ${fieldName} debe tener exactamente 15 caracteres`
    };
  }
  
  return { isValid: true };
};

// Usar en configuración
const discountConfig = {
  required: true,
  custom: (value: string) => validateDiscountCode(value, "Código de descuento")
};
```

---

## 📞 Soporte

Para preguntas o problemas con el sistema de validaciones, contacta al equipo de desarrollo de Journey Sales Compass.

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2024
