import React from "react";
import { View, Text, Pressable, Image, Platform, Linking } from "react-native";
import { useResponsive } from "@/hooks";
import { PROJECTS } from "@/constants";

interface ProjectsProps {
  onProjectPress?: (projectId: string) => void;
  onViewAllPress?: () => void;
}

export function Projects({ onProjectPress, onViewAllPress }: ProjectsProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridCols = () => {
    if (isDesktop) return "flex-row flex-wrap";
    if (isTablet) return "flex-row flex-wrap";
    return "flex-col";
  };

  const getCardWidth = () => {
    if (isDesktop) return "w-[calc(33.333%-16px)]";
    if (isTablet) return "w-[calc(50%-8px)]";
    return "w-full";
  };

  const handleLinkPress = (url?: string) => {
    if (!url) return;
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View id="projects" className="bg-background-secondary py-16 md:py-24">
      <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <View className="mb-10 md:mb-12 flex flex-row justify-between items-start">
          <View className="flex-1">
            <Text
              className={`text-text-primary font-bold mb-3 ${
                isMobile ? "text-2xl" : "text-3xl"
              }`}
            >
              Featured Projects
            </Text>
            <Text className="text-text-secondary text-base md:text-lg max-w-2xl">
              A selection of projects I've built to demonstrate my skills and solve
              real-world problems.
            </Text>
          </View>

          {!isMobile && (
            <Pressable
              onPress={onViewAllPress}
              className="flex flex-row items-center gap-1 active:opacity-70"
            >
              <Text className="text-primary text-sm font-medium">View all</Text>
              <Text className="text-primary">→</Text>
            </Pressable>
          )}
        </View>

        {/* Projects Grid */}
        <View className={`${getGridCols()} gap-4 md:gap-6`}>
          {/* TODO: Update projects in constants/data.ts */}
          {PROJECTS.map((project) => (
            <Pressable
              key={project.id}
              onPress={() => onProjectPress?.(project.id)}
              className={`${getCardWidth()} bg-background rounded-xl overflow-hidden border border-background-tertiary/30 active:opacity-90`}
            >
              {/* Project Image */}
              <View className="w-full aspect-video bg-background-tertiary">
                <Image
                  source={{ uri: project.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Project Content */}
              <View className="p-4 md:p-5">
                {/* TODO: Update project title */}
                <Text className="text-text-primary font-semibold text-lg mb-2">
                  {project.title}
                </Text>

                {/* TODO: Update project description */}
                <Text
                  className="text-text-secondary text-sm mb-4 leading-relaxed"
                  numberOfLines={3}
                >
                  {project.description}
                </Text>

                {/* Tech Tags */}
                <View className="flex flex-row flex-wrap gap-2 mb-4">
                  {/* TODO: Update project technologies */}
                  {project.technologies.map((tech, index) => (
                    <View
                      key={`${project.id}-tech-${index}`}
                      className="bg-primary/10 px-2.5 py-1 rounded"
                    >
                      <Text className="text-primary text-xs font-medium">
                        {tech}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Links */}
                <View className="flex flex-row gap-3">
                  {project.liveUrl && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLinkPress(project.liveUrl);
                      }}
                      className="flex flex-row items-center gap-1 active:opacity-70"
                    >
                      <Text className="text-text-secondary text-sm">Live</Text>
                      <Text className="text-text-secondary">↗</Text>
                    </Pressable>
                  )}
                  {project.githubUrl && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLinkPress(project.githubUrl);
                      }}
                      className="flex flex-row items-center gap-1 active:opacity-70"
                    >
                      <Text className="text-text-secondary text-sm">GitHub</Text>
                      <Text className="text-text-secondary">↗</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Mobile View All */}
        {isMobile && (
          <Pressable
            onPress={onViewAllPress}
            className="mt-6 flex flex-row items-center justify-center gap-1 active:opacity-70"
          >
            <Text className="text-primary text-sm font-medium">View all projects</Text>
            <Text className="text-primary">→</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default Projects;
