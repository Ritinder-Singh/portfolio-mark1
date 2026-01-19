import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useResponsive } from "@/hooks";
import { PROJECTS, SITE_CONFIG } from "@/constants";

// TODO: Future enhancements for rich project detail pages:
// - Add "challenges" field: string describing the challenges faced
// - Add "approach" field: string describing your solution approach
// - Add "features" field: string[] list of key features
// - Add "screenshots" field: string[] array of additional image URLs for gallery
// - Add "results" field: string describing impact/metrics
// - Add "relatedProjects" field: string[] array of related project IDs

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Find the project by ID
  const project = PROJECTS.find((p) => p.id === id);

  const handleLinkPress = (url?: string) => {
    if (!url) return;
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  // 404 state
  if (!project) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={["top"]}>
        <Text className="text-text-primary text-2xl font-bold mb-4">
          Project not found
        </Text>
        <Pressable
          onPress={() => router.push("/projects")}
          className="px-6 py-3 bg-primary rounded-lg"
        >
          <Text className="text-background font-semibold">View all projects</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

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

            {/* View All Projects Link */}
            <Pressable
              onPress={() => router.push("/projects")}
              className="flex flex-row items-center gap-1 active:opacity-70"
            >
              <Text className="text-text-secondary text-sm">All Projects</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Hero Image */}
          <View className="w-full aspect-video bg-background-secondary rounded-xl overflow-hidden mb-8">
            <Image
              source={{ uri: project.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Project Title */}
          <Text
            className={`text-text-primary font-bold mb-4 ${
              isMobile ? "text-2xl" : "text-4xl"
            }`}
          >
            {project.title}
          </Text>

          {/* Tech Stack */}
          <View className="flex flex-row flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <View
                key={`${project.id}-tech-${index}`}
                className="bg-primary/10 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-primary text-sm font-medium">{tech}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="flex flex-row gap-3 mb-8">
            {project.liveUrl && (
              <Pressable
                onPress={() => handleLinkPress(project.liveUrl)}
                className="px-6 py-3 bg-primary rounded-lg flex flex-row items-center gap-2 active:opacity-80"
              >
                <Text className="text-background font-semibold">View Live</Text>
                <Text className="text-background">↗</Text>
              </Pressable>
            )}
            {project.githubUrl && (
              <Pressable
                onPress={() => handleLinkPress(project.githubUrl)}
                className="px-6 py-3 border border-text-secondary rounded-lg flex flex-row items-center gap-2 active:opacity-70"
              >
                <Text className="text-text-primary font-semibold">
                  View Source
                </Text>
                <Text className="text-text-primary">↗</Text>
              </Pressable>
            )}
          </View>

          {/* Divider */}
          <View className="h-px bg-background-tertiary/30 mb-8" />

          {/* Project Description */}
          <View className="mb-8">
            <Text className="text-text-primary font-semibold text-xl mb-4">
              About this project
            </Text>
            <Text className="text-text-secondary text-base leading-relaxed">
              {project.description}
            </Text>
          </View>

          {/* TODO: Add these sections when the data model is extended:

          {project.challenges && (
            <View className="mb-8">
              <Text className="text-text-primary font-semibold text-xl mb-4">
                The Challenge
              </Text>
              <Text className="text-text-secondary text-base leading-relaxed">
                {project.challenges}
              </Text>
            </View>
          )}

          {project.approach && (
            <View className="mb-8">
              <Text className="text-text-primary font-semibold text-xl mb-4">
                My Approach
              </Text>
              <Text className="text-text-secondary text-base leading-relaxed">
                {project.approach}
              </Text>
            </View>
          )}

          {project.features && project.features.length > 0 && (
            <View className="mb-8">
              <Text className="text-text-primary font-semibold text-xl mb-4">
                Key Features
              </Text>
              {project.features.map((feature, index) => (
                <View key={index} className="flex flex-row items-start gap-3 mb-2">
                  <Text className="text-primary">•</Text>
                  <Text className="text-text-secondary text-base flex-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {project.results && (
            <View className="mb-8">
              <Text className="text-text-primary font-semibold text-xl mb-4">
                Results & Impact
              </Text>
              <Text className="text-text-secondary text-base leading-relaxed">
                {project.results}
              </Text>
            </View>
          )}
          */}

          {/* Tech Stack Details */}
          <View className="mb-8">
            <Text className="text-text-primary font-semibold text-xl mb-4">
              Technologies Used
            </Text>
            <View className="flex flex-row flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <View
                  key={`detail-${project.id}-tech-${index}`}
                  className="bg-background-secondary border border-background-tertiary/30 px-4 py-2 rounded-lg"
                >
                  <Text className="text-text-primary text-sm">{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Navigation */}
          <View className="mt-12 pt-8 border-t border-background-tertiary/30">
            <View className="flex flex-row justify-between items-center">
              <Pressable
                onPress={() => router.push("/projects")}
                className="flex flex-row items-center gap-2 active:opacity-70"
              >
                <Text className="text-primary">←</Text>
                <Text className="text-primary font-medium">All Projects</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/")}
                className="flex flex-row items-center gap-2 active:opacity-70"
              >
                <Text className="text-text-secondary font-medium">Home</Text>
                <Text className="text-text-secondary">→</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
