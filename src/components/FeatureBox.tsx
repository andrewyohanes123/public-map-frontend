import { FC, ReactElement, useMemo } from "react";
import { Box, Sx, Text } from "@mantine/core";
import { Geometry } from "geojson";
import { area, polygon } from "@turf/turf";

interface props {
  name: string;
  isFirst?: boolean;
  coordinates: Geometry;
  totalArea: number;
}

const sx: Sx = (theme) => {
  return {
    borderRadius: theme.radius.md,
    background: theme.colors.dark[7],
    padding: theme.spacing.md,
  };
};

const FeatureBox: FC<props> = ({
  name,
  isFirst = false,
  coordinates,
  totalArea,
}): ReactElement => {
  const areaOfDamage = useMemo(() => {
    // @ts-ignore
    const polygonArea = polygon(coordinates.coordinates);
    console.log(coordinates, polygonArea);
    const surface = area(polygonArea);
    return Math.round(Math.round(surface * 100) / 100) / 10000;
  }, [coordinates]);

  const damagedAreaPercentage = useMemo(() => {
    return (areaOfDamage / totalArea) * 100;
  }, [areaOfDamage, totalArea]);

  return (
    <Box p="md" my="xs" sx={sx}>
      <Text sx={(theme) => ({ color: theme.white })} weight={700}>
        {name}
      </Text>
      <Text sx={(theme) => ({ color: theme.white })}>
        Luar Area: {areaOfDamage} Ha
      </Text>
      <Text sx={(theme) => ({ color: theme.white })}>
        Jumlah Kerusakan {damagedAreaPercentage.toFixed(2)}%
      </Text>
      {/* {!isFirst && <NumberInput min={0} placeholder="Jumlah kerusakan" />} */}
    </Box>
  );
};

export default FeatureBox;
