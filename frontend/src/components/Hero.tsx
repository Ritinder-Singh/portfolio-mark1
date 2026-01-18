import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { useResponsive } from "@/hooks";
import { HERO_CONTENT, HERO_WORDS } from "@/constants";

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing animation effect
  useEffect(() => {
    const currentWord = HERO_WORDS[currentWordIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % HERO_WORDS.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <View
      id="hero"
      className="bg-background min-h-[80vh] md:min-h-[85vh] flex justify-center"
    >
      <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        <View
          className={`flex ${
            isDesktop ? "flex-row items-center" : "flex-col"
          } gap-8 md:gap-12`}
        >
          {/* Left Content */}
          <View className={`flex-1 ${isDesktop ? "pr-8" : ""}`}>
            {/* Badge */}
            <View className="mb-4 md:mb-6">
              <View className="bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 self-start">
                <Text className="text-primary text-sm font-medium">
                  {HERO_CONTENT.badge}
                </Text>
              </View>
            </View>

            {/* Headline */}
            <View className="mb-4 md:mb-6">
              <Text
                className={`text-text-primary font-bold leading-tight ${
                  isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-5xl"
                }`}
              >
                {HERO_CONTENT.headline}
              </Text>
              <Text
                className={`text-text-primary font-bold leading-tight ${
                  isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-5xl"
                }`}
              >
                {HERO_CONTENT.headlineHighlight}
              </Text>
              {/* Animated tech showcase */}
              <View className="flex flex-row items-baseline flex-wrap mt-3">
                <Text
                  className={`text-text-secondary font-medium ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  {"< "}
                </Text>
                <Text
                  className={`text-primary font-bold font-mono ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  {displayText}
                </Text>
                <Text
                  className={`text-primary font-bold animate-pulse ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  |
                </Text>
                <Text
                  className={`text-text-secondary font-medium ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  {" />"}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text
              className={`text-text-secondary mb-6 md:mb-8 leading-relaxed ${
                isMobile ? "text-base" : "text-lg"
              }`}
            >
              {HERO_CONTENT.description}
            </Text>

            {/* CTA Buttons */}
            <View className="flex flex-row gap-3 md:gap-4 flex-wrap">
              <Pressable
                onPress={() => onNavigate("projects")}
                className="px-6 py-3 bg-primary rounded-lg active:opacity-80"
              >
                <Text className="text-background font-semibold text-base">
                  {HERO_CONTENT.ctaPrimary}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onNavigate("contact")}
                className="px-6 py-3 border border-text-secondary rounded-lg active:opacity-70"
              >
                <Text className="text-text-primary font-semibold text-base">
                  {HERO_CONTENT.ctaSecondary}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Right Content - Decorative Element (Desktop/Tablet only) */}
          {!isMobile && (
            <View className="flex-1 flex items-center justify-center">
              <View className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                {/* Outer decorative circle */}
                <View className="absolute inset-0 border-2 border-primary/20 rounded-full" />
                {/* Inner decorative circle */}
                <View className="absolute inset-4 md:inset-6 border border-primary/30 rounded-full" />
                {/* Center content */}
                <View className="absolute inset-8 md:inset-12 bg-background-secondary rounded-full flex items-center justify-center">
                  <Text className="text-primary font-mono text-2xl md:text-3xl">
                    {"</>"}
                  </Text>
                </View>
                {/* Decorative dots */}
                <View className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full" />
                <View className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                <View className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default Hero;
