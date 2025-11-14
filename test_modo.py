"""
Script de Prueba: Generar 1 imagen para verificar el modo
"""

print("=" * 70)
print("🧪 PRUEBA DE GENERACIÓN - 1 IMAGEN")
print("=" * 70)

# Cargar configuración
try:
    from config import MODO_IMAGEN, API_KEY, MOSTRAR_EMOJI, FECHA_GLOBAL
    print("\n✅ Configuración cargada")
except ImportError:
    print("\n❌ No se encontró config.py")
    exit(1)

print(f"\n📋 Modo actual: {MODO_IMAGEN}")
print(f"📅 Fecha: {FECHA_GLOBAL if FECHA_GLOBAL else 'Fecha de hoy'}")
print(f"😀 Emoji: {'Visible' if MOSTRAR_EMOJI else 'Oculto'}")

if MODO_IMAGEN == "stability":
    print(f"💰 Costo de esta prueba: ~$0.05 USD")
elif MODO_IMAGEN == "openai":
    print(f"💰 Costo de esta prueba: ~$0.08 USD")
else:
    print(f"💰 Costo de esta prueba: GRATIS")

confirmar = input("\n¿Generar 1 imagen de prueba para Leo? (s/n): ").lower()

if confirmar != 's':
    print("❌ Prueba cancelada")
    exit(0)

print("\n" + "=" * 70)
print("🎨 GENERANDO IMAGEN DE PRUEBA")
print("=" * 70)

# Cargar sistema
try:
    exec(open('generar_todo.py').read().split('if __name__')[0])
    
    # Inicializar sistema
    sistema = SistemaHoroscopos(
        modo_imagen=MODO_IMAGEN,
        api_key=API_KEY if MODO_IMAGEN in ["stability", "openai"] else None
    )
    
    # Generar 1 imagen
    resultado = sistema.generar_tiktok(
        signo='leo',
        categoria='amor',
        texto_horoscopo='Tu corazón brilla con luz propia. El amor verdadero te encuentra hoy.',
        fecha=FECHA_GLOBAL,
        mostrar_emoji=MOSTRAR_EMOJI
    )
    
    print("\n" + "=" * 70)
    print("✅ PRUEBA COMPLETADA")
    print("=" * 70)
    
    ruta = resultado['ruta_imagen_final']
    nombre = ruta.split('/')[-1]
    
    print(f"\n📂 Imagen generada: {nombre}")
    print(f"📍 Ubicación: {ruta}")
    
    # Analizar el nombre del archivo
    print("\n🔍 ANÁLISIS:")
    if '_stability_' in nombre:
        print("   ✅ CONFIRMADO: Imagen generada con STABILITY AI")
        print("   💰 Se cobró ~$0.05 USD a tu cuenta")
        print("   🎨 Fondo: Con IA profesional (estrellas, cosmos, místico)")
    elif '_openai_' in nombre:
        print("   ✅ CONFIRMADO: Imagen generada con OPENAI DALL-E")
        print("   💰 Se cobró ~$0.08 USD a tu cuenta")
        print("   🎨 Fondo: Con IA de OpenAI (creativo, artístico)")
    else:
        print("   ✅ CONFIRMADO: Imagen generada en MODO PRUEBA")
        print("   💰 Sin costo - GRATIS")
        print("   🎨 Fondo: Gradiente simple de colores")
    
    print(f"\n📸 Abre la imagen para verificar la calidad:")
    print(f"   {ruta}")
    
    print("\n💡 Para cambiar el modo:")
    print("   1. Abre config.py")
    print("   2. Cambia MODO_IMAGEN = 'stability' (o 'prueba' o 'openai')")
    print("   3. Ejecuta de nuevo")
    
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()