import { useRef, useCallback } from "react";
import { ScrollView, View, Platform, findNodeHandle } from "react-native";
import { useRouter } from "expo-router";
import { Header, Hero, Skills, Projects, Contact, Footer } from "@/components";

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: View | null }>({});

  const handleNavigate = useCallback(
    (sectionId: string) => {
      // Handle routing to other pages
      if (sectionId === "all-projects") {
        router.push("/projects");
        return;
      }

      // Handle smooth scroll for sections on this page
      if (Platform.OS === "web") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        const sectionRef = sectionRefs.current[sectionId];
        if (sectionRef && scrollViewRef.current) {
          sectionRef.measureLayout(
            findNodeHandle(scrollViewRef.current) as number,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y, animated: true });
            },
            () => {}
          );
        }
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
    <View className="flex-1 bg-background">
      {/* Fixed Header */}
      <Header onNavigate={handleNavigate} />

      {/* Scrollable Content */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View
          ref={(ref) => (sectionRefs.current["hero"] = ref)}
          nativeID="hero"
        >
          <Hero onNavigate={handleNavigate} />
        </View>

        {/* Skills Section */}
        <View
          ref={(ref) => (sectionRefs.current["skills"] = ref)}
          nativeID="skills"
        >
          <Skills />
        </View>

        {/* Projects Section */}
        <View
          ref={(ref) => (sectionRefs.current["projects"] = ref)}
          nativeID="projects"
        >
          <Projects
            onProjectPress={handleProjectPress}
            onViewAllPress={handleViewAllProjects}
          />
        </View>

        {/* Contact Section */}
        <View
          ref={(ref) => (sectionRefs.current["contact"] = ref)}
          nativeID="contact"
        >
          <Contact />
        </View>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />
      </ScrollView>
    </View>
  );
}
