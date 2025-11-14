"""
Script de Verificación: ¿Qué modo está usando?
"""

print("=" * 70)
print("🔍 VERIFICACIÓN DE MODO DE GENERACIÓN")
print("=" * 70)

# Cargar configuración
try:
    from config import MODO_IMAGEN, API_KEY, MOSTRAR_EMOJI, FECHA_GLOBAL
    print("\n✅ Configuración cargada\n")
except ImportError:
    print("\n❌ No se encontró config.py")
    exit(1)

# Mostrar configuración
print("📋 TU CONFIGURACIÓN ACTUAL:")
print("─" * 70)
print(f"🎨 Modo de imagen: {MODO_IMAGEN}")
print(f"📅 Fecha global: {FECHA_GLOBAL if FECHA_GLOBAL else 'Fecha de hoy'}")
print(f"😀 Mostrar emoji: {'Sí' if MOSTRAR_EMOJI else 'No'}")

if MODO_IMAGEN == "stability":
    print(f"🔑 API Key: {API_KEY[:20]}..." if len(API_KEY) > 20 else f"🔑 API Key: {API_KEY}")
elif MODO_IMAGEN == "openai":
    print(f"🔑 API Key: {API_KEY[:20]}..." if len(API_KEY) > 20 else f"🔑 API Key: {API_KEY}")
else:
    print("🆓 Modo prueba: GRATIS")

print("─" * 70)

# Explicar qué modo está usando
print("\n" + "=" * 70)
if MODO_IMAGEN == "stability":
    print("✅ ESTÁS USANDO: STABILITY AI")
    print("=" * 70)
    print("\n📝 Características:")
    print("   ✓ Imágenes generadas con IA profesional")
    print("   ✓ Alta calidad visual")
    print("   ✓ Fondos místicos y artísticos")
    print("   ✓ Costo: ~$0.05 por imagen")
    print("   ✓ Los archivos incluyen '_stability_' en el nombre")
    print("\n💰 Costo estimado para 60 imágenes: ~$3.00 USD")
    
elif MODO_IMAGEN == "openai":
    print("✅ ESTÁS USANDO: OPENAI DALL-E")
    print("=" * 70)
    print("\n📝 Características:")
    print("   ✓ Imágenes generadas con IA de OpenAI")
    print("   ✓ Alta calidad visual")
    print("   ✓ Fondos creativos")
    print("   ✓ Costo: ~$0.08 por imagen")
    print("   ✓ Los archivos incluyen '_openai_' en el nombre")
    print("\n💰 Costo estimado para 60 imágenes: ~$4.80 USD")
    
else:
    print("✅ ESTÁS USANDO: MODO PRUEBA")
    print("=" * 70)
    print("\n📝 Características:")
    print("   ✓ Imágenes de gradientes simples")
    print("   ✓ Sin IA - solo colores del signo")
    print("   ✓ Calidad básica")
    print("   ✓ Costo: GRATIS")
    print("   ✓ Los archivos NO incluyen '_stability_' ni '_openai_'")
    print("\n💰 Costo total: $0.00 USD")

print("=" * 70)

# Diferencias visuales
print("\n📊 CÓMO IDENTIFICAR EL MODO:")
print("─" * 70)

print("\n🎨 MODO STABILITY AI:")
print("   → Nombres de archivo: 'aries_amor_stability_20241115.png'")
print("   → Imágenes: Fondos con estrellas, cosmos, efectos místicos")
print("   → Calidad: Alta, profesional, artística")
print("   → Consola: Muestra '🎨 Generando imagen con Stability AI...'")

print("\n🎨 MODO OPENAI:")
print("   → Nombres de archivo: 'aries_amor_openai_20241115.png'")
print("   → Imágenes: Fondos creativos, artísticos")
print("   → Calidad: Alta, profesional")
print("   → Consola: Muestra '🎨 Generando imagen con OpenAI...'")

print("\n🎨 MODO PRUEBA:")
print("   → Nombres de archivo: 'aries_amor_20241115.png' (sin '_stability_' ni '_openai_')")
print("   → Imágenes: Gradientes de colores simples")
print("   → Calidad: Básica, sin detalles")
print("   → Consola: Muestra '🧪 Modo prueba activado'")

print("─" * 70)

# Prueba en vivo
print("\n🧪 QUIERES HACER UNA PRUEBA?")
print("   Genera 1 imagen para verificar el modo actual")
print("\nEjecuta:")
print("   python3 test_modo.py")

print("\n" + "=" * 70)