'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface MonthlyData {
  monthName: string;
  year: number;
  monthNum: number;
  newUsers: number;
  paidUsers: number;
}

interface AdminChartProps {
  data: MonthlyData[];
}

export function AdminChart({ data }: AdminChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Encontrar o valor máximo para escala vertical
  const maxVal = Math.max(...data.map(d => Math.max(d.newUsers, d.paidUsers, 2)));
  const yTicks = 4;
  const maxLimit = Math.ceil(maxVal / yTicks) * yTicks;

  // Dimensões do SVG
  const width = 600;
  const height = 300;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Gerar linhas horizontais de grade (Grid Lines)
  const gridLines = Array.from({ length: yTicks + 1 }).map((_, i) => {
    const yVal = (maxLimit / yTicks) * i;
    const yPos = chartHeight + paddingTop - (chartHeight / maxLimit) * yVal;
    return { yPos, yVal };
  });

  // Espaçamento das colunas
  const colWidth = chartWidth / data.length;
  const barWidth = Math.max(12, colWidth * 0.25);
  const gap = Math.max(2, colWidth * 0.05);

  return (
    <Card className="w-full bg-admin-surface border-admin-border shadow-sm p-6 relative group flex-col gap-0 overflow-visible">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-admin-text tracking-tight">Crescimento de Usuários</h3>
          <p className="text-xs text-admin-text-secondary">Entrada de novos cadastrados vs assinantes pagos</p>
        </div>
        
        {/* Legenda do Gráfico */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-admin-primary" />
            <span className="text-admin-text-secondary font-medium">Novos Usuários</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-admin-success" />
            <span className="text-admin-text-secondary font-medium">Assinaturas</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Linhas de Grade e Valores do Eixo Y */}
          {gridLines.map((line, i) => (
            <g key={i} className="opacity-70">
              <line
                x1={paddingLeft}
                y1={line.yPos}
                x2={width - paddingRight}
                y2={line.yPos}
                className="stroke-admin-border/60"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={line.yPos + 4}
                className="text-[10px] fill-admin-text-muted font-bold text-right"
                textAnchor="end"
              >
                {Math.round(line.yVal)}
              </text>
            </g>
          ))}

          {/* Barras do Gráfico */}
          {data.map((month, index) => {
            const xCenter = paddingLeft + colWidth * index + colWidth / 2;
            
            // Altura e y para novos usuários (barra azul primary)
            const newUserHeight = (chartHeight / maxLimit) * month.newUsers;
            const newUserX = xCenter - barWidth - gap / 2;
            const newUserY = chartHeight + paddingTop - newUserHeight;

            // Altura e y para assinantes (barra verde success)
            const paidUserHeight = (chartHeight / maxLimit) * month.paidUsers;
            const paidUserX = xCenter + gap / 2;
            const paidUserY = chartHeight + paddingTop - paidUserHeight;

            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                {/* Zona de Interação/Hover (Coluna Invisível Inteligente) */}
                <rect
                  x={paddingLeft + colWidth * index}
                  y={paddingTop}
                  width={colWidth}
                  height={chartHeight}
                  className="fill-transparent cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Barra 1: Novos Usuários */}
                <rect
                  x={newUserX}
                  y={newUserY}
                  width={barWidth}
                  height={Math.max(2, newUserHeight)}
                  rx={3}
                  className={`fill-admin-primary transition-all duration-300 pointer-events-none ${
                    isHovered ? 'brightness-110 opacity-100 scale-y-[1.02]' : 'opacity-90'
                  }`}
                  style={{ transformOrigin: `${newUserX}px ${chartHeight + paddingTop}px` }}
                />

                {/* Barra 2: Usuários Pagos */}
                <rect
                  x={paidUserX}
                  y={paidUserY}
                  width={barWidth}
                  height={Math.max(2, paidUserHeight)}
                  rx={3}
                  className={`fill-admin-success transition-all duration-300 pointer-events-none ${
                    isHovered ? 'brightness-110 opacity-100 scale-y-[1.02]' : 'opacity-90'
                  }`}
                  style={{ transformOrigin: `${paidUserX}px ${chartHeight + paddingTop}px` }}
                />

                {/* Eixo X: Nomes dos Meses */}
                <text
                  x={xCenter}
                  y={chartHeight + paddingTop + 20}
                  className={`text-[11px] font-bold transition-all duration-200 pointer-events-none text-center ${
                    isHovered ? 'fill-admin-primary font-black' : 'fill-admin-text-secondary'
                  }`}
                  textAnchor="middle"
                >
                  {month.monthName}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div 
            className="absolute bg-admin-surface border border-admin-border rounded-xl p-3 shadow-xl pointer-events-none transition-all duration-200 ease-out"
            style={{
              left: `${Math.min(
                Math.max(20, (hoveredIndex * colWidth) + paddingLeft + colWidth / 2 - 80),
                chartWidth - 100
              )}px`,
              top: `${paddingTop}px`,
            }}
          >
            <p className="text-xs font-bold text-admin-text mb-2 text-center">
              {data[hoveredIndex].monthName} / {data[hoveredIndex].year}
            </p>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-admin-text-secondary">Cadastrados:</span>
                <span className="font-bold text-admin-primary">{data[hoveredIndex].newUsers}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-admin-text-secondary">Assinantes PRO:</span>
                <span className="font-bold text-admin-success">{data[hoveredIndex].paidUsers}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
