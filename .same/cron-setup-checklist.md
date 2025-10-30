# ✅ Checklist Rápido: CRON Setup Supabase

## Estado Actual del Sistema

- [x] Función Edge `c360_boe_check` creada y deployada
- [x] Tablas de BD creadas (`boe_changes`, `boe_alerts`, etc.)
- [x] Variables de entorno configuradas
- [x] Sistema de alertas visuales implementado
- [ ] **CRON automático configurado** ⬅️ PENDIENTE

---

## 🎯 Tarea Pendiente: Configurar CRON Semanal

### Método Recomendado: Supabase Console (3 minutos)

**Usuario debe hacer manualmente:**

1. [ ] Ir a https://supabase.com/dashboard
2. [ ] Seleccionar proyecto `gkoyqfusawhnobvkoijc`
3. [ ] Ir a Edge Functions → Schedules
4. [ ] Click "Create Schedule"
5. [ ] Rellenar formulario:
   - Name: `boe_weekly_monitor`
   - Function: `c360_boe_check`
   - Cron: `0 8 * * 1`
   - Enabled: ✅
6. [ ] Click "Create"
7. [ ] Verificar que aparece en la lista
8. [ ] Hacer test con "Run now"

### Resultado Esperado

```
✅ Schedule activo
⏰ Próxima ejecución: [Próximo lunes]
🔄 Estado: Enabled
```

---

## 📖 Documentación de Referencia

- **Guía detallada completa**: `CRON_SUPABASE_SETUP.md`
- **Deployment general**: `DEPLOYMENT_BOE_MONITORING.md`
- **Setup técnico**: `SETUP_BOE_MONITORING.md`

---

## ⚠️ Nota Importante

Como asistente de IA, no puedo acceder directamente a la consola de Supabase para crear el schedule automáticamente. El usuario debe hacerlo manualmente siguiendo la guía paso a paso proporcionada.

---

**Última actualización**: Octubre 2025
