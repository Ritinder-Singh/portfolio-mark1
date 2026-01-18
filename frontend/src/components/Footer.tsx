import React from "react";
import { View, Text, Pressable, Platform, Linking } from "react-native";
import { useResponsive } from "@/hooks";
import { SITE_CONFIG, NAV_ITEMS, CONTACT_INFO } from "@/constants";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { isMobile } = useResponsive();

  const handleLinkPress = (url: string) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <View className="bg-background-secondary border-t border-background-tertiary/30">
      <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Main Footer Content */}
        <View
          className={`flex ${
            isMobile ? "flex-col gap-8" : "flex-row justify-between"
          } mb-8`}
        >
          {/* Logo and Description */}
          <View className={isMobile ? "w-full" : "max-w-xs"}>
            {/* TODO: Update the logo text */}
            <Pressable onPress={() => onNavigate("hero")}>
              <Text className="text-primary font-mono text-lg font-semibold mb-3">
                {SITE_CONFIG.logo}
              </Text>
            </Pressable>
            <Text className="text-text-secondary text-sm leading-relaxed">
              Building digital experiences with clean code and modern
              technologies.
            </Text>
          </View>

          {/* Quick Links */}
          {!isMobile && (
            <View className="flex flex-row gap-12">
              {/* Navigation */}
              <View>
                <Text className="text-text-primary font-semibold text-sm mb-4">
                  Navigation
                </Text>
                <View className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <Pressable
                      key={item.id}
                      onPress={() => onNavigate(item.id)}
                      className="py-1 active:opacity-70"
                    >
                      <Text className="text-text-secondary text-sm hover:text-text-primary">
                        {item.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Connect */}
              <View>
                <Text className="text-text-primary font-semibold text-sm mb-4">
                  Connect
                </Text>
                <View className="space-y-2">
                  {/* TODO: Update social links in constants/data.ts */}
                  {CONTACT_INFO.map((contact) => (
                    <Pressable
                      key={contact.type}
                      onPress={() => handleLinkPress(contact.url)}
                      className="py-1 active:opacity-70"
                    >
                      <Text className="text-text-secondary text-sm hover:text-text-primary">
                        {contact.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Bottom Bar */}
        <View className="pt-6 border-t border-background-tertiary/30">
          <View
            className={`flex ${
              isMobile ? "flex-col gap-3" : "flex-row justify-between"
            } items-center`}
          >
            <Text className="text-text-secondary text-xs">
              © {currentYear} devPortfolio. All rights reserved.
            </Text>
            <Text className="text-text-secondary text-xs">
              Built with React Native + Expo
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Footer;
