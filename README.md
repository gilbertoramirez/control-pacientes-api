# Control de Pacientes

Sistema de gestión para el control de pacientes en entornos médicos, utilizando Screaming Architecture.

## Arquitectura del Proyecto

Este proyecto sigue los principios de **Screaming Architecture**, donde la estructura del código "grita" el propósito del sistema, enfocándose en los casos de uso y el dominio del negocio, no en frameworks o detalles técnicos.

### Estructura de directorios

```
src/
├── core/                  # Componentes del núcleo compartidos
│   ├── domain/            # Entidades e interfaces core del negocio
│   └── usecases/          # Casos de uso compartidos
│
├── patients/              # Módulo de gestión de pacientes
│   ├── domain/            # Entidades e interfaces de dominio
│   ├── usecases/          # Casos de uso específicos de pacientes
│   └── interfaces/        # Adaptadores UI/API para pacientes
│
├── appointments/          # Módulo de gestión de citas
│   ├── domain/
│   ├── usecases/
│   └── interfaces/
│
├── treatments/            # Módulo de tratamientos médicos
│   ├── domain/
│   ├── usecases/
│   └── interfaces/
│
├── medical_records/       # Módulo de historias clínicas
│   ├── domain/
│   ├── usecases/
│   └── interfaces/
│
├── users/                 # Módulo de usuarios del sistema (médicos, enfermeras, etc.)
│   ├── domain/
│   ├── usecases/
│   └── interfaces/
│
├── prescriptions/         # Módulo de prescripciones médicas
│   ├── domain/
│   ├── usecases/
│   └── interfaces/
│
└── infrastructure/        # Componentes técnicos y de infraestructura
    ├── config/            # Configuraciones
    ├── persistence/       # Implementaciones de persistencia
    └── api/               # Configuración y endpoints API
```

### Principios de Screaming Architecture aplicados

1. **Organización por dominio**: La estructura está organizada alrededor de los conceptos y dominios del negocio.
2. **Independencia de frameworks**: La arquitectura no menciona ningún framework o biblioteca específica.
3. **Regla de dependencia**: Las capas internas (dominio) no dependen de las externas (interfaces, infraestructura).
4. **Casos de uso centrales**: Cada módulo tiene sus casos de uso claramente identificados.
5. **Testabilidad**: La estructura facilita la prueba de los componentes de forma aislada.

## Próximos pasos

- Implementar las entidades de dominio principales
- Definir los casos de uso específicos
- Seleccionar la tecnología específica para las interfaces e infraestructura
