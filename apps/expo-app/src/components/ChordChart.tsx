import { FunctionComponent } from "react";
import { View } from "react-native";

import Svg, { Circle, Line, Rect, Text } from "react-native-svg";

interface Props {
  height?: number;
  width?: number;
  chord: string[];
  showTuning?: boolean;
  tuning?: string[];
}
const ChordChart: FunctionComponent<Props> = props => {
  const width = 100;
  const height = 120;
  const showTuning = false;
  const tuning = ["E", "A", "D", "G", "B", "E"];

  let { chord } = props;

  if (chord === null || chord === undefined || chord.length <= 0) {
    chord = ["x", "x", "x", "x", "x", "x"];
  }

  let fretPosition = 0;
  let lower = 100;

  chord.forEach(c => {
    if (c !== "x") {
      if (parseInt(c) < lower) lower = parseInt(c);
    }
  });

  const normalizedChord = chord.slice();
  if (lower === 100) {
    fretPosition = 0;
  } else if (lower >= 3) {
    fretPosition = lower;
    for (let i = 0; i < chord.length; i++) {
      normalizedChord[i] =
        chord[i] === "x" ? "x" : (parseInt(chord[i]) - (lower - 1)).toString();
    }
  }
  const barres: { from: number; to: number; fret: number }[] = [
    // { from: 6, to: 1, fret: 1 },
    // { from: 4, to: 5, fret: 4 },
  ];

  const tuningContainerHeight = 20;
  const chartWidth = width * 0.75;
  let chartHeight: number;
  if (showTuning) {
    chartHeight = height * 0.75 - tuningContainerHeight;
  } else {
    chartHeight = height * 0.75;
  }

  const circleRadius = chartWidth / 15;
  const bridgeStrokeWidth = Math.ceil(chartHeight / 36);
  const fontSize = Math.ceil(chartWidth / 8);
  const numStrings = chord.length;
  const numFrets = 5;

  const fretWidth = 1;
  const stringWidth = 1;

  const defaultColor = "#666";
  const strokeWidth = 1;

  const stringSpacing = chartWidth / numStrings;

  // Add room on sides for finger positions on 1. and 6. string
  const chartXPos = width - chartWidth;
  let chartYPos: number;
  if (showTuning) chartYPos = height - chartHeight - tuningContainerHeight;
  else chartYPos = height - chartHeight;

  const fretLabelTextWidth = 10;

  //start draw func
  const fretSpacing = chartHeight / numFrets;

  const drawText = (x: number, y: number, msg: string) => {
    return (
      <Text
        key={"text-" + x + y + msg}
        fill={defaultColor}
        stroke={defaultColor}
        fontSize={fontSize}
        x={x}
        y={y}
        textAnchor="middle">
        {msg}
      </Text>
    );
  };

  const lightUp = (stringNum: number, fret: string) => {
    const mute = fret === "x";
    const fretNum = fret === "x" ? 0 : parseInt(fret);

    const x = chartXPos + stringSpacing * stringNum;
    const y1 = chartYPos + fretSpacing * fretNum - fretSpacing / 2;

    const stringIsLoose = fretNum === 0;
    if (!mute && !stringIsLoose) {
      return (
        <Circle
          key={"finger-" + stringNum}
          cx={x}
          cy={y1}
          r={circleRadius}
          strokeWidth={strokeWidth}
          stroke={defaultColor}
          fill={defaultColor}
        />
      );
    }
  };

  const lightBar = (stringFrom: number, stringTo: number, fretNum: number) => {
    const stringFromNum = numStrings - stringFrom;
    const stringToNum = numStrings - stringTo;

    const y1 = chartYPos + fretSpacing * (fretNum - 1) + fretSpacing / 2;
    return (
      <Line
        strokeWidth={circleRadius * 2}
        strokeLinecap={"round"}
        stroke={defaultColor}
        x1={chartXPos + stringSpacing * stringFromNum}
        y1={y1}
        x2={chartXPos + stringSpacing * stringToNum}
        y2={y1}
      />
    );
  };

  return (
    <View
      style={[
        { height: props.height, width: props.width },
        { alignItems: "center", justifyContent: "center" },
      ]}>
      <Svg height={props.height} width={props.width}>
        {
          // Draw guitar bridge
          fretPosition <= 1 ? (
            <Rect
              fill={defaultColor}
              width={chartWidth - stringSpacing}
              height={bridgeStrokeWidth}
              x={chartXPos}
              y={chartYPos}
            />
          ) : (
            // Draw fret position
            drawText(
              chartXPos - fretLabelTextWidth,
              chartYPos + fontSize - fretWidth + (fretSpacing - fontSize) / 2,
              `${fretPosition}º`
            )
          )
        }
        {
          // Draw strings
          Array.from(Array(numStrings)).map((s, stringIndex) => {
            return (
              <Line
                key={"string-" + stringIndex}
                strokeWidth={stringWidth}
                stroke={defaultColor}
                x1={chartXPos + stringSpacing * stringIndex}
                y1={chartYPos}
                x2={chartXPos + stringSpacing * stringIndex}
                y2={chartYPos + fretSpacing * numFrets}
              />
            );
          })
        }
        {
          // Draw frets
          Array.from(Array(numFrets)).map((f, fretIndex) => {
            return (
              <Line
                key={"fret-" + fretIndex}
                strokeWidth={fretWidth}
                stroke={defaultColor}
                x1={chartXPos}
                y1={chartYPos + fretSpacing * fretIndex}
                x2={chartXPos + stringSpacing * (numStrings - 1)}
                y2={chartYPos + fretSpacing * fretIndex}
              />
            );
          })
        }
        {
          // Draw mute and loose strings icons
          normalizedChord.map((c, iconIndex) => {
            if (c === "x") {
              return drawText(
                chartXPos + stringSpacing * iconIndex,
                chartYPos - fontSize,
                "X"
              );
            } else if (c === "0") {
              return (
                <Circle
                  key={"circle-" + iconIndex}
                  cx={chartXPos + stringSpacing * iconIndex}
                  cy={chartYPos - fontSize - circleRadius}
                  r={circleRadius}
                  strokeWidth={strokeWidth}
                  stroke={defaultColor}
                  fill="none"
                />
              );
            }
          })
        }
        {
          // Draw finger circles
          normalizedChord.map((c, fingerIndex) => {
            return lightUp(fingerIndex, c);
          })
        }
        {
          // Draw barres
          barres.map(barre => {
            return lightBar(barre.from, barre.to, barre.fret);
          })
        }

        {
          // Draw tuning
          showTuning &&
            tuning.length === numStrings &&
            tuning.map((t, tuningIndex) => {
              return drawText(
                chartXPos + stringSpacing * tuningIndex,
                chartYPos + chartHeight + fontSize,
                t
              );
            })
        }
      </Svg>
    </View>
  );
};
export default ChordChart;
