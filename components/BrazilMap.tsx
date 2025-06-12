'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';

// Define type for polygon data context
interface PolygonDataContext extends GeoJSONProperties {
  playerCount?: number;
}
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import brazilGeoJSON from '@/public/maps/brazilLow.json';
import { mockStatePlayerCounts, StatePlayerCount } from '@/lib/mockStateData';
import { colorPalette, getColorForPlayerCount } from '@/lib/colorPalette';

// Type assertion for the polygon data item
declare module '@amcharts/amcharts4/maps' {
  interface MapPolygon {
    dataItem: any;
  }
}

type GeoJSONProperties = {
  name: string;
  id: string;
  CNTRY: string;
  TYPE: string;
  hoverColor?: string;
  [key: string]: string | number | undefined;
};

type GeoJSONData = {
  type: string;
  features: Array<{
    type: string;
    properties: GeoJSONProperties;
    id: string;
    geometry: any; 
  }>;
};

const typedGeoJSON = brazilGeoJSON as unknown as GeoJSONData;

const maxPlayerCount = Math.max(...mockStatePlayerCounts.map(s => s.playerCount));

// Create color mapping using the new palette
const stateColorMapping: Record<string, string> = mockStatePlayerCounts.reduce((acc, state: StatePlayerCount) => {
  acc[state.stateCode] = getColorForPlayerCount(state.playerCount, maxPlayerCount);
  return acc;
}, {} as Record<string, string>);

export default function BrazilMap() {
  const chartRef = useRef<am4maps.MapChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStateName, setSelectedStateName] = useState<string>('Nenhum estado selecionado');
  const [selectedCategory, setSelectedCategory] = useState<string>('1.16rsg');
  const [warningVisible, setWarningVisible] = useState<boolean>(true);

  const updateStateData = useCallback(() => {
    console.log(`Getting data for state: ${selectedStateName} and category: ${selectedCategory}`);
  }, [selectedStateName, selectedCategory]);

  useEffect(() => {
    if (selectedStateName !== 'Nenhum estado selecionado' || selectedCategory !== '1.16rsg') {
      updateStateData();
    }
  }, [selectedStateName, selectedCategory, updateStateData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    am4core.useTheme(am4themes_animated);

    try {
      const chart = am4core.create('chartdiv', am4maps.MapChart);
      chartRef.current = chart;

      chart.geodata = typedGeoJSON;
      chart.projection = new am4maps.projections.Miller();

      chart.seriesContainer.draggable = true;
      chart.seriesContainer.resizable = true;

      chart.background.fill = am4core.color('#000000');
      chart.chartContainer.background.fill = am4core.color('#000000');
      chart.chartContainer.background.fillOpacity = 1;

      chart.maxZoomLevel = 6;
      chart.minZoomLevel = 0.5;
      chart.chartContainer.wheelable = true;

      chart.seriesContainer.events.disableType('doublehit');
      chart.chartContainer.background.events.disableType('doublehit');

      const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;

      const polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.stroke = am4core.color('#ffffff');
      polygonTemplate.strokeWidth = 2;

      const hoverState = polygonTemplate.states.create('hover');
      hoverState.properties.fill = am4core.color('#bed2e8');

      polygonTemplate.events.on('hit', (event) => {
        const data = event.target.dataItem.dataContext as GeoJSONProperties;
        setSelectedStateName(data.name);
      });

      polygonSeries.events.on("inited", function () {
        polygonSeries.mapPolygons.each(function (polygon: am4maps.MapPolygon) {
          const stateId = (polygon.dataItem.dataContext as GeoJSONProperties).id;
          if (stateColorMapping.hasOwnProperty(stateId)) {
            const color = stateColorMapping[stateId];
            polygon.fill = am4core.color(color);
            (polygon as any)._originalFill = am4core.color(color);
          }
        });

        polygonTemplate.events.on('inited', (ev) => {
          const polygon = ev.target;
          const stateCode = polygon.dataItem.dataContext.id;
          const playerCount = mockStatePlayerCounts.find(s => s.stateCode === stateCode)?.playerCount || 0;
          polygon.dataItem.dataContext.playerCount = playerCount;
        });
      });

      polygonTemplate.events.on('out', (event) => {
        const polygon = event.target;
        if ((polygon as any)._originalFill) {
          polygon.fill = (polygon as any)._originalFill;
        } else {
          polygon.fill = am4core.color('#367B25');
        }
      });

    } catch (e: any) {
      console.error('Error initializing map:', e);
      setError('Não foi possível carregar o mapa.');
    }

    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-screen box-border flex flex-col bg-black">
      <div id="chartdiv" className="flex-1 w-full overflow-hidden" />
    </div>
  );
}
