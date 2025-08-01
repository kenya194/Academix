import React from "react";
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Svg, {
  Polygon,
  Circle,
  Text as SvgText,
  Line,
  Path,
  Rect,
  G,
} from "react-native-svg";

export const RadarChart = ({
  data,
  containerWidth = "100%",
  containerHeight = 220,
  levels = 5,
  fillColor = "rgba(100, 150, 255, 0.4)",
  strokeColor = "rgba(100, 150, 255, 1)",
}) => {
  // Calculate size based on container dimensions
  const chartSize = Math.min(
    Dimensions.get("window").width * 1 * 1, // 90% of chartArea width
    containerHeight * 0.9 // 90% of chartArea height
  );

  const maxValue = Math.max(...data.map((item) => item.value));
  const angleSlice = (Math.PI * 2) / data.length;

  const polarToCartesian = (angle, radius) => ({
    x: chartSize / 2 + radius * Math.cos(angle - Math.PI / 2),
    y: chartSize / 2 + radius * Math.sin(angle - Math.PI / 2),
  });

  const points = data.map((item, i) => {
    const radius = (item.value / maxValue) * (chartSize / 2);
    return polarToCartesian(angleSlice * i, radius);
  });

  return (
    <View
      style={{
        width: containerWidth,
        height: containerHeight,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <Svg height={chartSize} width={chartSize}>
        {/* Background grid */}
        {[...Array(levels)].map((_, level) => (
          <Circle
            key={`level-${level}`}
            cx={chartSize / 2}
            cy={chartSize / 2}
            r={((level + 1) * chartSize) / (2 * levels)}
            fill="none"
            stroke="rgba(0, 0, 0, 0.1)"
            strokeWidth={0.5}
          />
        ))}

        {/* Axes */}
        {data.map((_, i) => {
          const { x, y } = polarToCartesian(angleSlice * i, chartSize / 2);
          return (
            <Line
              key={`axis-${i}`}
              x1={chartSize / 2}
              y1={chartSize / 2}
              x2={x}
              y2={y}
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth={1}
            />
          );
        })}

        {data.map((item, i) => {
          const labelRadius = chartSize / 2 + -3; // Adjust this value for label position
          const { x, y } = polarToCartesian(angleSlice * i, labelRadius);

          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y}
              fill="#333"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle" // Better vertical centering
            >
              {item.label}
            </SvgText>
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export const LineChart = ({
  data,
  width = Dimensions.get("window").width * 0.8,
  height = 220,
  color = "#4CAF50",
  showPoints = true,
}) => {
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate scales
  const maxValue = Math.max(...data.map((item) => item.value));
  const xScale = chartWidth / (data.length - 1);
  const yScale = chartHeight / maxValue;

  // Create path data
  let path = `M${padding} ${height - padding - data[0].value * yScale}`;
  data.forEach((item, i) => {
    path += ` L${padding + i * xScale} ${
      height - padding - item.value * yScale
    }`;
  });

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        <G>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <Line
              key={`grid-${ratio}`}
              x1={padding}
              y1={height - padding - chartHeight * ratio}
              x2={width - padding}
              y2={height - padding - chartHeight * ratio}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
          ))}
        </G>

        {/* Line path */}
        <Path d={path} fill="none" stroke={color} strokeWidth="2" />

        {/* Data points */}
        {showPoints &&
          data.map((item, i) => (
            <Circle
              key={`point-${i}`}
              cx={padding + i * xScale}
              cy={height - padding - item.value * yScale}
              r="4"
              fill={color}
            />
          ))}

        {/* X-axis labels */}
        {data.map((item, i) => (
          <SvgText
            key={`label-${i}`}
            x={padding + i * xScale}
            y={height - 5}
            fontSize="10"
            textAnchor="middle"
          >
            {item.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

export const HeatmapChart = ({ 
  data = [],
  colorRange = ['#ffcccc', '#ff9999', '#ff6666', '#ff0000'],
  containerWidth = '100%',
  fixedHeight = 220 // Add fixed height prop
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

  // Calculate dimensions
  const calculatedWidth = typeof containerWidth === 'string' ? 
    windowWidth * 0.8 : // Match your chartArea width
    containerWidth;
  
  // Fixed cell size calculation
  const maxCellSize = 30;
  const cellSize = Math.min(
    maxCellSize,
    (calculatedWidth - 20) / months.length // Reduced padding
  );

  // Calculate required height
  const requiredHeight = weeks.length * cellSize + 50; // 50 for headers/space

  // Adjust cell size if needed to fit fixed height
  const finalCellSize = fixedHeight && (requiredHeight > fixedHeight) ? 
    (fixedHeight - 50) / weeks.length :
    cellSize;

  // Process data
  const gridData = weeks.map((_, weekIndex) => 
    months.map(month => {
      const day = data.find(d => d.month === month && d.week === weekIndex + 1);
      return day ? Number(day.absences) || 0 : 0;
    })
  );

  const maxAbsences = Math.max(1, ...gridData.flat());

  const getColor = (value) => {
    const ratio = value / maxAbsences;
    const colorIndex = Math.min(
      Math.floor(ratio * (colorRange.length - 1)),
      colorRange.length - 1
    );
    return colorRange[colorIndex];
  };

  // Final dimensions
  const svgWidth = months.length * finalCellSize + 20;
  const svgHeight = fixedHeight ? fixedHeight - 30 : weeks.length * finalCellSize + 50;

  if (!data?.length) {
    return (
      <View style={[styles.container, { width: calculatedWidth, height: fixedHeight }]}>
        <Text>No attendance data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      width: calculatedWidth, 
      height: fixedHeight // Constrain height
    }]}>
      <Text style={styles.title}>Monthly Attendance Heatmap</Text>
      
      <View style={{
        width: svgWidth,
        height: svgHeight - 30, // Account for title
        overflow: 'hidden' // Prevent overflow
      }}>
        <Svg width={svgWidth} height={svgHeight}>
          {/* Month headers */}
          {months.map((month, col) => (
            <SvgText
              key={`month-${col}`}
              x={10 + col * finalCellSize + finalCellSize/2}
              y={8}
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              {month}
            </SvgText>
          ))}

          {/* Week headers */}
          {weeks.map((week, row) => (
            <SvgText
              key={`week-${row}`}
              x={8}
              y={20 + row * finalCellSize + finalCellSize/2}
              fontSize="10"
              fontWeight="bold"
              textAnchor="end"
            >
              {week}
            </SvgText>
          ))}

          {/* Cells */}
          {gridData.map((week, row) => 
            week.map((absences, col) => (
              <G 
                key={`cell-${row}-${col}`} 
                x={10 + col * finalCellSize} 
                y={20 + row * finalCellSize}
              >
                <Rect
                  width={finalCellSize - 2}
                  height={finalCellSize - 2}
                  fill={getColor(absences)}
                  stroke="#fff"
                  rx={3}
                />
                <SvgText
                  x={finalCellSize/2}
                  y={finalCellSize/2 + 4}
                  fontSize="8"
                  fill={absences > maxAbsences/2 ? '#fff' : '#333'}
                  textAnchor="middle"
                >
                  {absences}
                </SvgText>
              </G>
            ))
          )}
        </Svg>
      </View>

      {/* Compact legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Fewer</Text>
        {colorRange.map((color, i) => (
          <View 
            key={`legend-${i}`} 
            style={[styles.legendItem, { 
              backgroundColor: color,
              width: 15,
              height: 15
            }]} 
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    marginHorizontal: 2,
  },
  legendLabel: {
    fontSize: 9,
    marginHorizontal: 3,
  }
});

export default RadarChart;
