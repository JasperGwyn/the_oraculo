import { TeamStats } from './blockchain';

export type Team = 'YES' | 'NO';

export function assignTeam(teamYes: TeamStats, teamNo: TeamStats): Team {
  // Calcular diferencia de participantes
  const participantDiff = teamYes.participants - teamNo.participants;

  // Calcular diferencia de apuestas (en porcentaje)
  const totalStaked = teamYes.totalStaked + teamNo.totalStaked;
  const stakingDiff = Number(teamYes.totalStaked - teamNo.totalStaked) / Number(totalStaked);

  // Factor de balance (entre -1 y 1)
  // Considera tanto participantes como apuestas
  // 70% peso para participantes, 30% para apuestas
  const balanceFactor = (participantDiff * 0.7 + stakingDiff * 0.3);

  // Añadir factor aleatorio (20% de aleatoriedad)
  const randomFactor = (Math.random() * 0.4) - 0.2;

  // Decisión final
  const finalFactor = balanceFactor + randomFactor;

  // Si el factor final es positivo, significa que el equipo YES está más "pesado"
  // por lo tanto asignamos al equipo NO para balancear
  return finalFactor > 0 ? 'NO' : 'YES';
}