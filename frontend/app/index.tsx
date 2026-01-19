import { useRef, useCallback, useState } from "react";
import { ScrollView, View, LayoutChangeEvent, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Header, Hero, Skills, Projects, Contact, Footer } from "@/components";
import { useProjects, useSkills, useAppFocus } from "@/hooks";

// Type for storing measured section positions
type SectionPositions = {
  [key: string]: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Data fetching hooks
  const {
    projects,
    isLoading: projectsLoading,
    refetch: refetchProjects,
  } = useProjects();
  const {
    categories,
    isLoading: skillsLoading,
    refetch: refetchSkills,
  } = useSkills();

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([refetchProjects(), refetchSkills()]);
  }, [refetchProjects, refetchSkills]);

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // Refetch data when app comes to foreground
  useAppFocus(refreshData);

  // Use ref for positions to avoid stale closure issues
  const sectionPositionsRef = useRef<SectionPositions>({
    hero: 0,
    skills: 0,
    projects: 0,
    contact: 0,
  });

  // Handler to measure section position when it renders
  const handleSectionLayout = useCallback(
    (sectionId: string) => (event: LayoutChangeEvent) => {
      const { y } = event.nativeEvent.layout;
      sectionPositionsRef.current[sectionId] = y;
    },
    []
  );

  const handleNavigate = useCallback(
    (sectionId: string) => {
      // Handle routing to other pages
      if (sectionId === "all-projects") {
        router.push("/projects");
        return;
      }

      // Use measured positions from onLayout for scrolling (works on both web and native)
      const position = sectionPositionsRef.current[sectionId];
      if (position !== undefined) {
        scrollViewRef.current?.scrollTo({ y: position, animated: true });
      }
    },
    [router]
  );

  const handleProjectPress = useCallback(
    (projectId: string) => {
      router.push(`/projects/${projectId}`);
    },
    [router]
  );

  const handleViewAllProjects = useCallback(() => {
    router.push("/projects");
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Fixed Header */}
      <Header onNavigate={handleNavigate} />

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        }
      >
        {/* Hero Section */}
        <View nativeID="hero" onLayout={handleSectionLayout("hero")}>
          <Hero onNavigate={handleNavigate} />
        </View>

        {/* Skills Section */}
        <View nativeID="skills" onLayout={handleSectionLayout("skills")}>
          <Skills
            externalCategories={categories}
            externalIsLoading={skillsLoading}
          />
        </View>

        {/* Projects Section */}
        <View nativeID="projects" onLayout={handleSectionLayout("projects")}>
          <Projects
            onProjectPress={handleProjectPress}
            onViewAllPress={handleViewAllProjects}
            externalProjects={projects}
            externalIsLoading={projectsLoading}
          />
        </View>

        {/* Contact Section */}
        <View nativeID="contact" onLayout={handleSectionLayout("contact")}>
          <Contact />
        </View>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </ScrollView>
    </SafeAreaView>
  );
}
