import "./global.css";
import { StatusBar } from "expo-status-bar";
import { useRef, useCallback } from "react";
import { ScrollView, View, Platform, findNodeHandle } from "react-native";
import { Header, Hero, Skills, Projects, Contact, Footer } from "@/components";

export default function App() {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionRefs = useRef<{ [key: string]: View | null }>({});

  const handleNavigate = useCallback((sectionId: string) => {
    if (Platform.OS === "web") {
      // For web, use smooth scroll with element ID
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // For native, we'd need to measure and scroll to position
      // This is a simplified version - for full support, use a library like react-native-anchor
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
  }, []);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="light" />

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
          <Projects />
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
