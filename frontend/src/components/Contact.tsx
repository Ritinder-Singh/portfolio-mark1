import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { useResponsive } from "@/hooks";
import { CONTACT_INFO } from "@/constants";
import { API_ENDPOINTS } from "@/config";

// Simple icon components
function LinkedInIcon() {
  return (
    <View className="w-5 h-5 bg-primary/20 rounded flex items-center justify-center">
      <Text className="text-primary text-xs font-bold">in</Text>
    </View>
  );
}

function GitHubIcon() {
  return (
    <View className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
      <Text className="text-primary text-xs">⚙</Text>
    </View>
  );
}

function EmailIcon() {
  return (
    <View className="w-5 h-5 flex items-center justify-center">
      <Text className="text-primary text-sm">✉</Text>
    </View>
  );
}

function getContactIcon(type: string) {
  switch (type) {
    case "linkedin":
      return <LinkedInIcon />;
    case "github":
      return <GitHubIcon />;
    case "email":
      return <EmailIcon />;
    default:
      return <EmailIcon />;
  }
}

export function Contact() {
  const { isMobile, isDesktop } = useResponsive();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLinkPress = (url: string) => {
    if (Platform.OS === "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.email || !formData.message) {
      if (Platform.OS === "web") {
        alert("Please fill in all required fields");
      } else {
        Alert.alert("Error", "Please fill in all required fields");
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.contact, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName || null,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || "Failed to send message");
      }

      if (Platform.OS === "web") {
        alert("Message sent successfully!");
      } else {
        Alert.alert("Success", "Message sent successfully!");
      }
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      if (Platform.OS === "web") {
        alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-background py-16 md:py-24">
      <View className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <View className="mb-10 md:mb-12">
          <Text
            className={`text-text-primary font-bold mb-3 ${
              isMobile ? "text-2xl" : "text-3xl"
            }`}
          >
            Let's Connect
          </Text>
          <Text className="text-text-secondary text-base md:text-lg max-w-2xl">
            I'm actively seeking full-time software developer positions. Feel free
            to reach out if you have opportunities or just want to connect.
          </Text>
        </View>

        {/* Content Grid */}
        <View
          className={`flex ${
            isDesktop ? "flex-row" : "flex-col"
          } gap-8 md:gap-12`}
        >
          {/* Contact Info */}
          <View className={isDesktop ? "w-1/3" : "w-full"}>
            <View className="space-y-4">
              {/* TODO: Update contact information in constants/data.ts */}
              {CONTACT_INFO.map((contact) => (
                <Pressable
                  key={contact.type}
                  onPress={() => handleLinkPress(contact.url)}
                  className="flex flex-row items-center gap-3 py-2 active:opacity-70"
                >
                  {getContactIcon(contact.type)}
                  <View>
                    <Text className="text-text-secondary text-sm">
                      {contact.label}
                    </Text>
                    <Text className="text-text-primary text-sm">
                      {contact.value}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Contact Form */}
          <View className={isDesktop ? "flex-1" : "w-full"}>
            <View className="bg-background-secondary rounded-xl p-5 md:p-6 border border-background-tertiary/30">
              {/* Name Fields */}
              <View
                className={`flex ${
                  isMobile ? "flex-col" : "flex-row"
                } gap-4 mb-4`}
              >
                <View className={isMobile ? "w-full" : "flex-1"}>
                  <Text className="text-text-secondary text-sm mb-2">
                    First Name *
                  </Text>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, firstName: text })
                    }
                    placeholder="John"
                    placeholderTextColor="#64748b"
                    className="bg-background border border-background-tertiary rounded-lg px-4 py-3 text-text-primary"
                  />
                </View>
                <View className={isMobile ? "w-full" : "flex-1"}>
                  <Text className="text-text-secondary text-sm mb-2">
                    Last Name
                  </Text>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(text) =>
                      setFormData({ ...formData, lastName: text })
                    }
                    placeholder="Doe"
                    placeholderTextColor="#64748b"
                    className="bg-background border border-background-tertiary rounded-lg px-4 py-3 text-text-primary"
                  />
                </View>
              </View>

              {/* Email Field */}
              <View className="mb-4">
                <Text className="text-text-secondary text-sm mb-2">Email *</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  placeholder="john@example.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="bg-background border border-background-tertiary rounded-lg px-4 py-3 text-text-primary"
                />
              </View>

              {/* Message Field */}
              <View className="mb-6">
                <Text className="text-text-secondary text-sm mb-2">
                  Tell me about your project *
                </Text>
                <TextInput
                  value={formData.message}
                  onChangeText={(text) =>
                    setFormData({ ...formData, message: text })
                  }
                  placeholder="Describe your project or opportunity..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-background border border-background-tertiary rounded-lg px-4 py-3 text-text-primary min-h-[120px]"
                />
              </View>

              {/* Submit Button */}
              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`bg-primary rounded-lg py-3 px-6 flex flex-row items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-70" : "active:opacity-80"
                }`}
              >
                <Text className="text-background font-semibold">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Text>
                {!isSubmitting && <Text className="text-background">✓</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Contact;
