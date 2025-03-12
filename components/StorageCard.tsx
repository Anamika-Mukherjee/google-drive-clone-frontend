"use client";

import React from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
  } from "recharts";

//component to render usage chart and total usage summary 
const StorageCard = ({totalFileSize}: {totalFileSize: number})=>{

    let totalUsedSizeInMB = totalFileSize/1000000;
    totalUsedSizeInMB = parseFloat(totalUsedSizeInMB.toFixed(2));
    const totalSpaceInMB= 50;

    let usage = (totalUsedSizeInMB/totalSpaceInMB);
    usage = parseFloat(usage.toFixed(2));
    let usagePercent = usage * 100;
    usagePercent = parseFloat(usagePercent.toFixed(2));

    //initialize the values for chart data to be displayed in radial chart
    const chartData = [
      { spaceType: "usedSpace", spaceUsed: `${usagePercent}%`, fill: "var(--color-brand)" },
      { spaceType: "totalSpace", spaceUsed: "100%", fill: "var(--color-gray-500)" }, 
    ];

    //initialize chart configuration 
    const chartConfig = {
      spaceUsed: {
          label: "Space Used",  
      },
      totalSpace: {
          label: "Total Space",  
          color: "hsl(var(--chart-1))", 
      },
      usedSpace: {
          label: "Used Space",  
          color: "hsl(var(--chart-2))",
      },
    } satisfies ChartConfig;      
    
    return(
       <>
        <div className="w-full h-auto lg:w-[500px] p-4 lg:p-0 lg:h-1/3 bg-white rounded-xl flex flex-col items-center justify-between lg:flex-row lg:justify-betweeen">
         <ChartContainer
          config={chartConfig}
          className="w-full h-[200px] lg:w-1/2 lg:h-full self-start"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={usage * 360}
            innerRadius={80}
            outerRadius={100}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-brand last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="spaceUsed" background cornerRadius={10}/>
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {chartData[0].spaceUsed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Space Used
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        <div className="w-4/5 h-1/4 lg:w-full lg:h-4/5 m-4 flex flex-col justify-center items-center bg-violet text-white rounded-xl text-base font-semibold">
            <p>Available Storage</p>
            <p>
                <span className="mr-1">{totalUsedSizeInMB}</span>
                MB&#47;
                <span>{totalSpaceInMB}</span>
                MB
            </p>
        </div>
        </div>
       </>
    );
};
 
export default StorageCard;