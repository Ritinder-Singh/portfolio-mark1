import React from "react";
import { View, Text } from "react-native";
import { useResponsive } from "@/hooks";
import { SKILL_CATEGORIES } from "@/constants";

// Icon components for skill categories
function CodeIcon() {
  return (
    <Text className="text-primary text-xl">{"</>"}</Text>
  );
}

function LayoutIcon() {
  return (
    <View className="w-5 h-5 border-2 border-primary rounded">
      <View className="w-full h-1/3 border-b border-primary" />
    </View>
  );
}

function ServerIcon() {
  return (
    <View className="w-5 h-5">
      <View className="w-full h-2 bg-primary rounded-t mb-0.5" />
      <View className="w-full h-2 bg-primary rounded-b" />
    </View>
  );
}

function ToolIcon() {
  return (
    <Text className="text-primary text-lg">⚙</Text>
  );
}

function getCategoryIcon(iconName: string) {
  switch (iconName) {
    case "code":
      return <CodeIcon />;
    case "layout":
      return <LayoutIcon />;
    case "server":
      return <ServerIcon />;
    case "tool":
      return <ToolIcon />;
    default:
      return <CodeIcon />;
  }
}

export function Skills() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridCols = () => {
    if (isDesktop) return "flex-row flex-wrap";
    if (isTablet) return "flex-row flex-wrap";
    return "flex-col";
  };

  const getCardWidth = () => {
    if (isDesktop) return "w-[calc(25%-12px)]";
    if (isTablet) return "w-[calc(50%-8px)]";
    return "w-full";
  };

  return (
    <View id="skills" className="bg-background py-16 md:py-24">
      <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <View className="mb-10 md:mb-12">
          <Text
            className={`text-text-primary font-bold mb-3 ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}
          >
            Technical Arsenal
          </Text>
          <Text className="text-text-secondary text-base md:text-lg max-w-2xl">
            Technologies and tools I've worked with during my academic journey and
            personal projects.
          </Text>
        </View>

        {/* Skills Grid */}
        <View className={`${getGridCols()} gap-4`}>
          {/* TODO: Update skills in constants/data.ts */}
          {SKILL_CATEGORIES.map((category) => (
            <View
              key={category.id}
              className={`${getCardWidth()} bg-background-secondary rounded-xl p-5 md:p-6 border border-background-tertiary/30`}
            >
              {/* Category Header */}
              <View className="flex flex-row items-center gap-3 mb-4">
                <View className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(category.icon)}
                </View>
                <Text className="text-text-primary font-semibold text-base">
                  {category.title}
                </Text>
              </View>

              {/* Skills Tags */}
              <View className="flex flex-row flex-wrap gap-2">
                {/* TODO: Update individual skills */}
                {category.skills.map((skill, index) => (
                  <View
                    key={`${category.id}-${index}`}
                    className="bg-background px-3 py-1.5 rounded-lg border border-background-tertiary/50"
                  >
                    <Text className="text-text-secondary text-sm">
                      {skill.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Skills;
