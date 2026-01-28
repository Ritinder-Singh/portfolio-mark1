import React, { useState } from "react";
import { View, Text, Pressable, Platform, Modal } from "react-native";
import { useResponsive } from "@/hooks";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const { isMobile, isTablet } = useResponsive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <View className="bg-background border-b border-background-tertiary/30 z-50">
        <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <View className="flex flex-row items-center justify-between h-16 md:h-20">
            {/* Logo */}
            {/* TODO: Update the logo text */}
            <Pressable onPress={() => handleNavClick("hero")}>
              <Text className="text-primary font-mono text-lg md:text-xl font-semibold">
                {SITE_CONFIG.logo}
              </Text>
            </Pressable>

            {/* Desktop Navigation */}
            {!isMobile && (
              <View className="flex flex-row items-center gap-6 lg:gap-8">
                {NAV_ITEMS.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleNavClick(item.id)}
                    className="active:opacity-70"
                  >
                    <Text className="text-text-secondary text-sm lg:text-base">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* CTA Buttons */}
            <View className="flex flex-row items-center gap-2 md:gap-3">
              {!isMobile && (
                <Pressable
                  onPress={() => {
                    // TODO: Implement CV download
                    if (Platform.OS === "web") {
                      window.open(SITE_CONFIG.cvUrl, "_blank");
                    }
                  }}
                  className="px-3 py-2 md:px-4 md:py-2 border border-primary rounded-lg active:opacity-70"
                >
                  <Text className="text-primary text-sm font-medium">
                    Download Resume
                  </Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => handleNavClick("contact")}
                className="px-3 py-2 md:px-4 md:py-2 bg-primary rounded-lg active:opacity-80"
              >
                <Text className="text-background text-sm font-medium">
                  Contact Me
                </Text>
              </Pressable>

              {/* Mobile Menu Button */}
              {isMobile && (
                <Pressable
                  onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="ml-2 p-2"
                >
                  <Text className="text-text-primary text-xl">
                    {mobileMenuOpen ? "✕" : "☰"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <Modal
          visible={mobileMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <Pressable
            className="flex-1 bg-black/50"
            onPress={() => setMobileMenuOpen(false)}
          >
            {/* Menu Content */}
            <View className="bg-background border-b border-background-tertiary/30 pt-16">
              <View className="px-4 py-4">
                {NAV_ITEMS.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleNavClick(item.id)}
                    className="py-4 border-b border-background-tertiary/20 active:opacity-70"
                  >
                    <Text className="text-text-primary text-lg">
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => {
                    setMobileMenuOpen(false);
                    // TODO: Implement CV download
                    if (Platform.OS === "web") {
                      window.open(SITE_CONFIG.cvUrl, "_blank");
                    }
                  }}
                  className="py-4 active:opacity-70"
                >
                  <Text className="text-primary text-lg font-medium">
                    Download Resume
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

export default Header;
