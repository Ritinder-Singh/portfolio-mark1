import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useResponsive, useProjects } from "@/hooks";
import { SITE_CONFIG } from "@/constants";

export default function AllProjectsScreen() {
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { projects, isLoading } = useProjects();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Extract unique technologies from all projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on selected technology
  const filteredProjects = useMemo(() => {
    if (!selectedFilter) return projects;
    return projects.filter((project) =>
      project.technologies.includes(selectedFilter)
    );
  }, [selectedFilter, projects]);

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
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="bg-background border-b border-background-tertiary/30">
        <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <View className="flex flex-row items-center justify-between h-16 md:h-20">
            {/* Back Button + Logo */}
            <View className="flex flex-row items-center gap-4">
              <Pressable
                onPress={() => router.back()}
                className="flex flex-row items-center gap-1 active:opacity-70"
              >
                <Text className="text-text-secondary text-lg">←</Text>
                <Text className="text-text-secondary text-sm">Back</Text>
              </Pressable>

              <Pressable onPress={() => router.push("/")}>
                <Text className="text-primary font-mono text-lg md:text-xl font-semibold">
                  {SITE_CONFIG.logo}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Page Header */}
          <View className="mb-8 md:mb-10">
            <Text
              className={`text-text-primary font-bold mb-3 ${
                isMobile ? "text-2xl" : "text-3xl"
              }`}
            >
              All Projects
            </Text>
            <Text className="text-text-secondary text-base md:text-lg max-w-2xl">
              Browse all my projects. Filter by technology to find specific types
              of work.
            </Text>
          </View>

          {/* Filter Buttons */}
          <View className="mb-8">
            <Text className="text-text-secondary text-sm mb-3">
              Filter by technology:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              <Pressable
                onPress={() => setSelectedFilter(null)}
                className={`mr-2 px-4 py-2 rounded-lg border ${
                  selectedFilter === null
                    ? "bg-primary border-primary"
                    : "bg-transparent border-background-tertiary"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedFilter === null ? "text-background" : "text-text-secondary"
                  }`}
                >
                  All
                </Text>
              </Pressable>

              {allTechnologies.map((tech) => (
                <Pressable
                  key={tech}
                  onPress={() => setSelectedFilter(tech)}
                  className={`mr-2 px-4 py-2 rounded-lg border ${
                    selectedFilter === tech
                      ? "bg-primary border-primary"
                      : "bg-transparent border-background-tertiary"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedFilter === tech
                        ? "text-background"
                        : "text-text-secondary"
                    }`}
                  >
                    {tech}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Results Count */}
          <Text className="text-text-secondary text-sm mb-6">
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
            {selectedFilter && ` using ${selectedFilter}`}
          </Text>

          {/* Loading State */}
          {isLoading && projects.length === 0 && (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          )}

          {/* Projects Grid */}
          <View className={`${getGridCols()} gap-4 md:gap-6`}>
            {filteredProjects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() => router.push(`/projects/${project.id}`)}
                className={`${getCardWidth()} bg-background-secondary rounded-xl overflow-hidden border border-background-tertiary/30 active:opacity-90`}
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
                  <Text className="text-text-primary font-semibold text-lg mb-2">
                    {project.title}
                  </Text>

                  <Text
                    className="text-text-secondary text-sm mb-4 leading-relaxed"
                    numberOfLines={3}
                  >
                    {project.description}
                  </Text>

                  {/* Tech Tags */}
                  <View className="flex flex-row flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <View
                        key={`${project.id}-tech-${index}`}
                        className={`px-2.5 py-1 rounded ${
                          selectedFilter === tech
                            ? "bg-primary"
                            : "bg-primary/10"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            selectedFilter === tech
                              ? "text-background"
                              : "text-primary"
                          }`}
                        >
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

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <View className="py-12 items-center">
              <Text className="text-text-secondary text-lg mb-2">
                No projects found
              </Text>
              <Pressable onPress={() => setSelectedFilter(null)}>
                <Text className="text-primary">Clear filter</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
