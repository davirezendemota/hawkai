import { Demand, DemandPriority } from '../types/demand';

// Pesos de prioridade
const PRIORITY_WEIGHTS: Record<DemandPriority, number> = {
  low: 1,
  medium: 3,
  high: 5,
  urgent: 10,
};

/**
 * Calcula o peso de uma demanda baseado na sua prioridade
 */
export const getPriorityWeight = (priority: DemandPriority): number => {
  return PRIORITY_WEIGHTS[priority];
};

/**
 * Calcula o impacto de todas as demandas baseado na fórmula:
 * Soma dos pesos / Número de pendências
 * 
 * @param demands - Lista de demandas ativas (sem groupId)
 * @returns Map com o ID da demanda e seu impacto calculado
 */
export const calculateImpactPercentages = (
  demands: Demand[]
): Map<string, number> => {
  // Filtrar apenas demandas ativas (sem groupId)
  const activeDemands = demands.filter((d) => !d.groupId);

  if (activeDemands.length === 0) {
    return new Map();
  }

  // Calcular soma dos pesos
  const totalWeight = activeDemands.reduce((sum, demand) => {
    return sum + getPriorityWeight(demand.priority);
  }, 0);

  // Número de pendências
  const numberOfDemands = activeDemands.length;

  // Calcular impacto para cada demanda proporcionalmente ao seu peso
  // Fórmula: impacto = (peso da demanda / soma dos pesos) * 100
  // Isso distribui 100% entre todas as demandas proporcionalmente ao peso
  const impactMap = new Map<string, number>();
  
  activeDemands.forEach((demand) => {
    const demandWeight = getPriorityWeight(demand.priority);
    const impactPercentage = totalWeight > 0 
      ? (demandWeight / totalWeight) * 100 
      : 0;
    impactMap.set(demand.id, impactPercentage);
  });

  return impactMap;
};
