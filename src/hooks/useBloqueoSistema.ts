import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verificarEstadoConfiguracion, calcularEstadoBloqueo, procesarNotificacionesAutomaticas, inicializarFechaContratacion } from '@/utils/sistemaBloqueo';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  entidad: string;
  tipo: string;
}

interface EstadoBloqueo {
  bloqueado: boolean;
  diasRestantes: number;
  requiereNotificacion15: boolean;
  requiereNotificacion30: boolean;
  accionesPendientes: string[];
}

export const useBloqueoSistema = (usuario: Usuario | null) => {
  const router = useRouter();
  const [estadoBloqueo, setEstadoBloqueo] = useState<EstadoBloqueo | null>(null);
  const [verificandoBloqueo, setVerificandoBloqueo] = useState(true);

  useEffect(() => {
    if (!usuario) {
      setVerificandoBloqueo(false);
      return;
    }

    // Inicializar fecha de contratación si no existe
    inicializarFechaContratacion(usuario.entidad);

    // Verificar estado y procesar notificaciones automáticas
    const estado = procesarNotificacionesAutomaticas(usuario);
    setEstadoBloqueo(estado);

    // Si el sistema está bloqueado, redirigir
    if (estado.bloqueado) {
      router.push('/sistema-bloqueado');
      return;
    }

    setVerificandoBloqueo(false);
  }, [usuario, router]);

  const verificarEstadoActual = () => {
    if (!usuario) return null;

    const configuracion = verificarEstadoConfiguracion(usuario);
    const estado = calcularEstadoBloqueo(configuracion);
    setEstadoBloqueo(estado);

    return estado;
  };

  const mostrarAlertaConfiguracion = () => {
    if (!estadoBloqueo || estadoBloqueo.accionesPendientes.length === 0) return false;

    // Mostrar alerta si quedan menos de 15 días y hay acciones pendientes
    return estadoBloqueo.diasRestantes <= 15 && estadoBloqueo.diasRestantes > 0;
  };

  return {
    estadoBloqueo,
    verificandoBloqueo,
    verificarEstadoActual,
    mostrarAlertaConfiguracion
  };
};
