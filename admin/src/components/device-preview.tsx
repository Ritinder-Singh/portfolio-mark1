"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProjectCreate } from "@/lib/api";

type Props = {
  device: "desktop" | "tablet" | "mobile";
  project?: ProjectCreate;
  previewUrl?: string;
};

const EXPO_WEB_URL = "http://localhost:8081";

const deviceStyles = {
  desktop: {
    frame: "w-full max-w-3xl",
    screen: "aspect-[16/10]",
    bezel: "p-2 bg-gray-800 rounded-lg",
  },
  tablet: {
    frame: "w-80",
    screen: "aspect-[3/4]",
    bezel: "p-3 bg-gray-800 rounded-2xl",
  },
  mobile: {
    frame: "w-48",
    screen: "aspect-[9/19]",
    bezel: "p-2 bg-gray-800 rounded-3xl",
  },
};

function MockPreview({ device, project }: { device: string; project: ProjectCreate }) {
  return (
    <div className="p-4 h-full overflow-auto">
      {/* Project Image */}
      {project.images?.[0]?.url ? (
        <div className="rounded-lg overflow-hidden mb-4">
          <img
            src={project.images[0].url}
            alt={project.title}
            className="w-full h-32 object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-gray-500 text-xs">No image</span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
        {project.title || "Project Title"}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {project.description || "Project description will appear here..."}
      </p>

      {/* Technologies */}
      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.slice(0, device === "mobile" ? 3 : 5).map((tech) => (
            <span
              key={tech}
              className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (device === "mobile" ? 3 : 5) && (
            <span className="text-xs text-gray-500">
              +{project.technologies.length - (device === "mobile" ? 3 : 5)}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-2">
        {project.github_url && (
          <span className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded">
            GitHub
          </span>
        )}
        {project.live_url && (
          <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded">
            Live Demo
          </span>
        )}
      </div>

      {/* Status badges */}
      <div className="absolute top-2 right-2 flex gap-1">
        {project.is_featured && (
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
            Featured
          </span>
        )}
        {!project.is_published && (
          <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
            Draft
          </span>
        )}
      </div>
    </div>
  );
}

export function DevicePreview({ device, project, previewUrl }: Props) {
  const styles = deviceStyles[device];
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const effectiveUrl = previewUrl || EXPO_WEB_URL;

  return (
    <div className="flex justify-center">
      <div className={cn(styles.frame, styles.bezel)}>
        {/* Notch for mobile */}
        {device === "mobile" && (
          <div className="flex justify-center mb-1">
            <div className="w-20 h-5 bg-gray-800 rounded-b-xl" />
          </div>
        )}

        {/* Screen */}
        <div
          className={cn(
            styles.screen,
            "bg-[#0a0a0a] rounded overflow-hidden relative"
          )}
        >
          {/* iframe for live preview */}
          {!iframeError ? (
            <>
              {iframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span className="text-gray-500 text-xs">Loading preview...</span>
                  </div>
                </div>
              )}
              <iframe
                src={effectiveUrl}
                className="w-full h-full border-0"
                title="Portfolio Preview"
                onLoad={() => setIframeLoading(false)}
                onError={() => {
                  setIframeError(true);
                  setIframeLoading(false);
                }}
                sandbox="allow-scripts allow-same-origin"
              />
            </>
          ) : project ? (
            <MockPreview device={device} project={project} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-gray-500 text-xs block mb-2">
                  Preview unavailable
                </span>
                <span className="text-gray-600 text-xs">
                  Start the frontend server at {effectiveUrl}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Home indicator for mobile */}
        {device === "mobile" && (
          <div className="flex justify-center mt-2">
            <div className="w-24 h-1 bg-gray-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
