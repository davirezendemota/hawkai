'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Demand } from '../types/demand';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CanvasProps {
  demands: Demand[];
  onDemandClick?: (demand: Demand) => void;
}

interface BubbleNode {
  id: string;
  title: string;
  value: number;
  radius: number;
  x: number;
  y: number;
  color: string;
  demand: Demand;
  impactRank: number;
}

export default function Canvas({ demands, onDemandClick }: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 250 });

  const activeDemands = useMemo(
    () => demands.filter((d) => !d.groupId),
    [demands]
  );

  // Ajustar dimensões do SVG quando o container mudar
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const parent = svgRef.current.parentElement;
        setDimensions({
          width: parent.clientWidth || 800,
          height: Math.max(parent.clientHeight || 250, 250),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Preparar dados para o gráfico de bolhas
  const bubbleData = useMemo(() => {
    const demandsWithImpact = activeDemands.filter(
      (d) => d.impactPercentage !== undefined && d.impactPercentage > 0
    );

    if (demandsWithImpact.length === 0) return [];

    // Ordenar demandas por impacto (maior primeiro) para determinar ranks
    const sortedDemands = [...demandsWithImpact].sort(
      (a, b) => (b.impactPercentage || 0) - (a.impactPercentage || 0)
    );

    // Calcular raios proporcionais
    const maxImpact = Math.max(...sortedDemands.map(d => d.impactPercentage || 0));
    const minRadius = 20;
    const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.15;
    
    return sortedDemands.map((demand, index) => {
      const impact = demand.impactPercentage || 0;
      const radius = Math.max((impact / maxImpact) * maxRadius, minRadius);
      
      // Determinar cor baseada no rank
      let color: string;
      if (index === 0) {
        color = '#1A8917'; // Maior impacto: verde mais intenso
      } else if (index >= 1 && index <= 3) {
        color = '#2d5a2b'; // Top 3: verde mais escuro
      } else {
        color = '#4a9e47'; // Resto: verde normal
      }

      return {
        id: demand.id,
        title: demand.title,
        value: impact,
        radius,
        x: dimensions.width / 2,
        y: dimensions.height / 2,
        color,
        demand,
        impactRank: index,
      } as BubbleNode;
    });
  }, [activeDemands, dimensions]);

  // Simulação de força D3 para posicionar as bolhas
  useEffect(() => {
    if (bubbleData.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    // Criar simulação de força
    const simulation = d3
      .forceSimulation<BubbleNode>(bubbleData)
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('collision', d3.forceCollide<BubbleNode>().radius((d) => d.radius + 5))
      .stop();

    // Executar simulação
    for (let i = 0; i < 100; ++i) simulation.tick();

    // Criar grupos para cada bolha
    const bubbles = svg
      .selectAll<SVGGElement, BubbleNode>('g.bubble')
      .data(bubbleData)
      .enter()
      .append('g')
      .attr('class', 'bubble')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        if (onDemandClick) {
          onDemandClick(d.demand);
        }
      });

    // Adicionar círculos
    bubbles
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', (d) => (d.impactRank === 0 ? 0.8 : 0.6))
      .on('mouseenter', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseleave', function(_, d) {
        d3.select(this).style('opacity', d.impactRank === 0 ? 0.8 : 0.6);
      });

    // Adicionar texto com porcentagem
    bubbles
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', (d) => (d.impactRank === 0 ? '14' : '10'))
      .attr('font-weight', (d) => (d.impactRank === 0 ? 'bold' : 'normal'))
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text((d) => `${Math.round(d.value)}%`);

    // Adicionar título abaixo das bolhas menores
    bubbles
      .filter((d) => d.impactRank > 0)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('y', (d) => d.radius + 15)
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', '9')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
      .text((d) => {
        const maxLength = 15;
        return d.title.length > maxLength
          ? `${d.title.substring(0, maxLength)}...`
          : d.title;
      });
  }, [bubbleData, dimensions, onDemandClick]);

  return (
    <Card className="h-[300px] mb-4 flex flex-col max-w-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Canvas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {activeDemands.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-12">
            Nenhuma demanda no canvas
          </p>
        ) : bubbleData.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] text-center py-12">
            Adicione porcentagens de impacto às demandas para visualizar o gráfico
          </p>
        ) : (
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          />
        )}
      </CardContent>
    </Card>
  );
}
